---
name: language-learner-design
description: Use this skill to generate well-branded interfaces and assets for Language Learner, either for production or throwaway prototypes/mocks. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping a Duolingo-style, Hugging Face-authenticated language-learning mobile app.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

Key files:
- `README.md` — context, content fundamentals, visual foundations, iconography.
- `colors_and_type.css` — CSS variables for colors, type, radii, spacing, shadows.
- `assets/` — logos, flag PNGs, Open Peeps illustration, extracted SVG glyphs.
- `ui_kits/app/` — React JSX components for every screen in the mobile app (Phone, Homepage, Choose, Learn, LessonQuestion, LessonExplanation + primitives).
- `preview/` — small design-system cards that illustrate each token in isolation.
