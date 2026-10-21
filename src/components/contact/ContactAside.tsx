import { CONTACT_EMAIL, CONTACT_PHONE } from "@/lib/contact-details";
import "./contact.css";

function Owed({ what }: { what: string }) {
  return <span className="contact-todo">TODO(content): {what}</span>;
}

/** The way round the form: SAMUH's email and phone. The words come from
 *  the admin's Site-wide content; the defaults are contact-details.ts. */
export function ContactAside({
  title = "Or reach us directly",
  email = CONTACT_EMAIL ?? "",
  phone = CONTACT_PHONE ?? "",
}: { title?: string; email?: string; phone?: string }) {
  return (
    <aside className="contact-aside" aria-labelledby="contact-aside-title">
      <h2 className="contact-aside-title" id="contact-aside-title">
        {title}
      </h2>
      <dl className="contact-details">
        <dt>Email</dt>
        <dd>
          {email ? (
            <a className="inline-link" href={`mailto:${email}`}>
              {email}
            </a>
          ) : (
            <Owed what="email address" />
          )}
        </dd>
        <dt>Phone</dt>
        <dd>
          {phone ? (
            <a className="inline-link" href={`tel:${phone}`}>
              {phone}
            </a>
          ) : (
            <Owed what="Google Voice number" />
          )}
        </dd>
      </dl>
    </aside>
  );
}
