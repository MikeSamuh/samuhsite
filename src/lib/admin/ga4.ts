// GA4 for the admin's Analytics tab, through the Data API over REST with a
// service account. No Google SDK: the account's key signs a JWT (jose, which
// the admin already uses) and trades it for an access token.
//
// Needs, in Vercel's env:
//   GA4_PROPERTY_ID          the numeric property id, Admin > Property details
//   GA4_SERVICE_ACCOUNT_KEY  the service account's JSON key, as one line or
//                            base64. The account needs Viewer on the property
//
// Reads are cached for ten minutes under the "analytics" tag.

import { unstable_cache } from "next/cache";
import { importPKCS8, SignJWT } from "jose";

const SCOPE = "https://www.googleapis.com/auth/analytics.readonly";

interface ServiceAccount {
  client_email: string;
  private_key: string;
  token_uri?: string;
}

export function ga4Config(): { propertyId: string; account: ServiceAccount } | null {
  const propertyId = process.env.GA4_PROPERTY_ID?.trim();
  const raw = process.env.GA4_SERVICE_ACCOUNT_KEY?.trim();
  if (!propertyId || !raw) return null;
  try {
    const json = raw.startsWith("{") ? raw : Buffer.from(raw, "base64").toString("utf8");
    const account = JSON.parse(json) as ServiceAccount;
    if (!account.client_email || !account.private_key) return null;
    return { propertyId, account };
  } catch {
    return null;
  }
}

async function accessToken(account: ServiceAccount): Promise<string> {
  const key = await importPKCS8(account.private_key.replace(/\\n/g, "\n"), "RS256");
  const now = Math.floor(Date.now() / 1000);
  const assertion = await new SignJWT({ scope: SCOPE })
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .setIssuer(account.client_email)
    .setSubject(account.client_email)
    .setAudience(account.token_uri ?? "https://oauth2.googleapis.com/token")
    .setIssuedAt(now)
    .setExpirationTime(now + 3600)
    .sign(key);
  const res = await fetch(account.token_uri ?? "https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion }),
  });
  if (!res.ok) throw new Error(`token: ${res.status} ${await res.text()}`);
  return ((await res.json()) as { access_token: string }).access_token;
}

interface Report {
  rows?: { dimensionValues: { value: string }[]; metricValues: { value: string }[] }[];
}

async function runReport(cfg: NonNullable<ReturnType<typeof ga4Config>>, token: string, body: object): Promise<Report> {
  const res = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${cfg.propertyId}:runReport`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`runReport: ${res.status} ${await res.text()}`);
  return (await res.json()) as Report;
}

export interface Totals {
  users: number;
  sessions: number;
  views: number;
  engagementRate: number;
  avgEngagement: number;
}

export interface Analytics {
  days: number;
  totals: Totals;
  previous: Totals;
  /** one point per day, oldest first */
  series: { date: string; users: number; views: number }[];
  pages: { path: string; views: number; users: number }[];
  sources: { source: string; sessions: number }[];
  events: { name: string; count: number }[];
  devices: { device: string; users: number }[];
  countries: { country: string; users: number }[];
  fetchedAt: string;
}

const n = (v?: string) => Number(v ?? 0) || 0;

function totalsOf(r: Report): Totals {
  const m = r.rows?.[0]?.metricValues ?? [];
  return { users: n(m[0]?.value), sessions: n(m[1]?.value), views: n(m[2]?.value), engagementRate: n(m[3]?.value), avgEngagement: n(m[4]?.value) };
}

async function fetchAnalytics(days: number): Promise<Analytics> {
  const cfg = ga4Config();
  if (!cfg) throw new Error("GA4 is not configured");
  const token = await accessToken(cfg.account);
  const range = { startDate: `${days}daysAgo`, endDate: "today" };
  const prev = { startDate: `${days * 2}daysAgo`, endDate: `${days + 1}daysAgo` };
  const TOTAL_METRICS = [{ name: "activeUsers" }, { name: "sessions" }, { name: "screenPageViews" }, { name: "engagementRate" }, { name: "averageSessionDuration" }];
  const [tot, prevTot, series, pages, sources, events, devices, countries] = await Promise.all([
    runReport(cfg, token, { dateRanges: [range], metrics: TOTAL_METRICS }),
    runReport(cfg, token, { dateRanges: [prev], metrics: TOTAL_METRICS }),
    runReport(cfg, token, { dateRanges: [range], dimensions: [{ name: "date" }], metrics: [{ name: "activeUsers" }, { name: "screenPageViews" }], orderBys: [{ dimension: { dimensionName: "date" } }], limit: 400 }),
    runReport(cfg, token, { dateRanges: [range], dimensions: [{ name: "pagePath" }], metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }], orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }], limit: 12 }),
    runReport(cfg, token, { dateRanges: [range], dimensions: [{ name: "sessionSource" }], metrics: [{ name: "sessions" }], orderBys: [{ metric: { metricName: "sessions" }, desc: true }], limit: 10 }),
    runReport(cfg, token, { dateRanges: [range], dimensions: [{ name: "eventName" }], metrics: [{ name: "eventCount" }], dimensionFilter: { filter: { fieldName: "eventName", inListFilter: { values: ["lead_submit", "teaser_interact", "booking_open", "form_submit", "file_download", "video_start"] } } }, limit: 20 }),
    runReport(cfg, token, { dateRanges: [range], dimensions: [{ name: "deviceCategory" }], metrics: [{ name: "activeUsers" }], orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }], limit: 5 }),
    runReport(cfg, token, { dateRanges: [range], dimensions: [{ name: "country" }], metrics: [{ name: "activeUsers" }], orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }], limit: 8 }),
  ]);
  const d = (r: Report) => r.rows ?? [];
  return {
    days,
    totals: totalsOf(tot),
    previous: totalsOf(prevTot),
    series: d(series).map((r) => ({ date: r.dimensionValues[0].value, users: n(r.metricValues[0].value), views: n(r.metricValues[1].value) })),
    pages: d(pages).map((r) => ({ path: r.dimensionValues[0].value, views: n(r.metricValues[0].value), users: n(r.metricValues[1].value) })),
    sources: d(sources).map((r) => ({ source: r.dimensionValues[0].value, sessions: n(r.metricValues[0].value) })),
    events: d(events).map((r) => ({ name: r.dimensionValues[0].value, count: n(r.metricValues[0].value) })).sort((a, b) => b.count - a.count),
    devices: d(devices).map((r) => ({ device: r.dimensionValues[0].value, users: n(r.metricValues[0].value) })),
    countries: d(countries).map((r) => ({ country: r.dimensionValues[0].value, users: n(r.metricValues[0].value) })),
    fetchedAt: new Date().toISOString(),
  };
}

export const getAnalytics = unstable_cache(fetchAnalytics, ["ga4-analytics"], { revalidate: 600, tags: ["analytics"] });
