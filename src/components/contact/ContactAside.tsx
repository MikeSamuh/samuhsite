import { CONTACT_EMAIL, CONTACT_PHONE } from "@/lib/contact-details";
import "./contact.css";

function Owed({ what }: { what: string }) {
  return <span className="contact-todo">TODO(content): {what}</span>;
}

/** The way round the form: SAMUH's email and phone. */
export function ContactAside() {
  return (
    <aside className="contact-aside" aria-labelledby="contact-aside-title">
      <h2 className="contact-aside-title" id="contact-aside-title">
        Or reach us directly
      </h2>
      <dl className="contact-details">
        <dt>Email</dt>
        <dd>
          {CONTACT_EMAIL ? (
            <a className="inline-link" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>
          ) : (
            <Owed what="email address" />
          )}
        </dd>
        <dt>Phone</dt>
        <dd>
          {CONTACT_PHONE ? (
            <a className="inline-link" href={`tel:${CONTACT_PHONE}`}>
              {CONTACT_PHONE}
            </a>
          ) : (
            <Owed what="Google Voice number" />
          )}
        </dd>
      </dl>
    </aside>
  );
}
