/* ===========================================================
   CMS v3.5 — SAN to Text js (Refactored & Secured)
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

  /* 1. HELPER: Ασφάλεια για να μην περνάει HTML κώδικας από τα ονόματα (XSS Protection) */
  function escapeHtml(text) {
    if (!text) return "";
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /* 2. CORE: Η μοναδική συνάρτηση μετατροπής (DRY Fix) */
  function sanToText(san) {
    if (!san) return "";
    // Ειδικές περιπτώσεις
    if (san === "O-O") return "King Castles Short Side";
    if (san === "O-O-O") return "King Castles Long Side";

    const map = { N: "Knight", B: "Bishop", R: "Rook", Q: "Queen", K: "King" };
    
    // Καθαρισμός συμβόλων (+, #, κλπ)
    let move = san.replace(/[+#?!]/g, "");
    
    // Εύρεση κομματιού
    let piece = map[move[0]] ? map[move[0]] : "Pawn";
    
    // Αν είναι πιόνι, το move μένει ως έχει, αλλιώς κόβουμε το πρώτο γράμμα
    move = map[move[0]] ? move.slice(1) : move;

    const parts = move.split("x");
    const square = parts[parts.length - 1]; // Το τετράγωνο είναι πάντα το τελευταίο κομμάτι
    const action = move.includes("x") ? "takes" : "moves to";

    return `${piece} ${action} ${square}`;
  }

  /* ============================================================
      MODAL DOM
  ============================================================ */
  const sanModal = document.createElement("div");
  sanModal.id = "sanTextModal";
  sanModal.className = "san-modal-overlay";
  sanModal.innerHTML = `
    <div class="san-modal-content">
      <span class="san-close" id="sanTextCloseBtn">&times;</span>

      <div class="san-toolbar" id="sanTextToolbar">
        <button id="sanModeFullBtn">Full-move</button>
        <button id="sanModeHalfBtn">Half-move</button>
        <button id="sanCopyBtn" class="primary">Copy</button>
        <button id="sanLociBtn">Loci: OFF</button>
        <p class="tts-hint">
          <a href="https://chessmnemonics.net/chess_games_tts_app/index.html" target="_blank" rel="noopener noreferrer">
            Listen to the game with this site TTS Tool or use external (i.e. Read Aloud MSWord etc.)
          </a>
        </p>
      </div>

      <pre id="sanTextOut" class="san-text"></pre>
    </div>
  `;
  document.body.appendChild(sanModal);

  /* ============================================================
      CSS (Με τις βελτιώσεις εμφάνισης)
  ============================================================ */
  const sanStyle = document.createElement("style");
  sanStyle.textContent = `
    /* --- Isolation --- */
    #sanTextModal .san-modal-content,
    #sanTextOut.san-text {
        all: revert;
        box-sizing: border-box !important;
    }
    /* --- Overlay --- */
    #sanTextModal.san-modal-overlay {
      display: none; position: fixed; z-index: 1050; left: 0; top: 0;
      width: 100%; height: 100%; overflow: auto; background-color: rgba(0,0,0,0.5);
    }
    /* --- Modal box --- */
    #sanTextModal .san-modal-content {
      background: #e9f4ff; margin: 40px auto; padding: 16px; border-radius: 8px;
      max-width: 850px; width: 90%; max-height: 90vh; display: flex; flex-direction: column;
      box-shadow: 0 4px 12px rgba(0,0,0,0.25); font-family: system-ui, sans-serif; font-size: 15px;
    }
    /* --- Close button --- */
    #sanTextModal .san-close { align-self: flex-end; font-size: 24px; cursor: pointer; margin-bottom: 8px; line-height: 1; }
    
    /* --- Toolbar --- */
    #sanTextToolbar { margin-bottom: 12px; display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
    #sanTextToolbar button { padding: 6px 10px; border-radius: 4px; border: 1px solid #888; background: #fff; cursor: pointer; font-size: 14px; color: #000 !important; }
    #sanTextToolbar button.primary { border-color: #c00; color: #c00 !important; font-weight: bold; }
    #sanTextToolbar button.mode-active { background: #dbe9ff; border-color: #3a6edc; color: #000 !important; }
    #sanTextToolbar button:not(.mode-active) { background: #fff !important; border-color: #888 !important; }

    /* --- Text area --- */
    #sanTextOut.san-text {
      white-space: pre-wrap; border: 1px solid #ccc; padding: 12px; border-radius: 6px;
      background: #ffffffcf; font-size: 15px; color: #000 !important;
      max-height: calc(90vh - 120px); overflow: auto; backdrop-filter: blur(2px);
    }

    /* --- Link Styling --- */
    .tts-hint { width: 100%; text-align: center; margin-top: 10px; font-size: 14px; opacity: 0.9; }
    .tts-hint a { color: #444; text-decoration: none; border-bottom: 1px dotted #888; transition: color 0.2s; }
    .tts-hint a:hover { color: #000; text-decoration: underline; cursor: pointer; }

    /* --- Responsive --- */
    @media (max-width: 768px) { #sanTextModal .san-modal-content { margin: 20px auto; padding: 12px; } #sanTextOut.san-text { max-height: calc(90vh - 110px); } }
    @media (max-width: 600px) { #sanTextModal .san-modal-content { margin: 10px auto; padding: 10px; width: 95%; } #sanTextOut.san-text { font-size: 16px; } }
  `;
  document.head.appendChild(sanStyle);

  /* ============================================================
      LOGIC / STATE
  ============================================================ */
  let sanMode = "full";
  let sanLociOn = false;
  let sanPayload = null;

  const sanOutEl    = document.getElementById("sanTextOut");
  const sanHalfBtn  = document.getElementById("sanModeHalfBtn");
  const sanFullBtn  = document.getElementById("sanModeFullBtn");
  const sanCopyBtn  = document.getElementById("sanCopyBtn");
  const sanLociBtn  = document.getElementById("sanLociBtn");
  const sanCloseBtn = document.getElementById("sanTextCloseBtn");

  function buildSanPayload() {
    const chess = new Chess();
    const pgnEl = document.getElementById("pgnText");
    if (pgnEl && pgnEl.value.trim()) {
      chess.load_pgn(pgnEl.value, { sloppy: true });
    }
    const H = chess.header();
    
    // Καθαρισμός ημερομηνίας
    let formatted = H["Date"] || "";
    if (formatted.includes(".")) {
      const [y, m, d] = formatted.split(".");
      // Έλεγχος αν είναι έγκυρη ημερομηνία
      const js = new Date(y, m - 1, d);
      if (!isNaN(js.getTime())) {
        formatted = js.toLocaleDateString("en-GB", { day:"numeric", month:"long", year:"numeric" });
      }
    }

    const moves = Array.isArray(gameMoves)
      ? gameMoves.map(m => ({ san: m.san, side: m.side || "" }))
      : [];

    return {
      header: { 
        event: H["Event"] || "", 
        white: H["White"] || "", 
        black: H["Black"] || "", 
        date: formatted, 
        result: H["Result"] || "" 
      },
      moves
    };
  }

  function buildLociArrayFromTable() {
    const loci = [];
    try {
      const sanBody = document.getElementById("sanBody");
      if (!sanBody) return loci;
      // Χρησιμοποιούμε spread operator για πιο μοντέρνο κώδικα
      [...sanBody.querySelectorAll("tr")].forEach(row => {
        const cells = row.children;
        const locusCell = cells && cells[3];
        loci.push(locusCell ? locusCell.textContent.trim() : "");
      });
    } catch(e) {}
    return loci;
  }

  function resultText(res) {
    if (res === "1-0") return "\n\nWhite wins.";
    if (res === "0-1") return "\n\nBlack wins.";
    if (res === "1/2-1/2") return "\n\nThe game is draw.";
    return "";
  }

  function buildSanText() {
    if (!sanPayload) return "";
    const h = sanPayload.header;
    
    // ΕΔΩ χρησιμοποιούμε το escapeHtml για ασφάλεια
    const headerLine =
      (`"` + escapeHtml(h.event) + `"` + "\n " +
       escapeHtml(h.white) + " vs " + escapeHtml(h.black) + " \n " +
       escapeHtml(h.date)).trim();

    const moves = sanPayload.moves || [];
    const out = [];
    const lociArray = sanLociOn ? buildLociArrayFromTable() : [];

    /* ============== HALF MODE ===========================*/
    if (sanMode === "half") {
      moves.forEach((moveObj, i) => {
        const side = moveObj.side === "White" ? "White" : "Black";
        const locus = sanLociOn ? (lociArray[i] || "") : "";
        
        // Το locus το εμπιστευόμαστε (δικό μας data) αλλά καλό είναι να το κάνουμε escape
        const prefix = locus
          ? `<span style="color:#b30000; font-weight:bold;">[${escapeHtml(locus)}]</span> `
          : "";

        // Χρήση της κεντρικής sanToText
        out.push(`${prefix}Half-move ${i+1} (${side}): ${sanToText(moveObj.san)}.`);
      });
    }

    /*===================== FULL MODE ====================== */
    else {
      for (let i = 0; i < moves.length; i += 2) {
        const full = (i/2) + 1;
        const locus = sanLociOn ? (lociArray[i/2] || "") : "";
        
        let block = `Move ${full}.\n`;

        if (moves[i]) {
          block += `  ${
            locus ? `<span style="color:#b30000; font-weight:bold;">[${escapeHtml(locus)}]</span> \n` : ""
          }  White: ${sanToText(moves[i].san)}.\n`;
        }

        if (moves[i+1]) {
          block += `  Black: ${sanToText(moves[i+1].san)}.\n`;
        }
        out.push(block.trim());
      }
    }

    return headerLine + "\n\n" + out.join("\n\n") + resultText(h.result);
  }

  function renderSanText() {
    // Εφόσον έχουμε HTML spans (για το Loci), πρέπει να χρησιμοποιήσουμε innerHTML.
    // ΑΛΛΑ, πλέον έχουμε κάνει escape όλα τα user inputs (ονόματα, events), οπότε είναι ασφαλές!
    sanOutEl.innerHTML = buildSanText();
  }

  function openSanToTextModal() {
    if (!Array.isArray(gameMoves) || gameMoves.length === 0) {
      alert("Load a game first (Demo Games or Parse PGN).");
      return;
    }
    sanPayload = buildSanPayload();
    sanMode = "full";
    sanLociOn = false;
    sanFullBtn.classList.add("mode-active");
    sanHalfBtn.classList.remove("mode-active");
    sanLociBtn.textContent = "Loci: OFF";
    renderSanText();
    sanModal.style.display = "block";
  }

  /* ===================== Controls ===========================*/
  sanHalfBtn.onclick = () => { sanMode = "half"; sanHalfBtn.classList.add("mode-active"); sanFullBtn.classList.remove("mode-active"); renderSanText(); };
  sanFullBtn.onclick = () => { sanMode = "full"; sanFullBtn.classList.add("mode-active"); sanHalfBtn.classList.remove("mode-active"); renderSanText(); };
  sanLociBtn.onclick = () => { sanLociOn = !sanLociOn; sanLociBtn.textContent = sanLociOn ? "Loci: ON" : "Loci: OFF"; renderSanText(); };

  sanCopyBtn.onclick = async () => {
    // Για το copy θέλουμε ΚΑΘΑΡΟ κείμενο, χωρίς τα HTML tags (spans)
    // Οπότε φτιάχνουμε ένα προσωρινό div για να πάρουμε το textContent του
    const rawHtml = buildSanText();
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = rawHtml;
    const cleanText = tempDiv.textContent; // Αυτό αφαιρεί τα spans αυτόματα

    try {
      await navigator.clipboard.writeText(cleanText);
      sanCopyBtn.textContent = "Copied!";
    } catch(e) {
      const ta = document.createElement("textarea");
      ta.value = cleanText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      sanCopyBtn.textContent = "Copied (fallback)";
    }
    setTimeout(() => sanCopyBtn.textContent = "Copy", 1200);
  };

  sanCloseBtn.onclick = () => sanModal.style.display = "none";
  window.addEventListener("click", (ev) => { if (ev.target === sanModal) sanModal.style.display = "none"; });

  /* ============================================================
      Insert SAN→Text Button
  ============================================================ */
  const demoBtn = document.getElementById("demoGamesBtn");
  let sanBtn = null;

  if (demoBtn && demoBtn.parentNode) {
    sanBtn = document.createElement("button");
    sanBtn.id = "openSanToTextBtn";
    sanBtn.innerHTML = "SAN → Text";
    // Inline styles (ok για μικρό κουμπί)
    Object.assign(sanBtn.style, {
        background: "white", color: "blue", border: "1px solid red", padding: "5px 12px",
        borderRadius: "4px", marginLeft: "10px", cursor: "pointer", fontSize: "12px",
        fontWeight: "bold", verticalAlign: "middle", transition: "background .18s",
        opacity: "0.5", cursor: "not-allowed"
    });
    sanBtn.disabled = true;
    sanBtn.onmouseenter = () => sanBtn.style.background = "#ffeaea";
    sanBtn.onmouseleave = () => sanBtn.style.background = "white";

    demoBtn.parentNode.insertBefore(sanBtn, demoBtn.nextSibling);
    sanBtn.onclick = openSanToTextModal;
  }

  function enableSanButtonIfReady() {
    const sanBody = document.getElementById("sanBody");
    if (!sanBody || !sanBtn) return;
    const hasRows = sanBody.children.length > 0;
    sanBtn.disabled = !hasRows;
    sanBtn.style.opacity = hasRows ? "1" : "0.5";
    sanBtn.style.cursor  = hasRows ? "pointer" : "not-allowed";
  }

  const orig = window.renderAll;
  window.renderAll = function() {
    orig.apply(this, arguments);
    enableSanButtonIfReady();
  };

  setTimeout(enableSanButtonIfReady, 200);
});
