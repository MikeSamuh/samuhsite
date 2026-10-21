import { getContent } from "@/lib/content/content";
import { DraftPage } from "../../Go";

export default async function WorkingSolutions() {
  const { solutions, global } = await getContent();
  return <DraftPage draft="working" id="solutions" content={{ solutions, global }} />;
}
