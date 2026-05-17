/* ===========================================================
   Shortnames Action Column Override
   Adds a dedicated Action column to the Shortnames table.
   =========================================================== */

function shortnameActionFromSan(san) {
  const text = String(san || '');
  const actions = [];

  if (text.includes('x')) actions.push('x');
  if (text.includes('+')) actions.push('+');
  if (text.includes('#')) actions.push('#');

  return actions.join(' ');
}

function fillShortnamesTable(moves){
  const body = document.getElementById('shortnamesBody');
  if(!body) return;
  body.innerHTML='';

  const shortnameBySquare = Object.create(null);

  const getShortnameFor = (pieceLetter, fromSq) =>
    shortnameBySquare[fromSq] ||
    characterShortnameBySquare(fromSq, pieceLetter) ||
    pieceGreek(pieceLetter);

  moves.forEach(m=>{
    const locus  = locusForMove(m);
    const anchor = anchorForMove(m.index);

    let pieceShortname = shortnameBySquare[m.from] || characterShortnameBySquare(m.from, m.piece) || pieceGreek(m.piece);
    if(m.from) delete shortnameBySquare[m.from];

    const sanClean = (m.san || '').replace(/[+#?!]+/g,'');
    const action = shortnameActionFromSan(m.san);

    if(sanClean.startsWith('O-O')){
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
