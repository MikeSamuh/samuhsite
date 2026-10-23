# Admin panel

`/hq-7h3k`, with its API under `/api/hq-7h3k`. Not `/admin`, so it is not
the first thing a stranger types; the pages carry noindex and robots.txt
does not name the path. Both halves of the path are one constant in
`src/lib/admin/paths.ts` plus the two folder names and the literal
matcher in `src/middleware.ts`. The team's back end for the site: the words on every page, the
Insights posts, the style guide, and the numbers. Built 21 October 2026 on
`feat/admin`. No visitor accounts: this is the team signing in, which is a
different thing from CLAUDE.md rule 5 and is called out there.

## Signing in

Magic link. Enter a work email on `/hq-7h3k/login`; if it is on
`ADMIN_EMAILS`, a single-use link arrives by email (Resend, the same key
the lead notify uses) and signs the browser in for thirty days. The form
answers the same way whether or not the address is on the list.

Adding someone: add their address to `ADMIN_EMAILS` in Vercel and redeploy.
Removing someone: take it out; their next request fails even with a live
cookie, because `currentUser()` re-checks the list.

Local dev with no `RESEND_API_KEY`: the link prints in the terminal and
shows on the login page.

**Open for now.** `ADMIN_OPEN` in `src/lib/admin/session.ts` is `true`
since 23 October 2026, Wilfred's call: the sign-in email only reaches
Mike until the Resend domain is verified, and nobody on our side has
Vercel access to set an env switch, so the gate is off in code and the
team can look around. Pages and the API act as `open-access@samuh.work`.
While it is open, anyone with the URL can edit the site. Flip it to
`false` before launch.

| Piece | File |
|---|---|
| Session cookie, signed JWT, edge-safe | `src/lib/admin/session.ts` |
| Whitelist, tokens, the email | `src/lib/admin/auth.ts` |
| The gate on the admin pages and API | `src/middleware.ts` |

## Where things are stored

`src/lib/admin/store.ts`, one interface, two backends:

- **Upstash Redis** when `UPSTASH_REDIS_REST_URL` and `_TOKEN` are set (the
  Marketplace integration; it may write `KV_REST_API_URL` and `_TOKEN`, which
  also work). This is production
- **Files under `.data/store/`** otherwise. Local dev only, never committed

Images go to Vercel Blob when `BLOB_READ_WRITE_TOKEN` is set, else to
`public/uploads/` locally.

Keys: `content:<page>`, `post:<slug>`, `reflection:<id>`, `auth:magic:<hash>`.

## The five tabs

**Content.** One document per page (`home`, `about`, `process`,
`solutions`, `teamq`, `contact`, `insights`, `global`). The fields and
their labels are `src/lib/content/schema.ts`; the defaults, which are the
copy as it stood when the admin was built, are `src/lib/content/defaults.ts`.
A save stores only that page and revalidates the whole tree, so the site
stays static between edits. Reset deletes the document and the defaults
show again.

Adding a field: add it to `defaults.ts` and to `schema.ts` (a check at load
throws if they drift), then read it in the component. The site reads the
merged content through `getContent()` in a server page and passes it down;
components without it show the defaults, which is what the frozen drafts
and the layout tool want.

**Blog.** Posts written in the admin are documents with HTML bodies from
the editor (Tiptap). The Insights loader merges them with the MDX files in
`content/insights/`; a stored post with a file's slug replaces the file.
Opening a file post in the admin converts its markdown to HTML; saving it
makes the admin copy, and the file is only a fallback from then on.
Deleting the admin copy brings the file back.

YouTube: paste a watch link on its own line, or press the YouTube button.
The site swaps the embed for its own click-to-play player.

Only `published` posts with a date show. `draft` and `review` never render.

**Cards.** The metaphor deck on the home page: each card is a drawing
and a name. Add a card (upload the drawing, it goes to Blob, or paste a
path), rename, move, delete, then Save; the list is one document under
`cards:list` and the home page re-renders. Without a saved list the two
cards in `src/lib/site.ts` show, and Reset goes back to them. Wilfred's
ask on 23 October 2026. Below the deck on the same tab: what visitors
shared beside a card, each one a document under `reflection:<id>` with
the card's name, the words and the time, nothing else, so CLAUDE.md rule
5 holds. A visitor's line arrives hidden; "Show on card" puts it on the
back of that card for everyone, "Delete" removes it; the team can write
one of its own. The card reads and writes through `/api/reflection`,
public and anonymous; the admin's own routes are `/api/hq-7h3k/cards`
and `/api/hq-7h3k/reflections`. The words beside the deck are in the
code (`DECK` in `src/app/layout/sections.tsx`), not in the Content tab.

**Brand.** Read-only, rendered from `src/lib/tokens.ts` and the locked hash
in `src/lib/layout.ts`, so it cannot drift from the site. The rules are the
ones in CLAUDE.md, `docs/brief.md` and `docs/assets.md`.

**Analytics.** GA4 through the Data API with a service account
(`src/lib/admin/ga4.ts`), cached ten minutes. The GA4 tag itself is in the
root layout and switches on with `NEXT_PUBLIC_GA_ID`. Vercel Analytics is
on the page too and reports once it is enabled on the project; it has no
read API, so the tab links out.

## Setting it up on Vercel

1. `ADMIN_EMAILS`, `ADMIN_SESSION_SECRET` (any long random string),
   `ADMIN_ORIGIN` (`https://samuh.work` once live)
2. Upstash Redis from the Marketplace, attached to the project
3. Blob store (Mike, already on the M2 list) for uploads
4. `NEXT_PUBLIC_GA_ID` once the GA4 property exists; `GA4_PROPERTY_ID` and
   `GA4_SERVICE_ACCOUNT_KEY` for the tab, steps on the tab itself
5. `RESEND_API_KEY` is already there for leads; `RESEND_FROM` once the
   domain is verified, so sign-in links come from samuh.work

## Not in this build

- Previewing unsaved content. Save, then open the page
- Reordering sections or turning them off from the admin. That is still
  `drafts.ts`
- Roles. Everyone on the list can do everything
