# Domain Model

This document defines the main domains of the experimental-functional branch.

The application is organized as a set of clear responsibility areas.

## PGN Domain

Responsible for reading and preparing chess game input.

Main responsibilities:

- read PGN text
- normalize PGN input
- extract headers
- extract SAN moves
- report PGN-related errors

## Chess Domain

Responsible for understanding the chess meaning of the moves.

Main responsibilities:

- build the move model
- normalize SAN notation
- calculate fullmove indexes
- classify moves
- handle pieces and squares

## Mnemonic Domain

Responsible for converting chess data into the Chess Mnemonic System.

Main responsibilities:

- build time loci
- build space loci
- build character links
- build associations
- build shortnames
- build PAO rows

## Library Domain

Responsible for loading, validating and combining mnemonic libraries.

Main responsibilities:

- load default library
- load user library
- validate library structure
- normalize library data
- merge default and user libraries

## Story Domain

Responsible for narrative output.

Main responsibilities:

- convert SAN to readable text
- build Epic Story material
- create narrative scenes
- apply narrative rules

## Export Domain

Responsible for preparing downloadable output.

Main responsibilities:

- build CSV export
- build JSON export
- build TXT export
- build ZIP export
- generate export filenames

## Warehouse

The warehouse stores stable material.

It does not perform business logic.

Examples:

- default libraries
- time loci
- square scenes
- piece characters
- pawn characters
- PAO system
- templates
- constants

## UI

The UI displays prepared data and handles interaction.

It should not contain chess, mnemonic or story calculations.

## Services

Services handle browser-related side effects.

Examples:

- file reading
- local storage
- clipboard
- downloads

## Core Rule

Each domain should have a clear responsibility.

A domain should not secretly perform the work of another domain.