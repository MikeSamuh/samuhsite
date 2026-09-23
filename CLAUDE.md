# CLAUDE.md

Read this first, every session. It is the operating brief for this repo.

## What this is

The website for SAMUH (samuh.work), an organisational and high-performance
consulting firm. Built and maintained by Wilfred Hirst (Vynfred LLC) on a
monthly retainer.

The site has two jobs, in this order:

1. **Educate.** Teach the SAMUH model to people who have never heard of it,
   using SAMUH's own research as the proof.
2. **Generate leads.** Move the ones who are ready into a conversation with
   the sales team.

Everything on the site serves one of those two.

## Stack

- Next.js 15, App Router, TypeScript
- Tailwind v4 (utilities only; design values come from tokens, see below)
- `next/font/google`, self-hosted at build time
- Deployed on Vercel. `main` is production, every branch gets a preview URL

## Commands

```bash
npm run dev      # localhost:3000
npm run build    # must pass before any push to main
npm run lint
```

## Where things are

```
src/
  app/
    layout.tsx           font loading
    page.tsx             home
    design/              the five-direction preview (delete after selection)
  lib/
    directions.ts        THE DESIGN SYSTEM. all tokens live here
docs/                    project context, read these before big changes
```

## Hard rules

These are not style preferences. Breaking them creates real problems with the
client.

**1. Never invent facts.** No statistics, sample sizes, client names, years of
research, percentages or case study outcomes unless they came from SAMUH in
writing. If a number is needed and we do not have it, write `TODO(content)`
and leave it visible. A plausible-looking fake number that ships to a client
who then quotes it is the worst failure mode in this project.

**2. The logo is untouchable.** The lettering is custom and handmade. SAMUH's
brand book explicitly forbids recreating, redrawing or modifying it. Always
place the supplied SVG. Never set "SAMUH" in a web font as a substitute for
the wordmark.

**3. No design values outside `directions.ts`.** No hex codes, font stacks,
radii or transition durations typed into a component or a CSS file. Everything
reads a CSS custom property. This is what makes the direction switchable and
what makes the eventual design system real rather than decorative.

**4. No "Phase 1" or "Phase 2" language.** Anywhere. Not in code, comments,
copy or docs. The client agreed to remove it. There is one scope.

**5. This is not a SaaS build.** No accounts, no login, no payments, no Stripe,
no user dashboard, no assessment result storage. Leads go to the sales team.
If a request implies any of the above, it is out of scope and needs a
conversation, not an implementation.

**6. The qualification quiz is not TeamQ.** SAMUH has a scientifically
validated instrument. Ours is a short qualification and routing quiz. Never
label ours as validated, scientific, or as TeamQ, and never imply the results
are diagnostic.

**7. No em dashes in any copy.** Use commas, colons or full stops. This applies
to site copy, docs and client-facing text.

## Working style

- Prefer editing an existing file to creating a new one.
- Ship behind a branch, review on the Vercel preview URL, then merge.
- If a change touches scope, pricing or the launch date, stop and flag it
  rather than building it.
- When the client asks for something that contradicts a doc in `docs/`,
  update the doc in the same commit. Docs that drift are worse than no docs.

## Context files

| File | Read it when |
|---|---|
| `docs/brief.md` | You need the positioning or the audience |
| `docs/scope.md` | You are adding or arguing about a page or section |
| `docs/design-system.md` | You are touching tokens, type, colour or motion |
| `docs/content.md` | You need to know who owns a piece of copy |
| `docs/assets.md` | You need a logo, font, photo or video |
| `docs/conventions.md` | You are writing new components |
| `docs/roadmap.md` | You need to know what week we are in |
| `docs/decisions.md` | You are about to relitigate something |
