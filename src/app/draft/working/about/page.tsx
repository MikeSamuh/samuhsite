import { getContent } from "@/lib/content/content";
import { DraftPage } from "../../Go";

export default async function WorkingAbout() {
  const { about, global } = await getContent();
  return <DraftPage draft="working" id="about" content={{ about, global }} />;
}
