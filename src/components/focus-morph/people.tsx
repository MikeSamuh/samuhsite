// The person the home's fourth beat draws (FocusMorph), lifted here so the
// Solutions page shows the same figure and nobody draws it twice: a head
// and a bust with round shoulders, hollow. The home fills three of them
// with water; Solutions sets them out as Rahul's whiteboard of 6 Nov 2026
// does: one person, one team (a leader and their people), several teams.

/** the one drawing, in the home picture's frame units */
export const PERSON = { headR: 26, headCy: 108, shoulderY: 206, footY: 300, halfW: 56 };

/** the bust under a head centred on x */
export const bust = (x: number) =>
  `M ${x - PERSON.halfW} ${PERSON.footY} V ${PERSON.shoulderY} A ${PERSON.halfW} ${PERSON.halfW} 0 0 1 ${x + PERSON.halfW} ${PERSON.shoulderY} V ${PERSON.footY} Z`;

/** one person, hollow, the head centred on x */
export function Person({ x }: { x: number }) {
  return (
    <g className="L-fm-person">
      <circle cx={x} cy={PERSON.headCy} r={PERSON.headR} className="L-fm-person-line" />
      <path d={bust(x)} className="L-fm-person-line" />
    </g>
  );
}

const TOP = PERSON.headCy - PERSON.headR;
const MID = (TOP + PERSON.footY) / 2;

/** a person centred on (x, y) at scale s, for the small figures */
function Small({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) translate(0 ${-MID})`}>
      <Person x={0} />
    </g>
  );
}

/** a team in its circle: a leader above three people */
function Team({ x, y, r }: { x: number; y: number; r: number }) {
  const s = r / 360;
  return (
    <g>
      <circle cx={x} cy={y} r={r} className="L-org-ring" />
      <Small x={x} y={y - r * 0.36} s={s} />
      {[-1, 0, 1].map((k) => <Small key={k} x={x + k * r * 0.44} y={y + r * 0.34} s={s} />)}
    </g>
  );
}

export type OrgLevel = "one" | "team" | "teams";

const LABEL: Record<OrgLevel, string> = {
  one: "One person",
  team: "One team: a leader and their people",
  teams: "Several teams",
};

/** the org structure, a level at a time */
export function OrgFigure({ level }: { level: OrgLevel }) {
  return (
    <svg className="L-org-svg" data-level={level} viewBox="0 0 240 240" role="img" aria-label={LABEL[level]}>
      {level === "one" ? (
        <g>
          <circle cx={120} cy={120} r={72} className="L-org-ring" />
          <Small x={120} y={120} s={0.4} />
        </g>
      ) : level === "team" ? (
        <Team x={120} y={120} r={112} />
      ) : (
        <>
          <Team x={120} y={62} r={58} />
          <Team x={60} y={174} r={58} />
          <Team x={180} y={174} r={58} />
        </>
      )}
    </svg>
  );
}
