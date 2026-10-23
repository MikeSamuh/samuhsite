import { listReflections } from "@/lib/admin/reflections";
import { DRAFTS, WORKING } from "@/app/draft/drafts";
import { Responses } from "@/components/admin/Responses";

export default async function ResponsesPage() {
  const rows = await listReflections();
  // the cards on the working draft, so the team can write a response against one
  const cards = (DRAFTS.find((d) => d.id === WORKING)?.copy?.cards ?? []).map(([name]) => name);
  const shown = rows.filter((r) => r.shown).length;
  const waiting = rows.length - shown;
  return (
    <>
      <div className="adm-head">
        <div>
          <h1 className="adm-title">Responses</h1>
          <p className="adm-lede">
            What visitors shared beside a metaphor card. {rows.length} in all, {shown} on the cards{waiting ? `, ${waiting} waiting` : ""}. Anonymous: a card, the words and the time, nothing else.
          </p>
        </div>
      </div>
      <Responses rows={rows} cards={cards} />
    </>
  );
}
