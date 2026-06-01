/* Experimental CMS — base table renderers (extended by table-enhancements.js). */
function fillSanTable(moves) {
  const body = document.getElementById('sanBody');
  if (!body) return;
  body.innerHTML = '';
  moves.forEach(m => {
    const locus = locusForMove(m);
    const anchor = anchorForMove(m.index);
    const pieceDisplay = `${m.piece} — ${pieceGreek(m.piece)}`;
    const tr = document.createElement('tr');
    tr.dataset.index = m.index;
    tr.innerHTML =
      `<td>${escapeHtml(m.moveNumDisplay)}</td>` +
      `<td>${escapeHtml(m.san)}</td>` +
      `<td style="text-align:center;">${escapeHtml(anchor)}</td>` +
      `<td>${escapeHtml(locus)}</td>` +
      `<td>${escapeHtml(sideGR(m.side))}</td>` +
      `<td>${escapeHtml(pieceDisplay)}</td>` +
      `<td>${escapeHtml(m.to)}</td>`;
    body.appendChild(tr);
  });
}

function enableManualAnchors() {
  document.querySelectorAll('#sanBody, #assocBody, #paoBody, #pao99Body, #shortnamesBody')
    .forEach(table => {
      table.querySelectorAll('tr').forEach(tr => {
        const moveIndex = tr.dataset.index;
        tr.onclick = () => {
          if (manualAnchors[moveIndex]) delete manualAnchors[moveIndex];
          else manualAnchors[moveIndex] = true;
          renderAll();
          enableManualAnchors();
        };
      });
    });
}

function toPFR(m) {
  const P = PIECE_TO_P[m.piece] || 0;
  const F = FILE_TO_NUM[m.to?.[0]] || 0;
  const R = Number(m.to?.[1] || 0);
  return { P, F, R };
}
function formatPFR(pfr) { return `${pfr.P}${pfr.F}${pfr.R}`; }

function fillPaoTable_0_9(moves) {
  const body = document.getElementById('paoBody');
  if (!body) return;
  body.innerHTML = '';
  moves.forEach(m => {
    const locus = locusForMove(m);
    const anchor = anchorForMove(m.index);
    const pfr = toPFR(m);
    const code = formatPFR(pfr);
    const { person, action, object } = p1PAO(pfr);
    const tr = document.createElement('tr');
    tr.dataset.index = m.index;
    tr.innerHTML =
      `<td>${escapeHtml(m.moveNumDisplay)}</td>` +
      `<td>${escapeHtml(m.san)}</td>` +
      `<td>${escapeHtml(anchor)}</td>` +
      `<td>${escapeHtml(locus)}</td>` +
      `<td>${escapeHtml(sideGR(m.side))}</td>` +
      `<td>${escapeHtml(`${code} (${m.san})`)}</td>` +
      `<td>${escapeHtml(`Code: ${code}`)}<br>` +
      `${escapeHtml('P: ' + person)} | ${escapeHtml('A: ' + action)} | ${escapeHtml('O: ' + object)}</td>`;
    body.appendChild(tr);
  });
}

function weave6Digits(pfrW, pfrB) {
  const a = `${pfrW.P}${pfrW.F}`;
  const b = `${pfrW.R}${pfrB.P}`;
  const c = `${pfrB.F}${pfrB.R}`;
  return { a, b, c, all: `${a}${b}${c}` };
}
function twoDigit(str) { return String(str).padStart(2, '0'); }

function fillPaoTable_00_99(moves) {
  const body = document.getElementById('pao99Body');
  if (!body) return;
  const collSel = document.getElementById('pao99CollectionSelect');
  const collection = (collSel && collSel.value) ? collSel.value : 'LibraryDefaultP1';
  body.innerHTML = '';
  for (let i = 0; i < moves.length; i += 2) {
    const wm = moves[i];
    const bm = moves[i + 1];
    if (!wm || !bm) break;
    const movePair = wm.movePair;
    const locus = locusForMove(wm);
    const anchor = anchorForMove(wm.index);
    const parts = weave6Digits(toPFR(wm), toPFR(bm));
    const P = p2p3Get(twoDigit(parts.a), collection).person;
    const A = p2p3Get(twoDigit(parts.b), collection).action;
    const O = p2p3Get(twoDigit(parts.c), collection).object;
    const tr = document.createElement('tr');
    tr.dataset.index = wm.index;
    tr.innerHTML =
      `<td>${escapeHtml(`${movePair}.`)}</td>` +
      `<td>${escapeHtml(`${wm.san}  ${bm.san}`)}</td>` +
      `<td>${escapeHtml(anchor)}</td>` +
      `<td>${escapeHtml(locus)}</td>` +
      `<td>${escapeHtml('Full move')}</td>` +
      `<td>${escapeHtml(parts.all)}</td>` +
      `<td>${escapeHtml(`Person: ${P}`)}<br>` +
      `${escapeHtml(`Action: ${A}`)}<br>` +
      `${escapeHtml(`Object: ${O}`)}</td>`;
    body.appendChild(tr);
  }
}

/* Base association/shortname tables — replaced by extensions/table-enhancements.js */
function fillAssociationsTable(moves) {
  const body = document.getElementById('assocBody');
  if (!body) return;
  body.innerHTML = '';
  console.warn('[experimental] fillAssociationsTable base stub; load table-enhancements.js');
}

function fillShortnamesTable(moves) {
  const body = document.getElementById('shortnamesBody');
  if (!body) return;
  body.innerHTML = '';
  console.warn('[experimental] fillShortnamesTable base stub; load table-enhancements.js');
}
