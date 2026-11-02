import { StartDoors } from "@/components/start/StartDoors";
import { getContent } from "@/lib/content/content";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Get started",
  description: "Assess yourself with LeadQ, your team with TeamQ, or your organization with OrgQ. Pick the door that fits where you are.",
  path: "/start",
});

// Flow 4: the fork. One CTA everywhere lands here; the person picks a door.
// LeadQ and TeamQ go to the platform once it exists (NEXT_PUBLIC_PLATFORM_URL),
// and to a short form until then. OrgQ is a conversation. Spec:
// docs/decisions.md, 2 Nov 2026.
export default async function StartPage() {
  const { start } = await getContent();
  return (
    <>
      <section className="L-sec L-page-head" data-n="01">
        <div className="L-wrap">
          <div className="L-head">
            <span className="L-n">01</span>
            <div>
              <p className="eyebrow L-eyebrow">{start.head.kicker}</p>
              <h1 className="display L-page-title">{start.head.title}</h1>
              {start.head.lede ? <p className="lede">{start.head.lede}</p> : null}
            </div>
          </div>
        </div>
      </section>
      <section className="L-sec start-sec" data-n="02">
        <div className="L-wrap">
          <StartDoors c={start} />
        </div>
      </section>
    </>
  );
}
