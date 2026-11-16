// The Sapien Labs graphs on The Science, redrawn in the brand (16 Nov
// 2026): horizontal bars on a 0 to 100 scale, in HTML so they reflow and
// read aloud. The source charts carry no figures, so none are printed
// here either: the gridlines carry the scale, as they do in the report.

export interface ChartRow {
  label: string;
  /** 0 to 100, read off the bars in the report's own chart */
  value: number;
  /** "quiet" is the comparison series, in grey */
  tone?: "accent" | "quiet";
}

export interface ChartDef {
  rows: ChartRow[];
  /** under the scale */
  axis: string;
  /** the two series, accent then quiet */
  legend: [string, string];
}

const TICKS = [0, 20, 40, 60, 80, 100];

export function BarChart({ n, title, note, chart }: { n: string; title: string; note: string; chart: ChartDef }) {
  return (
    <figure className="L-chart">
      <figcaption className="L-chart-head">
        <span className="L-cap">{n}</span>
        <h3 className="L-chart-title">{title}</h3>
        <p className="L-chart-note">{note}</p>
      </figcaption>
      <ul className="L-chart-legend" aria-hidden="true">
        <li><i className="L-chart-key" />{chart.legend[0]}</li>
        <li><i className="L-chart-key" data-tone="quiet" />{chart.legend[1]}</li>
      </ul>
      <ul className="L-chart-rows">
        {chart.rows.map((r) => (
          <li className="L-chart-row" key={r.label}>
            <span className="L-chart-label">{r.label}</span>
            <span className="L-chart-track">
              <span className="L-chart-bar" data-tone={r.tone ?? "accent"} style={{ width: `${r.value}%` }} />
              <span className="L-chart-sr">about {r.value} of 100</span>
            </span>
          </li>
        ))}
        <li className="L-chart-row L-chart-scale" aria-hidden="true">
          <span />
          <span className="L-chart-ticks">{TICKS.map((t) => <span key={t} style={{ left: `${t}%` }}>{t}</span>)}</span>
        </li>
      </ul>
      <p className="L-cap L-chart-axis">{chart.axis}</p>
    </figure>
  );
}

/** Work Culture and Mental Wellbeing, Sapien Labs, October 2024: the two
 *  graphs Jake chose (email of 16 Nov 2026). Values read off the bars. */
export const CHART_FACTORS: ChartDef = {
  axis: "MHQ difference between highest and lowest ratings",
  legend: ["Work culture", "Work structure, for comparison"],
  rows: [
    { label: "Relationship with colleagues", value: 89 },
    { label: "Pride and purpose in work", value: 84 },
    { label: "Valued and recognized", value: 80 },
    { label: "Informed about what’s going on", value: 78 },
    { label: "Relationship with manager", value: 73 },
    { label: "Learning and growth opportunities", value: 66 },
    { label: "Workload", value: 64 },
    { label: "Flexibility and control over job", value: 63 },
    { label: "Flexibility and control over time", value: 51 },
    { label: "Team size (alone to 15+)", value: 19, tone: "quiet" },
    { label: "Type of job (human care to physical labor)", value: 16, tone: "quiet" },
    { label: "Hybrid to remote", value: 10, tone: "quiet" },
  ],
};

export const CHART_RELATIONSHIPS: ChartDef = {
  axis: "MHQ score",
  legend: ["Good colleague relationships", "Poor colleague relationships"],
  rows: [
    { label: "Good relationships and manageable workload", value: 94 },
    { label: "Good relationships and good flexibility over time", value: 79 },
    { label: "Good relationships but poor flexibility over time", value: 79 },
    { label: "Good relationships but excessive workload", value: 66 },
    { label: "Poor relationships and good flexibility over time", value: 35, tone: "quiet" },
    { label: "Poor relationships and manageable workload", value: 29, tone: "quiet" },
  ],
};
