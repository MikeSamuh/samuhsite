// The go-live checklist on the Launch tab: the list and its types. The list
// is code, so it is reviewed like everything else. Items marked `done: true`
// were finished in the repo and show ticked from the start; the store can
// still untick them. The basics of getting launched, nothing assumed and
// nobody assigned (Wilfred, 23 October 2026). No server imports here: the
// client component reads this file. Who ticked what lives in the store,
// through launch.ts.

import { ADMIN_BASE } from "./paths";

export interface LaunchItem {
  id: string;
  title: string;
  /** what done looks like, or where it stands today */
  detail?: string;
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
    note: "Every line marked TODO(content) in the code, and every claim that must come from SAMUH in writing.",
    items: [
      { id: "testimonials", title: "Testimonials: real quotes with name, role and organization", detail: "The home and Solutions carry three sample quotes.", where: content("global", "Site-wide") },
      { id: "hero-line", title: "Hero line and the Sapien Labs research claim confirmed", where: content("home", "Home") },
      { id: "hero-film", title: "Hero film in place of the stock test clip", detail: "/hero-test.mp4 is a placeholder behind a poster frame." },
      { id: "carte", title: "Solutions: the à la carte pieces confirmed", where: content("solutions", "Solutions") },
      { id: "tiers", title: "Solutions: the three tiers and the comparison table confirmed", detail: "Including whether a price shows.", where: content("solutions", "Solutions") },
      { id: "faq", title: "FAQ approved", where: content("home", "Home") },
      { id: "teamq-copy", title: "TeamQ tool copy approved", where: content("teamq", "TeamQ") },
      { id: "process-copy", title: "Process page copy confirmed, Assess stage icon drawn", where: content("process", "Process") },
      { id: "bios", title: "About: team bios and full-size headshots", where: content("about", "About") },
      { id: "case-study", title: "Case study PDF supplied, or the card goes", detail: "The card on the home links nowhere until the PDF exists." },
      { id: "metaphor-originals", title: "Metaphor cards: drawings at full resolution", detail: "Pulled from the keynote PDF at 509 by 720 today." },
      { id: "contact-details", title: "Contact page: email, phone number, response time", where: content("contact", "Contact") },
      { id: "legal", title: "Privacy, Terms and Cookies pages", detail: "The footer links land on Contact until they exist." },
      { id: "insights-review", title: "Insights: which episodes and drafts stay", where: { href: `${ADMIN_BASE}/blog`, label: "Blog" } },
      { id: "insights-videos", title: "Insights: remaining videos uploaded to YouTube and posted" },
      { id: "todo-grep", title: "Every TODO(content) in the code resolved", detail: "grep -r \"TODO(content)\" src/ returns nothing." },
    ],
  },
  {
    id: "intake",
    name: "Intake flows",
    note: "The three ways a visitor reaches SAMUH. Each needs a key in Vercel before it does anything.",
    items: [
      { id: "booking", title: "Booking link set as NEXT_PUBLIC_BOOKING_URL", detail: "/talk shows a placeholder until then.", where: { href: "/talk", label: "/talk" } },
      { id: "clarify", title: "Clarify workspace slug set as CLARIFY_WORKSPACE", detail: "Without it no lead reaches the CRM." },
      { id: "lead-notify", title: "Lead emails: LEAD_NOTIFY_TO, LEAD_NOTIFY_CC and RESEND_FROM in Vercel", detail: "After the Resend domain is verified." },
      { id: "turnstile", title: "Cloudflare Turnstile site key and secret in Vercel" },
    ],
  },
  {
    id: "seo",
    name: "Search",
    note: "Metadata, sharing cards, structured data, sitemap, robots and redirects are in the code. What remains happens on the live domain.",
    items: [
      { id: "meta", title: "Metadata, Open Graph, structured data, sitemap and robots on every page", done: true, where: { href: "/sitemap.xml", label: "/sitemap.xml" } },
      { id: "redirects", title: "Redirects from every old WordPress URL checked against the live WordPress sitemap" },
      { id: "gsc", title: "Google Search Console verified, sitemap submitted", detail: "GOOGLE_SITE_VERIFICATION in Vercel, then submit https://samuh.work/sitemap.xml.", where: { href: "https://search.google.com/search-console", label: "Search Console" } },
    ],
  },
  {
    id: "quality",
    name: "Quality bar",
    note: "The bar in docs/scope.md.",
    items: [
      { id: "lcp", title: "LCP under 2.5 seconds on throttled mobile, Lighthouse performance 90 or better" },
      { id: "browsers", title: "Chrome, Safari, Firefox and Edge, desktop and mobile" },
      { id: "a11y", title: "Keyboard through every flow, visible focus, contrast on the dark palette" },
      { id: "errors", title: "404 and error pages checked on the live domain", where: { href: "/this-page-does-not-exist", label: "404" } },
    ],
  },
  {
    id: "analytics",
    name: "Analytics",
    note: "Nothing fires until the IDs exist.",
    items: [
      { id: "ga4", title: "GA4 property created, NEXT_PUBLIC_GA_ID set", where: { href: `${ADMIN_BASE}/analytics`, label: "Analytics" } },
      { id: "ga4-tab", title: "GA4_PROPERTY_ID and the service account key, so the Analytics tab reads", where: { href: `${ADMIN_BASE}/analytics`, label: "Analytics" } },
      { id: "vercel-analytics", title: "Vercel Web Analytics enabled on the project" },
      { id: "consent", title: "Cookie consent before any tag fires for EU visitors", detail: "Needs the Cookies page." },
    ],
  },
  {
    id: "admin",
    name: "Admin and hosting",
    note: "What the admin needs on Vercel. docs/admin.md has the steps.",
    items: [
      { id: "redis", title: "Upstash Redis from the Marketplace, attached to the project", detail: "Until then nothing saved in the admin persists: content, posts, responses, this list." },
      { id: "blob", title: "Vercel Blob store created, BLOB_READ_WRITE_TOKEN set" },
      { id: "admin-env", title: "ADMIN_EMAILS, ADMIN_SESSION_SECRET and ADMIN_ORIGIN in Vercel" },
      { id: "resend-domain", title: "Resend domain verified, so sign-in links and lead emails reach everyone", detail: "Delivers to one address until the DNS record is in." },
      { id: "admin-gate", title: "Sign-in switched back on: ADMIN_OPEN set to false in src/lib/admin/session.ts", detail: "While it is open, anyone with the URL can edit the site." },
    ],
  },
  {
    id: "cutover",
    name: "Domain and launch day",
    note: "Done when samuh.work serves the new site and every check passes on it.",
    items: [
      { id: "dns-access", title: "Registrar and DNS access for samuh.work" },
      { id: "domain", title: "samuh.work and www added to the Vercel project, DNS pointed, certificate issued" },
      { id: "wp-backup", title: "WordPress export taken, old host kept live until the redirects are verified" },
      { id: "smoke", title: "Smoke test on the live domain", detail: "Home, every nav page, a post, the three flows with emails arriving, /sitemap.xml, /robots.txt, /og.png, a redirected WordPress URL." },
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
  by: string;
  at: string;
}

export interface LaunchState {
  items: Record<string, ItemState>;
  custom: CustomItem[];
}
