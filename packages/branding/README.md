# HaitiGov Branding Package

This package is the controlled registry for HaitiGov identity assets. It does
not make the proposed platform or any design asset official.

The three initial slots are:

- national seal;
- national emblem;
- simplified national mark.

An asset may be distributed only after its source, usage rights, project status,
and accessible alternatives are reviewed. Reference images in `docs/` are not
automatically package assets. Some are mockups or unrelated seals and must never
be silently promoted into the product.

Each approved asset should eventually include SVG and PNG renditions, a source
record, review date, usage guidance, minimum-size guidance, safe-area guidance,
and monochrome/high-contrast variants.

## Public prototype illustrations

The owner confirmed permission to use the supplied illustrations in the public
prototype. This records the owner's confirmation, not an independent rights
verification or government endorsement. Every placement has a visible bilingual
prototype-illustration label; these images are not documentary photographs,
current-site evidence, or official institutional identity assets.

| Owner-supplied source | Optimized public asset | Homepage placement |
| --- | --- | --- |
| `docs/citadelle.png` | `homepage-citadelle.webp` | Citadelle hero and heritage card |
| `docs/monhaiti.png` | `homepage-citizen.webp` | Mon Haiti phone-user illustration |
| `docs/coat.png` | `homepage-coast.webp` | Territorial discovery card |
| `docs/Eksplore-Ayiti.png` | `homepage-explore.webp` | Department discovery background |
| `docs/dance.png` | `homepage-culture.webp` | Culture and history card |
| `docs/Gouvènman-ouvè.png` | `homepage-open.webp` | Open-government illustration |

Derivatives live in `apps/web/public`. Sources are untouched. They are resized
to a maximum width of 1920 pixels without enlargement and encoded as WebP at
quality 80 using the image processor supplied by the existing Next dependency.
Next's responsive image optimization supplies `srcset` and `sizes`; the hero
loads eagerly with high fetch priority and below-fold images load lazily.
Decorative images have empty alternative text alongside semantic headings and
visible captions. Dark overlays protect text contrast.

The owner approved keeping the existing design system rather than installing
competing UI libraries. The hero wordmark alone has an eight-second repeated
blue/red CSS gradient, derived from national color tokens with lightened colors
for readability. A keyboard-operable pause control freezes visual effects.
Reduced-motion preferences retain a static gradient and disable transitions;
forced colors restore a readable system text color. Glass panels, responsive
bento links and short department-content reveals do not imply real accounts,
a verified interactive map, or transactional services.

`docs/emblem.png` is not incorporated as an official seal. Production use of
illustrations and identity assets still requires authoritative provenance,
rights review, accessible alternatives, and approval.

## Public-page mockup derivatives

The remaining public-page layouts use decorative crops from the owner's supplied
page mockups in `docs/`. Reproduce these with
`node scripts/prepare-public-page-assets.mjs` from the repository root.
The script records the exact source filenames and crop rectangles and writes
WebP quality-85 derivatives to `apps/web/public/discover`; originals remain
unchanged. It reuses the existing Next image processor without a new dependency.
It rejects other working directories before creating or writing any artwork.

These include the palace scene, ten department landscapes and conceptual marks,
Explore heritage/culture/coast/food scenes, and history-era and portrait artwork.
They are prototype illustrations, not verified photographs, official department
seals, evidence of current conditions, or proof of government adoption. Visible
localized notices identify that limitation. History claims retain their separate
source citations; artwork does not establish factual provenance.
Production publication still requires independent rights and identity review.
Missing videos, slides, captions and documentary media remain pending rather
than being simulated.

## Retained historical photography

The retained `apps/web/public/citadelle-aerial.webp` asset is derived from
[Citadelle Laferrière Aerial View](https://commons.wikimedia.org/wiki/File:Citadelle_Laferri%C3%A8re_Aerial_View.jpg).
Author: SPC Gibran Torres, United States Army. Photograph date: 2010-04-28.
Wikimedia Commons identifies this U.S. Army work as public domain (`PD US Army`);
its image metadata and rights statement were reviewed on 2026-10-06.
The local derivative is resized to 1920 pixels wide and compressed to WebP;
it is no longer displayed by the current illustrated homepage.
This historical photograph is not evidence of current site conditions,
institutional endorsement, or official HaitiGov adoption.

The owner-supplied logo remains prototype-only, with the production
provenance/usage-rights gate described in the engineering tracker.
