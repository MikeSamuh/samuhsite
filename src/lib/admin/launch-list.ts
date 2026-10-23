// The go-live checklist on the Launch tab: the list and its types. The list
// is code, so it is reviewed like everything else. Items marked `done: true`
// were finished in the repo and show ticked from the start; the store can
// still untick them. Owners are the people in docs/milestones.md "Client
// owes". No server imports here: the client component reads this file.
// Who ticked what lives in the store, through launch.ts.

import { ADMIN_BASE } from "./paths";

export type Owner = "Wilfred" | "SAMUH" | "Mike" | "Rahul" | "Jake" | "Calina";
export const OWNERS: Owner[] = ["SAMUH", "Rahul", "Calina", "Mike", "Jake", "Wilfred"];

export interface LaunchItem {
  id: string;
  title: string;
  /** what done looks like, or where it stands today */
  detail?: string;
  owner: Owner;
  /** where to go to do it: an admin page, a site page or an outside tool */
  where?: { href: string; label: string };
  /** finished in the repo already; ticked unless the store says otherwise */
  done?: boolean;
}

export interface LaunchGroup {
  id: string;
  name: string;
  note: string;
  items: LaunchItem[];
}

const content = (page: string, label: string) => ({ href: `${ADMIN_BASE}/content/${page}`, label });

export const LAUNCH: LaunchGroup[] = [
  {
    id: "content",
    name: "Content to confirm",
    note: "Every line marked TODO(content) in the code, and every claim the brief says must come from SAMUH in writing. Done when `grep -r \"TODO(content)\" src/` returns nothing.",
    items: [
      { id: "testimonials", title: "Testimonials: three real quotes with name, role and organization", detail: "The home and Solutions carry three sample quotes. Attributions must be cleared by the person quoted; Chanel's logo ban through Mentora is the precedent.", owner: "SAMUH", where: content("home", "Content · Home · Testimonials") },
      { id: "hero-line", title: "Hero line and the research claim confirmed by Rahul", detail: "The thesis line and the Sapien Labs line on the home. No years of research, no sample sizes unless supplied in writing.", owner: "Rahul", where: content("home", "Content · Home · Hero") },
      { id: "hero-film", title: "Hero film: SAMUH's own footage in place of the stock test clip", detail: "/hero-test.mp4 is a stock placeholder behind a poster frame. The script call puts the film and the site copy on one line.", owner: "SAMUH" },
      { id: "carte", title: "Solutions: the eight à la carte pieces confirmed", detail: "Drafted from the introduction deck and the Bangalore keynote. Confirm each name, what it is, who it is for and the format line, or remove pieces SAMUH does not sell on their own.", owner: "SAMUH", where: content("solutions", "Content · Solutions · À la carte") },
      { id: "tiers", title: "Solutions: the three tiers and the comparison table confirmed", detail: "Self-guided, Supported, Guided. What each includes, and the Self-guided price or the decision to show no price.", owner: "SAMUH", where: content("solutions", "Content · Solutions · Tiers") },
      { id: "faq", title: "FAQ: ten draft questions and answers approved", detail: "Written from the brief and the confirmed items in docs/content.md. Nothing in them is a figure SAMUH has not made, but SAMUH approves the wording. They also feed the FAQPage structured data.", owner: "SAMUH", where: content("home", "Content · Home · FAQ") },
      { id: "teamq-copy", title: "TeamQ tool copy: intro, pitch, and the insight and testimonial lines it interlaces", detail: "Every line is our draft and describes rather than claims. SAMUH replaces or approves.", owner: "SAMUH", where: content("teamq", "Content · TeamQ") },
      { id: "process-copy", title: "Process page: four-stage copy confirmed by Calina", detail: "Assess, then the three stages, from Calina's material. Assess shows a placeholder icon until its figure is drawn.", owner: "Calina", where: content("process", "Content · Process") },
      { id: "process-icon", title: "Assess stage icon drawn, in the style of the other three", owner: "Wilfred" },
      { id: "bios", title: "About: team bios, more than one line each", detail: "Five people. Rahul's HBS case line is public and approved; the HBR article with Tara is in submission and cannot be named yet.", owner: "SAMUH", where: content("about", "Content · About · Team") },
      { id: "headshots", title: "Team headshots at full size", detail: "The site uses the 141px files from the current samuh.work. One from each team member, then they move to Blob.", owner: "SAMUH" },
      { id: "case-study", title: "Case study: Sankora contract checked, PDF supplied or the card goes", detail: "The card on the home links nowhere until the PDF exists. Named clients need the contract check first.", owner: "Rahul" },
      { id: "metaphor-originals", title: "Metaphor cards: originals at full resolution and the one-liners approved", detail: "The six drawings are pulled from the keynote PDF at 509 by 720. The captions are SAMUH's, the one-liners are ours.", owner: "SAMUH" },
      { id: "reflection", title: "Metaphor cards: what visitors share is stored, or the responses list is hidden", detail: "\"Share anonymously\" keeps nothing yet and \"View responses\" shows three sample lines. Either a reflection flow on the lead route, or the back of the card goes for launch.", owner: "Wilfred" },
      { id: "contact-details", title: "Contact page: email, Google Voice number, response time", detail: "Shows TODO(content) where each is missing. The number as dialled, for example +1 555 123 4567.", owner: "SAMUH", where: content("contact", "Content · Contact") },
      { id: "legal", title: "Privacy, Terms and Cookies pages from counsel", detail: "The footer links land on Contact until the pages exist. Cookies matters for the consent item under Analytics.", owner: "SAMUH" },
      { id: "insights-review", title: "Insights: Rahul reviews the episode summaries and confirms which of 1 to 10 stay", detail: "Also the six written drafts: the HBR outline and five booklet chapters.", owner: "Rahul", where: { href: `${ADMIN_BASE}/blog`, label: "Blog" } },
      { id: "insights-videos", title: "Insights: four videos not on YouTube uploaded, then transcribed and posted", detail: "Leaders Lounge keynote, Wellbeing=Performance, HR Academy Welcome, the first email video, and the 2024 Summit deck.", owner: "SAMUH" },
      { id: "todo-grep", title: "Every TODO(content) in the code resolved", detail: "The M3 done line. Run the grep on main before cutover.", owner: "Wilfred" },
    ],
  },
  {
    id: "intake",
    name: "Intake flows",
    note: "The three ways a visitor reaches SAMUH, and the plumbing behind them. Each needs a key from the client before it does anything.",
    items: [
      { id: "booking", title: "Jake's Google Calendar appointment schedule, Intro call, 30 minutes", detail: "Set as NEXT_PUBLIC_BOOKING_URL in Vercel. /talk shows a placeholder until then.", owner: "Jake", where: { href: "/talk", label: "/talk" } },
      { id: "clarify", title: "Clarify workspace slug set as CLARIFY_WORKSPACE", detail: "The key is in since 13 October. Without the slug the lead route logs an error and no lead reaches the CRM.", owner: "Jake" },
      { id: "lead-notify", title: "Lead emails to hello@samuh.work, copied to Mike, sent from samuh.work", detail: "LEAD_NOTIFY_TO, LEAD_NOTIFY_CC and RESEND_FROM in Vercel, after the Resend domain is verified.", owner: "Wilfred" },
      { id: "turnstile", title: "Cloudflare Turnstile site key and secret in Vercel", detail: "Without them the form renders no widget and the lead route skips verification.", owner: "Wilfred" },
      { id: "flows-retest", title: "All three flows re-tested on the root: /contact, the TeamQ teaser, /talk, then /thank-you", detail: "Jake and Mike receive the email each time, the lead lands in Clarify, GA4 records the event.", owner: "Wilfred" },
    ],
  },
  {
    id: "seo",
    name: "Search and answer engines",
    note: "Done in the code on 21 October: metadata, Open Graph card, JSON-LD, sitemap, robots, llms.txt, redirects. What remains happens on the live domain.",
    items: [
      { id: "meta", title: "Metadata, Open Graph, structured data, sitemap and robots on every page", detail: "pageMeta() in src/lib/seo.ts. Organization and WebSite everywhere, FAQPage on the home, Article or VideoObject on posts.", owner: "Wilfred", done: true },
      { id: "llms", title: "/llms.txt for answer engines", detail: "Re-read it once the copy is final; it quotes the thesis and the offer.", owner: "Wilfred", done: true, where: { href: "/llms.txt", label: "/llms.txt" } },
      { id: "redirects", title: "Redirects from every old URL: 21 posts, WordPress pages, categories, authors, drafts and tools", detail: "In next.config.ts. Check the list against the live WordPress sitemap one last time before cutover.", owner: "Wilfred", done: true },
      { id: "gsc", title: "Google Search Console: verify, then submit the sitemap", detail: "GOOGLE_SITE_VERIFICATION in Vercel for the HTML-tag method, then submit https://samuh.work/sitemap.xml and request indexing of the home.", owner: "Wilfred", where: { href: "https://search.google.com/search-console", label: "Search Console" } },
      { id: "bing", title: "Bing Webmaster Tools: import the Search Console property", detail: "Bing feeds Copilot and ChatGPT search. One click once GSC is verified.", owner: "Wilfred", where: { href: "https://www.bing.com/webmasters", label: "Bing Webmaster" } },
      { id: "gbp", title: "Google Business Profile pointing at samuh.work", owner: "SAMUH" },
      { id: "share-check", title: "Share cards checked on the live domain: LinkedIn Post Inspector, Rich Results test", detail: "The default card is drawn at /og.png. Posts use their cover.", owner: "Wilfred", where: { href: "https://www.linkedin.com/post-inspector/", label: "Post Inspector" } },
      { id: "answer-check", title: "Ask ChatGPT, Perplexity and Google AI Mode what SAMUH does, a week after cutover", detail: "The answer should match the thesis line and name Sapien Labs. If not, the FAQ and llms.txt are where to adjust.", owner: "Wilfred" },
    ],
  },
  {
    id: "quality",
    name: "Performance and quality bar",
    note: "The bar in docs/scope.md. Lighthouse mobile on the production build is 89 to 91, SEO 100, accessibility 100.",
    items: [
      { id: "lcp", title: "LCP under 2.5 seconds on throttled mobile", detail: "3.5 to 3.8s simulated, 2.9s under real throttling. What remains is the Next runtime plus Inter italic; dropping the italic is a design call.", owner: "Wilfred" },
      { id: "browsers", title: "Chrome, Safari, Firefox and Edge, desktop and mobile", detail: "iOS Safari especially: the hero video, the TeamQ sliders, the card flip.", owner: "Wilfred" },
      { id: "a11y", title: "WCAG 2.1 AA by hand: keyboard through every flow, focus states, contrast on the dark palette", detail: "Lighthouse's 100 is the automated half. The tool, the card and the forms need a keyboard pass.", owner: "Wilfred" },
      { id: "motion", title: "Motion pass: one entrance and reveal system, reduced motion respected everywhere", owner: "Wilfred" },
      { id: "logos", title: "Logo SVGs optimised or redrawn", detail: "The wordmark and the star ship as PNG today.", owner: "Wilfred" },
      { id: "font-licence", title: "Font licence for the locked pairing", owner: "Mike" },
      { id: "errors", title: "404 and error pages checked on the live domain", owner: "Wilfred", where: { href: "/this-page-does-not-exist", label: "404" } },
    ],
  },
  {
    id: "analytics",
    name: "Analytics and tags",
    note: "Nothing fires until the IDs exist, and for EU visitors nothing may fire before consent.",
    items: [
      { id: "ga4", title: "GA4 property created, NEXT_PUBLIC_GA_ID set, conversion events on form, booking and teaser submit", owner: "SAMUH", where: { href: `${ADMIN_BASE}/analytics`, label: "Analytics" } },
      { id: "ga4-tab", title: "GA4_PROPERTY_ID and the service account key, so the Analytics tab reads", detail: "The service account is a Viewer on the property. Steps are on the tab.", owner: "Wilfred", where: { href: `${ADMIN_BASE}/analytics`, label: "Analytics" } },
      { id: "vercel-analytics", title: "Vercel Web Analytics enabled on the project", owner: "Wilfred" },
      { id: "linkedin", title: "LinkedIn Insight Tag ID. Meta pixel only if asked", owner: "SAMUH" },
      { id: "consent", title: "Cookie consent before any tag fires for EU visitors", detail: "Not built. Needs the Cookies page from counsel and a banner that holds GA4 and LinkedIn until accepted.", owner: "Wilfred" },
    ],
  },
  {
    id: "admin",
    name: "Admin and hosting",
    note: "What the admin needs on Vercel before the team can sign in. docs/admin.md has the steps.",
    items: [
      { id: "merge", title: "Branches merged to main: feat/admin, then launch/seo. Worktree removed", detail: "Wilfred approves every push.", owner: "Wilfred" },
      { id: "admin-env", title: "ADMIN_EMAILS, ADMIN_SESSION_SECRET and ADMIN_ORIGIN in Vercel", detail: "ADMIN_ORIGIN is https://samuh.work once live, so sign-in links never carry a preview URL.", owner: "Wilfred" },
      { id: "redis", title: "Upstash Redis from the Marketplace, attached to the project", detail: "Without it content edits save to the build machine and vanish.", owner: "Wilfred" },
      { id: "blob", title: "Vercel Blob store created, BLOB_READ_WRITE_TOKEN set, images and headshots moved to it", owner: "Mike" },
      { id: "resend-domain", title: "Resend domain verified, RESEND_FROM on samuh.work", detail: "Mike's key is in onboarding mode and only delivers to mike@samuh.work. Sign-in links and lead emails to anyone else fail until the DNS record is in.", owner: "Mike" },
      { id: "team-signin", title: "Each team member signs in to the admin once", owner: "SAMUH", where: { href: `${ADMIN_BASE}/login`, label: "Sign in" } },
      { id: "walkthrough", title: "Admin walkthrough recorded for SAMUH", detail: "Content, Blog, this list. Part of the handover in the scope.", owner: "Wilfred" },
    ],
  },
  {
    id: "cutover",
    name: "Domain and launch day",
    note: "Done when samuh.work serves the new site and every check below passes on it.",
    items: [
      { id: "dns-access", title: "Registrar and DNS access for samuh.work", owner: "Mike" },
      { id: "domain", title: "samuh.work and www added to the Vercel project, DNS pointed, certificate issued", detail: "www redirects to the apex.", owner: "Wilfred" },
      { id: "wp-backup", title: "WordPress export taken and the old host kept live until the redirects are verified", owner: "Mike" },
      { id: "smoke", title: "Smoke test on the live domain", detail: "Home, every nav page, a post, the three flows with emails arriving, admin sign-in, /sitemap.xml, /robots.txt, /og.png, a redirected WordPress URL.", owner: "Wilfred" },
      { id: "retainer", title: "Hours allowance for the ongoing retainer agreed in writing", detail: "The $1,000 per month tier is not numbered.", owner: "SAMUH" },
      { id: "scope-doc", title: "Drive scope document: Phase language removed from sections 1, 4 and 13", owner: "Wilfred" },
    ],
  },
];

export interface ItemState {
  done: boolean;
  by: string;
  at: string;
  note?: string;
}

export interface CustomItem {
  id: string;
  group: string;
  title: string;
  detail?: string;
  owner: Owner;
  by: string;
  at: string;
}

export interface LaunchState {
  items: Record<string, ItemState>;
  custom: CustomItem[];
}
