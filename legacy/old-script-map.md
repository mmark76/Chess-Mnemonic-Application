# Old Script Map

This document maps the existing production scripts to the intended experimental-functional architecture.

The purpose is to guide migration without losing current behavior.

## Production Reference

The main branch remains the reference for current behavior.

No production behavior should be changed without documentation.

## Current Script Mapping

| Existing file | Future location | Notes |
|---|---|---|
| js/cms.bundle.js | src/domains/pgn, src/domains/chess, src/domains/mnemonic, src/ui | Main monolithic logic must be split gradually |
| js/shortnames-action-column.js | src/domains/mnemonic, src/ui/components | Shortname logic and UI behavior should be separated |
| js/user-libraries-history.js | src/domains/library, src/state, src/services | Library history and persistence should be separated |
| js/user-library-runtime-fix.js | src/domains/library, src/state | Runtime fixes should become explicit logic |
| js/epic.js | src/domains/story | Epic Story logic belongs in the story domain |
| js/san-to-text-popup.js | src/domains/story, src/ui/modals | SAN-to-text logic and modal UI should be separated |
| js/download-tables.js | src/domains/export, src/services | Export preparation and browser download should be separated |
| json/libraries files | src/warehouse/libraries or public data | Stable source material belongs in warehouse/public data |

## Migration Rule

Do not move code blindly.

Each old script should be reviewed and split by responsibility.

## Target Direction

Old structure:

scripts with mixed responsibilities

New structure:

domain logic  
+ state  
+ pipelines  
+ UI rendering  
+ browser services

## Core Rule

The map is a guide, not a final implementation plan.

Any uncertain migration decision should be documented in legacy/migration-decisions.md.