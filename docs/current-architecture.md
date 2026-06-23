# Current Architecture Baseline

This document records the current implementation as inspected on the Phase 0 baseline branch. It describes the repository as it exists now; it does not propose or imply a target architecture.

## Application Boundaries

- `index.html` is the public landing page. It is a static explanatory page with inline CSS, inline JSON-LD, and links into the product surfaces.
- `app.html` is the main Chess Mnemonic Application and Epic Chess Stories Creator. It loads the parser, mnemonic tables, user-library flows, Epic Story modal, TTS helpers, analytics, and translation helpers.
- `flashcards/` is a separate Memory Palaces and libraries trainer. It loads default libraries from `json/libraries_v.5.4.json` and can normalize selected default or user-template JSON structures into flashcard entries.
- `chess_games_tts_app/` is a standalone PGN text-to-speech application implemented as a single HTML file with inline CSS and JavaScript.
- `android/` contains a Capacitor/Cordova Android wrapper and a packaged copy of public web assets under `android/app/src/main/assets/public/`.

## Repository Areas Inspected

- `app.html`
- `index.html`
- `ARCHITECTURE.md`
- `docs/ARCHITECTURE_EVOLUTION_2026-06-07.md`
- `js/`
- `flashcards/`
- `chess_games_tts_app/`
- `json/`
- `user_libraries/`
- `css/`
- `android/`
- `tools/`

## Root Web Pages

### `index.html`

`index.html` is the landing page. It contains:

- inline styling for the introduction page,
- an inline `application/ld+json` `WebPage` schema,
- links to `app.html` and `flashcards/index.html`,
- explanatory content for the Chess Mnemonic System, memory palaces, PAO, shortnames, and Epic Story usage.

It does not load the main application JavaScript files and does not parse PGN.

### `app.html`

`app.html` is the main application. It contains:

- metadata, social tags, and CSS links to `css/styles.css` and `css/menu.css`,
- CDN dependencies for jQuery, Chess.js, PapaParse, FileSaver, and JSZip,
- project script loading for the main app and helper scripts,
- analytics scripts for Google Analytics and Plausible,
- the PGN input area and parse/clear/demo controls,
- a FEN Builder button that opens `https://lichess.org/editor` in a new tab,
- table selection controls and memory palace mode controls,
- table shells for SAN, Associations, PAO 0-9, PAO 00-99, and Shortnames,
- user-library buttons for create, template download, import/load, status, and default restore added at runtime,
- inline modal code for disclaimer, Google Translate, the "How to create the Epic Story" modal, the memory palace image modal, and the menu close behavior.

The page relies on global script execution order. No ES modules are used.

## Main Application JavaScript

### `js/cms.bundle.js`

`js/cms.bundle.js` is the legacy core application file. It owns the initial global state and most of the first-pass behavior:

- library state: `libs`,
- current parsed moves: `gameMoves`,
- selected language: `selectedLang`,
- memory palace mode: `locusMode`,
- manual anchor map: `manualAnchors`,
- PGN cleaning and parsing through Chess.js,
- table rendering functions for SAN, Associations, PAO 0-9, PAO 00-99, and Shortnames,
- 80-locus wrapping in `locusForMove`,
- manual anchor toggling in `enableManualAnchors`,
- user-library creation modals,
- original JSON-only user-library import flow,
- user-library dropdown/history UI hooks,
- memory palace table application through `window.applyUserPalaceToTables`,
- demo game modal and bundled demo PGNs,
- template ZIP download handling for the core JSON templates through the original `#downloadTemplatesBtn` handler,
- runtime creation of table column visibility controls,
- DOM initialization in a `DOMContentLoaded` listener.

The default `loadLibraries()` inside this file fetches `json/libraries_v.5.3.json`, but this function is replaced by `js/default-library-v5.4.js` before initialization runs.

### `js/default-library-v5.4.js`

This file replaces global `loadLibraries()` so the main application loads `json/libraries_v.5.4.json`. This makes v5.4 the effective default dataset for `app.html`.

### `js/shortnames-action-column.js`

This file replaces table renderers and adds castling/action behavior:

- defines `castlingMnemonicName()`,
- defines `castlingShortnameName()`,
- defines `castlingActionFromSan(san)`,
- defines `shortnameActionFromSan(san)`,
- defines `associationActionFromSan(san)`,
- defines `characterShortnameOverride(square, pieceLetter)`,
- replaces `fillAssociationsTable(moves)`,
- replaces `fillShortnamesTable(moves)`,
- adjusts Associations toolbar/header labels after `DOMContentLoaded`.

It depends on globals from `js/cms.bundle.js`, including `libs`, `selectedLang`, `locusForMove`, `anchorForMove`, `pieceGreek`, `escapeHtml`, and `squareShortname`.

### `js/user-libraries-history.js`

This file adds user-library import history, import interception, runtime helper loading, restore-default behavior, and library-panel UX changes. It:

- dynamically appends `js/user-library-runtime-fix.js`,
- detects library types with `detectLibraryType(json)`,
- applies complete library bundles and individual user libraries,
- stores history in `localStorage.savedLibraries`,
- stores active library metadata in `localStorage.activeLibrary`,
- replaces `window.wireImportLibraryButton`,
- installs a document-level capture-phase click guard for `#importLibraryBtn`,
- exposes `window.CMAUserLibrariesHistory`,
- wraps `updateUserLibraryStatus` in `installStatusWrapper()`,
- installs a capture-phase guard for `#downloadTemplatesBtn`,
- adds the "Restore Default Libraries" button at runtime.

### `js/user-library-runtime-fix.js`

This file is loaded dynamically by `js/user-libraries-history.js`. It patches runtime behavior for imported user libraries:

- wraps `p2p3Get`,
- wraps `squareShortname`,
- wraps `fillAssociationsTable`,
- wraps `renderAll` when present,
- wraps `updateUserLibraryStatus`,
- inserts a PAO 0-9 educational note,
- hides selected table columns by default,
- adjusts Associations labels,
- exposes `window.CMAUserLibraryFix`.

The exact order of its wrappers relative to wrappers installed by `js/user-libraries-history.js`, `js/san-to-text-popup.js`, and `js/user-library-batch-import.js` depends on dynamic script timing.

### `js/structured-data.js`

This deferred script injects JSON-LD `SoftwareApplication` data into the page head. It also dynamically appends:

- `js/user-library-batch-import.js?v=20260518-4`,
- `js/user-library-ui-labels.js?v=20260616-1`,
- `js/feedback.js?v=20260527-1`.

### `js/user-library-batch-import.js`

This dynamically loaded helper adds direct multi-file import support for:

- JSON,
- CSV,
- XLSX,
- XLS.

It detects and applies combined bundles, memory palaces, characters, squares, shortnames, and PAO 00-99. It also dynamically loads SheetJS from a CDN only when Excel import is attempted and `window.XLSX` is not already present.

It patches:

- `characterShortnameBySquare`,
- `squareShortname`,
- `castlingShortnameName`.

It replaces the import button node with a clone in `wireImportButton()` and exposes `window.CMAUserLibraryBatchImport`.

It also clones and rewires `#downloadTemplatesBtn` in `wireTemplatesZipButton()` to download an expanded ZIP containing both JSON and CSV templates.

### Other `js/` Files

- `js/download-tables.js` wires the "Download as..." dropdowns and exports visible table rows as CSV or JSON. It removes `txt` options at runtime.
- `js/epic-ui-init.js` adds classes to Epic Story UI elements when present.
- `js/epic.js` creates the Epic Story modal and generates story text from `gameMoves`, `manualAnchors`, `libs`, and table/locus state.
- `js/epic-tts.js` adds browser Web Speech API controls to the Epic Story modal and assigns `window.speechSynthesis.onvoiceschanged = loadVoices`.
- `js/san-to-text-popup.js` creates a SAN-to-text modal, renders full-move or half-move text, and wraps `window.renderAll`.
- `js/user-library-ui-labels.js` injects right-panel spacing styles and label text adjustments.
- `js/feedback.js` adds a feedback button/modal and sends feedback through a `mailto:` URL.
- `js/table-header-fixes.js` adjusts Associations table labels, but it is not statically loaded by root `app.html`; similar behavior exists in loaded scripts.

## Flashcards Trainer

`flashcards/index.html` loads `flashcards/style.css` and `flashcards/script.js`. It has its own static UI and an inline JSON-LD block. It does not load the main `js/` application bundle.

`flashcards/script.js`:

- maintains its own global card state,
- automatically fetches `../json/libraries_v.5.4.json`,
- normalizes selected default-library paths using the `#librarySelect` value,
- supports user-template-like JSON structures for memory palaces, characters, PAO 00-99, squares, and generic flat maps,
- lets users load a JSON file through FileReader,
- uses `window.lastData` to retain the most recently loaded JSON.

## Standalone TTS App

`chess_games_tts_app/index.html` is a standalone PGN audio player. It:

- loads Chess.js from CDN,
- uses Google Translate,
- stores theme preference in `localStorage.theme`,
- uses browser `speechSynthesis`,
- assigns `speechSynthesis.onvoiceschanged = populateVoices`,
- parses PGN through `new Chess().load_pgn(pgn)`,
- reads the game with global functions called by inline `onclick` handlers: `toggleTheme`, `playGame`, `pauseGame`, and `stopGame`.

It does not share state with `app.html`.

## Data and Templates

### `json/`

- `json/libraries_v.5.4.json` is the effective default library for `app.html` and `flashcards/`.
- `json/libraries_v.5.3.json` remains in the repository. The original `loadLibraries()` in `js/cms.bundle.js` fetches it, but `js/default-library-v5.4.js` overrides that function in the main application.

### `user_libraries/`

This directory contains JSON and CSV templates for user-created libraries:

- combined user bundle,
- characters,
- memory palaces,
- PAO 00-99,
- shortnames,
- squares,
- matching CSV templates.

## CSS

- `css/styles.css` styles the main app.
- `css/menu.css` styles menu behavior.
- `flashcards/style.css` styles only the flashcards trainer.
- `index.html` and `chess_games_tts_app/index.html` contain their own inline CSS.

## Android Packaging

`android/app/src/main/assets/public/` contains a packaged copy of the web assets. Most copied root assets match their root counterparts, but these inspected files differ:

- `android/app/src/main/assets/public/index.html` is not identical to root `app.html`.
- `android/app/src/main/assets/public/js/structured-data.js` differs from root `js/structured-data.js`.
- `android/app/src/main/assets/public/js/user-library-ui-labels.js` differs from root `js/user-library-ui-labels.js`.

The Android packaged `index.html` corresponds to the app surface rather than the root landing page. The root landing page `index.html` is not mirrored as Android public `index.html`.

Android config observed:

- `android/app/src/main/assets/capacitor.config.json` has `appId` `net.chessmnemonics.app`, `appName` `Chess Mnemonic Application`, and `webDir` `www`.
- `android/app/src/main/res/xml/config.xml` allows `<access origin="*" />`.

## Tools

- `tools/apply_v5_4_character_update.py` updates `json/libraries_v.5.4.json` character, PAO, and shortname entries and can create a backup file.
- `tools/prune_v5_4_unused_libraries.py` removes unused sections from `json/libraries_v.5.4.json` and can create a backup file.

These are maintenance scripts, not runtime application code.

## Current Inconsistencies

- `js/cms.bundle.js` defines `loadLibraries()` for `json/libraries_v.5.3.json`; `js/default-library-v5.4.js` replaces it with a v5.4 loader.
- `app.html` offers `PAO 00-99/LibraryP1` only, matching v5.4. v5.3 contains additional PAO 00-99 libraries.
- `app.html` includes the `txt` option in download dropdowns, but `js/download-tables.js` removes `txt` options at runtime.
- User-library import exists in at least three overlapping flows: the original JSON-only flow in `js/cms.bundle.js`, the history/import-guard flow in `js/user-libraries-history.js`, and the multi-format flow in `js/user-library-batch-import.js`.
- Template ZIP download also has overlapping handlers: the original handler in `js/cms.bundle.js`, a capture-phase guard in `js/user-libraries-history.js`, and a clone-and-rewire expanded handler in `js/user-library-batch-import.js`.
- Multiple scripts adjust the same Associations table headers and labels.
- `js/table-header-fixes.js` exists but is not loaded by root `app.html`.
- Inline `window.onclick` handlers in `app.html` are assigned more than once.
- The Android packaged public assets are not a byte-for-byte mirror of the root app assets.

## Uncertainties

- The intended canonical source for Android public assets is unclear because several packaged files differ from root files.
- The intended final import flow is unclear because multiple import handlers are installed, cloned, wrapped, or intercepted.
- The exact runtime wrapper order for dynamically loaded scripts may vary by browser timing unless verified in a live browser.
- It is unclear whether `js/table-header-fixes.js` is intentionally unused or a leftover helper.
