#!/usr/bin/env python3
"""
Apply the public-safe v5.4 character library update.

This script updates only:
- json/libraries_v.5.4.json

It does not modify:
- json/libraries_v.5.3.json

Run from the repository root:
    python tools/apply_v5_4_character_update.py
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
LIBRARY_PATH = ROOT / "json" / "libraries_v.5.4.json"
BACKUP_PATH = ROOT / "json" / "libraries_v.5.4.before_character_update.json"


def require_path(data: dict[str, Any], *keys: str) -> dict[str, Any]:
    current: Any = data
    for key in keys:
        if not isinstance(current, dict) or key not in current:
            raise KeyError(f"Missing JSON path: {'.'.join(keys)}")
        current = current[key]
    if not isinstance(current, dict):
        raise TypeError(f"JSON path is not an object: {'.'.join(keys)}")
    return current


def main() -> None:
    if not LIBRARY_PATH.exists():
        raise FileNotFoundError(f"Could not find {LIBRARY_PATH}")

    raw = LIBRARY_PATH.read_text(encoding="utf-8")
    data = json.loads(raw)

    characters_c2 = require_path(data, "Characters", "LibraryC2")
    characters_c3 = require_path(data, "Characters", "LibraryC3")
    pao = require_path(data, "PAO 00-99", "LibraryP1")
    shortnames_chars = require_path(data, "Shortnames", "CharactersSN1")
    shortnames_00_99 = require_path(data, "Shortnames", "Shortnames00_99List")

    # Full character names.
    characters_c2.update({
        "Bc1": "Aldor the White Wizard",
        "Qd1": "Elara the Radiant Queen",
        "Ke1": "Ravon the White Lord",
        "Ra8": "Kairo the Devastating Kaiju",
        "Nb8": "Nara the Shadow Widow",
        "Qd8": "Morria the Screaming Spirit",
        "Ke8": "Vorath the Dark Lord",
        "Bf8": "Veyron the Savage Symbiote",
        "Ng8": "Selira the Shadow Cat",
        "Rh8": "Gromak the Brutal Orc",
    })

    # Character narrative descriptions.
    characters_c3.update({
        "Bc1_name": "Aldor the White Wizard holds a glowing spellbook of power.",
        "Qd1_name": "Elara the Radiant Queen stands bathed in pure light.",
        "Ke1_name": "Ravon the White Lord grips his sword, ready for battle.",
        "Ra8_name": "Kairo the Devastating Kaiju beats his chest in fury.",
        "Nb8_name": "Nara the Shadow Widow stands with a spider ready to strike.",
        "Qd8_name": "Morria the Screaming Spirit screams while clutching a skull.",
        "Ke8_name": "Vorath the Dark Lord holds a dark ring with ominous power.",
        "Bf8_name": "Veyron the Savage Symbiote snarls with monstrous aggression.",
        "Ng8_name": "Selira the Shadow Cat moves silently in the darkness.",
        "Rh8_name": "Gromak the Brutal Orc grips his axe, ready for battle.",
    })

    # PAO 00-99 entries tied to the non-pawn chess characters.
    pao.update({
        "19": {
            "person": "Kairo the Devastating Kaiju",
            "action": "beats",
            "object": "his chest in fury",
            "person_el": "Κάιρο το Καταστροφικό Kaiju",
            "action_el": "χτυπά",
            "object_el": "το στήθος του με οργή",
        },
        "29": {
            "person": "Nara the Shadow Widow",
            "action": "stands",
            "object": "with a spider ready to strike",
            "person_el": "Νάρα η Σκιώδης Χήρα",
            "action_el": "στέκεται",
            "object_el": "με μια αράχνη έτοιμη να χτυπήσει",
        },
        "30": {
            "person": "Aldor the White Wizard",
            "action": "holds",
            "object": "a glowing spellbook of power",
            "person_el": "Άλντορ ο Λευκός Μάγος",
            "action_el": "κρατά",
            "object_el": "ένα λαμπερό βιβλίο ξορκιών δύναμης",
        },
        "40": {
            "person": "Elara the Radiant Queen",
            "action": "stands",
            "object": "bathed in pure light",
            "person_el": "Ελάρα η Λαμπερή Βασίλισσα",
            "action_el": "στέκεται",
            "object_el": "λουσμένη σε καθαρό φως",
        },
        "49": {
            "person": "Morria the Screaming Spirit",
            "action": "screams",
            "object": "while clutching a skull",
            "person_el": "Μόρρια το Ουρλιαχτό Πνεύμα",
            "action_el": "ουρλιάζει",
            "object_el": "κρατώντας ένα κρανίο",
        },
        "50": {
            "person": "Ravon the White Lord",
            "action": "grips",
            "object": "his sword, ready for battle",
            "person_el": "Ράβον ο Λευκός Άρχοντας",
            "action_el": "κρατά",
            "object_el": "το σπαθί του έτοιμος για μάχη",
        },
        "59": {
            "person": "Vorath the Dark Lord",
            "action": "holds",
            "object": "a dark ring with ominous power",
            "person_el": "Βόραθ ο Σκοτεινός Άρχοντας",
            "action_el": "κρατά",
            "object_el": "ένα σκοτεινό δαχτυλίδι με δυσοίωνη δύναμη",
        },
        "69": {
            "person": "Veyron the Savage Symbiote",
            "action": "snarls",
            "object": "with monstrous aggression",
            "person_el": "Βέιρον το Άγριο Συμβίωτο",
            "action_el": "γρυλίζει",
            "object_el": "με τερατώδη αγριότητα",
        },
        "79": {
            "person": "Selira the Shadow Cat",
            "action": "moves",
            "object": "silently in the darkness",
            "person_el": "Σελίρα η Σκιώδης Γάτα",
            "action_el": "κινείται",
            "object_el": "σιωπηλά στο σκοτάδι",
        },
        "89": {
            "person": "Gromak the Brutal Orc",
            "action": "grips",
            "object": "his axe, ready for battle",
            "person_el": "Γκρόμακ ο Βίαιος Όρκ",
            "action_el": "κρατά",
            "object_el": "το τσεκούρι του, έτοιμος για μάχη",
        },
    })

    # Shortnames used by the main application tables.
    shortnames_chars.update({
        "Bc1": "Aldor",
        "Qd1": "Elara",
        "Ke1": "Ravon",
        "Ra8": "Kairo",
        "Nb8": "Nara",
        "Qd8": "Morria",
        "Ke8": "Vorath",
        "Bf8": "Veyron",
        "Ng8": "Selira",
        "Rh8": "Gromak",
    })

    shortnames_00_99.update({
        "19": "Kairo",
        "29": "Nara",
        "30": "Aldor",
        "40": "Elara",
        "49": "Morria",
        "50": "Ravon",
        "59": "Vorath",
        "69": "Veyron",
        "79": "Selira",
        "89": "Gromak",
    })

    # Safety: ensure old protected names do not remain in the intended public v5.4 chess character entries.
    protected_terms = [
        "Gandalf", "Galadriel", "Geralt", "Godzilla", "Natasha", "Black Widow",
        "Banshee", "Sauron", "Venom", "Selina", "Catwoman", "Goro the Devastating Godzilla",
        "Grom the Brutal Orc",
    ]

    serialized = json.dumps(data, ensure_ascii=False, indent=2)
    remaining_terms = [term for term in protected_terms if term in serialized]
    if remaining_terms:
        print("Warning: protected terms still exist somewhere in v5.4:")
        for term in remaining_terms:
            print(f"- {term}")
        print("This may be expected if they occur in unrelated libraries, such as LibraryP4/P5.")

    # Safety: parse again before writing.
    json.loads(serialized)

    if not BACKUP_PATH.exists():
        BACKUP_PATH.write_text(raw, encoding="utf-8")
        print(f"Backup created: {BACKUP_PATH.relative_to(ROOT)}")
    else:
        print(f"Backup already exists: {BACKUP_PATH.relative_to(ROOT)}")

    LIBRARY_PATH.write_text(serialized + "\n", encoding="utf-8")
    print(f"Updated: {LIBRARY_PATH.relative_to(ROOT)}")
    print("v5.3 was not modified.")


if __name__ == "__main__":
    main()
