import Link from "next/link";
import { TrendChart } from "@/components/admin/TrendChart";
import { ga4Config, getAnalytics, type Analytics, type Totals } from "@/lib/admin/ga4";
import { ADMIN_BASE } from "@/lib/admin/paths";

const RANGES = [7, 28, 90];

function pct(now: number, before: number): string | null {
  if (!before) return null;
  const d = ((now - before) / before) * 100;
  return `${d >= 0 ? "+" : ""}${d.toFixed(0)}% vs the ${"previous period"}`;
}

function Tile({ k, v, d, up }: { k: string; v: string; d?: string | null; up?: boolean | null }) {
  return (
    <div className="adm-tile">
      <span className="adm-tile-k">{k}</span>
      <span className="adm-tile-v">{v}</span>
      {d ? <span className="adm-tile-d" data-up={up === null || up === undefined ? undefined : String(up)}>{d}</span> : null}
    </div>
  );
}

function Bars({ rows, max }: { rows: { label: string; n: number }[]; max: number }) {
  if (!rows.length) return <p className="adm-note">Nothing yet.</p>;
  return (
    <div className="adm-bars">
      {rows.map((r) => (
        <div className="adm-bar" key={r.label}>
          <span className="adm-bar-label" title={r.label}>{r.label}</span>
          <span className="adm-bar-n">{r.n.toLocaleString()}</span>
          <span className="adm-bar-track"><span className="adm-bar-fill" style={{ width: `${Math.max(2, (r.n / Math.max(1, max)) * 100)}%` }} /></span>
        </div>
      ))}
    </div>
  );
}

function mmss(s: number): string {
  return `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")}`;
}

function Dashboard({ a }: { a: Analytics }) {
  const t: Totals = a.totals, p: Totals = a.previous;
  const up = (now: number, before: number) => (before ? now >= before : null);
  return (
    <>
      <div className="adm-tiles">
        <Tile k="Users" v={t.users.toLocaleString()} d={pct(t.users, p.users)} up={up(t.users, p.users)} />
        <Tile k="Sessions" v={t.sessions.toLocaleString()} d={pct(t.sessions, p.sessions)} up={up(t.sessions, p.sessions)} />
        <Tile k="Page views" v={t.views.toLocaleString()} d={pct(t.views, p.views)} up={up(t.views, p.views)} />
        <Tile k="Engagement rate" v={`${(t.engagementRate * 100).toFixed(0)}%`} d={pct(t.engagementRate, p.engagementRate)} up={up(t.engagementRate, p.engagementRate)} />
        <Tile k="Avg. session" v={mmss(t.avgEngagement)} d={pct(t.avgEngagement, p.avgEngagement)} up={up(t.avgEngagement, p.avgEngagement)} />
      </div>
      <div className="adm-card" style={{ marginTop: 16 }}>
        <div className="adm-card-title">Users by day</div>
        <TrendChart points={a.series.map((s) => ({ date: s.date, value: s.users }))} label="Users" />
      </div>
      <div className="adm-grid adm-grid-2" style={{ marginTop: 16 }}>
        <div className="adm-card">
          <div className="adm-card-title">Top pages</div>
          <div className="adm-card-note">Views</div>
          <Bars rows={a.pages.map((r) => ({ label: r.path, n: r.views }))} max={a.pages[0]?.views ?? 0} />
        </div>
        <div className="adm-card">
          <div className="adm-card-title">Where sessions came from</div>
          <div className="adm-card-note">Sessions by source</div>
          <Bars rows={a.sources.map((r) => ({ label: r.source, n: r.sessions }))} max={a.sources[0]?.sessions ?? 0} />
        </div>
        <div className="adm-card">
          <div className="adm-card-title">Leads and conversions</div>
          <div className="adm-card-note">lead_submit is a form sent, teaser_interact the first slider moved on TeamQ, booking_open the calendar shown</div>
          <Bars rows={a.events.map((r) => ({ label: r.name, n: r.count }))} max={a.events[0]?.count ?? 0} />
        </div>
        <div className="adm-card">
          <div className="adm-card-title">Devices and countries</div>
          <div className="adm-card-note">Users</div>
          <Bars rows={[...a.devices.map((r) => ({ label: r.device, n: r.users })), ...a.countries.slice(0, 5).map((r) => ({ label: r.country, n: r.users }))]} max={Math.max(a.devices[0]?.users ?? 0, a.countries[0]?.users ?? 0)} />
        </div>
      </div>
      <p className="adm-note" style={{ marginTop: 12 }}>Fetched {new Date(a.fetchedAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}. Refreshes every ten minutes. GA4 itself lags a day or so on some reports.</p>
    </>
  );
}

function Setup({ gaId }: { gaId?: string }) {
  return (
    <div className="adm-grid adm-grid-2">
      <div className="adm-card">
        <div className="adm-card-title">1. Measure the site</div>
        <div className="adm-card-note">Google Analytics 4 collects. The tag is already in the site and switches on with one variable.</div>
        <ol className="adm-steps">
          <li>In Google Analytics, create a GA4 property for samuh.work and a Web data stream. Copy its Measurement ID, which looks like <span className="adm-code">G-XXXXXXXXXX</span>.</li>
          <li>In Vercel, add <span className="adm-code">NEXT_PUBLIC_GA_ID</span> with that ID, for Production (and Preview if you want preview traffic counted). Redeploy.</li>
          <li>Page views, plus the site&rsquo;s own events, start flowing: <span className="adm-code">lead_submit</span>, <span className="adm-code">teaser_interact</span>, <span className="adm-code">booking_open</span>. Mark <span className="adm-code">lead_submit</span> as a key event in GA4 so it counts as a conversion.</li>
        </ol>
        <p className="adm-note" style={{ marginTop: 12 }}>{gaId ? <><span className="adm-badge adm-badge-ok">Tag on</span> NEXT_PUBLIC_GA_ID is set to {gaId}.</> : <><span className="adm-badge adm-badge-warn">Tag off</span> NEXT_PUBLIC_GA_ID is not set on this deployment.</>}</p>
      </div>
      <div className="adm-card">
        <div className="adm-card-title">2. Show it here</div>
        <div className="adm-card-note">This tab reads GA4 with a service account, so nobody needs a Google login to see the numbers.</div>
        <ol className="adm-steps">
          <li>In Google Cloud, make a project (or reuse one), enable the <strong>Google Analytics Data API</strong>, and create a service account. Create a JSON key for it and download it.</li>
          <li>In GA4, Admin &rarr; Property access management, add the service account&rsquo;s email as a <strong>Viewer</strong>.</li>
          <li>In Vercel, add <span className="adm-code">GA4_PROPERTY_ID</span> (the numeric id under Admin &rarr; Property details) and <span className="adm-code">GA4_SERVICE_ACCOUNT_KEY</span>, the JSON key file pasted as one line, or base64 of it. Redeploy.</li>
        </ol>
      </div>
    </div>
  );
}

export default async function AnalyticsPage({ searchParams }: { searchParams: Promise<{ days?: string }> }) {
  const { days: d } = await searchParams;
  const days = RANGES.includes(Number(d)) ? Number(d) : 28;
  const cfg = ga4Config();
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  let data: Analytics | null = null;
  let error: string | null = null;
  if (cfg) {
    try {
      data = await getAnalytics(days);
    } catch (e) {
      error = e instanceof Error ? e.message : "Could not read GA4";
      console.error("[admin] GA4", e);
    }
  }
  const vercel = process.env.VERCEL_ANALYTICS_URL || (process.env.VERCEL_TEAM_SLUG && process.env.VERCEL_PROJECT_NAME ? `https://vercel.com/${process.env.VERCEL_TEAM_SLUG}/${process.env.VERCEL_PROJECT_NAME}/analytics` : "https://vercel.com/dashboard");
  return (
    <>
      <div className="adm-head">
        <div>
          <span className="adm-kicker">Analytics</span>
          <h1 className="adm-title">Who came, and what they did</h1>
          <p className="adm-lede">{cfg ? "Google Analytics 4, read live for this site." : "Not connected yet. Two short steps, both in Vercel's environment variables."}</p>
        </div>
        <div className="adm-actions">
          {cfg ? (
            <span className="adm-range" role="group" aria-label="Range">
              {RANGES.map((r) => <Link key={r} href={`${ADMIN_BASE}/analytics?days=${r}`} aria-current={r === days ? "true" : undefined}>{r} days</Link>)}
            </span>
          ) : null}
          <a className="adm-btn" href={cfg ? `https://analytics.google.com/analytics/web/#/p${cfg.propertyId}/reports/intelligenthome` : "https://analytics.google.com/"} target="_blank" rel="noopener noreferrer">GA4 ↗</a>
          <a className="adm-btn" href={vercel} target="_blank" rel="noopener noreferrer">Vercel Analytics ↗</a>
        </div>
      </div>
      {error ? (
        <div className="adm-card" style={{ marginBottom: 16 }}>
          <div className="adm-card-title">GA4 did not answer</div>
          <p className="adm-note adm-note-error">{error}</p>
          <p className="adm-note" style={{ marginTop: 8 }}>Usually the service account is not a Viewer on the property, the Data API is not enabled on the Cloud project, or the key was pasted with line breaks.</p>
        </div>
      ) : null}
      {data ? <Dashboard a={data} /> : <Setup gaId={gaId} />}
      <div className="adm-section">
        <h2 className="adm-section-title">Vercel Analytics</h2>
        <div className="adm-card">
          <p className="adm-note">The site also carries Vercel&rsquo;s own analytics script, which only reports once Web Analytics is switched on for the project in the Vercel dashboard. It has no read API, so its numbers live there; the button above opens it. Set <span className="adm-code">VERCEL_ANALYTICS_URL</span> to the project&rsquo;s analytics page so the button lands on it.</p>
        </div>
      </div>
    </>
  );
}
