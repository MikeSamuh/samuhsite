import { TalkForm } from "@/components/talk/TalkForm";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Book a call",
  description: "Tell us a little about your team, then pick a time for an intro call with SAMUH.",
  path: "/talk",
});

// Flow 3: qualify, then book. Spec: docs/sprint-intakes.md, "Flow 3".
export default function TalkPage() {
  return (
    <>
      <section className="L-sec L-page-head" data-n="01">
        <div className="L-wrap">
          <div className="L-head">
            <span className="L-n">01</span>
            <div>
              <p className="eyebrow L-eyebrow">Talk to us</p>
              <h1 className="display L-page-title">Book a call.</h1>
              <p className="lede">Tell us a little about your team, then pick a time. A person at SAMUH takes the call.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="L-sec talk-sec">
        <div className="L-wrap L-wrap-narrow">
          <TalkForm />
        </div>
      </section>
    </>
  );
}
