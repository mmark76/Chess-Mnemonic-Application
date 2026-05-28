# Chess Mnemonic Application — Architecture

## 1. Purpose

This document describes the current architecture of the **Chess Mnemonic Application & Epic Chess Stories Creator**.

It is intended to be the technical reference for future maintenance, audit, and refactoring work.

The main principle is unchanged:

> The code must serve the Chess Mnemonic System.

Any technical change must preserve the cognitive structure, mnemonic numbering logic, memory palace logic, PAO logic, existing associations, and user-facing behavior unless the project owner explicitly decides otherwise.

---

## 2. Current Repository Status

### 2.1 Confirmed status

The repository currently contains a static browser-based application deployed for the domain:

```text
chessmnemonics.net
```

The application is designed to run as a static web application. It has no backend server and no database.

It depends on:

- browser APIs,
- localStorage,
- external CDN scripts,
- JSON data files,
- user-imported local files,
- browser Text-to-Speech support,
- optional translation and analytics scripts.

### 2.2 Branch status note

Earlier documentation mentioned the following branch strategy:

| Branch | Previously documented role |
|---|---|
| `main` | Active / production version |
| `backup-after-changes-2026-05-19` | Safe backup |
| `refactor-plan-documentation` | Documentation branch |

During the latest read-only inspection, the current working content was confirmed from the active repository branch, but the backup/documentation branch names above were not fully verified through direct file fetch.

Therefore, before any future refactor:

1. confirm the actual existing branches in GitHub,
2. create a fresh backup branch or tag,
3. avoid direct changes to production except for small documentation updates,
4. use separate branches for all functional code changes.

---

## 3. High-Level Application Map

The repository contains three main application areas.

| Area | Path | Role |
|---|---|---|
| Main Chess Mnemonic Application | `index.html` | Main PGN/SAN parser, mnemonic tables, PAO outputs, SAN-to-text, Epic Story |
| Flashcards Trainer | `flashcards/` | Training environment for default and user libraries |
| Chess PGN TTS Player | `chess_games_tts_app/` | Standalone PGN listening helper using browser TTS |

Supporting folders:

| Folder | Role |
|---|---|
| `css/` | Main styles and menu styles |
| `js/` | Main application logic and runtime helpers |
| `json/` | Default mnemonic library datasets |
| `user_libraries/` | User library templates and import templates |
| `assets/` | Images and visual assets |

---

## 4. Current File Map

### 4.1 Root files

| File | Purpose | Risk |
|---|---|---|
| `index.html` | Main application entry point and UI shell | High |
| `README.md` | Current public project overview | Low |
| `ARCHITECTURE.md` | Technical architecture and refactor reference | Medium |
| `Disclaimer.txt` | Disclaimer text loaded into popup | Low |
| `LICENSE` | Copyright and usage restrictions | Low |
| `CNAME` | GitHub Pages custom domain | Low |
| `favicon.ico` | Browser icon | Low |
| `start_server.bat` | Local static server helper for Windows | Low |

### 4.2 CSS files

| File | Purpose | Risk |
|---|---|---|
| `css/styles.css` | Main application layout, tables, modals, responsive styles | Medium |
| `css/menu.css` | Ecosystem / burger menu styling | Low-Medium |

### 4.3 Main JavaScript files

| File | Purpose | Risk |
|---|---|---|
| `js/cms.bundle.js` | Main bundled application logic: state, PGN parser, renderers, user library modals, demo games, initialization | Very High |
| `js/default-library-v5.4.js` | Overrides `loadLibraries()` and loads `json/libraries_v.5.4.json` | High |
| `js/shortnames-action-column.js` | Overrides association and shortname renderers; adds Action column and castling shortname behavior | High |
| `js/user-libraries-history.js` | User library import history, import guard, library panel UX, restore defaults | High |
| `js/user-library-runtime-fix.js` | Runtime patches for imported libraries, full-move display, PAO lookup, square shortnames, hidden columns | Very High |
| `js/user-library-batch-import.js` | Multi-format user library import: JSON, CSV, XLS/XLSX; shortname patching | High |
| `js/user-library-ui-labels.js` | Small UI label and spacing adjustments | Low-Medium |
| `js/download-tables.js` | CSV/JSON table export | Medium |
| `js/epic.js` | Epic Story modal and story generation | High |
| `js/epic-ui-init.js` | Small Epic Story styling helper | Low |
| `js/epic-tts.js` | Epic Story browser TTS controls | Medium |
| `js/san-to-text-popup.js` | SAN-to-text modal, copy support, loci output | High |
| `js/feedback.js` | Feedback form using local mail client | Low-Medium |
| `js/structured-data.js` | JSON-LD metadata and optional helper script loading | Medium |

### 4.4 JSON data files

| File | Purpose | Risk |
|---|---|---|
| `json/libraries_v.5.4.json` | Current default mnemonic library dataset | Very High |
| `json/libraries_v.5.3.json` | Previous/reference library dataset | Medium |

### 4.5 User library templates

| File / Pattern | Purpose | Risk |
|---|---|---|
| `user_memory_palaces_template.json` | User memory palace template | Medium |
| `user_characters_template.json` | User characters template | Medium |
| `user_squares_template.json` | User square associations template | Medium |
| `user_pao_00_99_template.json` | User PAO 00–99 template | Medium |
| `user_shortnames_template.json` | User shortnames template | Medium |
| `libraries_user_template.json` | Combined user library bundle template | Medium |
| `csv_template_*.csv` | CSV templates for user imports | Medium |

---

## 5. Script Loading Order

The main application currently loads external and project scripts directly from `index.html`.

### 5.1 External libraries

| Order | Script | Purpose | Criticality |
|---:|---|---|---|
| 1 | `jquery-3.6.0.min.js` | Legacy / possible helper dependency | Low-Medium |
| 2 | `chess.js/0.10.3/chess.min.js` | PGN/SAN parsing and chess move history | Critical |
| 3 | `PapaParse/5.4.1/papaparse.min.js` | CSV parsing support / potential import use | Medium |
| 4 | `FileSaver.js/2.0.5/FileSaver.min.js` | Saving files from browser | Medium |
| 5 | `JSZip/3.10.1/jszip.min.js` | Template ZIP creation | Medium |

### 5.2 Project scripts

| Order | Script | Purpose | Load-order sensitivity |
|---:|---|---|---|
| 1 | `js/cms.bundle.js` | Defines global state and core functions | Critical |
| 2 | `js/default-library-v5.4.js` | Overrides `loadLibraries()` | Critical |
| 3 | `js/shortnames-action-column.js` | Overrides renderers | High |
| 4 | `js/user-libraries-history.js` | Patches import flow and UI | High |
| 5 | `js/epic-ui-init.js` | Adds Epic UI classes | Medium |
| 6 | `js/epic.js` | Builds Epic Story modal | High |
| 7 | `js/epic-tts.js` | Adds Epic Story TTS controls | Medium |
| 8 | `js/san-to-text-popup.js` | Adds SAN-to-text modal and wraps `renderAll()` | High |
| 9 | `js/download-tables.js` | Adds export handlers | Medium |
| 10 | `js/structured-data.js` | Injects JSON-LD and optional helper scripts | Medium |

### 5.3 Dynamically loaded helper scripts

`structured-data.js` dynamically loads:

- `js/user-library-batch-import.js`
- `js/user-library-ui-labels.js`
- `js/feedback.js`

`user-libraries-history.js` dynamically loads:

- `js/user-library-runtime-fix.js`

This creates a layered runtime architecture where the final behavior depends not only on static script order but also on dynamic script injection timing.

---

## 6. Global State

The main global state is defined in `cms.bundle.js`:

```js
let libs = null;
let gameMoves = [];
let selectedLang = 'en';
let locusMode = 'half';
let manualAnchors = {};
```

| State | Meaning | Persistence |
|---|---|---|
| `libs` | Active default and user libraries | In memory |
| `gameMoves` | Parsed current PGN/SAN move list | In memory |
| `selectedLang` | Active language selection | In memory |
| `locusMode` | `half` or `full` memory palace mode | In memory, partially mirrored to `window.locusMode` |
| `manualAnchors` | User-selected anchor rows | In memory |
| `activeLibrary` | Active library metadata | `localStorage` |
| `savedLibraries` | User library history | `localStorage` |
| `epicLocusMode` | Epic Story loci mode | `localStorage` |

Important risk:

- Several scripts read and write the same global functions and state.
- Some helpers patch functions after initial definition.
- The final runtime behavior can differ from the apparent behavior in `cms.bundle.js` alone.

---

## 7. Current Data Flow

### 7.1 Main PGN/SAN flow

1. User enters PGN/SAN manually, loads a file, or selects a demo game.
2. `cleanPGN()` removes comments, clock/comment tags, spacing noise.
3. `parsePGN()` uses `Chess().load_pgn(pgn, { sloppy: true })`.
4. `chess.history({ verbose: true })` creates verbose moves.
5. Each move becomes an internal move object:

```js
{
  index,
  moveNumber,
  moveNumDisplay,
  movePair,
  side,
  san,
  piece,
  from,
  to,
  fen,
  flags,
  promotion
}
```

6. `renderAll()` renders:
   - SAN Table,
   - Associations Table,
   - PAO 0–9 Table,
   - PAO 00–99 Table,
   - Shortnames Table.
7. Optional outputs use the same `gameMoves`:
   - SAN → Text,
   - Epic Story,
   - Epic TTS,
   - table exports.

### 7.2 User library flow

User libraries can be imported from:

- JSON files,
- CSV files,
- XLS/XLSX files,
- combined user library bundles.

Detected library types include:

- Memory Palace,
- Characters,
- Squares,
- PAO 00–99,
- Shortnames,
- Combined User bundle,
- Complete library bundle.

Imported data is attached mainly under:

```js
libs.User
```

The imported user data may override or supplement default behavior.

---

## 8. Chess Mnemonic System Logic

The application implements a layered mnemonic method.

### 8.1 Temporal Memory Palace

The default temporal system uses 80 loci.

Current `locusForMove(m)` logic:

- in `full` mode: locus index is based on `m.movePair`,
- in `half` mode: locus index is based on `m.index`,
- indexes wrap after 80 loci.

Important note:

There is a current behavior conflict:

- `cms.bundle.js` initializes `locusMode = 'half'`,
- the UI lists Ply / half-move first,
- `user-library-runtime-fix.js` applies default full-move mode at runtime.

This must be treated as a product decision before refactoring.

### 8.2 Full-move / half-move rule

Project convention:

> In this project, a “move” normally means a fullmove unless explicitly stated otherwise.

Therefore:

- one fullmove = White move + Black move,
- one half-move / ply = one side's move.

This distinction is critical for:

- locus assignment,
- PAO 00–99 grouping,
- SAN-to-text output,
- Epic Story chronology,
- user documentation.

### 8.3 Character logic

Character association tracks the piece from source square to target square.

Special cases handled:

- castling,
- en passant,
- user character libraries,
- default character fallback.

The character logic is high-risk because it connects the chess move to the mnemonic identity.

### 8.4 Spatial Memory Palace

Target squares are mapped to fixed spatial associations.

The project philosophy uses a 64-square spatial structure with thematic/geometric rank symmetry:

| Ranks | Theme |
|---|---|
| 1st and 8th | Inner / royal spaces |
| 2nd and 7th | Walls / battlements / observation areas |
| 3rd and 6th | Water / moat / aquatic environments |
| 4th and 5th | Forest / plains / natural ground |

### 8.5 PAO 0–9

PAO 0–9 is based on a single move:

```text
Piece → File → Rank
```

It is mainly educational and explanatory.

### 8.6 PAO 00–99

PAO 00–99 uses a fullmove pair.

For each White/Black move pair:

1. Convert White move to Piece–File–Rank.
2. Convert Black move to Piece–File–Rank.
3. Weave the six digits into three two-digit PAO keys.
4. Read:
   - Person,
   - Action,
   - Object.

Current implementation ignores an odd final half-move in the PAO 00–99 table because a full PAO 00–99 row needs both White and Black moves.

This is acceptable only if clearly documented in the UI or handled with a visible note.

---

## 9. Current UI/UX Architecture

### 9.1 Main screen

The main screen contains:

- header with logo/title,
- Ecosystem menu,
- How-to button,
- Disclaimer button,
- Feedback button injected later,
- PGN/SAN input panel,
- import and demo controls,
- library panel,
- table selector,
- locus mode selector,
- multiple output tables,
- footer.

### 9.2 Tables

Current tables:

| Table | Purpose |
|---|---|
| SAN Table | Chronological SAN and basic move information |
| Associations | Piece/character and target square associations |
| Shortnames | Piece and square shortname output |
| PAO 0–9 | Educational single-move PAO encoding |
| PAO 00–99 | Fullmove PAO encoding |

### 9.3 Dynamic UI features

The application dynamically injects:

- Epic Story modal,
- SAN-to-text modal,
- Feedback modal,
- user library modals,
- table column visibility checkboxes,
- status cards,
- restore defaults button,
- TTS controls.

This provides rich functionality, but it also increases complexity.

### 9.4 UX risk

The current UI is powerful for an expert user, but can feel dense for a new user.

Suggested future improvement:

- keep expert mode,
- add a simple guided mode:
  1. Load PGN,
  2. Choose Memory Palace Mode,
  3. View Table / Epic Story.

---

## 10. Technical Audit Findings

### 10.1 Strengths

- The application is portable and static.
- The core mnemonic idea is coherent and distinctive.
- The default libraries are protected conceptually.
- The system supports user libraries.
- The app includes multiple study outputs.
- The README is relatively current.
- The project has already identified the need for cautious refactoring.

### 10.2 Main weaknesses

| Area | Issue | Risk |
|---|---|---|
| Global state | Many scripts share and mutate global state | High |
| Load order | Runtime behavior depends on script order and dynamic injection | High |
| Function overrides | Several scripts replace existing functions | High |
| PGN/SAN text conversion | Some text conversion uses regex instead of verbose move data | High |
| User library import | Multiple overlapping import flows exist | High |
| Default locus mode | Half/full default is not fully consistent | High |
| Tests | No formal automated regression tests identified | Very High |
| Metadata | Structured data version/features appear partially outdated | Medium |
| External CDNs | Critical dependencies lack local fallback | Medium |

---

## 11. Dependency Map

### 11.1 Critical dependencies

| Dependency | Used for | Criticality | Failure impact |
|---|---|---|---|
| chess.js | PGN parsing, move history | Critical | Main application cannot parse games |
| Browser DOM APIs | UI rendering and event handling | Critical | App cannot function |
| FileReader API | PGN and library file imports | High | File import fails |
| localStorage | Active library and user library history | Medium-High | User library persistence fails |
| Web Speech API | TTS output | Medium | TTS unavailable |

### 11.2 External service dependencies

| Dependency | Purpose | Criticality |
|---|---|---|
| Google Translate | Optional translation widget | Low-Medium |
| Google Analytics / gtag | Analytics | Low |
| Plausible analytics | Analytics | Low |
| Copyrighted.com badge | Copyright badge | Low |

### 11.3 CDN dependencies

| CDN library | Purpose | Risk |
|---|---|---|
| chess.js | PGN parsing | High |
| PapaParse | CSV parsing | Medium |
| FileSaver.js | Save files | Medium |
| JSZip | ZIP templates | Medium |
| SheetJS / XLSX | XLS/XLSX import, dynamically loaded | Medium |

Recommendation:

For long-term stability, consider vendoring critical libraries locally or providing graceful fallback messages.

---

## 12. Security and Safety Notes

### 12.1 Positive points

- Several outputs use escaping functions such as `escapeHtml()`.
- SAN-to-text popup escapes user-facing header values before injecting HTML.
- Feedback uses `mailto:` and does not store messages on a server.
- User libraries are local browser imports, not server uploads.

### 12.2 Risks

- Some UI is built with `innerHTML`.
- Imported user library content eventually appears in rendered tables or story text.
- Multiple runtime patches make it harder to reason about sanitization globally.

Recommendation:

Create a single trusted rendering helper layer:

- text-only cell rendering by default,
- explicit safe HTML only when needed,
- no direct user data injection through raw `innerHTML`.

---

## 13. Testing Requirements Before Refactor

No modular extraction should begin before a golden behavior test set exists.

Minimum PGN test cases:

- ordinary move,
- capture,
- check,
- checkmate,
- kingside castling,
- queenside castling,
- en passant,
- promotion,
- disambiguation move,
- odd final half-move,
- malformed or partial PGN,
- PGN with comments,
- PGN with clock annotations.

Minimum output tests:

- SAN Table,
- Associations Table,
- Shortnames Table,
- PAO 0–9 Table,
- PAO 00–99 Table,
- full-move loci mode,
- half-move loci mode,
- manual anchors,
- SAN-to-text full mode,
- SAN-to-text half mode,
- SAN-to-text with loci,
- Epic Story with default libraries,
- Epic Story with user libraries,
- imported Memory Palace library,
- imported Characters library,
- imported Squares library,
- imported PAO 00–99 library,
- imported Shortnames library.

Recommended golden games:

- Morphy Opera Game,
- Anderssen Immortal Game,
- Rubinstein–Rotlewi,
- Lasker–Thomas,
- one custom tactical PGN with promotion/en passant/castling.

---

## 14. Refactor Risk Areas

### 14.1 Very high risk

- PGN parser,
- `gameMoves` structure,
- full-move / half-move logic,
- locus assignment,
- PAO 00–99 weaving logic,
- character tracking across moves,
- castling logic,
- en passant logic,
- user library overrides,
- Epic Story generation.

### 14.2 High risk

- `renderAll()` and table rendering,
- import handlers,
- runtime function patches,
- default library loading,
- localStorage state.

### 14.3 Medium risk

- table exports,
- UI labels,
- column visibility controls,
- modal styling,
- feedback UI,
- TTS controls.

### 14.4 Lower risk

- comments,
- documentation,
- static text corrections,
- metadata updates,
- CSS cleanup after visual comparison.

---

## 15. Recommended Future Module Map

The following module map remains recommended, but only after tests exist.

| Future Module | Responsibility |
|---|---|
| `state.js` | Central application state and safe state updates |
| `pgn-parser.js` | Clean PGN, parse PGN/SAN, produce move objects |
| `locus-engine.js` | Full/half move loci and temporal memory palace logic |
| `piece-tracker.js` | Piece identity tracking, castling, en passant, promotion handling |
| `pao-engine.js` | PAO 0–9 and PAO 00–99 encoding |
| `library-engine.js` | Default libraries, user libraries, validation, fallbacks |
| `table-models.js` | Pure table data models before DOM rendering |
| `table-renderers.js` | DOM rendering only |
| `san-text-engine.js` | SAN-to-readable text based on parsed move objects |
| `epic-engine.js` | Pure Epic Story text generation |
| `user-library-import.js` | Unified JSON/CSV/XLSX import and validation |
| `demo-games.js` | Demo PGNs |
| `app-init.js` | DOMContentLoaded and UI wiring |

---

## 16. Safe Refactor Strategy

### Phase 0 — Stabilization

1. Confirm branches.
2. Create fresh backup branch or tag.
3. Do not change application behavior.
4. Update documentation.
5. Record current outputs manually.

### Phase 1 — Golden Tests

1. Create a test PGN set.
2. Save expected table outputs.
3. Save expected Epic Story snippets.
4. Save expected SAN-to-text output.
5. Compare before and after every change.

### Phase 2 — Pure Logic Extraction

Extract only pure functions first:

1. PGN cleaning,
2. PGN parsing,
3. locus calculation,
4. PAO code generation,
5. SAN-to-readable conversion,
6. piece tracking.

No UI redesign in this phase.

### Phase 3 — Rendering Cleanup

1. Build table model objects.
2. Render tables from models.
3. Keep visual output unchanged.
4. Reduce direct `innerHTML` usage.

### Phase 4 — User Library Consolidation

1. Merge overlapping import flows.
2. Add validation.
3. Add clear error messages.
4. Keep default libraries protected.

### Phase 5 — UI/UX Improvement

1. Add guided mode.
2. Simplify main screen flow.
3. Improve mobile table/card display.
4. Add accessibility improvements.

---

## 17. Current Priority List

### P0 — Must do before functional refactor

- Confirm branch strategy.
- Create backup branch/tag.
- Decide default locus mode: `half` or `full`.
- Create golden test PGNs and expected outputs.
- Freeze current behavior as baseline.

### P1 — First technical improvements

- Centralize SAN-to-readable conversion.
- Centralize PAO encoding logic.
- Centralize user library detection and validation.
- Remove duplicate import handlers gradually.
- Avoid adding new monkey patches.

### P2 — Structural improvements

- Extract pure modules.
- Separate data logic from DOM rendering.
- Reduce global state.
- Replace runtime overrides with explicit extension points.

### P3 — UX improvements

- Guided beginner flow.
- Clearer table modes.
- Better mobile output.
- Fewer alerts, more inline status messages.

---

## 18. Review Checklist Before Any Future Code Change

Before changing code:

- [ ] Respect the Chess Mnemonic System.
- [ ] Confirm the change is on a safe branch.
- [ ] Confirm backup branch or tag exists.
- [ ] Identify affected files.
- [ ] Identify affected functions.
- [ ] Identify affected mnemonic outputs.
- [ ] Run golden PGN checks.
- [ ] Compare before/after table output.
- [ ] Compare before/after Epic Story output.
- [ ] Compare before/after SAN-to-text output.
- [ ] Verify default libraries still load.
- [ ] Verify user libraries still import.
- [ ] Verify full-move and half-move modes.
- [ ] Verify manual anchors.
- [ ] Verify mobile layout if UI changed.
- [ ] Review before merge.

---

## 19. Current Conclusion

The application is functional and conceptually strong.

Its main technical debt is not the mnemonic logic itself, but the way the code evolved around a large central bundle with layered runtime patches.

The safest path is:

1. preserve current behavior,
2. create golden tests,
3. extract pure logic gradually,
4. reduce runtime overrides,
5. only then improve UI/UX.

The Chess Mnemonic System must remain the controlling reference for every technical decision.
