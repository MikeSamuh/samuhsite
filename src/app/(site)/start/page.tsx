import { StartEmail } from "@/components/start/StartEmail";
import { getContent } from "@/lib/content/content";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Take your free assessment",
  description: "Enter your work email and we send you a link. One click signs you in and starts LeadQ, a free five-minute read on your team's environment.",
  path: "/start",
});

// Flow 4: the email box. One address in, a magic link out, the platform
// from there (Wilfred, 3 Nov 2026). Until the platform exists the address
// posts to /api/lead as flow "start" and SAMUH sends the link by hand.
// Spec: docs/decisions.md, 3 Nov 2026.
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
          <StartEmail c={start.form} />
        </div>
      </section>
    </>
  );
}
