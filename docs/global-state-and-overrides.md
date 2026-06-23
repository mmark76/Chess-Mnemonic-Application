# Global State and Runtime Overrides Baseline

This document records global mutable state and runtime function replacements observed in the current implementation.

## Main Application Global Mutable State

Defined in `js/cms.bundle.js`:

| Name | Kind | Purpose | Mutated By |
| --- | --- | --- | --- |
| `libs` | top-level `let` | Current default library data plus optional `libs.User` data. | `loadLibraries`, user-library import flows, restore-default flow, complete-library import flow. |
| `gameMoves` | top-level `let` | Parsed current PGN/SAN moves. | `wirePGN`, demo game modal, user-library rebuild logic. |
| `selectedLang` | top-level `let` | Selected language for library lookup. | `DOMContentLoaded` language select handler. |
| `locusMode` | top-level `let` | Main table memory palace mode, `full` or `half`. | `#locusMode` change handler. |
| `manualAnchors` | top-level `let` object | Move indexes marked with manual anchors. | `enableManualAnchors`, PGN parse/clear/demo flows. |

Important note: these are top-level script lexical/global bindings. Several later scripts access them by free variable name. `user-libraries-history.js` also writes `window.libs = libs` after complete-library import, creating or syncing a `window.libs` property.

## Main Application Global Constants

Defined in `js/cms.bundle.js`:

- `PIECE_GREEK`
- `PIECE_TO_P`
- `FILE_TO_NUM`
- bundled demo PGN constants: `demoMorphyPGN`, `demoImmortalPGN`, `demoCapaPGN`, `demoRubinsteinPGN`, `demoLaskerPGN`

These constants are global script bindings but are not intended mutable state.

## Main Application Global Functions

Defined in `js/cms.bundle.js` before later scripts patch some of them:

- `sideGR(side)`
- `pieceGreek(letter)`
- `escapeHtml(s)`
- `setActiveLibrary(type, path)`
- `getActiveLibrary()`
- `t1Label(idx)`
- `t2Label(idx)`
- `s1Square(square)`
- `p1PAO(d)`
- `p2p3Get(idx2, collection)`
- `v1Verse(pieceLetter, file, rank, side, moveNo)`
- `sn1Shortname(code)`
- `characterShortnameBySquare(square, pieceLetter)`
- `squareShortname(square)`
- `locusForMove(m)`
- `anchorForMove(index)`
- `anchorForMovePair(n)`
- `cleanPGN(pgn)`
- `parsePGN(pgn)`
- `fillSanTable(moves)`
- `enableManualAnchors()`
- `fillAssociationsTable(moves)`
- `toPFR(m)`
- `formatPFR(pfr)`
- `fillPaoTable_0_9(moves)`
- `weave6Digits(pfrW, pfrB)`
- `twoDigit(str)`
- `fillPaoTable_00_99(moves)`
- `fillShortnamesTable(moves)`
- `renderAll()`
- `showOnlySection(idToShow)`
- `wireTableSelect()`
- `loadLibraries()`
- `loadUserLibrariesIntoUI()`
- `updateUserLibraryStatus(text)`
- `loadMemoryPalacesTemplate()`
- `loadCharactersTemplate()`
- `loadSquaresTemplate()`
- `loadPAOTemplate()`
- `createBackdrop()`
- `openSquaresModal(data)`
- `openMemoryPalaceModal(data)`
- `openCharactersModal(data)`
- `openPAOModal(data)`
- `openCreateLibraryChooser()`
- `wireCreateLibraryButton()`
- `wireImportLibraryButton()`
- `openLibrarySelector()`
- `wireUserLibraryDropdown()`
- `wirePGN()`
- `lockDropdown(id, value)`
- `openDemoGamesModal()`

Scoped helper note: `updateLocusColumn(bodyId, lociArray)` exists in `js/cms.bundle.js`, but it is scoped inside the memory-palace IIFE and is not a global function. It is used indirectly by `window.applyUserPalaceToTables`.

Defined inline in `app.html`:

- `googleTranslateElementInit()`

## Window Properties and Namespaces

Main application window-level properties observed:

| Name | Defined In | Purpose |
| --- | --- | --- |
| `window.applyUserPalaceToTables` | `js/cms.bundle.js` | Applies user memory palace loci to table locus columns. |
| `window.dataLayer` | `app.html` | Google Analytics queue. |
| `gtag` | `app.html` | Google Analytics global function. |
| `window.plausible` | `app.html` | Plausible analytics queue/function. |
| `window.__cmaUserRuntimeFixLoading` | `js/user-libraries-history.js` | Guard for dynamic runtime helper injection. |
| `window.__cmaImportPickerOpen` | `js/user-libraries-history.js` | Guard for file picker re-entry. |
| `window.__cmaImportClickGuardInstalled` | `js/user-libraries-history.js` | Guard for import click handler installation. |
| `window.wireImportLibraryButton` | `js/user-libraries-history.js` | Replaces/import-neutralizes original import-button wiring. |
| `window.CMAUserLibrariesHistory` | `js/user-libraries-history.js` | Exposes detection and import helpers. |
| `window.__cmaLibraryStatusWrapperInstalled` | `js/user-libraries-history.js` | Guard for status wrapper installation. |
| `window.CMAUserLibraryFix` | `js/user-library-runtime-fix.js` | Exposes runtime-fix helper functions. |
| `window.CMAUserLibraryBatchImport` | `js/user-library-batch-import.js` | Exposes batch-import helper functions. |
| `window.XLSX` | SheetJS CDN, dynamic | Excel parser used by batch import. |
| `window.locusMode` | `js/cms.bundle.js` change handler | Mirrors selected `locusMode` for other scripts. |
| `window.renderAll` | `js/san-to-text-popup.js` | Reassigned wrapper around the existing render function. |
| `window.speechSynthesis.onvoiceschanged` | `js/epic-tts.js` | Assigned to `loadVoices` for Epic Story TTS voice refresh. |

## Local Storage Keys

| Key | Used In | Purpose |
| --- | --- | --- |
| `activeLibrary` | `js/cms.bundle.js`, `js/user-libraries-history.js` | Stores active library metadata `{ type, path }`. |
| `savedLibraries` | `js/cms.bundle.js`, `js/user-libraries-history.js` | Stores local user-library history entries. |
| `epicLocusMode` | `js/epic.js` | Stores Epic Story locus mode. |
| `theme` | `chess_games_tts_app/index.html` | Stores standalone TTS app dark/light theme. |

## Function Replacements, Wrappers, and Patches

### `loadLibraries`

- Original: `js/cms.bundle.js` defines `async function loadLibraries()` and fetches `json/libraries_v.5.3.json`.
- Replacement: `js/default-library-v5.4.js` defines `async function loadLibraries()` again and fetches `json/libraries_v.5.4.json`.
- Effective main-app behavior: v5.4 is loaded when the DOM initialization in `js/cms.bundle.js` calls `loadLibraries()`.

### `fillAssociationsTable`

- Original: `js/cms.bundle.js`.
- Replacement: `js/shortnames-action-column.js` redefines `function fillAssociationsTable(moves)` to add Action column behavior and castling mnemonic behavior.
- Wrapper: `js/user-library-runtime-fix.js` saves `var defaultAssociations = fillAssociationsTable` and replaces `fillAssociationsTable` to post-process target square association cells with imported user square text.

### `fillShortnamesTable`

- Original: `js/cms.bundle.js`.
- Replacement: `js/shortnames-action-column.js` redefines `function fillShortnamesTable(moves)` to add Action column behavior and castling shortname behavior.

### `p2p3Get`

- Original: `js/cms.bundle.js` reads `libs["PAO 00-99"][collection]`.
- Wrapper: `js/user-library-runtime-fix.js` saves `var defaultPao99 = p2p3Get` and replaces `p2p3Get` to prefer `libs.User.PAO_00_99[key]`.

### `squareShortname`

- Original: `js/cms.bundle.js` reads `libs.Shortnames.SquaresSN1`.
- Wrapper 1: `js/user-library-runtime-fix.js` saves `var defaultSquareShortname = squareShortname` and replaces `squareShortname` to prefer imported `libs.User.Squares` text.
- Wrapper 2: `js/user-library-batch-import.js` saves `const original = squareShortname` and replaces `squareShortname` to prefer `libs.User.Shortnames.SquaresSN1` or `libs.User.Shortnames.SquareShortnames`.
- Uncertainty: the final wrapper nesting order depends on dynamic script timing.

### `characterShortnameBySquare`

- Original: `js/cms.bundle.js` reads `libs.Shortnames.CharactersSN1`.
- Wrapper: `js/user-library-batch-import.js` replaces it to prefer `libs.User.Shortnames.CharactersSN1` or `libs.User.Shortnames.PieceShortnames`.

### `castlingShortnameName`

- Original: `js/shortnames-action-column.js` returns `Peter`.
- Wrapper: `js/user-library-batch-import.js` replaces it to prefer `libs.User.Shortnames.CastlingSN1[cleanSan]`.

### `renderAll`

- Original: `js/cms.bundle.js` renders all tables.
- Wrapper 1: `js/user-library-runtime-fix.js` wraps it to hide columns and insert the PAO 0-9 note after rendering.
- Wrapper 2: `js/san-to-text-popup.js` captures `const orig = window.renderAll` and replaces `window.renderAll` so the SAN-to-text button enables after render.
- Uncertainty: wrapper order depends on dynamic loading and DOM timing.

### `updateUserLibraryStatus`

- Original: `js/cms.bundle.js` writes `status.innerHTML = text`.
- Wrapper 1: `js/user-library-runtime-fix.js` wraps it to call `renderAll()` and `enableManualAnchors()` after a short timeout.
- Wrapper 2: `js/user-libraries-history.js` `installStatusWrapper()` wraps it to add status card display and styling.
- Uncertainty: final wrapper nesting order depends on when `js/user-library-runtime-fix.js` finishes loading.

### `wireImportLibraryButton`

- Original: `js/cms.bundle.js` adds a JSON-only import click listener directly to `#importLibraryBtn`.
- Replacement: `js/user-libraries-history.js` assigns `window.wireImportLibraryButton = function () { ... }`, marking the button as wired without installing the original handler.
- Additional interception: `js/user-libraries-history.js` installs a capture-phase document click guard on `#importLibraryBtn` to open a JSON picker.
- Additional replacement: `js/user-library-batch-import.js` later clones and replaces `#importLibraryBtn` and adds an import handler accepting JSON, CSV, XLSX, and XLS.
- Important current behavior: there are overlapping import strategies; exact click behavior should be characterized in-browser.

### `#downloadTemplatesBtn`

- Original handler: `js/cms.bundle.js` adds a click listener to `#downloadTemplatesBtn` during its main `DOMContentLoaded` initialization. It fetches four JSON templates and downloads `CMA_Templates.zip`.
- Capture-phase guard: `js/user-libraries-history.js` installs `installTemplatesDownloadGuard()`, which listens for document clicks on `#downloadTemplatesBtn` in the capture phase, calls `event.preventDefault()`, `event.stopPropagation()`, and `event.stopImmediatePropagation()`, and downloads `CMA_Templates.zip`.
- Clone-and-rewire handler: `js/user-library-batch-import.js` runs `wireTemplatesZipButton()`, clones and replaces `#downloadTemplatesBtn`, and installs an expanded templates ZIP handler that includes JSON and CSV templates and downloads `CMA_User_Library_Templates.zip`.
- Important current behavior: template download behavior depends on handler installation order, capture-phase interception, and whether the button has been cloned by the batch importer.

### `window.onclick`

In `app.html`:

- disclaimer popup script assigns `window.onclick = e => { if (e.target === popup) ... }`,
- later How-To modal script assigns `window.onclick = (e) => { if (e.target === modal) ... }`, replacing the earlier assignment,
- other scripts use `window.addEventListener("click", ...)`, which does not replace `window.onclick`.

## Flashcards Global Mutable State

Defined in `flashcards/script.js`:

| Name | Purpose |
| --- | --- |
| `pao` | Current normalized flashcard map. |
| `keys` | Sorted keys for current flashcard map. |
| `currentKey` | Active flashcard key. |
| `showingAnswer` | Whether answer side is visible. |
| `window.lastData` | Last loaded JSON object. |

Global functions:

- `isPlainObject(obj)`
- `setStatus(msg, isError=false)`
- `normalizeData(data)`
- `renderEntry(key, entry)`
- `loadPAOObject(obj)`
- `nextCard()`
- `showAnswer()`
- `autoFetch()`
- `loadFromFile(file)`
- `refreshDefaults()`

## Standalone TTS Global Mutable State

Defined inline in `chess_games_tts_app/index.html`:

| Name | Purpose |
| --- | --- |
| `synth` | `window.speechSynthesis`. |
| `voices` | Available speech synthesis voices. |
| `game` | Chess.js game instance. |
| `isPaused` | Pause state flag. |

Window/event assignment:

- `speechSynthesis.onvoiceschanged = populateVoices` refreshes the standalone TTS voice list when voices become available.

Global functions used by inline handlers:

- `googleTranslateElementInit()`
- `toggleTheme()`
- `populateVoices()`
- `sanToEnglish(san)`
- `playGame()`
- `speakText(text, visualText = null)`
- `pauseGame()`
- `stopGame()`

## DOM State Added at Runtime

The main app creates or mutates these notable runtime DOM nodes:

- `#activePalaceInfo` is updated or created by user memory palace application.
- `#epicSection`, `#epicModal`, `#epicTextView`, and Epic Story controls are created by `js/epic.js`.
- `#sanTextModal` and `#openSanToTextBtn` are created by `js/san-to-text-popup.js`.
- `#feedbackBtn` and `#feedbackModal` are created by `js/feedback.js`.
- `#restoreDefaultLibrariesBtn` is created by `js/user-libraries-history.js`.
- Table toolbar controls are created in `js/cms.bundle.js` initialization logic and later relabeled/hidden by helper scripts.
