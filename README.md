# Chess Mnemonic Application & Epic Chess Stories Creator

A web-based chess mnemonic application created by **Markellos Markides**.

The application transforms PGN/SAN chess games into structured mnemonic material using temporal loci, spatial loci, character associations, shortnames, PAO systems, SAN-to-text output, browser TTS support, and epic narrative storytelling.

The project is designed as an **online static web application**. It does not use a backend server or database. It runs in the browser and depends on browser APIs, JSON data files, local user imports, external CDN libraries, translation tools, analytics scripts, and other online assets.

---

## 1. Purpose

The application supports the study and memorization of chess games through a layered mnemonic method.

A chess move is treated as a memory event connected with:

- time,
- place,
- piece or character identity,
- board square,
- action or special chess event,
- PAO encoding,
- shortnames,
- plain SAN-to-text reading,
- and narrative meaning.

The main goal is to help the user convert chess games into memorable internal stories, structured mnemonic tables, and readable or listenable chess text.

---

## 2. Main Application Areas

The repository contains three main application areas:

| Area | Path | Role |
|---|---|---|
| Main Chess Mnemonic Application | `index.html` | PGN/SAN parsing, mnemonic tables, PAO outputs, SAN-to-text, Epic Story |
| Flashcards Trainer | `flashcards/` | Training environment for memory palaces, characters, PAO systems, square associations, and shortnames |
| Chess PGN TTS Player | `chess_games_tts_app/` | Standalone browser-based tool for listening to chess games |

---

## 3. Core Features

### Main Chess Mnemonic Application

The main application supports:

- PGN/SAN input by copy-paste or file import,
- demo chess games,
- PGN/SAN parsing with chess.js,
- SAN Table,
- Associations Table,
- Shortnames Table,
- PAO 0-9 Table,
- PAO 00-99 Table,
- full-move and half-move / ply memory palace modes,
- manual anchor markers,
- user library imports,
- default protected libraries,
- SAN -> Text popup,
- Epic Story generation,
- Epic Story browser TTS,
- CSV/JSON table export,
- Ecosystem menu,
- Feedback helper.

### Flashcards Trainer

The flashcards tool supports study and review of:

- Temporal Memory Palace libraries,
- character libraries,
- spatial square associations,
- PAO 0-9,
- PAO 00-99,
- shortnames.

### Chess PGN TTS Player

The TTS helper provides a simpler environment for listening to PGN games through the browser Text-to-Speech API.

---

## 4. Folder Structure

```text
Chess-Mnemonic-Application/
├── index.html
├── ARCHITECTURE.md
├── README.md
├── LICENSE
├── Disclaimer.txt
├── CNAME
├── favicon.ico
├── start_server.bat
│
├── assets/
├── css/
│   ├── styles.css
│   └── menu.css
│
├── js/
│   ├── cms.bundle.js
│   ├── default-library-v5.4.js
│   ├── shortnames-action-column.js
│   ├── user-libraries-history.js
│   ├── user-library-runtime-fix.js
│   ├── user-library-ui-labels.js
│   ├── user-library-batch-import.js
│   ├── download-tables.js
│   ├── epic.js
│   ├── epic-ui-init.js
│   ├── epic-tts.js
│   ├── san-to-text-popup.js
│   ├── feedback.js
│   └── structured-data.js
│
├── json/
│   ├── libraries_v.5.3.json
│   └── libraries_v.5.4.json
│
├── flashcards/
├── chess_games_tts_app/
└── user_libraries/
```

---

## 5. Main Application Entry Point

The main application is loaded from:

```text
index.html
```

The central application logic is currently handled mainly by:

```text
js/cms.bundle.js
```

The current default mnemonic library dataset is loaded through:

```text
js/default-library-v5.4.js
```

This file overrides the earlier `loadLibraries()` definition and loads:

```text
json/libraries_v.5.4.json
```

---

## 6. Current Default Libraries

The current core mnemonic library dataset is:

```text
json/libraries_v.5.4.json
```

Reference / previous mnemonic library:

```text
json/libraries_v.5.3.json
```

The application currently uses `libraries_v.5.4.json` as the main default data source unless another version is intentionally selected by the project owner.

Default libraries are protected. They are shown in the Library System panel for viewing and orientation, but they are not edited directly from the main application.

---

## 7. User Libraries

The application supports user-imported libraries.

Supported or partially supported user library formats include:

- JSON,
- CSV,
- XLS / XLSX,
- separate user library templates,
- combined user library bundles,
- complete mnemonic library bundles.

Detected user library types include:

- Memory Palace,
- Characters,
- Squares,
- PAO 00-99,
- Shortnames,
- Combined User bundle,
- Complete library bundle.

Imported user data is applied locally in the browser, mainly under:

```js
libs.User
```

The app also uses browser `localStorage` for active library and saved library history.

---

## 8. Chess Mnemonic System Logic

The code must serve the Chess Mnemonic System.

The system depends on:

- temporal memory palace logic,
- spatial memory palace logic,
- character associations,
- square associations,
- full-move / half-move distinction,
- manual anchors,
- PAO 0-9,
- PAO 00-99,
- shortnames,
- narrative memory through Epic Story.

### Full-move / half-move convention

In this project, a **move** normally means a **fullmove** unless explicitly stated otherwise.

Therefore:

- one fullmove = White move + Black move,
- one half-move / ply = one side's move.

This distinction is critical for loci, PAO 00-99, SAN-to-text output, and Epic Story chronology.

### PAO 00-99

PAO 00-99 is based on a fullmove pair.

For each White/Black move pair:

1. White move is converted into Piece-File-Rank.
2. Black move is converted into Piece-File-Rank.
3. The six digits are woven into three two-digit PAO keys.
4. The output reads Person, Action, Object.

If a game ends with an odd final half-move, the PAO 00-99 table cannot form a complete fullmove PAO row for that final half-move.

---

## 9. Technical Architecture Notes

The current architecture is a static browser-based front end with a large central JavaScript bundle and several runtime helper scripts.

Important implementation notes:

- `index.html` is the main entry point.
- `js/cms.bundle.js` contains most core application logic.
- `js/default-library-v5.4.js` loads the current default mnemonic dataset.
- `js/shortnames-action-column.js` overrides association and shortname table renderers.
- `js/user-libraries-history.js` and `js/user-library-runtime-fix.js` add user-library behavior and runtime patches.
- `js/user-library-batch-import.js` adds multi-format import support.
- `js/san-to-text-popup.js` handles the SAN-to-text popup and wraps table refresh behavior.
- `js/epic.js` handles Epic Story generation.
- `js/epic-tts.js` adds browser TTS controls for the Epic Story.
- `js/download-tables.js` handles table export.
- `js/structured-data.js` injects JSON-LD metadata and loads optional helper scripts.

Because the app is static and browser-based, several features depend on browser APIs, external CDN libraries, and the correct script loading order.

The current architecture uses global state and runtime overrides. This works, but it is a refactor risk and should be treated carefully.

---

## 10. Technical Audit Summary

Current strengths:

- strong and distinctive mnemonic concept,
- portable static architecture,
- no backend/database dependency,
- rich study outputs,
- protected default libraries,
- support for user libraries,
- integrated Epic Story and TTS features,
- separate Flashcards and TTS helper apps.

Main technical risks:

| Area | Risk |
|---|---|
| Global state | Several scripts share and mutate the same state |
| Load order | Final behavior depends on script order and dynamic script injection |
| Runtime overrides | Several functions are patched or replaced after initial definition |
| PGN/SAN conversion | Some readable text conversion uses regex-like logic instead of parsed verbose move data |
| User library import | Multiple overlapping import flows exist |
| Default locus mode | Half/full move behavior should be clarified as a product decision |
| Tests | Golden regression tests are needed before any functional refactor |
| External CDNs | Critical dependencies should eventually have fallback or local vendored copies |

---

## 11. Refactor Principle

The application must remain functionally identical during any future refactor unless an intentional decision is made by the project owner.

Any refactor must preserve:

- the cognitive structure,
- the full-move / half-move logic,
- the 00-99 PAO philosophy,
- the temporal and spatial memory palace structure,
- the existing mnemonic associations,
- the user-facing behavior.

No refactor should begin before golden test outputs exist.

---

## 12. Recommended Roadmap

### Phase 0 — Stabilization

- Confirm actual branch strategy.
- Create a fresh backup branch or tag.
- Freeze current behavior as baseline.
- Keep documentation updated.

### Phase 1 — Golden Tests

Create expected outputs for:

- SAN Table,
- Associations Table,
- Shortnames Table,
- PAO 0-9 Table,
- PAO 00-99 Table,
- SAN-to-text output,
- Epic Story output,
- default libraries,
- user libraries,
- full-move and half-move loci modes.

### Phase 2 — Pure Logic Extraction

Extract pure logic gradually:

- PGN cleaning,
- PGN parsing,
- locus calculation,
- PAO encoding,
- SAN-to-readable text conversion,
- piece tracking.

No UI redesign should be done in this phase.

### Phase 3 — Rendering Cleanup

- Separate data logic from DOM rendering.
- Build table data models before rendering.
- Reduce direct `innerHTML` usage.
- Preserve visual output.

### Phase 4 — User Library Consolidation

- Merge overlapping import flows.
- Add validation.
- Add clear user messages.
- Keep default libraries protected.

### Phase 5 — UI/UX Improvement

- Add guided beginner flow.
- Improve mobile table/card display.
- Reduce alert dialogs.
- Add accessibility improvements.

---

## 13. Architecture Document

For the detailed technical audit, file map, dependency map, risk map, testing requirements, and refactor roadmap, see:

```text
ARCHITECTURE.md
```

---

## 14. License and Usage

This project is publicly visible for transparency, documentation, educational reference, and demonstration purposes.

It is **not open source**.

All rights are reserved by Markellos Markides. See:

```text
LICENSE
```

---

## 15. Author

Created by **Markellos Markides**.

© 2025-2026 Markellos Markides. All rights reserved.
