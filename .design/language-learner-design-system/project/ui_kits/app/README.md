# Language Learner — Mobile App UI Kit

Interactive click-through of the full app. Frame size **402 × 874** (iPhone 14 Pro-ish). Built with React + Babel inline, **Geist Variable** (loaded from `fonts/Geist-VariableFont_wght.ttf`), and Lucide icons inline as SVG.

## Screens (9)
01 Home · 02 Choose · 03 Learn · 04 Explanation · 05 Lesson · 06 Result · 07 Streak · 08 Practice · 09 Profile

## Files
- `index.html` — router + stage. Persists `route` and `progress` to localStorage.
- `components/primitives.jsx` — `PillCTA`, `BigCTA`, `Input`, `UnitBanner`, `LessonNode`, `ProgressBar`, `BottomNav`, `CloseX`, `StatsHeader`, `I` (Lucide icon wrapper).
- `components/Phone.jsx` — device frame + status bar + bottom CTA slot.
- `components/Homepage.jsx` — full-bleed yellow splash, Open Peeps illustration, pill CTA.
- `components/Choose.jsx` — native + learning language pickers, A0/A1/B1 level cards.
- `components/Learn.jsx` — serpentine lesson path with connector dots, unit banners with 3D drop shadows, current-node pulse.
- `components/LessonQuestion.jsx` — sentence-meaning MCQ, audio button, check/wrong footer reveal.
- `components/LessonExplanation.jsx` — concept eyebrow + bulleted linguistic notes with green check marks.
- `components/LessonResult.jsx` — trophy success / "So close!" fail variants, XP + accuracy + time stat cards.
- `components/Streak.jsx` — flame hero, weekly grid (flames on completed days, dashed ring for today), daily XP goal bar.
- `components/Practice.jsx` — daily challenge banner, 4 drill cards (review / listening / speaking / matching).
- `components/Profile.jsx` — avatar header on yellow gradient, stat grid, achievements list.

## Flow
`Home → Choose → Learn → (tap current node) → Explanation → Lesson → Result → Streak → Learn`. Bottom nav swaps between Learn / Practice / Profile.

## Tweaks / reset
The router toolbar at the top of the stage includes a `↻ reset` button that clears progress and returns to Home. Progress is otherwise persistent across refreshes.

## Caveats
- Profile avatar is a monogram placeholder — swap in a real image if you have one.
- Weekly streak is hardcoded to "Friday is today"; wire to real dates before shipping.
- Confetti on Result is static CSS dots — animate with a small tween if desired.
- Lucide icons are inlined as SVG paths in `primitives.jsx` to avoid a CDN dependency; add new glyphs there.
