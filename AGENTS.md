# AGENTS.md

## Project

Chess Mnemonic Application and Epic Chess Stories Creator.

The software implements a specific Chess Mnemonic System. All changes must preserve the existing cognitive structure, mnemonic logic, library data, numbering rules, memory-palace behavior, PAO logic, associations, shortnames and user-facing behavior unless the project owner explicitly approves a change.

## Core Engineering Principles

1. Each file, module, component or service must have one clear and limited responsibility.
2. Prefer small, understandable files and local changes.
3. Organize new code primarily by feature.
4. Keep feature-specific code inside its feature.
5. Move code to shared modules only when it is genuinely reused.
6. Use clear and descriptive names.
7. Avoid global mutable state, circular dependencies and direct access to another module’s internals.
8. Communicate through explicit interfaces and public APIs.
9. Do not create quick fixes, runtime patches or chained overrides.
10. Do not replace one large file with another large file.
11. Do not introduce unnecessary abstractions or overengineering.
12. A full rebuild is a last resort.

## Refactoring Rules

1. Refactoring must be incremental, controlled and behavior-preserving.
2. Separate refactoring from unrelated feature development.
3. Add characterization tests before moving or rewriting important logic.
4. Make one logical change at a time.
5. Keep diffs small enough to review safely.
6. Do not silently change existing data structures or library schemas.
7. Do not rename, move or delete files unless the current task explicitly requires it.
8. Do not add another compatibility patch to solve an architectural problem.
9. Identify and address the root cause in the correct module.
10. Preserve backward compatibility unless a documented migration is approved.

## Protected Domain Behaviour

Do not change the following without explicit approval:

* PGN and SAN interpretation.
* Full-move and half-move terminology.
* Temporal memory-palace numbering.
* The 80-locus cycle and wrapping behaviour.
* Manual-anchor behaviour.
* Character association tracking.
* Castling handling, including rook movement.
* En passant handling.
* Promotion handling.
* Spatial square associations.
* PAO 0–9 and PAO 00–99 logic.
* Shortname logic.
* Default and user-library fallback behaviour.
* Existing official JSON library data and schemas.
* Epic Story chronology and mnemonic meaning.

## Current Application Boundaries

* `index.html` is the public landing page.
* `app.html` is the main Chess Mnemonic Application.
* `flashcards/` is the Memory Palaces and libraries trainer.
* `chess_games_tts_app/` is the standalone PGN text-to-speech application.
* `js/cms.bundle.js` currently contains legacy core logic and must be refactored gradually.
* Existing runtime overrides and dynamically loaded patch scripts are technical debt, not patterns to copy.

## Testing

Tests are part of development, not a later addition.

Important behaviour changes and bug fixes should include tests where practical.

Priority test areas:

* PGN normalization and parsing.
* Invalid PGN handling.
* Castling.
* En passant.
* Promotion and underpromotion.
* Check and checkmate.
* Full-move and half-move loci.
* 80-locus wrapping.
* Character tracking.
* User and default library fallback.
* PAO generation.
* Shortnames.
* JSON, CSV and Excel library imports.
* Invalid, incomplete and oversized imported files.

## Security and Data Handling

1. Treat PGN files and user-library files as untrusted input.
2. Validate imported data before modifying application state.
3. Avoid inserting user-controlled values through `innerHTML`.
4. Prefer `textContent` and DOM element creation.
5. Do not load new external scripts or dependencies without explicit approval.
6. Do not expose secrets, credentials or private user data.
7. Do not modify analytics or privacy behaviour unless explicitly requested.

## Git Workflow

1. Never modify the `main` branch directly.
2. Work only on the active task branch.
3. Each commit must represent one logical change.
4. Review the complete diff before committing.
5. Run relevant tests before committing.
6. Use a Pull Request for significant changes.
7. Do not merge automatically.

## Documentation

Architecture, requirements, decisions, testing and development procedures should be documented under `docs/`.

Significant architectural decisions should be recorded as Architecture Decision Records.

Documentation must describe the actual current implementation and must not present proposed architecture as already implemented.

## Current Phase: Phase 0 Baseline

The current branch is for documentation and baseline analysis only.

Allowed work:

* Inspect the repository.
* Document the current architecture.
* Document global state and function overrides.
* Document script loading order.
* Document current library schemas.
* Correct clearly outdated architectural documentation.

Not allowed during Phase 0:

* Functional code changes.
* Refactoring.
* Renaming or moving application files.
* Dependency upgrades.
* Library-data modifications.
* UI changes.
* New features.
* New runtime patches.
* Changes to mnemonic behaviour.

When uncertain, stop and ask for approval before modifying code.