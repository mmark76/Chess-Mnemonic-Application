# Runtime overrides and fragile dependencies (production baseline)

**Captured:** 2026-06-01, branch `main` (pre-refactor inventory).  
**Purpose:** Document every mechanism that changes behavior at runtime before the experimental modular refactor. Production entry: `/index.html`.

---

## 1. Move semantics (fullmove vs ply)

| Source | Behavior |
|--------|----------|
| `README.md` §8, `ARCHITECTURE.md` §8.2 | A **move** means **fullmove** (White + Black) unless stated otherwise. |
| `js/cms.bundle.js` line 10 | `let locusMode = 'half'` at init. |
| `js/user-library-runtime-fix.js` | Forces `locusMode = 'full'`, syncs `#locusMode`, clears Black-row locus cells when move label contains `...`. Loaded **dynamically** by `user-libraries-history.js`. |
| `#locusMode` (`index.html`) | User can switch half ↔ full; triggers `renderAll()`. |
| `js/epic.js` | `epicLocusMode` from `localStorage` or `window.locusMode` or default **`"half"`**. |
| `js/san-to-text-popup.js` | Default `sanMode = "full"`; user can toggle Half-move in modal. |
| PAO 00–99 (`fillPaoTable_00_99`) | Iterates `i += 2`; column shows `'Full move'`; odd trailing ply has **no row**. |

**Product conflict:** Docs + runtime-fix say fullmove; bundle init + Epic default say half unless user/storage overrides.

**Experimental change:** `locusMode = 'full'` in `src/core/01-state.js` and pipeline hook (no `__cmaDefaultFullMoveApplied` flag). Intended to match **effective production UI** after runtime-fix, not raw bundle init.

---

## 2. Environment and CLI

| Mechanism | Effect |
|-----------|--------|
| *(none in JS)* | No `process.env`, no server config. |
| `start_server.bat` | Local `py -m http.server 8000` only; not read by app. |

---

## 3. Browser persistence

| Key | Values | Writers / readers |
|-----|--------|-------------------|
| `activeLibrary` | `{ type, path }` | `cms.bundle.js`, `user-libraries-history.js` |
| `savedLibraries` | Import history array | Same |
| `epicLocusMode` | `"half"` \| `"full"` | `epic.js` |
| `theme` | `"dark"` \| light | `chess_games_tts_app/index.html` only |

---

## 4. In-memory globals

| Symbol | Initial | Mutators |
|--------|---------|----------|
| `libs` | `null` → JSON | `loadLibraries`, imports, user dropdown |
| `gameMoves` | `[]` | PGN parse, demo games, clear |
| `locusMode` / `window.locusMode` | `'half'` → patched `'full'` | UI, runtime-fix |
| `selectedLang` | `'en'` | `#langSelect` **if present** (missing in current `index.html` → stuck `en`) |
| `manualAnchors` | `{}` | Row clicks |
| `libs.User` | — | JSON/CSV/XLSX import |
| `window.CMAUserLibraryFix` | — | `user-library-runtime-fix.js` |
| `window.CMAUserLibrariesHistory` | — | `user-libraries-history.js` |
| `window.CMAUserLibraryBatchImport` | — | `user-library-batch-import.js` |

---

## 5. Script load order (production `index.html`)

1. CDN: jQuery, chess.js, PapaParse, FileSaver, JSZip  
2. `cms.bundle.js`  
3. `default-library-v5.4.js` → **replaces** `loadLibraries` (v5.4 fetch)  
4. `shortnames-action-column.js` → **replaces** `fillAssociationsTable`, `fillShortnamesTable`  
5. `user-libraries-history.js` → **injects** `user-library-runtime-fix.js`  
6. Deferred: `epic-ui-init.js`, `epic.js`, `epic-tts.js`  
7. `san-to-text-popup.js` → **wraps** `renderAll` (after load; order vs runtime-fix **non-deterministic**)  
8. `download-tables.js`  
9. `structured-data.js` → injects batch-import, UI labels, feedback  

---

## 6. Function replacement chain

| Function | Defined in | Overridden by |
|----------|------------|---------------|
| `loadLibraries` | bundle (v5.3 fetch) | `default-library-v5.4.js` |
| `fillAssociationsTable` | bundle | `shortnames-action-column.js` → `user-library-runtime-fix.js` |
| `fillShortnamesTable` | bundle | `shortnames-action-column.js` |
| `p2p3Get`, `squareShortname` | bundle | `user-library-runtime-fix.js` |
| `renderAll` | bundle | `user-library-runtime-fix.js`, then `san-to-text-popup.js` |
| `updateUserLibraryStatus` | bundle | runtime-fix, history wrapper |
| Shortname helpers | bundle | `user-library-batch-import.js` (conditional) |

---

## 7. UI controls (runtime behavior)

| Control | Effect |
|---------|--------|
| `#locusMode` | Half vs full loci in SAN/Assoc/PAO/Shortnames |
| `#tableSelect` | Visible table section |
| `#pao99CollectionSelect` | PAO 00–99 collection key |
| `#librarySelect` | Default library overview (read-only browse) |
| `#pgnText`, Parse/Clear, file, Demo Games | `gameMoves`, `renderAll()` |
| Row click | `manualAnchors` |
| Table toolbar checkboxes | Column visibility; runtime-fix defaults several **hidden** |
| Epic `#epicLocusMode` | Epic chronology |
| SAN modal Full/Half, Loci | Text output shape |

---

## 8. Dynamically loaded scripts

| Injector | Script | Cache-bust |
|----------|--------|------------|
| `user-libraries-history.js` | `user-library-runtime-fix.js` | — |
| `structured-data.js` | `user-library-batch-import.js` | `?v=20260518-4` |
| `structured-data.js` | `user-library-ui-labels.js` | `?v=20260518-2` |
| `structured-data.js` | `feedback.js` | `?v=20260527-1` |
| `user-library-batch-import.js` | SheetJS CDN | on demand |

**Orphan:** `js/table-header-fixes.js` is never referenced in `index.html`.

---

## 9. Data paths (runtime fetch)

| Path | Role |
|------|------|
| `json/libraries_v.5.4.json` | Active defaults (via override) |
| `json/libraries_v.5.3.json` | Dead code in bundle `loadLibraries` |
| `user_libraries/*` | Templates, imports |
| `Disclaimer.txt` | Disclaimer popup |

Paths are **relative to site root**; hosting under a subpath breaks fetches unless adjusted.

---

## 10. External services

- CDNs: jQuery, chess.js, PapaParse, FileSaver, JSZip, optional XLSX  
- Google Analytics `G-3PNNG17EF8`, Plausible `stats.chessmnemonics.net`  
- Google Translate widget  
- `mailto:` feedback  
- Hardcoded outbound links (Lichess, blogs)

---

## 11. Fragile dependencies (refactor risks)

### 11.1 Global namespace and patching

- No modules; all logic shares global functions and `let` bindings.  
- **`renderAll` wrapper order** depends on whether runtime-fix or SAN→Text registers last on `DOMContentLoaded`.  
- **`fillAssociationsTable`**: three layers; cell indices **4** and **8** assumed in runtime-fix.

### 11.2 DOM coupling

- Fixed IDs: `sanBody`, `assocBody`, `paoBody`, `pao99Body`, `shortnamesBody`, `pgnText`, `locusMode`, sections for export.  
- `applyFullMoveLocusDisplay` uses **column index 3** for locus.  
- `setTimeout(250)` / `750` for column hide retries (slow render races).

### 11.3 Magic numbers and chess rules

- **80** temporal loci (`locusForMove`, Epic).  
- PAO 00–99: `i += 2`, drops incomplete final pair.  
- `pao99CollectionSelect` fallback `'LibraryDefaultP1'` vs HTML/JSON `LibraryP1`.

### 11.4 Duplicate flows

- Template ZIP: `cms.bundle.js` and `user-libraries-history.js` (history adds busy guard).  
- Import: bundle modals + history + batch-import overlap on `libs.User`.

### 11.5 Mnemonic special cases (`shortnames-action-column.js`)

- Castling: `Peter` / Spider-man char sequence / association name.  
- `Pb2` → `Bruce`.  
- Action column derived from SAN symbols.

### 11.6 Parallel library versions

- v5.3 embedded in bundle; v5.4 only via override file.

### 11.7 Offline tools (not runtime)

- `tools/apply_v5_4_character_update.py`, `tools/prune_v5_4_unused_libraries.py` mutate JSON backups.

---

## 12. User-facing outputs to preserve

| Category | Examples |
|----------|----------|
| On-screen tables | SAN, Associations, Shortnames, PAO 0–9, PAO 00–99 |
| Modals | Disclaimer, Epic Story, Memory Palace, SAN→Text, library modals |
| Clipboard | Epic copy, SAN→Text copy |
| Downloads | `{section}.csv/json`, `CMA_Templates.zip`, user template JSON exports |
| Speech | Epic TTS, TTS app (separate entry) |
| Alerts / status | `alert()`, `#userLibraryStatus` |

---

## 13. Experimental refactor mitigations

| Production fragility | Experimental approach |
|---------------------|------------------------|
| `renderAll` patch race | `CMA_RENDER_PIPELINE.register()` with ordered before/after |
| `locusMode` half init + runtime full patch | `locusMode = 'full'` in `01-state.js` |
| `loadLibraries` override file | v5.4 fetch in `10-libraries-loader.js` |
| Dynamic runtime-fix inject | Synchronous `user-library-runtime.js` + adapter no-op inject |
| Monolithic bundle | `src/core/*` + `src/extensions/*` + extracted modals |

Satellite scripts (`epic.js`, `san-to-text-popup.js`, batch-import) still use globals; experimental reuses them intentionally until a later phase.
