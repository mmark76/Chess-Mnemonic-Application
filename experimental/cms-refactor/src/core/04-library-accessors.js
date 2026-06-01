/* Experimental CMS — mnemonic library accessors (default + user). */
function t1Label(idx) {
  const node = libs?.Temporal?.LibraryT1?.[String(idx)];
  if (!node) return '';
  return (node.locus_en || node[selectedLang] || node.el || '');
}
function t2Label(idx) {
  const node = libs?.Temporal?.LibraryT2?.[String(idx)];
  if (!node) return '';
  return (node.locus_en || node[selectedLang] || node.el || '');
}
function s1Square(square) {
  const node = libs?.Spatial?.LibraryS1?.[square];
  if (!node) return '';
  return (node[selectedLang] || node.el || node.en || '');
}
function p1PAO(d) {
  const P = String(d.P);
  const A = String(d.F);
  const O = String(d.R);
  const lib = libs?.['PAO 0-9']?.Library_p1;
  if (!lib) return { person: '', action: '', object: '' };
  const lang = selectedLang || 'el';
  const person = lib?.persons?.[P]?.[lang] || lib?.persons?.[P]?.el || '';
  const action = lib?.actions?.[A]?.[lang] || lib?.actions?.[A]?.el || '';
  const object = lib?.objects?.[O]?.[lang] || lib?.objects?.[O]?.el || '';
  return { person, action, object };
}
function p2p3Get(idx2, collection) {
  const lib = libs?.['PAO 00-99']?.[collection];
  if (!lib) return { person: '', action: '', object: '' };
  const node = lib?.[idx2];
  if (!node) return { person: '', action: '', object: '' };
  return { person: node.person || '', action: node.action || '', object: node.object || '' };
}
function v1Verse(pieceLetter, file, rank, side, moveNo) {
  const V = libs?.Verses?.LibraryV1;
  if (!V) return { piece: '', file: '', rank: '', closing: '' };
  const piece = V.Pieces?.[pieceLetter]?.[selectedLang] || V.Pieces?.[pieceLetter]?.el || '';
  const fileTxt = V.Files?.[file]?.[selectedLang] || V.Files?.[file]?.el || '';
  const rankTxt = V.Ranks?.[String(rank)]?.[selectedLang] || V.Ranks?.[String(rank)]?.el || '';
  const closings = (side === 'White' ? V.Closings?.White : V.Closings?.Black) || [];
  const idx = ((moveNo - 1) % Math.max(1, closings.length));
  const closing = closings[idx]?.[selectedLang] || closings[idx]?.el || '';
  return { piece, file: fileTxt, rank: rankTxt, closing };
}
function sn1Shortname(code) {
  const key = String(code).padStart(2, '0');
  const lib = libs?.Shortnames?.Shortnames00_99List;
  if (!lib) return '';
  return lib?.[key] || '';
}
function characterShortnameBySquare(square, pieceLetter) {
  const lib = libs?.Shortnames?.CharactersSN1 || {};
  const key = `${pieceLetter}${square || ''}`;
  return lib?.[key] || '';
}
function squareShortname(square) {
  const lib = libs?.Shortnames?.SquaresSN1 || {};
  return lib?.[square] || square || '';
}
