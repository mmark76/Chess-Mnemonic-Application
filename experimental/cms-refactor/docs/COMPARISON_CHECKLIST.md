# Comparison checklist: production vs experimental

Use this checklist to verify the experimental build preserves **user-facing outputs**. Run both apps from the **repository root** via HTTP (`py -m http.server 8000`).

| Build | URL |
|-------|-----|
| **Production** | `http://localhost:8000/index.html` |
| **Experimental** | `http://localhost:8000/experimental/cms-refactor/index.html` |

**Preparation**

- [ ] Clear `localStorage` for the origin (or use a private window per build) when comparing first-load defaults.  
- [ ] Use the **same PGN** in both (e.g. Demo → Morphy Opera).  
- [ ] Set production `#locusMode` to **Full move** (matches effective default after runtime-fix).  
- [ ] Note: experimental defaults to fullmove in code; Epic may still default half until `#epicLocusMode` changed.

---

## A. First load / defaults

| Check | Production | Experimental | Match? |
|-------|------------|--------------|--------|
| `#locusMode` shows Full move after load (post runtime-fix) | | | ☐ |
| Anchor / Color Turn / Action columns hidden by default (where applicable) | | | ☐ |
| PAO 0–9 educational note visible when section shown | | | ☐ |
| Default library loads (v5.4 keys in console) | | | ☐ |
| No console errors on load | | | ☐ |

---

## B. PGN parse — Morphy Opera (demo)

| Check | Production | Experimental | Match? |
|-------|------------|--------------|--------|
| Move count in SAN table | | | ☐ |
| First White row: move `1.`, locus text | | | ☐ |
| First Black row: `1...`, locus cell empty in **full** mode | | | ☐ |
| Last move row present | | | ☐ |
| PAO 00–99 row count (= fullmove pairs) | | | ☐ |
| PAO 00–99 first row SAN pair `1. e4 e5` (or actual demo line) | | | ☐ |
| PAO 00–99 Person/Action/Object strings | | | ☐ |

---

## C. Half-move mode (explicit)

Set `#locusMode` → **Ply (half move)** on both.

| Check | Production | Experimental | Match? |
|-------|------------|--------------|--------|
| Black rows show locus (not blank) | | | ☐ |
| Locus sequence differs from full mode | | | ☐ |
| PAO 00–99 row count unchanged (still pairs) | | | ☐ |

---

## D. Associations table

| Check | Production | Experimental | Match? |
|-------|------------|--------------|--------|
| Column count (9 with Action) | | | ☐ |
| Castling row: special association name | | | ☐ |
| En passant capture square handling | | | ☐ |
| Action column for `x`, `+`, `#` | | | ☐ |
| Target Square Association column | | | ☐ |

---

## E. Shortnames table

| Check | Production | Experimental | Match? |
|-------|------------|--------------|--------|
| Castling shortname `Peter` | | | ☐ |
| `Pb2` → `Bruce` if applicable in position | | | ☐ |
| Action column matches production | | | ☐ |
| Square shortnames match | | | ☐ |

---

## F. Manual anchors

| Check | Production | Experimental | Match? |
|-------|------------|--------------|--------|
| Click row toggles ⚓ in all tables | | | ☐ |
| Anchor persists after `renderAll` | | | ☐ |

---

## G. SAN → Text modal

| Check | Production | Experimental | Match? |
|-------|------------|--------------|--------|
| Opens when PGN parsed | | | ☐ |
| Default Full-move layout | | | ☐ |
| Half-move toggle output | | | ☐ |
| Copy to clipboard text | | | ☐ |

---

## H. Epic Story

| Check | Production | Experimental | Match? |
|-------|------------|--------------|--------|
| Story generates for demo game | | | ☐ |
| Full-move loci mode narrative | | | ☐ |
| Half-move loci mode narrative | | | ☐ |
| Copy text matches | | | ☐ |

---

## I. Table export (download)

| Check | Production | Experimental | Match? |
|-------|------------|--------------|--------|
| SAN CSV row count | | | ☐ |
| Associations CSV column headers | | | ☐ |
| JSON export parseable | | | ☐ |

---

## J. User libraries

| Check | Production | Experimental | Match? |
|-------|------------|--------------|--------|
| Download Templates ZIP (4 files) | | | ☐ |
| Import sample from `user_libraries/` | | | ☐ |
| User square overrides association target text | | | ☐ |
| User PAO 00–99 overrides PAO table | | | ☐ |
| Restore defaults (F5) | | | ☐ |

---

## K. Known intentional differences

| Item | Notes |
|------|--------|
| Experimental banner | Visible only on experimental URL |
| Analytics | Production loads gtag/Plausible; experimental does not |
| `robots` / JSON-LD | Experimental marked noindex |
| `locusMode` init | Production bundle `half` until runtime-fix; experimental `full` in source |
| Epic default loci | Both may still default **half** in Epic modal until user changes |
| URL-relative imports | Batch-import from `../../js/` may resolve paths differently; note failures in section J |

---

## L. Sign-off

| Role | Name | Date | Pass? |
|------|------|------|-------|
| Tester | | | ☐ |
| Product owner | | | ☐ |

**Pass criteria:** All sections A–J marked Match for at least one standard demo PGN and one user-import scenario; section K reviewed and accepted.

**Do not merge to `main` or deploy** until sign-off is complete.
