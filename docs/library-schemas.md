# Library Schemas Baseline

This document records the library data structures currently present and currently detected by application code. It is descriptive only.

## Default Library Files

### `json/libraries_v.5.4.json`

Effective default for the main app and flashcards trainer.

Top-level keys:

- `Temporal`
- `Spatial`
- `Characters`
- `PAO 0-9`
- `PAO 00-99`
- `Shortnames`

Observed structure:

| Path | Shape |
| --- | --- |
| `Temporal.LibraryT1` | Object with 80 string-number keys, `1` through `80`; each entry is an object with `el` and `en`. |
| `Temporal.LibraryT2` | Object with 9 string-number keys, `1` through `9`; each entry is an object with `el` and `en`. |
| `Spatial.LibraryS1` | Object with 64 square keys such as `a1` through `h8`; each entry has `Target Square Association`, `text`, `el`, and `en`. |
| `Spatial.LibraryS2` | Object with 64 square keys such as `a1` through `h8`; each entry has `Target Square Association`, `text`, `el`, and `en`. |
| `Characters.LibraryC2` | Object with 32 piece-square keys such as `Pa2`, `Nb1`, `Ke1`. |
| `Characters.LibraryC3` | Object with 32 description keys such as `Pa2_name`, `Nb1_name`, `Ke1_name`. |
| `PAO 0-9.Library_p1` | Object with `persons`, `actions`, and `objects`. |
| `PAO 00-99.LibraryP1` | Object with 100 two-digit keys, `00` through `99`; each entry has `person`, `action`, `object`, `person_el`, `action_el`, and `object_el`. |
| `Shortnames.CharactersSN1` | Object with 32 piece-square keys. |
| `Shortnames.SquaresSN1` | Object with 64 square keys. |
| `Shortnames.Shortnames00_99List` | Object with 100 two-digit keys, `00` through `99`. |
| `Shortnames.ShortnamesTemporal` | Object with 80 string-number keys, `1` through `80`. |

Runtime readers:

- `t1Label(idx)` reads `Temporal.LibraryT1[String(idx)]`.
- `t2Label(idx)` reads `Temporal.LibraryT2[String(idx)]`.
- `s1Square(square)` reads `Spatial.LibraryS1[square]`.
- `p1PAO(d)` reads `PAO 0-9.Library_p1.persons/actions/objects`.
- `p2p3Get(idx2, collection)` reads `PAO 00-99[collection][idx2]`.
- `sn1Shortname(code)` reads `Shortnames.Shortnames00_99List`.
- `characterShortnameBySquare(square, pieceLetter)` reads `Shortnames.CharactersSN1`.
- `squareShortname(square)` reads `Shortnames.SquaresSN1`.

Entry-level examples from `json/libraries_v.5.4.json`:

```json
{
  "Temporal.LibraryT1.1": {
    "el": "...",
    "en": "..."
  },
  "Spatial.LibraryS1.a1": {
    "Target Square Association": "...",
    "text": "...",
    "el": "...",
    "en": "..."
  },
  "PAO 00-99.LibraryP1.00": {
    "person": "...",
    "action": "...",
    "object": "...",
    "person_el": "...",
    "action_el": "...",
    "object_el": "..."
  }
}
```

### `json/libraries_v.5.3.json`

Previous/reference dataset still present. It is the dataset requested by the original `loadLibraries()` in `js/cms.bundle.js`, but the main app overrides that loader before use.

Top-level keys:

- `Temporal`
- `Spatial`
- `Characters`
- `PAO 0-9`
- `PAO 00-99`
- `Verses`
- `Foundations`
- `Shortnames`

Differences from v5.4 observed during inspection:

- includes `Characters.LibraryC1`,
- includes `PAO 00-99.LibraryP1` through `LibraryP5`,
- includes `Verses.LibraryV1`,
- includes `Foundations.LibraryF1`,
- v5.4 has a pruned shape with only the currently effective libraries.

## User JSON Templates

### `user_libraries/user_memory_palaces_template.json`

Shape:

```json
{
  "palaces": [
    {
      "name": "",
      "description": "",
      "locations": [
        {
          "id": "L1",
          "label": "",
          "image": "",
          "notes": ""
        }
      ]
    }
  ]
}
```

Detection:

- `js/cms.bundle.js`: `json.palaces && Array.isArray(json.palaces)`.
- `js/user-libraries-history.js`: `Array.isArray(json.palaces)`.
- `js/user-library-batch-import.js`: `Array.isArray(json.palaces)`.
- `flashcards/script.js`: `Array.isArray(data.palaces)`.

Runtime application:

- stored as `libs.User.MemoryPalaces`,
- first palace locations may be applied to table locus columns through `window.applyUserPalaceToTables`.

### `user_libraries/user_characters_template.json`

Shape:

```json
{
  "white": {
    "pawn": { "a2": { "name": "", "notes": "" } },
    "knight": {},
    "bishop": {},
    "rook": {},
    "queen": {},
    "king": {}
  },
  "black": {
    "pawn": {},
    "knight": {},
    "bishop": {},
    "rook": {},
    "queen": {},
    "king": {}
  }
}
```

Detection:

- `js/cms.bundle.js`: `json.white && json.black`.
- `js/user-libraries-history.js`: `json.white && json.black`.
- `js/user-library-batch-import.js`: `json.white && json.black`.
- `flashcards/script.js`: `isPlainObject(data.white || null)` and then iterates `white`/`black`.

Runtime application:

- stored as `libs.User.Characters`,
- read by Associations and Epic Story code for piece names.

### `user_libraries/user_squares_template.json`

Shape:

```json
{
  "a1": {
    "keyword": "",
    "image": "",
    "notes": ""
  }
}
```

There are 64 square keys, `a1` through `h8`.

Detection:

- `js/cms.bundle.js`: `json.a1 || json.a2`.
- `js/user-libraries-history.js`: `json.a1 || json.a2`.
- `js/user-library-batch-import.js`: `json.a1 || json.a2`.
- `flashcards/script.js`: generic flat-map fallback for object values.

Runtime application:

- stored as `libs.User.Squares`,
- `js/user-library-runtime-fix.js` reads `keyword`, `name`, `label`, or `notes`,
- Epic Story reads localized node values from square entries.

### `user_libraries/user_pao_00_99_template.json`

Shape:

```json
{
  "00": {
    "person": "",
    "action": "",
    "object": ""
  }
}
```

There are 100 two-digit keys, `00` through `99`.

Detection:

- `js/cms.bundle.js`: `json["00"] || json["01"]`.
- `js/user-libraries-history.js`: `json["00"] || json["01"]`.
- `js/user-library-batch-import.js`: `json["00"] || json["01"]`.
- `flashcards/script.js`: generic flat-map fallback.

Runtime application:

- stored as `libs.User.PAO_00_99`,
- `js/user-library-runtime-fix.js` patches `p2p3Get()` to prefer user PAO values.

### `user_libraries/user_shortnames_template.json`

Shape:

```json
{
  "type": "Shortnames",
  "description": "",
  "CharactersSN1": {},
  "SquaresSN1": {},
  "CastlingSN1": {
    "O-O": "",
    "O-O-O": ""
  },
  "Actions": {}
}
```

Detection:

- `js/user-library-batch-import.js` only. `shortnamesFrom(json)` accepts:
  - `json.User.Shortnames`,
  - `json.Shortnames`,
  - an object with any of `CharactersSN1`, `SquaresSN1`, `CastlingSN1`, or `Actions`.

Runtime application:

- stored as `libs.User.Shortnames`,
- batch importer patches `characterShortnameBySquare`, `squareShortname`, and `castlingShortnameName` to read it.

Important gap:

- The original JSON-only flows in `js/cms.bundle.js` and `js/user-libraries-history.js` do not detect standalone shortnames JSON.

### `user_libraries/libraries_user_template.json`

Shape:

```json
{
  "_template": "libraries_user_template",
  "_description": "",
  "User": {
    "MemoryPalaces": {},
    "Characters": {},
    "Squares": {},
    "Shortnames": {},
    "PAO_00_99": {}
  }
}
```

Detection:

- `js/user-library-batch-import.js`: if `json.User` is an object, detects as `Combined`.

Runtime application:

- `applyJson()` applies supported nested user sections:
  - `User.MemoryPalaces`,
  - `User.Characters`,
  - `User.Squares`,
  - `User.Shortnames`,
  - `User.PAO_00_99`.

Important gap:

- `js/user-libraries-history.js` detects a complete default-style library bundle, but not this `User` combined template.
- `js/cms.bundle.js` does not detect this combined template.

## CSV Templates

CSV and Excel import are supported by `js/user-library-batch-import.js`, not by the original JSON-only import flow.

### `user_libraries/csv_template_pao_00_99.csv`

Headers:

```csv
code,person,action,object
```

Detection:

- requires all normalized headers `code`, `person`, `action`, `object`.
- outputs PAO 00-99 JSON with two-digit keys and `{ person, action, object }` entries.

### `user_libraries/csv_template_squares.csv`

Headers:

```csv
square,keyword,image,notes
```

Detection:

- requires `square` and `keyword`.
- accepts square values matching `/^[a-h][1-8]$/`.
- outputs square JSON with `{ keyword, image, notes }` entries.

### `user_libraries/csv_template_characters.csv`

Headers:

```csv
color,piece,square,name,notes
```

Detection:

- requires `color`, `piece`, `square`, `name`.
- outputs `{ white: {}, black: {} }` with nested piece and square maps.

### `user_libraries/csv_template_memory_palaces.csv`

Headers:

```csv
palace_name,palace_description,id,label,image,notes
```

Detection:

- accepts either `id,label` or `locus,label`.
- uses `palace_name` or `palace` or the file name for palace name.
- uses `palace_description` or `description`.
- outputs `{ palaces: [{ name, description, locations }] }`.

### `user_libraries/csv_template_shortnames.csv`

Headers:

```csv
type,key,shortname
```

Detection:

- requires `type`, `key`, `shortname`.
- outputs:
  - `CharactersSN1` for `type` of `character` or `piece`,
  - `SquaresSN1` for `type` of `square`,
  - `CastlingSN1` for `type` of `castling`,
  - `Actions` for `type` of `action`.

## Excel Import Shape

`js/user-library-batch-import.js` accepts `.xlsx` and `.xls`. It:

- dynamically loads SheetJS from `https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js` if needed,
- reads the first worksheet only,
- converts it to row arrays,
- passes those rows through the same header-detection logic used for CSV.

## Complete Library Bundle Detection

`js/user-libraries-history.js` defines `isCompleteLibraryBundle(json)` as an object with:

- `Temporal`,
- `Spatial`,
- `Characters`,
- and either `PAO 0-9` or `PAO 00-99`.

When detected in `applyImportedLibrary()`, it replaces `libs` entirely with the imported JSON and tries to sync `window.libs = libs`.

This detection overlaps with default library datasets such as `json/libraries_v.5.4.json`.

## Duplicate Import Flows

### Flow 1: Original JSON-only import in `js/cms.bundle.js`

`wireImportLibraryButton()`:

- creates an `<input type="file">`,
- accepts `.json`,
- parses one selected file,
- detects:
  - memory palace via `json.palaces`,
  - characters via `json.white && json.black`,
  - PAO 00-99 via `json["00"] || json["01"]`,
  - squares via `json.a1 || json.a2`,
- does not detect shortnames,
- does not detect combined `User` templates,
- does not detect complete default-style bundles.

### Flow 2: History/import-guard flow in `js/user-libraries-history.js`

This flow:

- replaces `window.wireImportLibraryButton`,
- installs a capture-phase click guard on `#importLibraryBtn`,
- accepts `.json`,
- supports multiple JSON files,
- detects:
  - `CompleteLibrary`,
  - `MemoryPalace`,
  - `Characters`,
  - `PAO_00_99`,
  - `Squares`,
- saves detected libraries to `localStorage.savedLibraries`,
- sets `localStorage.activeLibrary`,
- does not detect standalone shortnames,
- does not detect combined `User` templates.

### Flow 3: Batch import flow in `js/user-library-batch-import.js`

This flow:

- is loaded dynamically by `js/structured-data.js`,
- accepts JSON, CSV, XLSX, and XLS,
- replaces the import button node with a clone,
- detects:
  - `Combined` via `json.User`,
  - `Memory Palace`,
  - `Characters`,
  - `Squares`,
  - `PAO 00-99`,
  - `Shortnames`,
- does not save imported files to `localStorage.savedLibraries`,
- applies user libraries directly into `libs.User`.

## Incompatible or Overlapping Schema Detection

- `json.a1 || json.a2` detects square libraries broadly; any object with `a1` or `a2` keys can be treated as a squares map.
- `json["00"] || json["01"]` detects PAO 00-99 broadly; any object with those keys can be treated as a PAO map.
- `json.white && json.black` detects character libraries broadly without validating piece or square depth.
- Standalone shortnames are only supported by the batch importer, not by the original or history import flows.
- Combined `User` templates are only supported by the batch importer.
- Complete default-style bundles are only supported by `js/user-libraries-history.js`; they replace `libs` entirely.
- CSV/XLSX schema detection depends on headers and first worksheet only.
- The flashcards trainer has its own normalization rules and accepts generic flat maps, which overlap with squares and PAO template structures.

## Uncertainties

- Which import flow is intended to be canonical is not clear.
- Whether complete default-style bundles should be user-importable alongside combined `User` bundles needs owner confirmation.
- Whether standalone shortnames should be supported by all JSON import paths needs owner confirmation.
- Whether CSV/XLSX import should persist to user-library history is not clear from current implementation.
- Whether broad key-based detection should remain compatible behavior or be narrowed later requires owner approval because it may affect existing user files.
