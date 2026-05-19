# Chess Mnemonic Application — Architecture

## 1. Purpose

This document describes the current architecture of the Chess Mnemonic Application before any refactoring.

The goal is to understand the existing structure, responsibilities, dependencies, and critical logic of the application, so that future changes can be made safely and gradually.

This document is part of Phase 1: Documentation Only.

No code changes are included in this phase.

---

## 2. Core Principle

The application must remain functionally identical during the refactor.

The code must serve the Chess Mnemonic System.

The refactor must not change the philosophy, cognitive structure, numbering logic, mnemonic associations, or user-facing behavior of the system without an explicit decision.

---

## 3. Current Branch Strategy

| Branch | Role |
|---|---|
| `main` | Active / production version |
| `backup-after-changes-2026-05-19` | Safe backup of the current `main` |
| `refactor-plan-documentation` | Documentation branch for Phase 1 |

Rules:

- No direct changes to `main`.
- Every change must happen in a separate branch.
- Each change must be small and reviewable.
- Functionality must be checked after every step.
- If something breaks, return to `backup-after-changes-2026-05-19`.

---

## 4. Application Overview

The Chess Mnemonic Application converts chess game information into mnemonic outputs based on the Chess Mnemonic System.

The application appears to handle:

- PGN input and parsing.
- SAN move extraction.
- Full-move and half-move logic.
- Temporal loci.
- Manual anchors.
- Piece and pawn character associations.
- Square associations.
- PAO 0–9 and PAO 00–99 logic.
- User-imported libraries.
- Default fallback libraries.
- Demo games.
- Multiple output tables.
- Epic Story generation.
- UI initialization and user interaction.

---

## 5. Main JavaScript Responsibility Map

The current main JavaScript bundle is:

| File | Current Role |
|---|---|
| `cms.bundle.js` | Main bundled script containing most or all application logic |

The long-term goal is to split this bundle gradually into smaller, clearer modules.

No extraction should happen before the current behavior is documented and understood.

---

## 6. Proposed Future Module Map

The following module structure is proposed for the modular refactor phase.

| Future Module | Responsibility |
|---|---|
| `pgn-parser.js` | Clean PGN text, parse SAN/PGN, generate move objects |
| `locus-engine.js` | Handle full-move / half-move loci, anchors, and temporal logic |
| `library-engine.js` | Manage default libraries, user libraries, and fallback logic |
| `table-renderers.js` | Render SAN, associations, shortnames, and PAO tables |
| `user-libraries.js` | Import, validate, template, and store local user libraries |
| `demo-games.js` | Store and load demo PGNs |
| `app-init.js` | Handle DOMContentLoaded, button wiring, and application initialization |

---

## 7. Functional Areas

### 7.1 PGN / SAN Processing

Responsible for:

- Reading PGN input.
- Cleaning PGN text.
- Removing or handling metadata.
- Extracting moves.
- Producing move objects.
- Handling move annotations where applicable.

Critical risk:

- Any parsing change can affect every downstream mnemonic output.

Refactor rule:

- Extract only after test cases exist for ordinary moves, captures, checks, checkmates, castling, en passant, promotion, and odd final half-moves.

---

### 7.2 Move Numbering Logic

Responsible for:

- Full-move mode.
- Half-move mode.
- Correct chronological order.
- Correct temporal locus assignment.
- Handling odd final half-moves.

Critical rule:

- In this project, a “move” means a fullmove unless otherwise specified.

Critical risk:

- A numbering error can corrupt the mnemonic timeline.

---

### 7.3 Locus Engine

Responsible for:

- Mapping moves to temporal loci.
- Handling anchors.
- Maintaining the correct relationship between chronology and mnemonic location.

Important principle:

- The temporal structure must remain cognitively clear and consistent with the Chess Mnemonic System.

---

### 7.4 Character Logic

Responsible for:

- Mapping chess pieces and pawns to characters.
- Supporting the 00–99 PAO structure.
- Preserving the fixed numbering philosophy.

Important constraints:

- The system must remain within 00–99.
- It must not expand beyond 99 unless explicitly decided.
- Pieces and pawns must preserve their established conceptual roles.

---

### 7.5 Square Associations

Responsible for:

- Mapping the 64 chessboard squares to fixed spatial scenes.
- Preserving geometric and thematic symmetry across ranks.

Important structure:

- 1st and 8th ranks: inner / royal spaces.
- 2nd and 7th ranks: walls / battlements / observation areas.
- 3rd and 6th ranks: water / moat / aquatic environments.
- 4th and 5th ranks: forest / plains / natural ground.

---

### 7.6 PAO Logic

Responsible for:

- PAO 0–9.
- PAO 00–99.
- Person / Action / Object mappings.
- Integration with move and square logic.

Critical risk:

- Changes here can damage the core mnemonic structure.

Refactor rule:

- Treat PAO logic as a protected domain area.

---

### 7.7 Library Management

Responsible for:

- Default libraries.
- User libraries.
- Imported libraries.
- Validation.
- Fallback behavior.
- Active library indication.

Expected library areas:

- Memory Palace library.
- Characters library.
- Squares library.
- PAO 00–99 library.

Critical rule:

- User libraries must not silently break default behavior.
- Fallback logic must be explicit and predictable.

---

### 7.8 Table Rendering

Responsible for displaying outputs such as:

- SAN table.
- Associations table.
- Shortnames table.
- PAO tables.
- Other derived mnemonic views.

Refactor opportunity:

- Rendering logic should be separated from data logic.

Critical rule:

- Rendering changes must not alter the underlying mnemonic data.

---

### 7.9 Epic Story Generation

Responsible for:

- Combining moves, loci, characters, squares, PAO elements, and libraries into narrative mnemonic output.

Critical principle:

- Story generation must follow the cognitive logic of the Chess Mnemonic System, not merely technical convenience.

Test requirement:

- Epic Story must be tested with default libraries and user libraries.

---

### 7.10 Demo Games

Responsible for:

- Storing demo PGNs.
- Loading demo games.
- Allowing quick testing of application behavior.

Refactor rule:

- Demo content should be isolated from core parsing and rendering logic.

---

### 7.11 App Initialization

Responsible for:

- DOMContentLoaded.
- Wiring buttons.
- Connecting UI controls to application logic.
- Initial state setup.

Refactor opportunity:

- UI initialization should eventually be separated from domain logic.

---

## 8. Dependency Map

This section must be completed during repository inspection.

Known dependency areas to inspect:

- CDN dependencies.
- Script loading order.
- Browser APIs.
- Local storage usage.
- DOM dependencies.
- CSS dependencies.
- External chess-related libraries, if any.

Documentation task:

- List each dependency.
- Explain why it is needed.
- Identify whether it is critical, replaceable, or removable.
- Check whether the application can fail safely if the dependency is missing.

---

## 9. File Map

This section must be completed after scanning the repository.

For each file, record:

| File | Purpose | Depends On | Used By | Refactor Risk |
|---|---|---|---|---|
| `cms.bundle.js` | Main application logic | To be identified during repo inspection | Main UI | High |

---

## 10. Script Loading Order

This section must be completed after checking the HTML entry point.

For each loaded script, record:

| Order | Script | Purpose | Must Load Before | Must Load After |
|---|---|---|---|---|
| 1 | To be identified during repo inspection | To be documented | To be documented | To be documented |

Critical question:

- Does the current application rely on global variables or load order side effects?

---

## 11. State Management

This section must be completed during code inspection.

Areas to document:

- Global variables.
- User-selected mode.
- Active library.
- Imported user data.
- Current PGN.
- Parsed moves.
- Generated output.
- Local storage data.

Important question:

- Which state is temporary and which state is persisted?

---

## 12. Data Flow

Expected high-level flow:

1. User loads or enters PGN.
2. Application parses PGN.
3. Moves are converted into internal move objects.
4. Move objects are connected to loci, characters, squares, and PAO data.
5. User selects mode and output type.
6. Application renders tables or story output.
7. User may import libraries or use default fallback libraries.

This flow must be verified against the actual code.

---

## 13. Refactor Risk Areas

High-risk areas:

- PGN parsing.
- Full-move / half-move logic.
- Temporal loci.
- Manual anchors.
- Character mappings.
- Square associations.
- PAO 00–99.
- User library fallback logic.
- Epic Story generation.

Medium-risk areas:

- Table rendering.
- Demo game loading.
- UI event wiring.

Lower-risk areas:

- Comments.
- Dead code, after review.
- Inline styles, after visual check.
- CSS class extraction, after comparison.

---

## 14. Testing Requirements Before Refactor

The following test cases should exist before or during modular extraction:

- Ordinary move.
- Capture.
- Check.
- Checkmate.
- Kingside castling.
- Queenside castling.
- En passant.
- Promotion.
- Odd final half-move.
- Full-move loci mode.
- Half-move loci mode.
- Imported Memory Palace library.
- Imported Characters library.
- Imported Squares library.
- Imported PAO 00–99 library.
- Epic Story with default libraries.
- Epic Story with user libraries.

---

## 15. Safe Refactor Strategy

Recommended sequence:

1. Document current files.
2. Document functions inside `cms.bundle.js`.
3. Identify pure functions.
4. Identify DOM-dependent functions.
5. Identify data constants.
6. Identify library-related logic.
7. Identify rendering logic.
8. Add basic tests.
9. Extract one module at a time.
10. Verify behavior after every extraction.

Important rule:

- Do not extract multiple modules at the same time.

---

## 16. Candidate Extraction Order

Suggested order:

1. `demo-games.js`
2. Static default libraries, if safely separable.
3. `pgn-parser.js`
4. `table-renderers.js`
5. `library-engine.js`
6. `user-libraries.js`
7. `locus-engine.js`
8. `app-init.js`

Reasoning:

- Start with the lowest-risk static or isolated logic.
- Move gradually toward the core mnemonic logic.
- Leave initialization and wiring until responsibilities are clearer.

---

## 17. Review Checklist

Before any code change:

- [ ] Respect the Chess Mnemonic System.
- [ ] Confirm that no behavior is intentionally changed.
- [ ] Confirm that the change is on a branch, not `main`.
- [ ] Confirm that backup branch exists.
- [ ] Identify affected functions.
- [ ] Identify affected outputs.
- [ ] Run manual functional checks.
- [ ] Compare output before and after change.
- [ ] Review before merge.

---

## 18. Open Questions for Repository Inspection

These questions must be answered before modular refactor begins:

1. What files currently exist in the repository?
2. Which HTML file loads `cms.bundle.js`?
3. Are there multiple JavaScript files or only one bundle?
4. Which functions inside `cms.bundle.js` are pure?
5. Which functions directly touch the DOM?
6. Which data is hard-coded?
7. Which data is user-imported?
8. Where is local storage used?
9. Which logic depends on load order?
10. Which parts are safest to extract first?
11. Which parts should remain untouched until tests exist?
12. Are there current bugs or only structural risks?
13. Are there hidden dependencies between UI and mnemonic logic?

---

## 19. Success Criteria

The documentation phase succeeds when:

- The current structure is clearly described.
- The role of each major file is known.
- The role of each major function is known.
- Dependencies are documented.
- Script loading order is documented.
- Core risk areas are identified.
- The first safe refactor step is obvious.
- The application still works exactly as before.

---

## 20. Next Step

The next practical step is to inspect the repository in Cursor and complete:

1. File map.
2. Function map.
3. Dependency map.
4. Script loading order.
5. Current data flow verification.

Only after that should any refactoring begin.
