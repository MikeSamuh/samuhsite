import "./lead.css";

/** A field no person sees or tabs to. A bot that fills it is dropped by
 *  /api/lead, which still answers 200. */
export function Honeypot() {
  return (
    <div className="lead-honeypot" aria-hidden="true">
      <label>
        Company website
        <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}
