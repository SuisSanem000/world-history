# AI Harness Engineering Guidelines (`AGENTS.md`)

> **Coordinator Router**: Primary entry point for any AI Assistant working on the **World History Visual Map** (`world-history`) repository.

---

## 1. Documentation Map (`documents/ai-assistant-project-context/`)
Always keep these files synchronized with every user instruction and code change:
- [`PROJECT_CONTEXT.md`](./PROJECT_CONTEXT.md) — Core vision, product specifications, current project state, and chronological user requirement log.
- [`TASKS.md`](./TASKS.md) — Active task tracker, completed milestones, and upcoming roadmap items.
- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — System design, React component hierarchy, SVG geographic projection pipeline, and Text-to-Speech (TTS) integration.
- [`../tts-feature-handoff/AGENTS.md`](../tts-feature-handoff/AGENTS.md) — Original handoff specification for the 100% free Bilingual (`en`/`fa`) Neural TTS module.

---

## 2. Core Engineering Rules
1. **Context-First Workflow**:
   - Whenever the user shares new requirements or feedback, immediately update `PROJECT_CONTEXT.md` and `TASKS.md` in `documents/ai-assistant-project-context/`.
2. **Component-Driven Map Architecture**:
   - The map must be rendered using modular **React + TypeScript SVG components** (`<WorldMap />`, `<CountryItem />`, `<CountryPopup />`), not a static image or canvas-only bitmap in Phase 1.
   - Country borders must always be visible on the map.
   - Default map state shows **no text labels** on countries.
   - **Hover Behavior**: Hovering over a country highlights it and renders the country's name **inside that country** (at its primary landmass centroid).
   - **Click Behavior**: Clicking a country triggers a popup modal displaying the country's name.
3. **Preserving the TTS Module**:
   - Keep the 100% free Bilingual (`en`/`fa`) TTS module (`code/src/tts/`) intact and ready for audio narration features.
   - Never introduce paid API keys for TTS (`node-edge-tts` primary, `google-tts-api` fallback).
4. **Verification Before Completion**:
   - Always run `npm run typecheck` (`tsc --noEmit`) and verify the dev server (`npm run dev`) builds and serves cleanly.

