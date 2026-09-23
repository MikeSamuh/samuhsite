# Assets

## Where they live

Google Drive, `SAMUH Website` master folder, shared with Mike, Calina, Rahul,
Jake and Daniel (all writer access).

```
01 Business Materials/   Meeting Notes, Proposal and Scope, Contract and Invoices
02 Client Uploads/       01 Fonts, 02 Logo Vectors and Illustrations, 03 Page Copy,
                         04 Team Photos and Bios, 05 Testimonials and Case Studies,
                         06 Video, 07 Decks and Screenshots
03 Brand Assets/         Logos and Brand Book
04 Content/              Page Copy, Education Library, Insights Migration
05 Design/               Wireframes, Mockups, Iconography, Motion References
06 Build/
07 Reference/            01 Noom Inspo, 02 Creds, 03 Personas
```

Raw client assets never enter this repo. `.gitignore` blocks `.ai`, `.psd`,
`.mp4`, `.mov` and `/raw`. Optimised output goes in `public/`.

## Blocking

Design cannot finish without these.

| Asset | Owner | Status |
|---|---|---|
| Logo as clean SVG | Calina | Received, but see the logo note below |
| Font files plus the web licence | Client | Outstanding |
| Hero video source, highest quality available | Daniel | Script drafted, not shot |
| Confirmed palette decision | Client | Pending direction selection |

**On fonts:** web use is a separate licence from desktop use. If SAMUH bought a
desktop licence only, we cannot self-host and the type decision changes. Get
the licence, not just the files.

## Non-blocking

Can land during build without stopping anything.

- Team photos and bios
- Testimonials and case studies (two case studies received from Rahul)
- Insights posts for migration
- Partner and client logos
- Platform screenshots

## The logo

Supplied in SVG, PNG, JPG and PDF: primary, simplified, with tagline, and
favicon variants.

Two things matter:

**The lettering is custom and handmade.** The brand book forbids recreating,
redrawing or modifying it. Place the supplied file. Never set it in a web font.

**The SVGs are not vectors.** Each one is an SVG wrapper around an embedded
JPEG with a solid background rectangle, between roughly 550KB and 1.9MB. They
cannot be recoloured, scaled cleanly, or placed on a dark stage. SVGO will not
help. Before launch, get a real vector from whoever drew the lettering, or have
the mark redrawn as clean paths with the client's sign-off. Track this as a
real task, not a nice to have.

**What is in use now.** `public/samuh-logo.png` is the supplied transparent PNG,
cropped to the lettering and scaled to 960px wide. It is dark lettering, so on
the dark stage it is turned white with a CSS filter rather than by editing the
file. Good enough for the style picker, not for launch.

## Received but out of scope

Mike and the team have shared material for the platform rather than the site.
Read it for context, do not build from it.

- Platform collateral inventory v7
- welcome-team-journey script (the in-platform welcome)
- Productivity Simulator (Railway app)
