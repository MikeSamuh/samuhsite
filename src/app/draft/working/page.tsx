import { BASELINE, OPTIMIZER_MOVES } from "@/components/teamq-teaser/model";
import { bestForProductiveDays, score } from "@/lib/teaser/score";
import { DraftHome } from "../Go";

export default function WorkingHome() {
  // section 9 shows the tool moving. Scored here, on the server, the same
  // way /teamq does it, so the home page carries no typed-in numbers
  const demo = { baseline: score(BASELINE), answer: bestForProductiveDays(OPTIMIZER_MOVES) };
  return <DraftHome draft="working" demo={demo} />;
}
