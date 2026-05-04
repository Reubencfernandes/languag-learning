# Language Learner — Design System

**Language Learner** is a mobile-first language-learning app: users authenticate with Hugging Face, the Gemma 3/4 model powers inference through the HF Inference API, and lessons are generated personally for each learner. The current MVP focuses on non-English speakers learning English (and vice versa, Japanese first).

The product has three core tabs on a bottom nav:

1. **Learn** — the main lesson map (duolingo-style chain of circular nodes).
2. **Practice** — drills on everything the user has learned so far.
3. **Profile** — account, streaks, settings.

Authoring surface is driven by a small set of screens:

- **Homepage / Login** — full-bleed yellow splash, illustrated "peep" character, "Get started (login with Hugging Face)" pill.
- **Choose** — native language, learning language, level selector.
- **Learn** — unit banners and big colored lesson-node circles.
- **Learn lesson (question)** — progress bar, close button, exercise card, CHECK CTA.
- **Learn lesson (explanation)** — reading block of linguistic notes + CONTINUE CTA.

---

## Sources

- **Figma file:** `Project Ember.fig` — mounted VFS, page `/Page-1` with frames `Homepage`, `Choose`, `Learn`, `Learn-lesson-1`, `Learn-lesson-explanation`, plus the `peep-11` open-peep component. This is the design source of truth.
- **Codebase:** `github.com/Reubencfernandes/languag-learning` (branch `aws`). It is a stock Next.js 16 + Tailwind 4 scaffold — the only meaningful signal is that fonts are `Geist` + `Geist_Mono`; no component code has been written yet. The Figma drives the UI.
- **Uploaded illustration:** `uploads/Open Peeps - Sitting.png` — an Open Peeps (by Pablo Stanley, CC0) character used on the login screen.

---

## Content fundamentals

The voice in the Figma is sparse — short, lowercase-tolerant, written like a friend giving you a nudge. Headlines are Title Case and aspirational; microcopy is plain and utilitarian.

- **Person.** Second-person implied ("Master Any Language with Ease", "Choose your native language"). Never "we", rarely "I".
- **Casing.** Title Case for page titles ("Choose your native language" is sentence-case — consistent with the friendlier level labels). Section labels are sentence-case with occasional all-lowercase slips ("start From scratch", "intermediate", "japanese"). CTAs inside a lesson shout in ALL CAPS ("CHECK", "CONTINUE"); CTAs on marketing surfaces are sentence case ("Get started (login with Hugging face)").
- **Tone.** Warm, slightly informal, not over-written. The copy trusts the visuals — the yellow splash does the selling, not the words. No marketing adjectives beyond a single sentence of benefit copy.
- **Emoji.** None in the designs. Don't introduce them.
- **Jargon.** The lesson-explanation screen leans educational and specific ("mora-timing", "pitch accent"). When explaining a concept, be concrete with examples in quotes: `ka-ta-na`, `"machine-gun" pace`.
- **Example voice samples (from Figma):**
  - Hero: *"Master Any Language with Ease"*
  - Subhead: *"Build your vocabulary, practice speaking with confidence, and learn naturally through personalized lessons whenever you want, wherever you are."*
  - CTA: *"Get started (login with Hugging face)"* — parenthetical clarifies the auth, no corporate puffery.
  - Lesson prompt: *"What does this sentence Mean ?"* — informal spacing before the `?` is kept.
  - Explanation lead: *"Japanese sounds rhythmic, crisp, and staccato. Here is the breakdown:"* — declarative, then a colon, then a list.

Write like a tutor writing a sticky note — never like marketing writing a brochure.

---

## Visual foundations

**Color story.** Three high-chroma brand colors do most of the work: **sunshine yellow** (`#FDE249`) owns the hero / login and the progress-bar start; **grass green** (`#54CE01` solid / `#49FD8E` banner) is the "go-learn" color for current units and success; **sky blue** (`#19ADF6`) is the secondary lock-in color for locked / completed units and the big lesson-submit CTA. Neutrals are warm-leaning greys (`rgb(166,159,159)`, `rgb(231,231,231)`) — never cool blue-grey. Off-white `rgb(255,249,249)` is used for icon fills.

**Type.** **Geist Variable** (loaded from the uploaded `fonts/Geist-VariableFont_wght.ttf`, weights 100–900). Display titles 32–36/1.05 at 800, h2 22/1.1 at 700, body 15–16/1.45 at 500, eyebrows 12/1 at 700 uppercase with 0.1em tracking, captions 13/1 at 400. Button labels 15 SemiBold on pills, 15 Bold ALL-CAPS on full-width lesson CTAs.

**Spacing.** Mobile frame is a hard **402 × 874** canvas (iPhone 14 Pro-ish). Screen padding is ~16–24px; cards are inset 16px from the bar. Form inputs are 48px tall. The bottom CTA sits 55px above the phone edge, 33px inset on each side.

**Backgrounds.** Two modes: **full-bleed brand color** (hero/login uses pure `#FDE249`, nothing else) or **clean white**. No gradients on backgrounds. The one gradient in the system is the **progress bar** — yellow → orange, vertical. No grain, no noise, no patterns.

**Imagery.** Hand-drawn Open Peeps illustrations (rough ink contour, flat fills, no shadow) for human characters. Flag PNGs for language pickers. No photography.

**Animation.** The Figma has no motion specs. Implement restrained, Duolingo-adjacent: 120ms ease-out on color/opacity; lesson-node press = 80ms scale(0.96). No parallax, no springy bounces on neutral UI. The one place to indulge is **completed-lesson celebration** — a small bounce on the node and a progress-bar fill tween.

**Hover / press.**
- Primary dark pill: hover → nothing (mobile); press → background `rgb(0,0,0)` and +2px outer shadow, translate-y: 1px.
- Unit banner (green/blue): press darkens by 6–8% (use `color-mix(in srgb, base, black 8%)`).
- Lesson-node circle: press = scale(0.96) + remove the 6px flat drop shadow so it "sinks".
- Text links: none in current UI.

**Borders.** 1px solid. Inputs use `--ll-gray-350` (`#A69F9F`). Cards use `--ll-gray-100` (`#EBE8E8`). Flags have a 1px `#999090` hairline stroke.

**Shadows.** Two tokens only. `--shadow-node` is a 6px flat drop under circular lesson nodes (Duolingo trick — uses the halo ring below the fill circle, see `Group2`). `--shadow-card` is barely-there 1px card lift. No blurred soft shadows elsewhere.

**Radii.** Distinct scale — 2 (flag), 5 (swatch), 6 (progress), 8 (unit banner), 11 (inputs), 12 (card), 20 (pill CTA), 50% (lesson nodes).

**Layout rules.** Everything is absolute-positioned in the Figma but maps cleanly to a single-column mobile layout with a fixed bottom CTA / bottom nav. Bottom nav is 57px tall, 1px divider at top, three 24×24 icons spaced across the width (roughly at x=64, x=185, x=293).

**Transparency & blur.** Not used. All fills are opaque.

**Iconography.** Light-gray `#B5B5B5` line icons at 24×24 for bottom nav; `#A5ADAD` × icon 25×25 on lesson chrome. Everything else is solid-fill UI.

**Corner radii rule of thumb.** Sharper (2–8px) for content surfaces, rounder (11–12px) for inputs/cards, full-pill for CTAs, full-circle for play/progress elements.

**Card anatomy.** 1px border `--border-soft`, 12px radius, white fill, no shadow, internal padding 16px.

---

## Iconography

The Figma uses two kinds of icons:

- **Iconify line icons** at 24×24, light gray `#B5B5B5`. The node chain in the Figma references `iconamoon:profile`, `mdi:learn-outline`, `mdi:sword-fight`, `lsicon:right-filled`, `ix:cancel`. Stroke-weight and fill style match the **Lucide** family cleanly.
- **Extracted SVGs** — `Vector.svg` (profile head+shoulders), `Vector-2.svg` (crossed-swords glyph) sit in `assets/`.

Approach:
- **Primary system:** Lucide — inlined as SVG paths inside `ui_kits/app/components/primitives.jsx` via a small `<I name="..." />` wrapper. The full Figma icon library wasn't provided; Lucide's 2px-stroke rounded style matches the Figma's `iconamoon`/`mdi` references 1:1. Flagged as a substitution — swap to actual `iconamoon`/`mdi` sets from Iconify if the user prefers.
- **Fallback SVGs:** `assets/icon-profile.svg`, `assets/icon-sword.svg` — the exact two glyphs exported from the Figma.
- **No emoji.** Never used in any screen.
- **Unicode chars as icons:** not used. Language pickers use real flag PNGs (`assets/flag-japan.png`, `assets/flag-uk.png`).

Icon sizing scale: **16** (inline), **20** (CTA arrow), **24** (nav / chrome), **25** (lesson close).

---

## Font note

**Geist Variable** is the canonical brand font, loaded locally from `fonts/Geist-VariableFont_wght.ttf` (weights 100–900 via a single variable TTF). Declared with `@font-face` in `colors_and_type.css` and referenced by `--font-sans` / `--font-display` / `--font-ui`. No Google Fonts CDN dependency — the font ships with the system.

---

## Index

Root:

- `README.md` — this file.
- `SKILL.md` — portable skill definition for Claude Code / Agent Skills.
- `colors_and_type.css` — CSS variables for colors, type scale, radii, spacing, shadows.
- `assets/` — brand illustrations, flag PNGs, extracted SVG glyphs.
- `preview/` — small design-system cards that populate the Design System tab.
- `ui_kits/app/` — the mobile app UI kit: `index.html` (interactive click-through), `components/*.jsx`, `README.md`.

Products covered:

- **Language Learner (mobile app)** — `ui_kits/app/`

No marketing website, docs site, or slide template were provided, so those UI kits are omitted.
