import { MHQ_BANDS, MHQ_SCALE, mhqBand } from "@/lib/tokens";
import "./teaser.css";

const one = (value: number) => value.toFixed(1);

/** Capacity to perform: the team's MHQ on Sapien Labs' six-band scale,
 *  drawn the way SAMUH's dashboard draws it. The figure with its band and
 *  its change from baseline on the left, the scale with a marker at the
 *  figure, and the band names. `dim` and `lit` are the readout tour's: the
 *  whole part dimmed, or the change line lit. */
export function Capacity({ value, delta, dim, lit }: { value: number; delta: string; dim?: true; lit?: true }) {
  const band = mhqBand(value);
  const clamped = Math.max(MHQ_SCALE.min, Math.min(MHQ_SCALE.max, value));
  // how far down the scale the figure sits; Thriving is at the top
  const top = ((MHQ_SCALE.max - clamped) / (MHQ_SCALE.max - MHQ_SCALE.min)) * 100;
  return (
    <div className="teaser-capacity" data-dim={dim}>
      <span className="teaser-label">Capacity to perform</span>
      <div className="capacity-body">
        <div className="capacity-figure">
          <span className="teaser-figure">{one(value)}</span>
          <span className="capacity-band-name" style={{ "--band": `var(--band-${band.id})` } as React.CSSProperties}>
            {band.name}
          </span>
          <span className="teaser-delta" data-lit={lit}>
            {delta}
          </span>
        </div>
        <div
          className="capacity-scale"
          role="img"
          aria-label={`${one(value)} on the MHQ scale from ${MHQ_SCALE.min} to ${MHQ_SCALE.max}, in the ${band.name} band`}
        >
          {MHQ_BANDS.map((b) => (
            <span key={b.id} className="capacity-band" style={{ "--band": `var(--band-${b.id})` } as React.CSSProperties} />
          ))}
          <span className="capacity-marker" style={{ "--top": `${top}%` } as React.CSSProperties} />
        </div>
        <ol className="capacity-names" aria-hidden="true">
          {MHQ_BANDS.map((b) => (
            <li key={b.id} data-on={b.id === band.id || undefined}>
              {b.name}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
