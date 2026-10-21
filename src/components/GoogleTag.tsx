import Script from "next/script";

/**
 * The GA4 tag. Renders nothing until NEXT_PUBLIC_GA_ID is set, which is
 * also what makes track() in src/lib/analytics.ts send events. Loaded
 * after the page is interactive so it never sits in front of the LCP.
 * Cookie consent for EU visitors is an M4 item (docs/milestones.md) and
 * gates this when it lands.
 */
export function GoogleTag() {
  const id = process.env.NEXT_PUBLIC_GA_ID;
  if (!id) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="ga4" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${id}',{send_page_view:true});`}
      </Script>
    </>
  );
}
