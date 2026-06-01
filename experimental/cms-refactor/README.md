# Experimental CMS refactor

**Branch:** `experimental/cms-refactor`  
**Status:** Local / review only — **not deployed** to GitHub Pages or production.

This folder contains a modular rewrite of the main Chess Mnemonic Application (`index.html` + `js/cms.bundle.js` + runtime patches). Production files at the repository root are **unchanged**.

## Goals

- Split the monolithic bundle into ordered core modules and explicit extensions.
- Make **fullmove** the default move concept in code (`locusMode = 'full'`), matching product documentation.
- Replace ad-hoc `renderAll` monkey-patch chains with a **deterministic render pipeline** (`CMA_RENDER_PIPELINE`).
- Document all production runtime overrides and fragile dependencies **before** logic changes.
- Provide a **comparison checklist** to verify user-facing outputs match production.

## How to run locally

From the **repository root** (required so `json/`, `css/`, and `assets/` resolve):

```bat
py -m http.server 8000
```

Open:

```text
http://localhost:8000/experimental/cms-refactor/index.html
```

Do **not** open the file via `file://` — `fetch()` for libraries and templates needs HTTP.

## Layout

| Path | Role |
|------|------|
| `index.html` | Experimental entry (banner, no production analytics) |
| `src/core/` | State, PGN, loci, renderers, pipeline, bootstrap |
| `src/user-library-modals.js` | User library modals (extracted from bundle) |
| `src/pgn-wire.js` | PGN wiring and demo games |
| `src/extensions/` | Table enhancements + user-library runtime |
| `js/adapters/` | History + structured-data path adapters |
| `docs/` | Override inventory + comparison checklist |

Shared assets: `../../css/`, `../../json/`, `../../assets/`, `../../user_libraries/`, and selected `../../js/` satellites (Epic, SAN→Text, exports).

## What stayed on production scripts

These are reused unchanged from `js/` to limit scope; behavior should match production when paths are correct:

- `epic.js`, `epic-ui-init.js`, `epic-tts.js`
- `san-to-text-popup.js`
- `download-tables.js`
- `user-library-batch-import.js`, `user-library-ui-labels.js`, `feedback.js`

## Next steps (manual)

1. Walk through `docs/COMPARISON_CHECKLIST.md` with the same PGN on production vs experimental.
2. Record any diffs; fix in this branch only.
3. Merge to `main` only after explicit product sign-off — **do not deploy** from this branch without a separate release process.
