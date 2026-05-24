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
├── index.html
├── CNAME
├── Disclaimer.txt
├── LICENSE
├── README.md
├── favicon.ico
├── start_server.bat
│
├── assets/
├── css/
├── js/
│   ├── cms.bundle.js
│   ├── default-library-v5.4.js
│   ├── shortnames-action-column.js
│   ├── user-libraries-history.js
│   ├── user-library-runtime-fix.js
│   ├── download-tables.js
│   ├── epic.js
│   ├── epic-ui-init.js
│   ├── epic-tts.js
│   ├── san-to-text-popup.js
│   └── structured-data.js
│
├── json/
│   ├── libraries_v.5.3.json            # Personal / reference library
│   └── libraries_v.5.4.json            # Current core mnemonic library dataset
│
├── flashcards/
├── chess_games_tts_app/
└── user_libraries/
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

Reference / personal mnemonic library:

```text
json/libraries_v.5.3.json
```

The current application uses `libraries_v.5.4.json` as the main data source unless another version is intentionally selected by the project owner.

The default libraries are protected. They are shown in the Library System panel for viewing and orientation, but they are not edited directly from the main application.

---

## 17. Author

Created by Markellos Markides.

© 2025-2026 Markellos Markides. All rights reserved.
