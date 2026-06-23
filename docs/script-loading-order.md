# Script Loading Order Baseline

This document records the current static and dynamic script loading order and dependencies. It describes observed source order and known runtime dependencies; it does not define a proposed replacement.

## `index.html` Landing Page

`index.html` has no external JavaScript application scripts. It contains one inline script:

1. Inline `application/ld+json` `WebPage` metadata.

It links to `app.html` and `flashcards/index.html`.

## `app.html` Main Application Static Load Order

Scripts in the document head, in source order:

1. `https://code.jquery.com/jquery-3.6.0.min.js`
2. `https://cdnjs.cloudflare.com/ajax/libs/chess.js/0.10.3/chess.min.js`
3. `https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js`
4. `https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js`
5. `https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js`
6. `js/cms.bundle.js`
7. `js/default-library-v5.4.js`
8. `js/shortnames-action-column.js`
9. `js/user-libraries-history.js`
10. `js/epic-ui-init.js` with `defer`
11. `js/epic.js` with `defer`
12. `js/epic-tts.js` with `defer`
13. `js/san-to-text-popup.js`
14. `js/download-tables.js`
15. `js/structured-data.js` with `defer`
16. `https://www.googletagmanager.com/gtag/js?id=G-3PNNG17EF8` with `async`
17. Inline Google Analytics setup: `window.dataLayer`, `gtag(...)`
18. `https://stats.chessmnemonics.net/js/pa-WdICfxHgt8muzquWjtyoH.js` with `async`
19. Inline Plausible setup: `window.plausible`, `plausible.init()`

Scripts in the document body, in source order:

20. Inline disclaimer popup script. Fetches `Disclaimer.txt` on button click and assigns `window.onclick`.
21. `https://static.copyrighted.com/badges/helper.js`
22. Inline `googleTranslateElementInit()`.
23. `//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit`
24. Inline How-To modal script. Assigns `window.onclick`, replacing the earlier direct `window.onclick` assignment.
25. Inline memory palace image modal script. Uses `window.addEventListener("click", ...)`.
26. Inline menu close script. Uses `document.addEventListener("click", ...)`.

## Main Application Dependency Chain

### Core Dependencies

- `js/cms.bundle.js` depends on `Chess` from Chess.js for `parsePGN`.
- `js/cms.bundle.js` uses `saveAs`, which is provided by FileSaver.js, in user-library export paths.
- `js/user-libraries-history.js` and `js/user-library-batch-import.js` use `JSZip` for template ZIP generation.
- `js/user-library-batch-import.js` dynamically loads SheetJS only for Excel import.

### Project Script Dependencies

- `js/default-library-v5.4.js` must load after `js/cms.bundle.js` to replace `loadLibraries()`.
- `js/shortnames-action-column.js` must load after `js/cms.bundle.js` because it replaces `fillAssociationsTable()` and `fillShortnamesTable()` and uses core helpers.
- `js/user-libraries-history.js` assumes core globals such as `libs`, `parsePGN`, `cleanPGN`, `renderAll`, `enableManualAnchors`, `showOnlySection`, `loadLibraries`, and `updateUserLibraryStatus` exist when its runtime functions execute.
- `js/user-library-runtime-fix.js` assumes `p2p3Get`, `squareShortname`, `fillAssociationsTable`, and `updateUserLibraryStatus` already exist.
- `js/epic.js` depends on `gameMoves`, `manualAnchors`, `libs`, `selectedLang`, `pieceGreek`, and `Chess`.
- `js/epic-tts.js` depends on DOM created by `js/epic.js`; both are deferred and ordered in `app.html`. It assigns `window.speechSynthesis.onvoiceschanged = loadVoices`.
- `js/san-to-text-popup.js` depends on `gameMoves`, `libs`, `selectedLang`, `t1Label`, `renderAll`, and `Chess`.
- `js/download-tables.js` depends on table DOM already being present by the time its `DOMContentLoaded` handler runs.
- `js/structured-data.js` can run independently for JSON-LD injection but also dynamically loads optional helper scripts.

## Dynamic Script Loading

### Loaded by `js/user-libraries-history.js`

`loadRuntimeHelper()` dynamically appends:

- `js/user-library-runtime-fix.js`

It sets:

- `script.defer = true`
- `window.__cmaUserRuntimeFixLoading = true`

Observed dependency:

- The helper expects core functions from `js/cms.bundle.js` and the replacement `fillAssociationsTable()` from `js/shortnames-action-column.js` to already exist.

Uncertainty:

- Dynamically inserted classic scripts have browser-specific execution timing relative to static deferred scripts and `DOMContentLoaded`. The exact wrapper order should be characterized in-browser.

### Loaded by `js/structured-data.js`

`js/structured-data.js` dynamically appends these helper scripts:

1. `js/user-library-batch-import.js?v=20260518-4`
2. `js/user-library-ui-labels.js?v=20260616-1`
3. `js/feedback.js?v=20260527-1`

Each is appended with `script.defer = true`.

Observed dependencies:

- `js/user-library-batch-import.js` expects core globals and `castlingShortnameName()` from `js/shortnames-action-column.js`.
- `js/user-library-ui-labels.js` expects the right-panel DOM and menu DOM.
- `js/feedback.js` expects `#goldBtn` to exist before it creates the feedback row.

Uncertainty:

- Because these are dynamically inserted by a deferred script, their exact execution order relative to other deferred scripts should be verified in a browser. Source order suggests they are appended in the order shown above.

### Loaded by `js/user-library-batch-import.js`

`loadSheetJS()` dynamically appends:

- `https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js`

This only occurs when an `.xlsx` or `.xls` import is attempted and `window.XLSX` is not already present.

## Initialization Events

`js/cms.bundle.js` installs one main `DOMContentLoaded` listener. That listener:

1. initializes `selectedLang`,
2. initializes `locusMode`,
3. awaits `loadLibraries()`; the effective function is the v5.4 override,
4. calls `loadUserLibrariesIntoUI()`,
5. calls `wirePGN()`,
6. calls `wireTableSelect()`,
7. calls `wireImportLibraryButton()`,
8. calls `wireCreateLibraryButton()`,
9. calls `wireUserLibraryDropdown()`,
10. wires `#openLibrarySelectorBtn` if present,
11. wires `#pao99CollectionSelect`,
12. parses existing PGN text if present,
13. renders all tables and enables manual anchors,
14. wires `#openFenBuilderBtn` to `https://lichess.org/editor`,
15. wires the demo games button,
16. wires the original template ZIP handler for `#downloadTemplatesBtn`,
17. wires `#refreshLociBtn` if present,
18. creates table column visibility controls.

Other `DOMContentLoaded` listeners include:

- `js/shortnames-action-column.js`: fixes Associations labels.
- `js/user-libraries-history.js`: enhances library panel and installs status wrapper.
- `js/epic-ui-init.js`: adds Epic classes.
- `js/epic.js`: creates Epic modal and story controls.
- `js/epic-tts.js`: adds Epic TTS controls if Epic DOM exists.
- `js/san-to-text-popup.js`: creates SAN-to-text modal and wraps `window.renderAll`.
- `js/download-tables.js`: wires download dropdowns.
- `js/user-library-runtime-fix.js`: applies small UI fixes if loaded before or after DOM readiness.
- `js/user-library-batch-import.js`: patches shortname accessors and rewires import/template buttons.
- `js/user-library-ui-labels.js`: applies label and spacing updates.
- `js/feedback.js`: creates feedback UI.

## Effective Main Application Library Load

Although `js/cms.bundle.js` originally defines:

- `loadLibraries()` -> `fetch('json/libraries_v.5.3.json')`

`js/default-library-v5.4.js` loads immediately afterward and redefines:

- `loadLibraries()` -> `fetch('json/libraries_v.5.4.json')`

Therefore, `app.html` currently loads `json/libraries_v.5.4.json` by default.

## Template Download Handler Chain

`#downloadTemplatesBtn` is handled by multiple layers:

1. `js/cms.bundle.js` wires the original click handler during its main `DOMContentLoaded` listener. It fetches four JSON templates and downloads `CMA_Templates.zip`.
2. `js/user-libraries-history.js` installs `installTemplatesDownloadGuard()`. It listens on `document` in the capture phase for clicks on `#downloadTemplatesBtn`, stops propagation, and downloads `CMA_Templates.zip`.
3. `js/user-library-batch-import.js` runs `wireTemplatesZipButton()`, clones and replaces the button, then installs an expanded click handler that includes JSON and CSV templates and downloads `CMA_User_Library_Templates.zip`.

The effective click behavior depends on dynamic loading order and capture-phase interception.

## Flashcards Script Loading

`flashcards/index.html` static scripts:

1. Inline `application/ld+json`
2. `flashcards/script.js`

`flashcards/script.js` runs as a normal script near the end of the body. It:

- wires controls immediately,
- installs a `keydown` listener,
- installs a `DOMContentLoaded` listener that calls `autoFetch()`,
- fetches `../json/libraries_v.5.4.json`.

## Standalone TTS Script Loading

`chess_games_tts_app/index.html` static scripts:

1. Inline `application/ld+json`
2. `https://cdnjs.cloudflare.com/ajax/libs/chess.js/0.10.3/chess.min.js`
3. Inline `googleTranslateElementInit()`
4. Inline Google Translate cookie default helper
5. `https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit`
6. Inline TTS app logic

The inline TTS app logic assigns `speechSynthesis.onvoiceschanged = populateVoices` when the property is available.

Inline controls call global functions through `onclick` attributes:

- `toggleTheme()`
- `playGame()`
- `pauseGame()`
- `stopGame()`

## Android Script Loading

`android/app/src/main/assets/public/index.html` is the packaged Android app page. It follows the same broad script order as root `app.html`, but the file content is not identical. Notable inspected differences:

- menu label/content differs,
- right-panel wording differs,
- packaged `js/structured-data.js` differs and appends `js/user-library-ui-labels.js?v=20260518-2`,
- packaged `js/user-library-ui-labels.js` differs from root.

The Android packaged public `index.html` is the app page, not the root landing page.

## Unloaded or Indirect Scripts

- `js/table-header-fixes.js` exists in root and Android public assets, but root `app.html` does not statically load it and no inspected root script dynamically loads it.
- Similar header-fix behavior is duplicated in `js/shortnames-action-column.js` and `js/user-library-runtime-fix.js`.

## Load-Order Risks to Characterize Later

- Final wrapper order for `renderAll`, `updateUserLibraryStatus`, and `squareShortname`.
- Effective click behavior for `#importLibraryBtn` when the original core handler, history click guard, and batch importer all exist.
- Whether dynamically inserted scripts with `defer = true` execute in a stable order across target browsers.
- Whether `js/epic-tts.js` always sees DOM created by `js/epic.js` before it runs.
