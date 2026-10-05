import { TEAM_SIZE } from "./model";
import "./teaser.css";

// TODO(content): every line of copy here is our draft, for SAMUH to replace.
// It describes and does not claim: no statistics, no outcomes, no client
// names. See CLAUDE.md rules 1 and 4.

/** The top of /teamq: what TeamQ is and how SAMUH uses it, as two boxes that
 *  open like an FAQ, and a way down to the tool. Nothing stops a visitor
 *  scrolling straight past it. */
export function TeamQIntro() {
  return (
    <section className="L-sec L-page-head teaser-intro">
      <div className="L-wrap">
        <p className="eyebrow L-eyebrow">Explore TeamQ</p>
        <h1 className="display L-page-title">Optimize your team, with science</h1>
        <div className="teaser-faq">
          <details className="teaser-faq-item">
            <summary>What is TeamQ</summary>
            <div className="teaser-faq-body">
              <p>
                TeamQ is how SAMUH reads a team: what the work is like for the people doing it, and what that does to
                their capacity to perform.
              </p>
              <p>
                Below is a demonstration team of {TEAM_SIZE}. Eleven things shape their working life, nine in the work
                environment and two in how they live. Move any of them and watch the estimate for this team change.
              </p>
            </div>
          </details>
          <details className="teaser-faq-item">
            <summary>How we use it</summary>
            <div className="teaser-faq-body">
              <p>
                With a real team, this is where the work starts. The team answers for itself, we read the result
                together, and the team chooses what to work on. Then we measure again.
              </p>
              <p>
                Capacity to perform is measured with the Mental Health Quotient (MHQ), from our partner Sapien Labs.
              </p>
            </div>
          </details>
        </div>
        <p className="teaser-intro-note">
          The team on this page is a demonstration, not yours. Nothing here is a result for your team.
        </p>
        <a className="btn" href="#tool">
          Start exploring <span className="arrow">&darr;</span>
        </a>
      </div>
    </section>
  );
}
