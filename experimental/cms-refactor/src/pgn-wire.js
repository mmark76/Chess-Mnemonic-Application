function wirePGN(){
  const ta = document.getElementById('pgnText');
  const fileInput = document.getElementById('pgnFileInput');
  const parseBtn = document.getElementById('parsePgnBtn');
  const clearBtn = document.getElementById('clearBtn');

  if(fileInput){
    fileInput.addEventListener('change', ev=>{
      const f = ev.target.files?.[0]; 
      if(!f) return;
      const r = new FileReader();
      r.onload = ()=>{ 
        const cleaned = cleanPGN(r.result);
        if(ta) ta.value = cleaned; 
        gameMoves = parsePGN(cleaned);
        manualAnchors = {};
        renderAll();
        enableManualAnchors();
      };
      r.readAsText(f);
    });
  }

  if(parseBtn){
    parseBtn.addEventListener('click', ()=>{
      const pgn = ta ? cleanPGN(ta.value) : '';
      gameMoves = parsePGN(pgn);
      manualAnchors = {};
      renderAll();
      enableManualAnchors();
    });
  }

  if(clearBtn){
    clearBtn.addEventListener('click', ()=>{
      if(ta) ta.value='';
      if(fileInput) fileInput.value='';
      gameMoves=[]; 
      manualAnchors = {};
      renderAll();
    });
  }
}

/* ---------- Dropdown locker ---------- */

function lockDropdown(id, value){
  const el=document.getElementById(id); if(!el) return;
  el.innerHTML = `<option>${value}</option>`;
  el.value=value; el.disabled=true;
}

/* ---------- Export (CSV/TXT/JSON/PDF) stays as ÏƒÏ„Î¿ Î´Î¹ÎºÏŒ ÏƒÎ¿Ï… script ---------- */
/* ... ÎµÎ´ÏŽ Î¼Ï€Î¿ÏÎµÎ¯Ï‚ Î½Î± ÎºÏÎ±Ï„Î®ÏƒÎµÎ¹Ï‚ Ï„Î¿Î½ exportTable / download logic Î±ÎºÏÎ¹Î²ÏŽÏ‚ ÏŒÏ€Ï‰Ï‚ Ï„Î¿ Î­Ï‡ÎµÎ¹Ï‚ ... */

/* ===========================================================
   14. DEMO GAMES MODULE
   =========================================================== */

/* ---- PGN DATA ---- */

const demoMorphyPGN = `[Event "Paris Opera"]
[Site "Paris FRA"]
[Date "1858.??.??"]
[Round "?"]
[White "Paul Morphy"]
[Black "Duke Karl / Count Isouard"]
[Result "1-0"]

1.e4 e5 2.Nf3 d6 3.d4 Bg4 4.dxe5 Bxf3 5.Qxf3 dxe5 
6.Bc4 Nf6 7.Qb3 Qe7 8.Nc3 c6 9.Bg5 b5 10.Nxb5 cxb5 
11.Bxb5+ Nbd7 12.O-O-O Rd8 13.Rxd7 Rxd7 14.Rd1 Qe6 
15.Bxd7+ Nxd7 16.Qb8+ Nxb8 17.Rd8# 1-0`;

const demoImmortalPGN = `[Event "Immortal Game"]
[Site "London ENG"]
[Date "1851.06.21"]
[Round "?"]
[White "Adolf Anderssen"]
[Black "Lionel Kieseritzky"]
[Result "1-0"]

1.e4 e5 2.f4 exf4 3.Bc4 Qh4+ 4.Kf1 b5 5.Bxb5 Nf6 
6.Nf3 Qh6 7.d3 Nh5 8.Nh4 Qg5 9.Nf5 c6 10.g4 Nf6 
11.Rg1 cxb5 12.h4 Qg6 13.h5 Qg5 14.Qf3 Ng8 15.Bxf4 Qf6 
16.Nc3 Bc5 17.Nd5 Qxb2 18.Bd6 Qxa1+ 19.Ke2 Bxg1 
20.e5 Na6 21.Nxg7+ Kd8 22.Qf6+ Nxf6 23.Be7# 1-0`;

const demoCapaPGN = `[Event "Simul Exhibition"]
[Site "USA"]
[Date "1918.??.??"]
[Round "?"]
[White "JosÃ© RaÃºl Capablanca"]
[Black "?"]
[Result "1-0"]

1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6 
5.O-O Be7 6.Re1 b5 7.Bb3 d6 8.c3 O-O 
9.h3 Nb8 10.d4 Nbd7 11.c4 Bb7 12.Nc3 b4 
13.Nd5 Nxd5 14.exd5 exd4 15.Nxd4 Bf6 
16.Be3 Nc5 17.Bc2 g6 18.Qd2 Re8 19.Bf4 Rxe1+ 
20.Rxe1 Qd7 21.Bg5 Be5 22.f4 Bg7 23.f5 Re8 
24.f6 Bh8 25.Re7 Qd8 26.Ne6 1-0`;

const demoRubinsteinPGN = `[Event "Lodz"]
[Site "Lodz RUE"]
[Date "1907.12.26"]
[Round "6"]
[White "Georg Rotlewi"]
[Black "Akiba Rubinstein"]
[Result "0-1"]

1. d4 d5 2. Nf3 e6 3. e3 c5 4. c4 Nc6 5. Nc3 Nf6 6. dxc5 Bxc5 7. a3 a6 8. b4 Bd6 9. Bb2 O-O 10. Qd2 Qe7 11. Bd3 dxc4 12. Bxc4 b5 13. Bd3 Rd8 14. Qe2 Bb7 15. O-O Ne5 16. Nxe5 Bxe5 17. f4 Bc7 18. e4 Rac8 19. e5 Bb6+ 20. Kh1 Ng4 21. Be4 Qh4 22. g3 Rxc3 23. gxh4 Rd2 24. Qxd2 Bxe4+ 25. Qg2 Rh3 0-1`;

const demoLaskerPGN = `[Event "Casual game"]
[Site "London ENG"]
[Date "1912.10.29"]
[White "Edward Lasker"]
[Black "George Alan Thomas"]
[Result "1-0"]

1. d4 e6 2. Nf3 f5 3. Nc3 Nf6 4. Bg5 Be7 5. Bxf6 Bxf6 6. e4 fxe4 7. Nxe4 b6 8. Ne5 O-O 9. Bd3 Bb7 10. Qh5 Qe7 11. Qxh7+ Kxh7 12. Nxf6+ Kh6 13. Ng4+ Kg5 14. h4+ Kf4 15. g3+ Kf3 16. Be2+ Kg2 17. Rh2+ Kg1 18. Kd2# 1-0`;

/* ---- MODAL ---- */

function openDemoGamesModal() {
  const backdrop = document.createElement("div");
  backdrop.className = "ul-backdrop";

  const modal = document.createElement("div");
  modal.className = "ul-modal";
  modal.style.maxWidth = "420px";

  const header = document.createElement("div");
  header.className = "ul-modal-header";
  header.innerHTML = `<span>Demo Games</span>`;

  const closeBtn = document.createElement("button");
  closeBtn.className = "ul-close-btn";
  closeBtn.textContent = "âœ–";
  closeBtn.onclick = () => backdrop.remove();
  header.appendChild(closeBtn);
  modal.appendChild(header);

  const body = document.createElement("div");
  body.className = "ul-modal-body";
  body.style.display = "flex";
  body.style.flexDirection = "column";
  body.style.gap = "8px";

  function addGame(label, pgn) {
    const btn = document.createElement("button");
    btn.className = "epic-btn";
    btn.textContent = label;
    btn.onclick = () => {
      const ta = document.getElementById("pgnText");
      ta.value = pgn;
      gameMoves = parsePGN(pgn);
      manualAnchors = {};
      renderAll();
      enableManualAnchors();
      backdrop.remove();
    };
    body.appendChild(btn);
  }

  addGame("ðŸŽ­ Morphy â€“ Opera Game (1858)", demoMorphyPGN);
  addGame("â™œ Anderssen â€“ Immortal Game (1851)", demoImmortalPGN);
  addGame("â™š Capablanca â€“ Simul Mini", demoCapaPGN);
  addGame("ðŸ§  Rubinstein â€“ Rotlewi (1907)", demoRubinsteinPGN);
  addGame("âš”ï¸ Lasker â€“ Thomas (1912)", demoLaskerPGN);
   
  modal.appendChild(body);
  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);
}
