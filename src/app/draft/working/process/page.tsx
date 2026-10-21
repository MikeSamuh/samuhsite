import { getContent } from "@/lib/content/content";
import { DraftPage } from "../../Go";

export default async function WorkingProcess() {
  const { process, global } = await getContent();
  return <DraftPage draft="working" id="process" content={{ process, global }} />;
}
