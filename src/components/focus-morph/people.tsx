// The one person, shared so nobody draws it twice: the home's "Who we work
// with" sets them out as one person, a team, several teams, and OrgFigure
// as Rahul's whiteboard of 6 Nov 2026 does. Since 17 Nov 2026 the figure
// is the client's own drawing, placed and never redrawn: a mask cut from
// it (scripts/figures/team.py) says where the lines are and the token
// gives them their colour. It sits in the box the old head and bust took,
// which PERSON still describes. An svg that draws a Person needs one
// <PersonDefs /> in it.

/** the one drawing, in the home picture's frame units */
export const PERSON = { headR: 26, headCy: 108, shoulderY: 206, footY: 300, halfW: 56 };

/** the bust under a head centred on x */
export const bust = (x: number) =>
  `M ${x - PERSON.halfW} ${PERSON.footY} V ${PERSON.shoulderY} A ${PERSON.halfW} ${PERSON.halfW} 0 0 1 ${x + PERSON.halfW} ${PERSON.shoulderY} V ${PERSON.footY} Z`;

const TOP = PERSON.headCy - PERSON.headR;
const MID = (TOP + PERSON.footY) / 2;

/** the drawing, 480 by 729, a little inside the old box and about its middle */
const ART_H = 204;
const ART = { w: (ART_H * 480) / 729, h: ART_H, y: MID - ART_H / 2, src: "/icons/individual-lines.png", id: "fm-person-lines" };

/** the drawing's mask, once in each svg that draws a Person */
export function PersonDefs() {
  return (
    <defs>
      <mask id={ART.id} maskUnits="userSpaceOnUse" x={-ART.w / 2} y={ART.y} width={ART.w} height={ART.h}>
        <image href={ART.src} x={-ART.w / 2} y={ART.y} width={ART.w} height={ART.h} />
      </mask>
    </defs>
  );
}

/** one person, hollow, centred on x */
export function Person({ x }: { x: number }) {
  return (
    <g className="L-fm-person" transform={`translate(${x.toFixed(2)} 0)`}>
      <rect className="L-fm-team-lines" x={-ART.w / 2} y={ART.y} width={ART.w} height={ART.h} mask={`url(#${ART.id})`} />
    </g>
  );
}

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
      <PersonDefs />
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
