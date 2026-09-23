# Conventions

## Components

- Server components by default. Add `"use client"` only when you need state,
  effects or event handlers
- One component per file, named export matching the filename
- Co-locate a component's CSS next to it when it is page-specific. Shared
  patterns go in `globals.css`
- No component library. This is a bespoke design build; a UI kit would fight
  the design system rather than help it

## Styling

Tailwind utilities for layout and spacing. CSS custom properties for every
design value. If you find yourself typing a hex code, a font name, a radius or
a duration into a component, stop: it belongs in `src/lib/directions.ts`.

Order of preference:

1. A Tailwind utility
2. A CSS custom property already in the token set
3. A new token added to `directions.ts`
4. Never a literal

## Naming

- Routes and files: kebab-case
- Components: PascalCase
- Tokens and CSS vars: kebab-case
- No abbreviations in public-facing names. `assessment`, not `assmt`

## Motion

Motion is a design token, not a per-component decision. Read `--dur` and
`--ease`. A component that animates at its own speed breaks the direction.

Scroll-driven sequences will use GSAP with ScrollTrigger once a direction is
chosen. Do not add an animation library before then; the choice depends on
which direction wins.

Always honour `prefers-reduced-motion`. It is already handled globally in
`design.css` and must be carried into any new stylesheet.

## Accessibility

Not a launch-week pass. Every component ships with it.

- Semantic elements. A clickable card is a `button` or an `a`, not a `div`
- Visible focus states on everything interactive
- Body text clears 4.5:1 against its background
- Images have alt text or `alt=""` if decorative
- Keyboard reachable in a sensible order

## Git

- Branch per piece of work. `feat/hero-video`, `fix/nav-mobile`
- `npm run build` passes before you push
- Review happens on the Vercel preview URL, not on screenshots by email
- Commit messages say what changed and why, not "updates"

## Performance

- Images through `next/image`. No raw `<img>` for content images
- Video is hosted (Mux, Cloudinary or Vercel Blob), never committed
- Watch the font budget. Every family is a network request and a render delay
- Check Lighthouse before merging anything that touches the hero
