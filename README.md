# Chess Mnemonic Application & Epic Chess Stories Creator

A web-based chess mnemonic application created by Markellos Markides. It transforms PGN/SAN chess games into structured mnemonic material using temporal loci, spatial loci, character associations, shortnames, PAO systems, SAN-to-text output, and epic narrative storytelling.

The project is designed as an **online static web application**. It does not use a backend server or database, but it is intended to run online because it depends on external browser resources and web services such as CDN libraries, analytics, translation tools, and other online assets.

---

## 1. Purpose

The application supports the study and memorization of chess games through a layered mnemonic method. A chess move is treated as a memory event connected with:

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

## 2. Main Components

The project contains three main application areas:

1. **Main Chess Mnemonic Application**  
   The central interface for loading PGN/SAN moves, parsing chess games, and generating mnemonic tables.

2. **Flashcards Trainer**  
   A separate study environment for training memory palaces, characters, PAO systems, square associations, and other mnemonic libraries.

3. **Chess PGN TTS Player**  
   A simple text-to-speech helper for listening to chess games or generated chess text.

---

## 3. Folder Structure

```text
Chess-Mnemonic-Application-main/
├── index.html                          # Main Chess Mnemonic Application UI
├── CNAME                               # Custom domain configuration
├── Disclaimer.txt                      # Project disclaimer and guidance notes
├── LICENSE                             # All rights reserved license
├── README.md                           # Project documentation
├── favicon.ico
├── start_server.bat                    # Optional local helper for local testing
│
├── assets/
│   ├── chess-and-mnemonics.png
│   └── memory_palace_image.png
│
├── css/
│   ├── styles.css                      # Main application styling and responsive layout
│   └── menu.css                        # Menu-specific styling
│
├── js/
│   ├── cms.bundle.js                   # Core application engine
│   ├── default-library-v5.4.js         # Current default library loader override
│   ├── shortnames-action-column.js     # Shortnames and Associations action/castling overrides
│   ├── user-libraries-history.js       # Library System UX, guarded import, template ZIP guard, history support
│   ├── user-library-runtime-fix.js     # Runtime support loaded dynamically by user-libraries-history.js
│   ├── download-tables.js              # Export tools for generated tables
│   ├── epic.js                         # Active Epic Story generator
│   ├── epic-ui-init.js                 # Epic Story UI initialization/styling support
│   ├── epic-tts.js                     # Epic Story TTS support where available
│   ├── san-to-text-popup.js            # SAN-to-text popup helper
│   └── structured-data.js              # SEO structured data
│
├── json/
│   ├── libraries_v.5.1.json            # Older library version
│   ├── libraries_v.5.2.json            # Older library version
│   ├── libraries_v.5.3.json            # Older library version
│   └── libraries_v.5.4.json            # Current core mnemonic library dataset
│
├── flashcards/
│   ├── index.html                      # Flashcards Trainer UI
│   ├── script.js                       # Flashcards Trainer logic
│   └── style.css                       # Flashcards Trainer styling
│
├── chess_games_tts_app/
│   └── index.html                      # Chess PGN / text-to-speech helper
│
└── user_libraries/
    ├── user_characters_template.json
    ├── user_memory_palaces_template.json
    ├── user_pao_00_99_template.json
    └── user_squares_template.json
```

---

## 4. Main Application

The main application is loaded from:

```text
index.html
```

Its main logic is handled by:

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

Additional current table-specific, library-specific, and runtime support logic is handled by these scripts. The file `js/user-library-runtime-fix.js` is loaded dynamically by `js/user-libraries-history.js` when needed:

```text
js/shortnames-action-column.js
js/user-libraries-history.js
js/user-library-runtime-fix.js
js/san-to-text-popup.js
js/epic.js
js/epic-tts.js
```

The main application supports:

- loading PGN chess games,
- entering SAN moves manually,
- parsing moves through the browser,
- generating SAN and plain-text move information,
- building association tables,
- generating shortname tables,
- generating PAO tables,
- creating Epic Story output from default or imported custom libraries,
- creating custom library templates,
- downloading official JSON library templates as a ZIP file,
- importing custom user libraries,
- restoring default libraries without refreshing the page,
- hiding/showing table columns,
- and exporting generated material.

---

## 5. Core Mnemonic Layers

### 5.1 Temporal Memory

Moves are connected with temporal loci. The application supports two memory palace modes:

```text
Ply / half-move mode
Full-move mode
```

In **Ply / half-move mode**, every half-move receives its own temporal locus:

```text
1. d4   → locus 1
1... d5 → locus 2
2. Nf3  → locus 3
2... e6 → locus 4
```

In **Full-move mode**, both half-moves of the same full move share the same temporal locus:

```text
1. d4   → locus 1
1... d5 → locus 1
2. Nf3  → locus 2
2... e6 → locus 2
```

For cleaner visual presentation in the main move-by-move tables, when Full-move mode is active the locus is displayed only on the White row and the Black row is left blank. Internally, both half-moves still belong to the same full-move locus.

This means:

```text
Full move = one temporal scene = one locus
```

### 5.2 Spatial Memory

Board squares are connected with spatial associations and memory scenes.

### 5.3 Character Memory

Pieces and pawns are linked with character images, identities, or symbolic agents.

### 5.4 Action / Special Move Memory

The current tables separate special chess actions from the moving piece and the target square where needed.

Examples include:

- `x` for capture,
- `+` for check,
- `#` for checkmate,
- `O-O` for kingside castling,
- `O-O-O` for queenside castling.

### 5.5 PAO Systems

The application supports two PAO-based encoding outputs:

- **PAO 00–99** — the main full-move PAO encoding table.
- **PAO 0–9** — an educational and explanatory table for Piece–File–Rank encoding of single moves.

The **PAO 0–9 table** is included to explain how a single chess move can be translated into a simple three-part code:

```text
Piece → File → Rank
```

For example, a move is decomposed into:

```text
Piece identity + destination file + destination rank
```

This makes the PAO 0–9 table useful for learning, checking, and understanding the basic encoding mechanism behind the system. However, because it uses only a small 0–9 set, many mnemonic images repeat frequently. For that reason, it is not intended to be the main method for memorizing complete chess games.

For complete-game memorization, the more suitable outputs are generally:

- Temporal Loci,
- Associations,
- Shortnames,
- PAO 00–99,
- SAN-to-text output,
- and Epic Story.

### 5.6 Shortnames

The Shortnames layer provides compact mnemonic labels for pieces and target squares.

Current specific shortname behaviour includes:

- `Pb2` is displayed as `Bruce`.
- Castling uses a dedicated castling mnemonic image name in the piece shortname field.
- The Shortnames table includes a dedicated `Action` column.
- For captures, checks, and checkmates, the `Action` column can display `x`, `+`, or `#`.

### 5.7 SAN-to-Text Output

The SAN-to-text popup converts the parsed game into plain readable text. It supports Full-move and Half-move views and can optionally include loci. This output is intended for reading, copying, or listening through a TTS workflow.

### 5.8 Epic Story

The Epic Story generator creates a continuous narrative from the chess game. It is handled by:

```text
js/epic.js
```

The Epic Story combines:

- PGN header information,
- SAN-derived move text,
- temporal loci,
- piece associations,
- target square associations,
- and narrative phrasing.

The Epic Story generator supports both default libraries and imported custom user libraries.

Current Epic Story library priority:

1. **Imported custom user libraries**, when available:
   - `libs.User.MemoryPalaces` for temporal loci,
   - `libs.User.Characters` for piece and pawn character associations,
   - `libs.User.Squares` for target square associations.
2. **Default libraries**, as fallback when no matching custom user library data exists:
   - `libs.Temporal.LibraryT1`,
   - `libs.Characters.LibraryC2`,
   - `libs.Spatial.LibraryS1`.

Manual anchor chapter labels currently continue to use the default temporal anchor library unless intentionally changed by the project owner in a later version.

This means that imported custom libraries can now influence not only the generated tables, but also the Epic Story narrative itself.

---

## 6. Current Table Outputs

The current table selection order in the main dropdown is:

```text
1. SAN Table
2. Associations
3. Shortnames
4. PAO 00–99
5. PAO 0–9
```

This order follows the preferred study flow: from basic chess information to richer mnemonic outputs, with PAO 0–9 kept last as an educational helper.

### 6.1 SAN Table

The SAN table provides the basic parsed move information, including:

```text
Move # | SAN | Anchor | Mnemonic Locus | Color Turn | Piece | Target Square
```

The `Target Square` column remains visible by default in the SAN table because it is basic chess information and there is no separate target square association column in this table.

### 6.2 Associations Table

The Associations table uses the following structure:

```text
Move # | SAN | Anchor | Mnemonic Locus | Target Square | Color Turn | Piece Association | Action | Target Square Association
```

For ordinary moves, the table links the moving piece association with the destination square association.

For castling:

```text
Piece Association: dedicated castling mnemonic image name
Action: O-O or O-O-O
Target Square Association: final king square association
```

The `Target Square` column is hidden by default in this table because the user normally studies the richer `Target Square Association`. The column remains available through the checkbox controls.

### 6.3 Shortnames Table

The Shortnames table uses the following structure:

```text
Move # | SAN | Anchor | Mnemonic Locus | Target Square | Color Turn | Piece Shortname | Action | Target Square Shortname
```

For ordinary moves, the piece shortname follows the moving piece from square to square.

For captures, checks, and checkmates, the `Action` column can show:

```text
x, +, #
```

For castling, the table uses a dedicated castling mnemonic image name in the `Piece Shortname` field, while preserving the final king destination as the target square shortname.

The `Target Square` column is hidden by default in this table because the user normally studies the richer `Target Square Shortname`. The column remains available through the checkbox controls.

### 6.4 PAO 00–99 Table

The PAO 00–99 table works on full moves and combines White and Black move information into a six-digit structure.

Example logic:

```text
1. d4 d5 → one full-move PAO code
```

This is the main PAO table for full-game mnemonic encoding.

### 6.5 PAO 0–9 Table

The PAO 0–9 table converts each single move into a compact Piece–File–Rank code and displays the corresponding PAO material.

Its main uses are:

- to explain how the basic Piece–File–Rank encoding works,
- to help the user understand how a move is transformed into code,
- to provide a simple educational bridge before PAO 00–99,
- to help with checking/debugging whether the app reads piece and destination-square data correctly.

It is mainly an educational and explanatory table. It is not intended as the main full-game memorization method because the limited 0–9 PAO set creates many repeated mnemonic images.

For full-game memorization, the more suitable outputs are generally:

- Temporal Loci,
- Associations,
- Shortnames,
- PAO 00–99,
- SAN-to-text output,
- and Epic Story.

---

## 7. Libraries

The current core mnemonic library dataset is stored in:

```text
json/libraries_v.5.4.json
```

It is loaded by:

```text
js/default-library-v5.4.js
```

The loader in `js/default-library-v5.4.js` overrides the earlier `loadLibraries()` definition in `js/cms.bundle.js` and makes `libraries_v.5.4.json` the active default data source.

Older versions are also kept for reference and rollback:

```text
json/libraries_v.5.1.json
json/libraries_v.5.2.json
json/libraries_v.5.3.json
```

The current application uses `libraries_v.5.4.json` as the main data source unless another version is intentionally selected by the project owner.

The default libraries are protected. They are shown in the Library System panel for viewing and orientation, but they are not edited directly from the main application.

---

## 8. User Libraries and Library System Panel

User library templates are stored in:

```text
user_libraries/
```

Available templates include:

- `user_characters_template.json`
- `user_memory_palaces_template.json`
- `user_pao_00_99_template.json`
- `user_squares_template.json`

These files are templates for user-defined mnemonic material and can be imported through the application where supported.

To import or load a user library, the file must follow the official template structure.

The Library System panel supports:

- viewing the protected default libraries,
- downloading the official JSON templates as `CMA_Templates.zip`,
- creating custom libraries in the browser and exporting them as JSON,
- importing a custom JSON library,
- displaying the currently active library status,
- restoring the default libraries without refreshing the page.

Supported custom library types are:

- Memory Palace libraries,
- Characters libraries,
- PAO 00–99 libraries,
- Squares libraries.

Runtime support for imported user libraries is handled by `js/user-libraries-history.js`, which dynamically loads `js/user-library-runtime-fix.js` when needed:

```text
js/user-libraries-history.js
js/user-library-runtime-fix.js
```

Epic Story support for imported Memory Palace, Characters, and Squares libraries is handled directly by:

```text
js/epic.js
```

When a supported custom user library is imported, the application can use it in the relevant generated tables and, where applicable, in the Epic Story output. If a required custom value is missing, the application falls back to the protected default libraries.

### 8.1 Import and Download Stability

The Library System has been hardened against duplicate browser actions.

Current safeguards include:

- custom library import is handled through a single guarded import flow,
- the previous global `FileReader` hook has been removed to avoid duplicate JSON processing,
- the import button is protected against being wired more than once,
- the template ZIP download is guarded against duplicate handlers and rapid double-clicks,
- the template ZIP button is temporarily disabled while the ZIP file is being prepared,
- template ZIP creation uses error handling and releases its generated object URL after download.

There is no `user_custom.js` file in the current structure.

---

## 9. Flashcards Trainer

The Flashcards Trainer is located in:

```text
flashcards/index.html
```

Its logic is handled by:

```text
flashcards/script.js
```

It is used for studying and reinforcing mnemonic libraries such as memory palaces, square associations, characters, PAO systems, and other structured mnemonic decks.

---

## 10. Chess PGN TTS Player

The Chess PGN TTS helper is located in:

```text
chess_games_tts_app/index.html
```

It supports listening to chess-related text or PGN-derived material through browser or external text-to-speech workflows.

---

## 11. Export Tools

The application includes table export functionality through:

```text
js/download-tables.js
```

Current supported export formats are:

- CSV,
- JSON.

The static HTML markup may still contain older TXT dropdown options, but the current export script removes TXT options at runtime and keeps the active export flow limited to CSV and JSON.

---

## 12. Responsive Layout

The interface includes responsive layout adjustments for mobile screens, tablet portrait and landscape layouts, large tablet / small laptop screens, and desktop layouts.

The header layout has been adjusted so the main menu and the `How to create the Epic Story` button do not overlap on tablet-sized screens.

---

## 13. Online Use

This project is intended to work **online**.

Although it is a static web application and does not require a backend database, some functionality depends on online resources such as external JavaScript libraries, translation tools, analytics scripts, and other browser-accessible services.

For this reason, full offline operation is not a project requirement.

---

## 14. Local Testing

The file:

```text
start_server.bat
```

can be used as a helper for local testing on Windows. Local testing is useful during development, but the intended use of the application remains online.

---

## 15. Disclaimer

This project is a personal cognitive and educational tool. It is provided for chess study, mnemonic experimentation, and personal learning workflows.

See also:

```text
Disclaimer.txt
```

---

## 16. License

This project is publicly visible for transparency, documentation, educational reference, and project demonstration purposes only.

See:

```text
LICENSE
```

No open-source license is granted.

---

## 17. Author

Created by Markellos Markides.

© 2025-2026 Markellos Markides. All rights reserved.
