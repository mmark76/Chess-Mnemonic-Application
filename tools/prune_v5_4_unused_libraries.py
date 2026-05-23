#!/usr/bin/env python3
"""
Prune unused libraries from json/libraries_v.5.4.json.

This script is intentionally conservative. It removes only libraries that are
not referenced by the current app/flashcards code paths:

Removed from v5.4:
- Characters.LibraryC1
- PAO 00-99.LibraryP2
- PAO 00-99.LibraryP3
- PAO 00-99.LibraryP4
- PAO 00-99.LibraryP5
- Foundations.LibraryF1

Kept because the app uses them:
- Temporal.LibraryT1
- Temporal.LibraryT2
- Spatial.LibraryS1
- Spatial.LibraryS2
- Characters.LibraryC2
- Characters.LibraryC3
- PAO 0-9.Library_p1
- PAO 00-99.LibraryP1
- Verses.LibraryV1
- Shortnames.CharactersSN1
- Shortnames.SquaresSN1
- Shortnames.Shortnames00_99List
- Shortnames.ShortnamesTemporal

This script does not modify json/libraries_v.5.3.json.

Run from repository root:
    python tools/prune_v5_4_unused_libraries.py
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
LIBRARY_PATH = ROOT / "json" / "libraries_v.5.4.json"
BACKUP_PATH = ROOT / "json" / "libraries_v.5.4.before_prune_unused.json"

REMOVALS = [
    ("Characters", "LibraryC1"),
    ("PAO 00-99", "LibraryP2"),
    ("PAO 00-99", "LibraryP3"),
    ("PAO 00-99", "LibraryP4"),
    ("PAO 00-99", "LibraryP5"),
    ("Foundations", "LibraryF1"),
]

REQUIRED_PATHS = [
    ("Temporal", "LibraryT1"),
    ("Temporal", "LibraryT2"),
    ("Spatial", "LibraryS1"),
    ("Spatial", "LibraryS2"),
    ("Characters", "LibraryC2"),
    ("Characters", "LibraryC3"),
    ("PAO 0-9", "Library_p1"),
    ("PAO 00-99", "LibraryP1"),
    ("Verses", "LibraryV1"),
    ("Shortnames", "CharactersSN1"),
    ("Shortnames", "SquaresSN1"),
    ("Shortnames", "Shortnames00_99List"),
    ("Shortnames", "ShortnamesTemporal"),
]


def ensure_required_paths(data: dict[str, Any]) -> None:
    missing: list[str] = []
    for parent, child in REQUIRED_PATHS:
        if parent not in data or not isinstance(data[parent], dict) or child not in data[parent]:
            missing.append(f"{parent}.{child}")
    if missing:
        joined = ", ".join(missing)
        raise KeyError(f"Required app libraries are missing before prune: {joined}")


def prune_empty_top_level_sections(data: dict[str, Any]) -> None:
    empty_sections = [key for key, value in data.items() if isinstance(value, dict) and not value]
    for key in empty_sections:
        del data[key]


def main() -> None:
    if not LIBRARY_PATH.exists():
        raise FileNotFoundError(f"Could not find {LIBRARY_PATH}")

    raw = LIBRARY_PATH.read_text(encoding="utf-8")
    data = json.loads(raw)

    ensure_required_paths(data)

    removed: list[str] = []
    already_missing: list[str] = []

    for parent, child in REMOVALS:
        section = data.get(parent)
        if isinstance(section, dict) and child in section:
            del section[child]
            removed.append(f"{parent}.{child}")
        else:
            already_missing.append(f"{parent}.{child}")

    prune_empty_top_level_sections(data)
    ensure_required_paths(data)

    serialized = json.dumps(data, ensure_ascii=False, indent=2)
    json.loads(serialized)

    if not BACKUP_PATH.exists():
        BACKUP_PATH.write_text(raw, encoding="utf-8")
        print(f"Backup created: {BACKUP_PATH.relative_to(ROOT)}")
    else:
        print(f"Backup already exists: {BACKUP_PATH.relative_to(ROOT)}")

    LIBRARY_PATH.write_text(serialized + "\n", encoding="utf-8")

    print(f"Updated: {LIBRARY_PATH.relative_to(ROOT)}")
    print("Removed libraries:")
    for item in removed:
        print(f"- {item}")

    if already_missing:
        print("Already missing:")
        for item in already_missing:
            print(f"- {item}")

    print("v5.3 was not modified.")


if __name__ == "__main__":
    main()
