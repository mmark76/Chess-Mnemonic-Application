/* Experimental CMS — UI helpers and piece/file constants. */
function sideGR(side) { return side === 'White' ? 'White' : 'Black'; }

const PIECE_GREEK = {
  P: 'Pawn', N: 'Knight', B: 'Bishop',
  R: 'Rook', Q: 'Queen', K: 'King'
};
function pieceGreek(letter) { return PIECE_GREEK[letter] || letter; }

function escapeHtml(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[m]));
}

const PIECE_TO_P = { P: 1, N: 2, B: 3, R: 4, Q: 5, K: 6 };
const FILE_TO_NUM = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8 };
