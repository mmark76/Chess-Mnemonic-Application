# Chess Mnemonic Application & Epic Chess Stories Creator

A web-based chess mnemonic application created by Markellos Markides. It transforms PGN/SAN chess games into structured mnemonic material using temporal loci, spatial loci, character associations, PAO systems, verse patterns, and epic narrative storytelling.

The project is designed as an **online static web application**. It does not use a backend server or database, but it is intended to run online because it depends on external browser resources and web services such as CDN libraries, analytics, translation tools, and other online assets.

---

## 1. Purpose

The application supports the study and memorization of chess games through a layered mnemonic method. A chess move is not treated only as notation, but as a memory event connected with:

- time,
- place,
- piece/character identity,
- board square,
- PAO encoding,
- rhythm or verse,
- and narrative meaning.

The main goal is to help the user convert chess games into memorable internal stories and structured mnemonic histories.

---

## 2. Main Components

The project contains three main application areas:

1. **Main Chess Mnemonic Application**  
   The central interface for loading PGN/SAN moves, parsing chess games, and generating mnemonic tables.

2. **Flashcards Trainer**  
   A separate study environment for training memory palaces, characters, PAO systems, and other mnemonic libraries.

3. **Chess PGN TTS Player**  
   A simple text-to-speech helper for listening to chess games or generated chess text.

---

## 3. Folder Structure

```text
Chess-Mnemonic-Application-main/
├── index.html                          # Main Chess Mnemonic Application UI
├── CNAME                               # Custom domain configuration
├── Disclaimer.txt                      # Project disclaimer
├── README.md                           # Project documentation
├── favicon.ico
├── start_server.bat                    # Optional local helper for testing with a local HTTP server
│
├── assets/
│   ├── chess-and-mnemonics.png
│   └── memory_palace_image.png
│
├── css/
│   ├── styles.css                      # Main application styling
│   └── menu.css                        # Menu-specific styling
│
├── js/
│   ├── cms.bundle.js                   # Core application engine
│   ├── download-tables.js              # Export tools for tables
│   ├── epic.js                         # Active Epic Story generator
│   ├── epic-ui-init.js                 # Epic Story UI initialization/styling support
│   ├── san-to-text-popup.js            # SAN-to-text popup helper
│   ├── structured-data.js              # SEO structured data
│   └── user-libraries-history.js       # User library import/history support
│
├── json/
│   ├── libraries_v.5.1.json            # Older library version
│   ├── libraries_v.5.2.json            # Older library version
│   └── libraries_v.5.3.json            # Current core mnemonic library dataset
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

The main application supports:

- loading PGN chess games,
- entering SAN moves manually,
- parsing moves through the browser,
- generating SAN and plain-text move information,
- building association tables,
- generating PAO tables,
- producing verse/rhythm-based mnemonic material,
- creating Epic Story output,
- importing user libraries,
- and exporting generated material.

---

## 5. Core Mnemonic Layers

The application uses multiple mnemonic layers.

### 5.1 Temporal Memory

Moves are connected with temporal loci. The system can work with full-move logic and half-move display logic depending on the relevant table or story output.

In the Epic Story output, half-moves should be labelled using the fullmove number plus side:

```text
1w, 1b, 2w, 2b, 3w, 3b ...
```

This means that the fullmove number increases only after Black's move, while each half-move keeps the fullmove number and adds:

- `w` for White,
- `b` for Black.

### 5.2 Spatial Memory

Board squares are connected with spatial associations and memory scenes.

### 5.3 Character Memory

Pieces and pawns are linked with character images, identities, or symbolic agents.

### 5.4 PAO Systems

The application supports PAO-based encoding, including PAO 0–9 and PAO 00–99 material.

### 5.5 Verse and Rhythm

Some outputs use short poetic or rhythmic structures to make recall easier.

### 5.6 Epic Story

The Epic Story generator creates a continuous narrative from the chess game. It is handled by:

```text
js/epic.js
```

## 6. Libraries

The core mnemonic libraries are stored in:

```text
json/libraries_v.5.3.json
```

Two older versions are also kept:

```text
json/libraries_v.5.1.json
json/libraries_v.5.2.json
```

The current application should use `libraries_v.5.3.json` as the main data source unless another version is intentionally selected by the project owner.

---

## 7. User Libraries

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

There is no `user_custom.js` file in the current structure.

---

## 8. Flashcards Trainer

The Flashcards Trainer is located in:

```text
flashcards/index.html
```

Its logic is handled by:

```text
flashcards/script.js
```

It is used for studying and reinforcing mnemonic libraries such as:

- memory palaces,
- square associations,
- characters,
- PAO systems,
- and other structured mnemonic decks.

---

## 9. Chess PGN TTS Player

The Chess PGN TTS helper is located in:

```text
chess_games_tts_app/index.html
```

It supports listening to chess-related text or PGN-derived material through browser or external text-to-speech workflows.

---

## 10. Export Tools

The application includes table export functionality through:

```text
js/download-tables.js
```

Supported export formats include:

- CSV,
- TXT,
- JSON.

---

## 11. Online Use

This project is intended to work **online**.

Although it is a static web application and does not require a backend database, some functionality depends on online resources such as external JavaScript libraries, translation tools, analytics scripts, and other browser-accessible services.

For this reason, full offline operation is not a project requirement.

---

## 12. Local Testing

The file:

```text
start_server.bat
```

can be used as a helper for local testing on Windows. Local testing is useful during development, but the intended use of the application remains online.

---

## 13. Disclaimer

This project is a personal cognitive and educational tool. It is provided for chess study, mnemonic experimentation, and personal learning workflows.

See also:

```text
Disclaimer.txt
```

---

## 14. Author

Created by Markellos Markides.

© 2025–2026 Markellos Markides. All rights reserved.
