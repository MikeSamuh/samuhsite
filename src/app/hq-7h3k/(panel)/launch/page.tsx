import { LAUNCH, getLaunchState } from "@/lib/admin/launch";
import { storeKind } from "@/lib/admin/store";
import { LaunchChecklist } from "@/components/admin/LaunchChecklist";

export const dynamic = "force-dynamic";

export default async function LaunchPage() {
  const state = await getLaunchState();
  const kind = storeKind();
  // on Vercel the file store cannot write (read-only filesystem), so the board saves in the browser until Redis is attached
  const shared = kind !== "file" || !process.env.VERCEL;
  return (
    <>
      <div className="adm-head">
        <div>
          <span className="adm-kicker">Launch</span>
          <h1 className="adm-title">Go-live checklist</h1>
          <p className="adm-lede">What stands between the site and samuh.work. Tick what is done, leave a note where it stands.</p>
        </div>
        {kind === "file" ? <span className="adm-badge adm-badge-warn" title="Attach Upstash Redis to the Vercel project for the shared store">{shared ? "Local store" : "No shared store yet"}</span> : null}
      </div>
      <LaunchChecklist groups={LAUNCH} initial={state} shared={shared} />
    </>
  );
}
