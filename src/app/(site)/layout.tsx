import { getPageContent } from "@/lib/content/content";
import { SiteShell } from "@/components/site/SiteShell";
import { JsonLd } from "@/components/site/JsonLd";
import { organizationLd, websiteLd } from "@/lib/seo";

/** Every public page: the shell with the admin's site-wide words, and the
 *  organisation's structured data once. The admin has its own tree. */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const global = await getPageContent("global");
  return (
    <SiteShell content={global}>
      <JsonLd data={organizationLd(global)} />
      <JsonLd data={websiteLd()} />
      {children}
    </SiteShell>
  );
}
