# samuhsite

Website for SAMUH (samuh.work). Next.js 15, TypeScript, App Router, Tailwind v4.

## Run it

```bash
npm install
npm run dev
```

http://localhost:3000 — placeholder home
http://localhost:3000/design — the five design directions

Switch directions with the tabs or the number keys 1 to 5. Each deep-links:
`/design#noir`, `#signal`, `#ember`, `#kinetic`, `#institute`.

## Layout

```
CLAUDE.md               operating brief, read first
docs/                   project context
src/
  app/
    layout.tsx          font loading
    page.tsx            home
    design/             direction preview, deleted after selection
  lib/
    directions.ts       the design system
```

## Before you write code

Read `CLAUDE.md`. It carries seven hard rules that exist because breaking them
causes real problems with the client, not because they are tidy.

The short version: never invent a statistic, never recreate the logo
lettering, and never type a hex code outside `src/lib/directions.ts`.

## Deployment

Vercel. `main` is production. Every branch gets a preview URL, and that URL is
how design review happens.
