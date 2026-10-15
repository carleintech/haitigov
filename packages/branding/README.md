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
Additional videos, slides and documentary media remain pending rather than
being simulated.

## First history-page film: Ayiti nan imaj / Haïti en images

On 2026-10-14 the owner confirmed public-use permission for all 41 images in
`docs/video` and the supplied `Haiti_Cherie.mp3` recording. The owner identified
the recording as instrumental, without speech or lyrics. This records the
owner's statements, not independent copyright, identity or factual verification.

Reproduce the 211-second, 1280x720 H.264/AAC film with
`node scripts/prepare-history-video.mjs` from the repository root. FFmpeg and
FFprobe must be available on PATH. The generator reuses Next's image processor,
rejects an unreviewed image inventory, preserves every complete image and source
watermark, and records source SHA-256 hashes and timecoded bilingual descriptions
in `apps/web/app/_data/history-media.json`. The soundtrack is lowered and faded
at the beginning/end; it is not looped. Each image lasts five seconds, with
three-second opening/closing titles and brief fades.

Outputs are in `apps/web/public/history-media`: the MP4, a static poster and
HT/FR WebVTT captions. The page offers native playback/volume/fullscreen controls,
no autoplay, captions and a full visual transcript. The poster stays static
until the visitor chooses playback, including with reduced-motion preferences.

The mixed supplied photographs, artwork, marks and nine conceptual department
flags are not a verified historical documentary or a complete territorial flag
registry. The film does not authenticate depicted places, dates, official seals,
embassy relationships or department identities. A bilingual prototype notice is
embedded throughout the film and repeated beside the player. No missing tenth
flag or historical claims were invented. Independent rights/identity review
remains a production-readiness gate.

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
