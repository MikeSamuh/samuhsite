import { cardsMeta, getCards } from "@/lib/admin/cards";
import { listReflections } from "@/lib/admin/reflections";
import { storeKind } from "@/lib/admin/store";
import { CardsEditor } from "@/components/admin/CardsEditor";
import { Responses } from "@/components/admin/Responses";

export const dynamic = "force-dynamic";

function when(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

export default async function CardsPage() {
  const [cards, meta, responses] = await Promise.all([getCards(), cardsMeta(), listReflections()]);
  const kind = storeKind();
  return (
    <>
      <div className="adm-head">
        <div>
          <h1 className="adm-title">Metaphor cards</h1>
          <p className="adm-lede">The deck on the home page. Add a drawing, give it a name, move it up or down, delete what should go. {meta ? `Saved ${when(meta.updatedAt)}.` : "Showing the two in the code."}</p>
        </div>
        {kind === "file" ? <span className="adm-badge adm-badge-warn" title="Attach Upstash Redis to the Vercel project for the shared store">{process.env.VERCEL ? "No shared store yet" : "Local store"}</span> : null}
      </div>
      <CardsEditor initial={cards} stored={!!meta} />
      <section className="adm-section" aria-labelledby="responses-title">
        <h2 className="adm-section-title" id="responses-title">What visitors shared</h2>
        <p className="adm-note" style={{ marginBottom: 12 }}>A line a visitor leaves beside a card lands here, hidden until you show it on the back of that card. Anonymous: the card, the words and the time.</p>
        <Responses rows={responses} cards={cards.map((c) => c.name)} />
      </section>
    </>
  );
}
