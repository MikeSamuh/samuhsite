# samuhsite

Website for SAMUH (samuh.work). Next.js 15, TypeScript, App Router, Tailwind v4.

## Run it

```bash
npm install
npm run dev
```

http://localhost:3000 - the site
http://localhost:3000/admin - the content admin (see `.env.example`)

## Layout

```
CLAUDE.md               operating brief, read first
docs/                   project context
src/
  app/
    layout.tsx          fonts, site-wide metadata, analytics tags
    (site)/             every public page, in the shared shell
    layout/             the sections and pages the site is composed from
    admin/              the content admin
    robots.ts, sitemap.ts, og.png/   search and sharing
  components/site/      the shell and the home and page composers
  lib/
    tokens.ts           the design system
    site.ts             the one composition: frame, nav, routes, section order
    seo.ts              metadata helper and structured data
```

## Before you write code

Read `CLAUDE.md`. It carries seven hard rules that exist because breaking them
causes real problems with the client, not because they are tidy.

The short version: never invent a statistic, never recreate the logo
lettering, never type a hex code outside `src/lib/tokens.ts`, and never call
the intake assessment TeamQ.

## Deployment

Vercel. `main` is production. Every branch gets a preview URL, and that URL is
how design review happens.
