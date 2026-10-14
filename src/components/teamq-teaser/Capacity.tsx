import { MHQ_BANDS, MHQ_SCALE, mhqBand } from "@/lib/tokens";
import "./teaser.css";

const one = (value: number) => value.toFixed(1);

/* the meter: a half circle from -100 on the left to 200 on the right, the
   six bands laid along it, a needle at the figure, the figure inside */
const CX = 100;
const CY = 100;
const R = 78;
/** the gap left between bands, in degrees */
const GAP = 1.6;

/** where a score sits on the arc, in degrees from the right-hand end */
const angle = (score: number) => 180 - ((score - MHQ_SCALE.min) / (MHQ_SCALE.max - MHQ_SCALE.min)) * 180;
const point = (deg: number) => {
  const rad = (deg * Math.PI) / 180;
  return { x: CX + R * Math.cos(rad), y: CY - R * Math.sin(rad) };
};
/** an arc along the meter from one score to the next, as a path */
function arc(from: number, to: number): string {
  const a = point(angle(from) - GAP);
  const b = point(angle(to) + GAP);
  return `M ${a.x.toFixed(2)} ${a.y.toFixed(2)} A ${R} ${R} 0 0 1 ${b.x.toFixed(2)} ${b.y.toFixed(2)}`;
}

const THRIVING = MHQ_BANDS[0];

/** Capacity to perform: the team's MHQ as how far it is from Thriving, and
 *  a meter from -100 to 200 with the six bands along it and a needle at
 *  the figure, the way SAMUH's dashboard shows it. `dim` and `lit` are
 *  the tour's: the whole part dimmed, or the change line lit. */
export function Capacity({ value, delta, dim, lit }: { value: number; delta: string; dim?: true; lit?: true }) {
  const band = mhqBand(value);
  const clamped = Math.max(MHQ_SCALE.min, Math.min(MHQ_SCALE.max, value));
  const away = Math.max(0, Math.round(THRIVING.min - value));
  // the needle is drawn pointing left, at -100, and turned to the figure
  const turn = 180 - angle(clamped);
  return (
    <div className="teaser-capacity" data-dim={dim}>
      <span className="teaser-label">Capacity to perform</span>
      <div className="capacity-body">
        <div className="capacity-words">
          <p className="capacity-line">
            {away > 0 ? (
              <>
                {away} points from{" "}
                <span className="capacity-band-word" style={{ "--band": `var(--band-${THRIVING.id})` } as React.CSSProperties}>
                  {THRIVING.name}
                </span>
                .
              </>
            ) : (
              <>
                <span className="capacity-band-word" style={{ "--band": `var(--band-${THRIVING.id})` } as React.CSSProperties}>
                  {THRIVING.name}
                </span>
                .
              </>
            )}
          </p>
          <span className="teaser-delta" data-lit={lit}>
            {delta}
          </span>
        </div>
        <svg
          className="capacity-gauge"
          viewBox="0 0 200 116"
          role="img"
          aria-label={`${one(value)} on the MHQ scale from ${MHQ_SCALE.min} to ${MHQ_SCALE.max}, in the ${band.name} band`}
        >
          {[...MHQ_BANDS].reverse().map((b) => (
            <path key={b.id} d={arc(b.min, b.max)} className="gauge-band" style={{ "--band": `var(--band-${b.id})` } as React.CSSProperties} data-on={b.id === band.id || undefined} />
          ))}
          <line
            className="gauge-needle"
            x1={CX - R + 18}
            y1={CY}
            x2={CX - R - 14}
            y2={CY}
            style={{ transform: `rotate(${turn.toFixed(2)}deg)` }}
          />
          <text className="gauge-value" x={CX} y={CY - 2}>
            {one(value)}
          </text>
          <text className="gauge-end" x={CX - R} y={CY + 14}>
            {MHQ_SCALE.min}
          </text>
          <text className="gauge-end" x={CX + R} y={CY + 14}>
            {MHQ_SCALE.max}
          </text>
        </svg>
      </div>
    </div>
  );
}
