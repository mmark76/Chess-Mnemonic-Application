# Behavior Parity Checklist

This checklist is used to compare the production main branch with the experimental-functional branch.

The goal is to preserve existing user-facing behavior while rebuilding the internal architecture.

## General Rule

For every test, compare:

main output  
vs  
experimental-functional output

No behavior should change unless the change is documented and intentional.

## 1. First Load

- [ ] Application loads without console errors
- [ ] Default library loads correctly
- [ ] Default table is displayed correctly
- [ ] Default locus mode behaves as expected
- [ ] No missing scripts or assets

## 2. PGN Input

- [ ] PGN text can be pasted
- [ ] SAN move list can be processed
- [ ] Headers are handled correctly
- [ ] Invalid PGN errors are understandable
- [ ] Move order is preserved

## 3. Chess Model

- [ ] SAN moves match production output
- [ ] Fullmove numbering is correct
- [ ] White and black moves are grouped correctly
- [ ] Captures, checks, castling and promotions are handled correctly

## 4. Mnemonic Output

- [ ] Time loci match production behavior
- [ ] Space loci match production behavior
- [ ] Character links match production behavior
- [ ] Associations table matches production behavior
- [ ] Shortnames table matches production behavior
- [ ] PAO rows match production behavior

## 5. Story Output

- [ ] SAN-to-text output matches production behavior
- [ ] Epic Story output matches production behavior
- [ ] Narrative order is correct
- [ ] No missing character or locus references

## 6. User Libraries

- [ ] Default library loads
- [ ] User library can be loaded
- [ ] User library can override default data
- [ ] Invalid library data is reported clearly
- [ ] Library history behavior is preserved if supported

## 7. Exports

- [ ] CSV export works
- [ ] JSON export works
- [ ] TXT export works
- [ ] ZIP export works if supported
- [ ] Export filenames are correct

## 8. UI Behavior

- [ ] Table switching works
- [ ] Modals open and close correctly
- [ ] Buttons trigger the correct actions
- [ ] Error messages are visible
- [ ] No layout-breaking changes

## 9. Regression Rule

Do not merge into main until this checklist is completed.

Any intentional difference must be documented in MIGRATION_NOTES.md.