/* ================================================
   Markellos CMS v3.4 — Epic Story (Half-Move / Full-Move Loci, JSON-based)
   ================================================ */

document.addEventListener("DOMContentLoaded", () => {

  // === Create Modal ===
  const epicSection = document.createElement("section");
  epicSection.id = "epicSection";
  const verseSection = document.getElementById("verseSection");
  const container = verseSection || document.querySelector(".layout-container");
  if (container) {
    container.after(epicSection);
  }

  const modal = document.createElement("div");
  modal.className = "epic-modal";
  modal.id = "epicModal";
  modal.innerHTML = `
    <div class="epic-modal-content">
      <span class="epic-close" id="epicCloseBtn">&times;</span>
      <div class="epic-copy-toolbar">
        <button id="copyEpicBtn" class="btn btn-primary">📋 Copy Story</button>
        <label for="epicLocusMode" style="display:inline-flex;align-items:center;gap:6px;">
          Epic loci mode:
          <select id="epicLocusMode">
            <option value="half">Ply / half-move loci</option>
            <option value="full">Full-move loci</option>
          </select>
        </label>
        <span>Listen to the story with a TTS Tool (i.e. Read Aloud MSWord etc.)</span>
      </div>
      <div id="epicTextView" class="epic-text"></div>
    </div>
  `;
  document.body.appendChild(modal);
  const textView = document.getElementById("epicTextView");
  if (textView) {
    textView.classList.add("parchment","edge");
  }

  const epicLocusModeSelect = document.getElementById("epicLocusMode");
  let epicLocusMode = localStorage.getItem("epicLocusMode") || window.locusMode || "half";
  if (!['half', 'full'].includes(epicLocusMode)) epicLocusMode = "half";
  if (epicLocusModeSelect) {
    epicLocusModeSelect.value = epicLocusMode;
    epicLocusModeSelect.addEventListener("change", (e) => {
      epicLocusMode = e.target.value === "full" ? "full" : "half";
      localStorage.setItem("epicLocusMode", epicLocusMode);
      updateEpicText();
    });
  }

  /* ---------- Helpers ---------- */
  function sanToText(san) {
    if (!san) return "";
    if (san === "O-O") return "King Castles Short Side";
    if (san === "O-O-O") return "King Castles Long Side";

    const pieceMap = { N: "Knight", B: "Bishop", R: "Rook", Q: "Queen", K: "King" };
    let move = san.replace(/[+#?!]/g, "");
    let piece = pieceMap[move[0]] ? pieceMap[move[0]] : "Pawn";
    move = pieceMap[move[0]] ? move.slice(1) : move;

    const parts = move.split("x");
    const square = parts[parts.length - 1];
    const action = move.includes("x") ? "takes" : "moves to";
    return `${piece} ${action} ${square}`.trim();
  }

  function cleanAnchor(txt) {
    if (!txt) return "";
    return txt.replace(/^\d+\s*—\s*/, "").trim();
  }

  /* ---------- Epic Story Generator ---------- */
  function updateEpicText() {
    const textView = document.getElementById("epicTextView");
    if (!textView) return;

    const Lpieces  = libs?.Characters?.LibraryC2 || {};
    const Ltarget1 = libs?.Spatial?.LibraryS1  || {};
    const T1       = libs?.Temporal?.LibraryT1 || {};
    const T2       = libs?.Temporal?.LibraryT2 || {};

    function epicLocusForMove(m) {
      const total = 80;
      const idx = epicLocusMode === "full"
        ? ((m.movePair - 1) % total) + 1
        : (m.index % total) + 1;

      const node = T1[String(idx)];
      if (!node) return "";
      return node.en || node.locus_en || node[selectedLang] || node.el || "";
    }

    const anchorMap = {};
    const anchored = Object.keys(manualAnchors || {})
      .map(n => parseInt(n, 10))
      .filter(n => !Number.isNaN(n))
      .sort((a, b) => a - b);

    anchored.forEach((moveIndex, idx) => {
      const chapNo = idx + 1;
      const node = T2[String(chapNo)] || {};
      const label = node.en || node[selectedLang] || node.el || "";
      if (label) {
        anchorMap[moveIndex] = `${chapNo} — ${label}`;
      }
    });

    const assocBySquare = Object.create(null);
    const getAssocFor = (pieceLetter, fromSq) =>
      (Lpieces[`${pieceLetter}${fromSq || ""}`] ||
       Lpieces[fromSq || ""] ||
       Lpieces[pieceLetter] ||
       pieceGreek(pieceLetter));

    const stories = [];

    if (Array.isArray(gameMoves)) {
      gameMoves.forEach((m, i) => {
        const locus = epicLocusForMove(m);
        if (!locus) return;

        const anchorRaw = anchorMap[m.index] || "";
        const anchorTxt = cleanAnchor(anchorRaw);

        let pieceAssoc = assocBySquare[m.from] || getAssocFor(m.piece, m.from);
        if (m.from) delete assocBySquare[m.from];

        const sanClean = (m.san || "").replace(/[+#?!]+/g, "");
        if (sanClean.startsWith("O-O")) {
          const long  = sanClean.startsWith("O-O-O");
          const white = (m.side === "White");
          const rookFrom = white ? (long ? "a1" : "h1") : (long ? "a8" : "h8");
          const rookTo   = white ? (long ? "d1" : "f1") : (long ? "d8" : "f8");
          if (assocBySquare[rookFrom]) {
            assocBySquare[rookTo] = assocBySquare[rookFrom];
            delete assocBySquare[rookFrom];
          } else {
            assocBySquare[rookTo] = getAssocFor("R", rookFrom);
          }
        }

        if ((m.flags || "").includes("e") && /^[a-h][1-8]$/.test(m.to || "")) {
          const toFile = m.to[0];
          const toRank = parseInt(m.to[1], 10);
          const capRank = (m.side === "White") ? (toRank - 1) : (toRank + 1);
          const capSq = `${toFile}${capRank}`;
          if (assocBySquare[capSq]) delete assocBySquare[capSq];
        }

        assocBySquare[m.to] = pieceAssoc;

        const sqKey = (m.to || "").toLowerCase();
        const node = Ltarget1[sqKey] || {};
        const areaName = node["Target Square Association"] || (m.to || "");

        const openings = [
          "Then, the action continues",
          "A little later, the action continues",
          "After a while, the scene continues",
        ];
        const verbs = ["appears", "emerges", "can be seen"];

        const opening = i === 0
          ? "A trumpet sounds, and the battle begins"
          : openings[i % openings.length];
        const action = verbs[i % verbs.length];

        const sanText = sanToText(m.san);
        const sceneNumber = i + 1;
        const locusNumber = epicLocusMode === "full"
          ? ((m.movePair - 1) % 80) + 1
          : (m.index % 80) + 1;

        const sceneLabel = epicLocusMode === "full"
          ? `Half-move ${sceneNumber} / Full-move locus ${locusNumber}`
          : `Half-move ${sceneNumber} / Half-move locus ${locusNumber}`;

        const t1Header = `${sceneLabel}. ${sanText}.\n`;

        let phrase = `${t1Header}- ${opening} ${locus}. There, ${pieceAssoc} ${action}, in the area where ${areaName}`;
        if (anchorTxt) phrase = `${anchorTxt} ${phrase}`;

        stories.push(phrase);
      });
    }

    const narrativeText = stories.join("\n\n");

    const chess = new Chess();
    const pgnEl = document.getElementById("pgnText");
    if (pgnEl && pgnEl.value.trim()) {
      chess.load_pgn(pgnEl.value, { sloppy: true });
    }
    const headers = chess.header();

    const event  = headers["Event"]  || "";
    const date   = headers["Date"]   || "";
    const white  = headers["White"]  || "";
    const black  = headers["Black"]  || "";
    const result = headers["Result"] || "";

    let formattedDate = date;
    if (date && date.includes(".")) {
      const [y, m, d] = date.split(".");
      const jsDate = new Date(`${y}-${m}-${d}`);
      if (!isNaN(jsDate.getTime())) {
        formattedDate = jsDate.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric"
        });
      }
    }

    const gameHeader = `"${event}" \n ${white} vs ${black} \n ${formattedDate}`.trim();

    const prologue = `♟. "The old man calmly takes in his hands the large book of historic chess battles and says to the young chess player ... Today we shall study a very interesting battle. He opens the cover, turns a few pages, and begins to read ... it was late in the afternoon when the two Generals shook hands, and after the signal was given, the battle began..."`;

    let finalMsg = "";
    if (result === "1-0") {
      finalMsg = "\n … and after the final move, the Black General understood that the battle was lost. He lowered his head slowly and, offering his hand to his opponent with dignity, accepted defeat. The old man closes the thick book. The game becomes memory, yet forever engraved in history.";
    } else if (result === "0-1") {
      finalMsg = "\n … and after the final move, the White General understood that the battle was lost. He lowered his head slowly and, offering his hand to his opponent with dignity, accepted defeat. The old man closes the thick book. The game becomes memory, yet forever engraved in history.";
    } else if (result === "1/2-1/2") {
      finalMsg = "\n … and after the final move, the two Generals understood that neither could claim victory. They shook hands, and the battle ended in a draw. The Elder closes the thick book. The game becomes memory, yet forever engraved in history.";
    }

    const fullText = [gameHeader, prologue, narrativeText, finalMsg.trim()]
      .filter(Boolean)
      .join("\n\n");

    textView.textContent = fullText;
    textView.style.whiteSpace = "pre-wrap";

    const copyBtn = document.getElementById("copyEpicBtn");
    if (copyBtn) {
      copyBtn.replaceWith(copyBtn.cloneNode(true));
      const freshBtn = document.getElementById("copyEpicBtn");
      freshBtn.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(fullText);
          freshBtn.innerText = "✅ Copied!";
        } catch {
          const ta = document.createElement("textarea");
          ta.value = fullText;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          document.body.removeChild(ta);
          freshBtn.innerText = "✅ Copied (fallback)!";
        } finally {
          setTimeout(() => (freshBtn.innerText = "📋 Copy Story"), 1500);
        }
      });
    }
  }

  function openEpicModal() {
    updateEpicText();
    modal.style.display = "block";
  }

  const assocSection = document.getElementById("assocSection");
  let assocBtnDiv = null;
  if (assocSection) {
    assocBtnDiv = document.createElement("div");
    assocBtnDiv.className = "table-toolbar";
    assocBtnDiv.innerHTML = `<button id="openEpicBtnTop" class="btn btn-primary">Show Epic Story</button>`;
    assocBtnDiv.style.display = "none";
    assocSection.parentNode.insertBefore(assocBtnDiv, assocSection);
    document.getElementById("openEpicBtnTop").addEventListener("click", openEpicModal);
  }

  const tableSelect = document.getElementById("tableSelect");
  if (tableSelect && assocBtnDiv) {
    tableSelect.addEventListener("change", (e) => {
      assocBtnDiv.style.display = e.target.value === "assocSection" ? "block" : "none";
    });
  }

  const closeBtn = document.getElementById("epicCloseBtn");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => (modal.style.display = "none"));
  }

  window.addEventListener("click", (event) => {
    if (event.target === modal) modal.style.display = "none";
  });
});
