# samuhsite

Website for SAMUH (samuh.work). Next.js 15, TypeScript, App Router, Tailwind v4.

## Run it

```bash
npm install
npm run dev
```

http://localhost:3000 - placeholder home
http://localhost:3000/design - the direction configurator

Seven independent dials: background (5), two accents (12 hues), type pairing
(10), line weight (4), entrance (5), hover (5). Number keys 1 to 5 switch the
background, q through p switch the type. The URL records the exact combination,
for example `/design#synapse.pink-magenta.cyan-samuh.dm-serif.balanced.unblur.glow`,
so a combination can be shared as a link.

## Layout

```
CLAUDE.md               operating brief, read first
docs/                   project context
src/
  app/
    layout.tsx          font loading
    page.tsx            home
    design/             the configurator, deleted after selection
      Backdrop.tsx      the five background treatments
  lib/
    tokens.ts           the design system
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
