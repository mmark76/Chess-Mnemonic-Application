/* Experimental CMS — PGN cleaning and parsing. */
function cleanPGN(pgn) {
  return String(pgn || '')
    .replace(/\{\[%.*?\]\}/gs, '')
    .replace(/\[%.*?\]/gs, '')
    .replace(/\{[^}]*\}/gs, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/[ \t]*\n[ \t]*/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function parsePGN(pgn) {
  pgn = String(pgn || '').replace(/\r\n/g, '\n');
  pgn = pgn.replace(/\{\[%[\s\S]*?\]\}/g, '');
  pgn = pgn.replace(/\[%[\s\S]*?\]/g, '');
  pgn = pgn.replace(/\{[^}]*\}/g, '');
  pgn = pgn
    .replace(/[ \t]+/g, ' ')
    .replace(/[ \t]*\n[ \t]*/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/(\]\n)(?!\n)/g, '$1\n')
    .trim();

  const chess = new Chess();
  chess.load_pgn(pgn, { sloppy: true });
  const hist = chess.history({ verbose: true });
  const tmp = new Chess();
  const out = [];
  hist.forEach((mv, i) => {
    tmp.move(mv);
    const fen = tmp.fen();
    const side = (i % 2 === 0) ? 'White' : 'Black';
    const moveNumber = Math.floor(i / 2) + 1;
    const moveNumDisplay = (side === 'White') ? `${moveNumber}.` : `${moveNumber}...`;
    const pieceLetter = mv.piece ? mv.piece.toUpperCase() : (mv.san[0]?.toUpperCase() || 'P');
    out.push({
      index: i, moveNumber, moveNumDisplay, movePair: moveNumber,
      side, san: mv.san, piece: pieceLetter, from: mv.from, to: mv.to, fen,
      flags: mv.flags || '', promotion: mv.promotion || null
    });
  });
  return out;
}
