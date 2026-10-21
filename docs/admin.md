# Admin panel

`/admin`. The team's back end for the site: the words on every page, the
Insights posts, the style guide, and the numbers. Built 21 October 2026 on
`feat/admin`. No visitor accounts: this is the team signing in, which is a
different thing from CLAUDE.md rule 5 and is called out there.

## Signing in

Magic link. Enter a work email on `/admin/login`; if it is on
`ADMIN_EMAILS`, a single-use link arrives by email (Resend, the same key
the lead notify uses) and signs the browser in for thirty days. The form
answers the same way whether or not the address is on the list.

Adding someone: add their address to `ADMIN_EMAILS` in Vercel and redeploy.
Removing someone: take it out; their next request fails even with a live
cookie, because `currentUser()` re-checks the list.

Local dev with no `RESEND_API_KEY`: the link prints in the terminal and
shows on the login page.

| Piece | File |
|---|---|
| Session cookie, signed JWT, edge-safe | `src/lib/admin/session.ts` |
| Whitelist, tokens, the email | `src/lib/admin/auth.ts` |
| The gate on `/admin/*` and `/api/admin/*` | `src/middleware.ts` |

## Where things are stored

`src/lib/admin/store.ts`, one interface, two backends:

- **Upstash Redis** when `UPSTASH_REDIS_REST_URL` and `_TOKEN` are set (the
  Marketplace integration; it may write `KV_REST_API_URL` and `_TOKEN`, which
  also work). This is production
- **Files under `.data/store/`** otherwise. Local dev only, never committed

Images go to Vercel Blob when `BLOB_READ_WRITE_TOKEN` is set, else to
`public/uploads/` locally.

Keys: `content:<page>`, `post:<slug>`, `auth:magic:<hash>`.

## The four tabs

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
