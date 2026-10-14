import { useId } from "react";
import type {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import "./lead.css";

interface FieldBase {
  label: string;
  name: string;
  /** shown under the control and announced. Empty means valid */
  error?: string;
}

type InputField = FieldBase & { as?: "input" } & Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "name"
  >;

type TextareaField = FieldBase & { as: "textarea" } & Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    "name"
  >;

type SelectField = FieldBase & {
  as: "select";
  options: { value: string; label: string }[];
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, "name">;

export type FieldProps = InputField | TextareaField | SelectField;

/** what is left of a field's props once ours are taken off: the native ones */
function native<T extends { as?: string; label: string; error?: string }>(props: T) {
  const rest: Partial<T> = { ...props };
  delete rest.as;
  delete rest.label;
  delete rest.error;
  return rest as Omit<T, "as" | "label" | "error">;
}

/** One labelled form control with its inline error. */
export function Field(props: FieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const described = {
    id,
    "aria-invalid": props.error ? true : undefined,
    "aria-describedby": props.error ? errorId : undefined,
  };

  let control;
  if (props.as === "textarea") {
    control = <textarea rows={5} {...native(props)} {...described} />;
  } else if (props.as === "select") {
    const { options, ...rest } = native(props);
    control = (
      <select {...rest} {...described}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  } else {
    control = <input type="text" {...native(props)} {...described} />;
  }

  return (
    <div className="lead-field">
      <label htmlFor={id}>
        {props.label}
        {props.required ? null : <span className="lead-optional"> (optional)</span>}
      </label>
      {control}
      {props.error ? (
        <p className="lead-error" id={errorId} role="alert">
          {props.error}
        </p>
      ) : null}
    </div>
  );
}
