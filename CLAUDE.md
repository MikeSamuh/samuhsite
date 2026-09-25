# CLAUDE.md

Read this first, every session. It is the operating brief for this repo.

## What this is

The website for SAMUH (samuh.work), an organisational and high-performance
consulting firm working in partnership with Sapien Labs. Built and maintained
by Wilfred Hirst (Vynfred LLC) on a monthly retainer.

Two jobs, in this order:

1. **Educate.** Teach the SAMUH model to people who have never heard it, using
   SAMUH's own research as the proof.
2. **Generate leads.** Move the ones who are ready into a conversation with the
   sales team.

Everything on the site serves one of those two.

## Art direction

The client does not want to look corporate. Their words, agreed in
conversation: an onboarding process for new clients, but on mushrooms.

Playful, organic, slightly psychedelic. Never childish. They sell to Fortune
500 companies, so it has to survive a boardroom.

The working split:

- **Looseness** in the background, the motion, the illustration, and the
  contrast between hairline and heavy stroke
- **Discipline** in the typography, the spacing, and using one loud color at a
  time

If a change makes the page more playful by making it less legible or less
credible, it is the wrong change.

## Stack

- Next.js 15, App Router, TypeScript
- Tailwind v4 for layout and spacing. Design values come from tokens
- GSAP with ScrollTrigger for scroll sequences, Framer Motion for component
  transitions. Neither is installed yet; wait for the direction decision
- `next/font/google`, self-hosted at build
- Headless CMS for foundations, insights, case studies, team, testimonials and
  solutions
- Vercel. `main` is production, every branch gets a preview URL

## Commands

```bash
npm run dev      # localhost:3000
npm run build    # must pass before any push to main
npm run lint
```

Stop `npm run dev` before `npm run build`. They share `.next`, and a build
under a running dev server leaves it serving broken chunks
(`__webpack_modules__[moduleId] is not a function`). Restart dev after.

## Where things are

```
src/
  app/
    layout.tsx           font loading
    page.tsx             home
    design/              the style picker. colors, fonts, lines, motion. archive now
      page.tsx
      Backdrop.tsx       the five background treatments
      backdrops.css
      design.css
    layout/              the layout tool. locked style, twelve sections, three layouts
      page.tsx
      layout.css
  lib/
    tokens.ts            THE DESIGN SYSTEM. backgrounds, accents, type pairings
    layout.ts            the locked style hash, frame options, section variants, presets
docs/                    project context, read before big changes
```

## Hard rules

Not style preferences. Each one exists because breaking it causes a real
problem with the client.

**1. Never invent facts.** No statistics, sample sizes, percentages, client
names, years of research or case study outcomes unless SAMUH supplied them in
writing. If a number is needed and we do not have it, write `TODO(content)`
and leave it visible. A plausible fake number that ships and gets quoted back
is the worst failure mode in this project.

**2. The logo is untouchable.** The lettering is custom and handmade. SAMUH's
brand book forbids recreating, redrawing or modifying it. Place the supplied
SVG. Never set "SAMUH" in a web font as a substitute.

**3. No design values outside `src/lib/tokens.ts`.** No hex codes, font stacks,
radii, line weights or durations typed into a component or a stylesheet.
Everything reads a CSS custom property.

**4. The intake assessment is not TeamQ.** SAMUH has a validated instrument
called TeamQ. Ours is a separate intake tool with its own logic. It must not
share the TeamQ algorithm, must never be labelled validated or scientific, and
must never be presented as diagnostic.

**5. No accounts, payments or dashboard.** Not in this build. Lead records, not
user records. If a request implies authentication, Stripe, gated content or
stored assessment history, it needs a conversation, not an implementation.

Note the one subtlety: assessment results do get a shareable URL. Encode the
result in the URL or store the minimum needed for that one link. That is not
the same as building accounts, and it is not licence to start storing user
data generally.

**6. Language.** "A multi-team organization", never "an enterprise". Teams stay
the subject. Sapien Labs is credited as a partner, not cited as a footnote.

**7. No em dashes.** Commas, colons or full stops. Site copy, docs, and
anything client-facing.

## Quality bar

From the signed scope. These are contractual, not aspirational.

- LCP under 2.5s. Lighthouse performance 90 or better on throttled mobile
- WCAG 2.1 AA. Keyboard navigation, visible focus, semantic structure, and
  contrast that holds across the dark palette
- Chrome, Safari, Firefox, Edge. Desktop and mobile
- Reduced motion support throughout, not retrofitted

## Working style

- Prefer editing an existing file to creating a new one
- Branch, review on the Vercel preview URL, then merge
- **Local only until told to push.** Commit on a branch as much as you like,
  but never `git push`, open a PR, or merge until Wilfred says so. The repo
  is the client's and every push is visible to them
- If a change touches scope, pricing or the launch date, flag it rather than
  building it
- When the client contradicts a doc in `docs/`, update the doc in the same
  commit. Docs that drift are worse than no docs

## Context files

| File | Read it when |
|---|---|
| `docs/brief.md` | You need positioning, audience, tone or the Sapien Labs relationship |
| `docs/scope.md` | You are adding or arguing about a page, section or feature |
| `docs/design-system.md` | You are touching tokens, type, color, line weight or motion |
| `docs/content.md` | You need to know who owns a piece of copy, or what we may claim |
| `docs/assets.md` | You need a logo, font, photo or video |
| `docs/conventions.md` | You are writing new components |
| `docs/roadmap.md` | You need to know what week we are in |
| `docs/decisions.md` | You are about to relitigate something |
