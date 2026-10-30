# World History Visual Map — Tasks & Milestones (`TASKS.md`)

> Tracks all completed, active, and planned engineering tasks across project phases.

---

## Milestone 0: Workspace & AI Harness Setup
- [x] Create `documents/ai-assistant-project-context/` directory.
- [x] Copy Text-to-Speech (TTS) feature code from `documents/tts-feature-handoff/` into `code/`.
- [x] Author AI Harness Engineering documents:
  - [x] `AGENTS.md` (AI Coordinator & Golden Rules)
  - [x] `PROJECT_CONTEXT.md` (Project Vision & State)
  - [x] `TASKS.md` (Task & Milestone Tracker)
  - [x] `ARCHITECTURE.md` (Component & System Architecture)

---

## Milestone 1: Feature 1 — Interactive 2D World Map (React + TypeScript + SVG)
- [x] Configure Vite + React + TypeScript web application in `code/`.
- [x] Integrate real-world country geometry data (`world-atlas` TopoJSON + `topojson-client` + `d3-geo`).
- [x] Build modular React SVG components:
  - [x] `<WorldMap />` — Renders the 2D SVG world map with always-visible country borders and zero default text labels.
  - [x] `<CountryShape />` — Renders individual country SVG `<path>` elements with hover & click handlers.
  - [x] Interior Centroid Calculation — Computes the largest-polygon centroid for each country so the hovered country name renders cleanly **inside that country**.
  - [x] `<CountryPopup />` — Displays a popup modal with the clicked country's name.
- [x] Typecheck, build, and launch the live development server (`npm run dev`).

---

## Milestone 2: Future Enhancements (Awaiting User Instructions)
- [ ] Historical eras / timeline data & country stories.
- [ ] Connect the Bilingual (`en`/`fa`) TTS engine (`code/src/tts/`) to read country/historical information aloud.
- [ ] Phase 2 transition: 2D flat map to 3D interactive draggable globe (Google Maps style).

