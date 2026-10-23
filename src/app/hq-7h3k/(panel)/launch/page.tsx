import { LAUNCH, getLaunchState } from "@/lib/admin/launch";
import { storeKind } from "@/lib/admin/store";
import { LaunchChecklist } from "@/components/admin/LaunchChecklist";

export const dynamic = "force-dynamic";

export default async function LaunchPage() {
  const state = await getLaunchState();
  const kind = storeKind();
  return (
    <>
      <div className="adm-head">
        <div>
          <span className="adm-kicker">Launch</span>
          <h1 className="adm-title">Go-live checklist</h1>
          <p className="adm-lede">Everything still between the site and samuh.work, by area and by owner. Tick what is done, leave a note where it stands. The list is shared, so the whole team sees the same board.</p>
        </div>
        {kind === "file" ? <span className="adm-badge adm-badge-warn" title="Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN for the shared store">Saving to this machine only</span> : null}
      </div>
      <LaunchChecklist groups={LAUNCH} initial={state} />
    </>
  );
}
