# World History Visual Map — AI Assistant Project Context

> **Living Source of Truth**: This folder (`documents/ai-assistant-project-context/`) records every requirement, vision statement, architectural decision, and feature detail shared by the user throughout the project.

---

## 1. Project Vision & Core Concept
- **Project Name**: World History Visual App (`world-history`)
- **Core Experience**: An interactive visual world map application for exploring world history with integrated Text-to-Speech (TTS) audio narration.
- **Phased Visual Evolution**:
  1. **Phase 1 — 2D Flat World Map**: Start with a clean, interactive 2D flat world map visual application.
  2. **Phase 2 — 3D Interactive Globe**: Evolve the map into a 3D interactive globe (similar to Google Maps / Google Earth) where the user can drag, pan, rotate, and zoom seamlessly across the world.

---

## 2. Integrated Features & Capabilities

### Text-to-Audio (TTS) Engine
- **Origin**: Adopted from `documents/tts-feature-handoff/` and placed into `code/`.
- **Capabilities**:
  - Converts **English (`en`)** and **Persian (`fa`)** text into natural spoken **MP3 `Buffer`s**.
  - **100% Free & Keyless**:
    - **Primary Engine**: Microsoft Edge Neural TTS (`node-edge-tts`) with Male & Female neural voices:
      - English: `en-US-GuyNeural` (Male), `en-US-JennyNeural` (Female)
      - Persian: `fa-IR-FaridNeural` (Male), `fa-IR-DilaraNeural` (Female)
    - **Fallback Engine**: Google Translate TTS (`google-tts-api`) with automatic punctuation-aware chunking for texts $> 200$ characters.
  - **Validation & Language Auto-Detection**:
    - Rejects empty, whitespace-only, or emoji/symbol-only strings.
    - Enforces configurable max character length (default `1000` chars).
    - Auto-detects Persian (`fa`) vs. English (`en`), prioritizing `fa` for mixed Persian/English strings so both scripts are pronounced naturally.
  - **Extendability**: Additional languages/voices can be added by extending `VOICE_MAP` in `src/tts/tts.ts` (or `src/tts.ts`) and character detection in `validator.ts`.

---

## 3. Workspace Directory Structure
- `documents/`
  - `ai-assistant-project-context/` — Living project context, user specifications, roadmap, and architectural decisions.
  - `tts-feature-handoff/` — Original reference handoff package for the Text-to-Speech feature.
- `code/` — Application source code, including the copied TTS feature module (`src/`, `tests/`, `package.json`, `tsconfig.json`).
- `resources/` — Project assets and static resources.

---

## 4. User Specifications Log (Chronological)
- **Session 1 (Initial Setup)**:
  - Provided `documents/tts-feature-handoff` containing the bilingual (`en`/`fa`) neural TTS engine and documentation.
  - Defined the core visual direction: build a World Map visual app starting in **2D (flat map)** first, then transitioning together into a **3D draggable globe (like Google Maps)**.
  - Established workspace conventions:
    - Record everything discussed about the project inside `documents/ai-assistant-project-context/`.
    - Place application and feature code inside `code/`.
  - *Status*: Ready and waiting for the user's detailed explanation of the project domain, historical data, user flows, and features.

