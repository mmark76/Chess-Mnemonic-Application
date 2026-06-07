# Migration Notes

This document records migration decisions for the experimental-functional branch.

The goal is to rebuild the application around a Functional Domain-Based Architecture while preserving the current production behavior.

## Migration Principle

Do not rewrite everything at once.

Move logic gradually from the existing production structure into the new domain-based structure.

## Source of Truth

The main branch remains the production reference.

The experimental-functional branch must be compared against main before any future merge.

## Allowed Changes

- Reorganize code by domain responsibility
- Extract pure functions from existing scripts
- Separate core logic from UI rendering
- Create clear pipelines
- Improve documentation
- Add tests and behavior parity checks

## Not Allowed Without Documentation

- Changing user-facing behavior
- Changing output tables
- Changing fullmove logic
- Changing library override behavior
- Changing export formats
- Changing Epic Story output
- Removing existing features

## Migration Order

Recommended order:

1. Document current behavior
2. Map old scripts to new domains
3. Extract pure PGN and chess logic
4. Extract mnemonic logic
5. Extract library logic
6. Extract story logic
7. Extract export logic
8. Rebuild UI rendering
9. Compare outputs with main
10. Document intentional differences

## Core Rule

Every intentional difference from main must be written here before it is accepted.