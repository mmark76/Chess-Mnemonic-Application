/* ===========================================================
   Table Overrides
   Adds a dedicated Action column to the Shortnames table.
   Adds a special castling mnemonic image to Shortnames and Associations.
   =========================================================== */

function castlingMnemonicName() {
  return String.fromCharCode(83, 112, 105, 100, 101, 114, 109, 97, 110);
}

function castlingShortnameName() {
  return 'Peter';
}

function castlingActionFromSan(san) {
  const clean = String(san || '').replace(/[+#?!]+/g, '');
  if (clean.startsWith('O-O-O')) return 'O-O-O';
  if (clean.startsWith('O-O')) return 'O-O';
  return '';
}

function shortnameActionFromSan(san) {
  const text = String(san || '');
  const castle = castlingActionFromSan(text);
  if (castle) return castle;

  const actions = [];

  if (text.includes('x')) actions.push('x');
  if (text.includes('+')) actions.push('+');
  if (text.includes('#')) actions.push('#');

  return actions.join(' ');
}

function associationActionFromSan(san) {
  const castle = castlingActionFromSan(san);
  if (castle) return castle;
  return shortnameActionFromSan(san);
}

function characterShortnameOverride(square, pieceLetter) {
  const key = `${pieceLetter}${square || ''}`;
  if (key === 'Pb2') return 'Bruce';
  return characterShortnameBySquare(square, pieceLetter);
}

function fillAssociationsTable(moves){
  const body = document.getElementById('assocBody');
  if(!body) return;
  body.innerHTML='';

  const userChars = libs?.User?.Characters;
  let getPieceName;

  if (userChars) {
    getPieceName = (square, piece) => {
      return userChars?.white?.pawn?.[square]?.name ||
             userChars?.white?.knight?.[square]?.name ||
             userChars?.white?.bishop?.[square]?.name ||
             userChars?.white?.rook?.[square]?.name ||
             userChars?.white?.queen?.[square]?.name ||
             userChars?.white?.king?.[square]?.name ||

             userChars?.black?.pawn?.[square]?.name ||
             userChars?.black?.knight?.[square]?.name ||
             userChars?.black?.bishop?.[square]?.name ||
             userChars?.black?.rook?.[square]?.name ||
             userChars?.black?.queen?.[square]?.name ||
             userChars?.black?.king?.[square]?.name ||

             pieceGreek(piece);
    };
  } else {
    const C2 = libs?.Characters?.LibraryC2 || {};
    const C3 = libs?.Characters?.LibraryC3 || {};
    getPieceName = (square, piece) =>
      C3[piece + square + "_name"] ||
      C2[piece + square] ||
      pieceGreek(piece);
  }

  const Ltarget1 = libs?.Spatial?.LibraryS1 || {};
  const Ltarget2 = libs?.Spatial?.LibraryS2 || {};

  const assocBySquare = Object.create(null);
  const getAssocFor = (pieceLetter, fromSq) =>
    getPieceName(fromSq || "", pieceLetter) ||
    pieceGreek(pieceLetter);

  moves.forEach(m=>{
    const locus  = locusForMove(m);
    const anchor = anchorForMove(m.index);

    let pieceAssoc = assocBySquare[m.from] || getPieceName(m.from, m.piece);
    if(m.from) delete assocBySquare[m.from];

    const sanClean = (m.san||'').replace(/[+#?!]+/g,'');
    const action = associationActionFromSan(m.san);

    if(sanClean.startsWith('O-O')){
      pieceAssoc = castlingMnemonicName();

      const long  = sanClean.startsWith('O-O-O');
      const white = (m.side==='White');
      const rookFrom = white ? (long ? 'a1':'h1') : (long ? 'a8':'h8');
      const rookTo   = white ? (long ? 'd1':'f1') : (long ? 'd8':'f8');
      if(assocBySquare[rookFrom]){
        assocBySquare[rookTo] = assocBySquare[rookFrom];
        delete assocBySquare[rookFrom];
      }else{
        assocBySquare[rookTo] = getAssocFor('R', rookFrom);
      }
    }

    if((m.flags||'').includes('e') && /^[a-h][1-8]$/.test(m.to)){
      const toFile = m.to[0], toRank = parseInt(m.to[1],10);
      const capRank = (m.side==='White') ? (toRank-1) : (toRank+1);
      const capSq = `${toFile}${capRank}`;
      if(assocBySquare[capSq]) delete assocBySquare[capSq];
    }

    assocBySquare[m.to] = pieceAssoc;

    const node = (selectedLang === 'el' ? Ltarget2[m.to] : Ltarget1[m.to]) || null;
    const targetAssoc = node?.['Target Square Association'] || m.to;

    const tr = document.createElement('tr');
    tr.dataset.index = m.index;
    tr.innerHTML =
      `<td>${escapeHtml(m.moveNumDisplay)}</td>`+
      `<td>${escapeHtml(m.san)}</td>`+
      `<td>${escapeHtml(anchor)}</td>`+
      `<td>${escapeHtml(locus)}</td>`+
      `<td>${escapeHtml(m.to)}</td>`+
      `<td>${escapeHtml(sideGR(m.side))}</td>`+
      `<td>${escapeHtml(pieceAssoc)}</td>`+
      `<td>${escapeHtml(action)}</td>`+
      `<td>${escapeHtml(targetAssoc)}</td>`;
    body.appendChild(tr);
  });
}

function fillShortnamesTable(moves){
  const body = document.getElementById('shortnamesBody');
  if(!body) return;
  body.innerHTML='';

  const shortnameBySquare = Object.create(null);

  const getShortnameFor = (pieceLetter, fromSq) =>
    shortnameBySquare[fromSq] ||
    characterShortnameOverride(fromSq, pieceLetter) ||
    pieceGreek(pieceLetter);

  moves.forEach(m=>{
    const locus  = locusForMove(m);
    const anchor = anchorForMove(m.index);

    let pieceShortname = shortnameBySquare[m.from] || characterShortnameOverride(m.from, m.piece) || pieceGreek(m.piece);
    if(m.from) delete shortnameBySquare[m.from];

    const sanClean = (m.san || '').replace(/[+#?!]+/g,'');
    const action = shortnameActionFromSan(m.san);

    if(sanClean.startsWith('O-O')){
      pieceShortname = castlingShortnameName();

      const long  = sanClean.startsWith('O-O-O');
      const white = (m.side === 'White');

      const rookFrom = white ? (long ? 'a1' : 'h1') : (long ? 'a8' : 'h8');
      const rookTo   = white ? (long ? 'd1' : 'f1') : (long ? 'd8' : 'f8');

      if(shortnameBySquare[rookFrom]){
        shortnameBySquare[rookTo] = shortnameBySquare[rookFrom];
        delete shortnameBySquare[rookFrom];
      }else{
        shortnameBySquare[rookTo] = getShortnameFor('R', rookFrom);
      }
    }

    if((m.flags || '').includes('e') && /^[a-h][1-8]$/.test(m.to)){
      const toFile = m.to[0];
      const toRank = parseInt(m.to[1], 10);
      const capRank = (m.side === 'White') ? (toRank - 1) : (toRank + 1);
      const capSq = `${toFile}${capRank}`;
      if(shortnameBySquare[capSq]) delete shortnameBySquare[capSq];
    }

    shortnameBySquare[m.to] = pieceShortname;

    const targetSquareShortname = squareShortname(m.to);

    const tr = document.createElement('tr');
    tr.dataset.index = m.index;
    tr.innerHTML =
      `<td>${escapeHtml(m.moveNumDisplay)}</td>`+
      `<td>${escapeHtml(m.san)}</td>`+
      `<td>${escapeHtml(anchor)}</td>`+
      `<td>${escapeHtml(locus)}</td>`+
      `<td>${escapeHtml(m.to)}</td>`+
      `<td>${escapeHtml(sideGR(m.side))}</td>`+
      `<td>${escapeHtml(pieceShortname)}</td>`+
      `<td>${escapeHtml(action)}</td>`+
      `<td>${escapeHtml(targetSquareShortname)}</td>`;

    body.appendChild(tr);
  });
}

/* Fix dynamic column-control labels after cms.bundle.js creates them. */
document.addEventListener('DOMContentLoaded', () => {
  function setLabelText(label, text) {
    if (!label) return;
    const checkbox = label.querySelector('input[type="checkbox"]');
    label.textContent = '';
    if (checkbox) {
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(' ' + text));
    } else {
      label.textContent = text;
    }
  }

  function fixAssociationsToolbar() {
    const section = document.getElementById('assocSection');
    if (!section) return;

    const headers = section.querySelectorAll('thead th');
    if (headers.length >= 9) {
      headers[7].textContent = 'Action';
      headers[8].textContent = 'Target Square Association';
    }

    const labels = section.querySelectorAll('.table-toolbar label');
    if (labels.length >= 9) {
      setLabelText(labels[7], 'Action');
      setLabelText(labels[8], 'Target Square Association');
    }
  }

  fixAssociationsToolbar();
  setTimeout(fixAssociationsToolbar, 500);
});
