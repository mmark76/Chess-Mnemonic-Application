/* Experimental CMS — temporal loci (fullmove vs ply). */
function locusForMove(m) {
  const total = 80;
  if (locusMode === 'full') {
    const idx = ((m.movePair - 1) % total) + 1;
    return t1Label(idx) || '';
  }
  const idx = (m.index % total) + 1;
  return t1Label(idx) || '';
}
function anchorForMove(index) {
  return manualAnchors[index] ? '⚓' : '';
}
function anchorForMovePair(n) {
  return anchorForMove(n);
}
