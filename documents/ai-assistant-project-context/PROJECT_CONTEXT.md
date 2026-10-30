# World History Visual Map — Project Context (`PROJECT_CONTEXT.md`)

> **Living Source of Truth**: Tracks all user requirements, product specifications, and the current implementation state of the **World History Visual Map** project.

---

## 1. Project Overview & Vision
- **Project Name**: World History Visual App (`world-history`)
- **Tech Stack**: TypeScript, React, HTML5/SVG, Vite, D3-Geo + TopoJSON (`world-atlas`), Node.js TTS Module (`node-edge-tts` + `google-tts-api`).
- **Visual Roadmap**:
  - **Phase 1 (Current — 2D Flat Map)**: Interactive 2D flat world map built with React SVG components where every country has visible geographic borders, shows no text by default, displays its name inside the country on hover, and opens a country name popup on click.
  - **Phase 2 (Upcoming — 3D Interactive Globe)**: Transition the map into a 3D draggable, zoomable globe (like Google Maps / Google Earth).
  - **Audio / History Narration**: Leverage the integrated 100% free Bilingual (`en`/`fa`) Text-to-Speech (TTS) module to convert historical text into spoken audio.

---

## 2. Current Feature Specifications (Feature 1: Interactive 2D World Map)
1. **Web Application (TypeScript + HTML + React)**:
   - Runs in the browser via a fast Vite + React + TypeScript setup inside `code/`.
2. **Actual World Map as React SVG Components**:
   - Renders real-world country geometries and borders using natural geographic projections.
   - Each country is a dedicated React component (`<CountryShape />`) inside the `<WorldMap />` SVG component.
   - **Always-Visible Borders**: Country borders are always clearly drawn across the entire world map.
   - **No Default Text**: The map is clean with zero text labels when idle.
3. **Hover Interaction (Name Inside Country)**:
   - When hovering over any country, the country's name is dynamically rendered **inside that country** at its main landmass centroid.
4. **Click Interaction (Country Name Popup)**:
   - When clicking on a country, a popup (`<CountryPopup />`) appears showing the selected country's name.

---

## 3. Workspace Structure
```text
world-history/
├── code/                                   # Main application & TTS codebase
│   ├── index.html                          # Web app entry HTML
│   ├── package.json                        # Scripts & dependencies
│   ├── tsconfig.json                       # TypeScript configuration
│   ├── vite.config.ts                      # Vite bundler configuration
│   ├── src/
│   │   ├── main.tsx                        # React DOM entry point
│   │   ├── App.tsx                         # Main application layout & state
│   │   ├── components/
│   │   │   ├── WorldMap.tsx                # Interactive 2D SVG World Map component
│   │   │   ├── CountryShape.tsx            # Individual Country SVG path React component
│   │   │   └── CountryPopup.tsx            # Popup modal when a country is clicked
│   │   ├── data/
│   │   │   └── worldMapData.ts             # TopoJSON -> GeoJSON parser & centroid calculator
│   │   └── tts/                            # Bilingual (EN/FA) Text-to-Speech module
│   │       ├── index.ts
│   │       ├── tts.ts
│   │       └── validator.ts
│   └── tests/
│       └── test-tts.ts                     # TTS verification suite
├── documents/
│   ├── ai-assistant-project-context/       # AI Harness Engineering documentation
│   │   ├── AGENTS.md                       # AI coordinator & rules
│   │   ├── PROJECT_CONTEXT.md              # Project state & user requirements log
│   │   ├── TASKS.md                        # Task & milestone tracker
│   │   └── ARCHITECTURE.md                 # System & component architecture
│   └── tts-feature-handoff/                # Original TTS feature handoff package
└── resources/                              # Static project resources
```

---

## 4. Chronological User Requirements Log
- **Update 1 — Initial Handoff & Vision**:
  - Provided `documents/tts-feature-handoff/` for text-to-audio synthesis.
  - Defined the vision: 2D flat world map first, later evolving into a 3D draggable globe like Google Maps.
  - Requested project context documentation in `documents/` and code in `code/`.
- **Update 2 — Feature 1 Specification (2D React SVG World Map)**:
  - Build and run the web app using TypeScript, HTML, and React components.
  - Render an actual world map with real countries as SVG React components.
  - Always display country borders on the map, with **no text** shown by default.
  - **On Hover**: Show the country's name **inside that country**.
  - **On Click**: Pop up the name of the clicked country.
  - Organize `documents/ai-assistant-project-context/` with proper AI harness engineering files (`AGENTS.md`, `PROJECT_CONTEXT.md`, `TASKS.md`, `ARCHITECTURE.md`).
