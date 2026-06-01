/* ---------- Templates Loader ---------- */

async function loadMemoryPalacesTemplate() {
  const resp = await fetch("../../user_libraries/user_memory_palaces_template.json");
  return await resp.json();
}

async function loadCharactersTemplate() {
  const resp = await fetch("../../user_libraries/user_characters_template.json");
  return await resp.json();
}

async function loadSquaresTemplate() {
  const resp = await fetch("../../user_libraries/user_squares_template.json");
  return await resp.json();
}

async function loadPAOTemplate() {
  const resp = await fetch("../../user_libraries/user_pao_00_99_template.json");
  return await resp.json();
}

/* ---------- Backdrop ---------- */

function createBackdrop() {
  const b = document.createElement("div");
  b.className = "ul-backdrop";
  return b;
}

/* ===========================================================
   10.1 Squares Modal
   =========================================================== */

function openSquaresModal(data) {
  const backdrop = createBackdrop();
  const modal = document.createElement("div");
  modal.className = "ul-modal";

  /* Header */
  const header = document.createElement("div");
  header.className = "ul-modal-header";
  header.innerHTML = `<span>Squares Library</span>`;

  const closeBtn = document.createElement("button");
  closeBtn.className = "ul-close-btn";
  closeBtn.textContent = "âœ–";
  closeBtn.onclick = () => backdrop.remove();
  header.appendChild(closeBtn);
  modal.appendChild(header);

  /* Body */
  const body = document.createElement("div");
  body.className = "ul-modal-body";

  for (const square in data) {
    const row = document.createElement("div");
    row.className = "ul-square-row";

    const label = document.createElement("div");
    label.className = "ul-square-label";
    label.textContent = square;

    const keyword = document.createElement("input");
    keyword.className = "ul-input";
    keyword.value = data[square].keyword || "";
    keyword.oninput = () => data[square].keyword = keyword.value;

    const uploadBtn = document.createElement("button");
    uploadBtn.className = "ul-upload-btn";
    uploadBtn.textContent = "Upload";
    uploadBtn.onclick = () => {
      const picker = document.createElement("input");
      picker.type = "file";
      picker.accept = ".png,.jpg,.jpeg,.webp";
      picker.onchange = () => {
        const file = picker.files[0];
        const reader = new FileReader();
        reader.onload = () => data[square].image = reader.result;
        reader.readAsDataURL(file);
      };
      picker.click();
    };

    const notes = document.createElement("input");
    notes.className = "ul-input-notes";
    notes.value = data[square].notes || "";
    notes.oninput = () => data[square].notes = notes.value;

    row.append(label, keyword, uploadBtn, notes);
    body.appendChild(row);
  }

  modal.appendChild(body);

  /* Footer */
  const footer = document.createElement("div");
  footer.className = "ul-modal-footer";

  const exportBtn = document.createElement("button");
  exportBtn.className = "ul-export-btn";
  exportBtn.textContent = "Export JSON";
  exportBtn.onclick = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "user_squares.json";
    a.click();
  };

  const cancelBtn = document.createElement("button");
  cancelBtn.className = "ul-cancel-btn";
  cancelBtn.textContent = "Cancel";
  cancelBtn.onclick = () => backdrop.remove();

  footer.append(exportBtn, cancelBtn);
  modal.appendChild(footer);

  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);
}
/* ===========================================================
   10.2 Memory Palace Modal
   =========================================================== */

function openMemoryPalaceModal(data) {
  const backdrop = createBackdrop();
  const modal = document.createElement("div");
  modal.className = "ul-modal";
  modal.style.maxWidth = "600px";

  /* Header */
  const header = document.createElement("div");
  header.className = "ul-modal-header";
  header.innerHTML = `<span>Memory Palace (Route)</span>`;

  const closeBtn = document.createElement("button");
  closeBtn.className = "ul-close-btn";
  closeBtn.textContent = "âœ–";
  closeBtn.onclick = () => backdrop.remove();
  header.appendChild(closeBtn);
  modal.appendChild(header);

  /* Body */
  const body = document.createElement("div");
  body.className = "ul-modal-body";

  const pal = data.palaces?.[0] || { name: "", description: "", locations: [] };

  /* Name */
  const nameInp = document.createElement("input");
  nameInp.className = "ul-input";
  nameInp.placeholder = "Palace name";
  nameInp.value = pal.name || "";
  nameInp.oninput = () => pal.name = nameInp.value;

  /* Description */
  const descInp = document.createElement("textarea");
  descInp.className = "ul-input";
  descInp.placeholder = "Description (optional)";
  descInp.style.minHeight = "60px";
  descInp.value = pal.description || "";
  descInp.oninput = () => pal.description = descInp.value;

  /* Locations List */
  const list = document.createElement("div");
  list.style.maxHeight = "360px";
  list.style.overflowY = "auto";
  list.style.border = "1px solid #333";
  list.style.padding = "8px";
  list.style.borderRadius = "8px";
  list.style.background = "#111";

  if (!Array.isArray(pal.locations) || pal.locations.length === 0) {
    pal.locations = Array.from({ length: 100 }, (_, i) => ({
      id: `L${i + 1}`,
      label: "",
      image: "",
      notes: ""
    }));
  }

  pal.locations.forEach(loc => {
    const row = document.createElement("div");
    row.className = "ul-square-row";

    const idTag = document.createElement("div");
    idTag.className = "ul-square-label";
    idTag.textContent = loc.id;

    const label = document.createElement("input");
    label.className = "ul-input";
    label.placeholder = `Label for ${loc.id}`;
    label.value = loc.label || "";
    label.oninput = () => loc.label = label.value;

    row.append(idTag, label);
    list.appendChild(row);
  });

  /* Actions */
  const actions = document.createElement("div");
  actions.style.display = "flex";
  actions.style.gap = "8px";
  actions.style.marginTop = "10px";

  const useNowBtn = document.createElement("button");
  useNowBtn.className = "epic-btn";
  useNowBtn.textContent = "âš¡ Use Now (apply to tables)";
  useNowBtn.onclick = () => {
    const labels = pal.locations.map(l => l.label || "");
    window.applyUserPalaceToTables?.(labels, pal.name || "User Palace");
    alert("âœ… Applied to tables.");
  };

  const saveBtn = document.createElement("button");
  saveBtn.className = "epic-btn";
  saveBtn.textContent = "ðŸ’¾ Save JSON";
  saveBtn.onclick = () => {
    const out = JSON.stringify({ palaces: [pal] }, null, 2);
    const blob = new Blob([out], { type: "application/json" });
    saveAs(blob, "user_memory_palaces.json");
    alert("âœ… Saved! ÎšÎ¬Î½Îµ upload ÎºÎ±Î¹ Î¼ÎµÏ„Î¬ Import.");
  };

  actions.append(useNowBtn, saveBtn);

  body.appendChild(nameInp);
  body.appendChild(descInp);
  body.appendChild(list);
  body.appendChild(actions);

  modal.appendChild(body);
  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);
}

/* ===========================================================
   10.3 Characters Modal
   =========================================================== */

function openCharactersModal(data) {
  const backdrop = createBackdrop();
  const modal = document.createElement("div");
  modal.className = "ul-modal";
  modal.style.maxWidth = "720px";

  const header = document.createElement("div");
  header.className = "ul-modal-header";
  header.innerHTML = `<span>Characters (Pieces + Pawns)</span>`;

  const closeBtn = document.createElement("button");
  closeBtn.className = "ul-close-btn";
  closeBtn.textContent = "âœ–";
  closeBtn.onclick = () => backdrop.remove();
  header.appendChild(closeBtn);
  modal.appendChild(header);

  const body = document.createElement("div");
  body.className = "ul-modal-body";

  const container = document.createElement("div");
  container.style.maxHeight = "420px";
  container.style.overflowY = "auto";
  container.style.border = "1px solid #333";
  container.style.borderRadius = "8px";
  container.style.padding = "8px";
  container.style.background = "#111";
  container.style.display = "grid";
  container.style.gridTemplateColumns = "repeat(2, 1fr)";
  container.style.gap = "8px";

  function section(title, obj) {
    const box = document.createElement("div");
    box.style.border = "1px solid #444";
    box.style.borderRadius = "8px";
    box.style.padding = "8px";

    const h = document.createElement("div");
    h.style.fontWeight = "bold";
    h.style.marginBottom = "6px";
    h.textContent = title;
    box.appendChild(h);

    Object.keys(obj).forEach(square => {
      const row = document.createElement("div");
      row.className = "ul-square-row";

      const tag = document.createElement("div");
      tag.className = "ul-square-label";
      tag.textContent = square;

      const name = document.createElement("input");
      name.className = "ul-input";
      name.placeholder = "Name";
      name.value = obj[square].name || "";
      name.oninput = () => obj[square].name = name.value;

      row.append(tag, name);
      box.appendChild(row);
    });

    return box;
  }

  /* White */
  const white = data.white || {};
  const whiteWrap = document.createElement("div");
  whiteWrap.style.gridColumn = "1 / -1";
  whiteWrap.style.marginBottom = "4px";
  whiteWrap.innerHTML = `<div style="font-weight:bold;color:#CFAF4A;">White</div>`;
  container.appendChild(whiteWrap);

  ["pawn", "knight", "bishop", "rook", "queen", "king"].forEach(p => {
    if (white[p]) container.appendChild(section(`White ${p}`, white[p]));
  });

  /* Black */
  const black = data.black || {};
  const blackWrap = document.createElement("div");
  blackWrap.style.gridColumn = "1 / -1";
  blackWrap.style.marginTop = "8px";
  blackWrap.innerHTML = `<div style="font-weight:bold;color:#CFAF4A;">Black</div>`;
  container.appendChild(blackWrap);

  ["pawn", "knight", "bishop", "rook", "queen", "king"].forEach(p => {
    if (black[p]) container.appendChild(section(`Black ${p}`, black[p]));
  });

  const saveBtn = document.createElement("button");
  saveBtn.className = "epic-btn";
  saveBtn.style.marginTop = "10px";
  saveBtn.textContent = "ðŸ’¾ Save JSON";
  saveBtn.onclick = () => {
    const out = JSON.stringify(data, null, 2);
    const blob = new Blob([out], { type: "application/json" });
    saveAs(blob, "user_characters.json");
    alert("âœ… Saved! ÎšÎ¬Î½Îµ upload ÎºÎ±Î¹ Î¼ÎµÏ„Î¬ Import.");
  };

  body.appendChild(container);
  body.appendChild(saveBtn);

  modal.appendChild(body);
  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);
}
/* ===========================================================
   10.4 PAO 00â€“99 Modal
   =========================================================== */
function openPAOModal(data) {
  const backdrop = createBackdrop();
  const modal = document.createElement("div");
  modal.className = "ul-modal";
  modal.style.maxWidth = "720px";

  const header = document.createElement("div");
  header.className = "ul-modal-header";
  header.innerHTML = `<span>PAO 00â€“99</span>`;

  const closeBtn = document.createElement("button");
  closeBtn.className = "ul-close-btn";
  closeBtn.textContent = "âœ–";
  closeBtn.onclick = () => backdrop.remove();
  header.appendChild(closeBtn);
  modal.appendChild(header);

  const body = document.createElement("div");
  body.className = "ul-modal-body";

  const grid = document.createElement("div");
  grid.style.display = "grid";
  grid.style.gridTemplateColumns = "repeat(2, 1fr)";
  grid.style.gap = "8px";
  grid.style.maxHeight = "420px";
  grid.style.overflowY = "auto";
  grid.style.border = "1px solid #333";
  grid.style.borderRadius = "8px";
  grid.style.padding = "8px";
  grid.style.background = "#111";

  Object.keys(data).sort().forEach(code => {
    const cell = document.createElement("div");
    cell.style.border = "1px solid #444";
    cell.style.borderRadius = "8px";
    cell.style.padding = "8px";

    const title = document.createElement("div");
    title.style.fontWeight = "bold";
    title.style.marginBottom = "4px";
    title.textContent = code;
    cell.appendChild(title);

    const p = document.createElement("input");
    p.className = "ul-input";
    p.placeholder = "Person";
    p.value = data[code].person || "";
    p.oninput = () => data[code].person = p.value;

    const a = document.createElement("input");
    a.className = "ul-input";
    a.placeholder = "Action";
    a.value = data[code].action || "";
    a.oninput = () => data[code].action = a.value;

    const o = document.createElement("input");
    o.className = "ul-input";
    o.placeholder = "Object";
    o.value = data[code].object || "";
    o.oninput = () => data[code].object = o.value;

    cell.append(p, a, o);
    grid.appendChild(cell);
  });

  const saveBtn = document.createElement("button");
  saveBtn.className = "epic-btn";
  saveBtn.style.marginTop = "10px";
  saveBtn.textContent = "ðŸ’¾ Save JSON";
  saveBtn.onclick = () => {
    const out = JSON.stringify(data, null, 2);
    const blob = new Blob([out], { type: "application/json" });
    saveAs(blob, "user_pao_00_99.json");
    alert("âœ… Saved! ÎšÎ¬Î½Îµ upload ÎºÎ±Î¹ Î¼ÎµÏ„Î¬ Import.");
  };

  body.appendChild(grid);
  body.appendChild(saveBtn);

  modal.appendChild(body);
  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);
}

/* ===========================================================
   10.5 Create Library Chooser (NEW)
   =========================================================== */

function openCreateLibraryChooser() {
  const backdrop = createBackdrop();
  const modal = document.createElement("div");
  modal.className = "ul-modal";
  modal.style.maxWidth = "420px";

  const header = document.createElement("div");
  header.className = "ul-modal-header";
  header.innerHTML = `<span>Create User Library</span>`;

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

  const info = document.createElement("div");
  info.style.fontSize = "0.9em";
  info.style.opacity = "0.8";
  info.textContent =
    "Choose the type of user library you want to create. A template will open for you to edit and then export as JSON.";
  body.appendChild(info);

  function addBtn(label, onClick) {
    const btn = document.createElement("button");
    btn.className = "epic-btn";
    btn.textContent = label;
    btn.onclick = async () => {
      await onClick();
      backdrop.remove();
    };
    body.appendChild(btn);
  }

     // Memory Palace
  addBtn("Memory Palace", async () => {
    const data = await loadMemoryPalacesTemplate();
    openMemoryPalaceModal(data);
  });
   
  // Characters
  addBtn("Characters Library", async () => {
    const data = await loadCharactersTemplate();
    openCharactersModal(data);
  });

  // Squares
  addBtn("Squares Library", async () => {
    const data = await loadSquaresTemplate();
    openSquaresModal(data);
  });

  // PAO 00â€“99
  addBtn("PAO 00â€“99", async () => {
    const data = await loadPAOTemplate();
    openPAOModal(data);
  });

  modal.appendChild(body);
  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);
}

/* ---- Wire Create Library button ---- */

function wireCreateLibraryButton() {
  const btn = document.getElementById("createLibraryBtn");
  if (!btn) return;
  btn.addEventListener("click", openCreateLibraryChooser);
}

/* ===========================================================
   10.6 Import Button (FULLY FIXED)
   =========================================================== */

function wireImportLibraryButton() {
  const importBtn = document.getElementById("importLibraryBtn");
  if (!importBtn) return;

  importBtn.addEventListener("click", () => {
    const picker = document.createElement("input");
    picker.type = "file";
    picker.accept = ".json";

    picker.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (ev) => {
        let json;

        /* Safe JSON Parse */
        try {
          json = JSON.parse(ev.target.result);
        } catch (err) {
          alert("âŒ Invalid JSON file: Cannot parse.");
          return;
        }

        /* Validate JSON Object */
        if (!json || typeof json !== "object") {
          alert("âŒ Invalid JSON structure.");
          return;
        }

        const name = file.name.replace(".json", "");

        libs = libs || {};
        libs.User = libs.User || {};
        /* Memory Palace */
        if (json.palaces && Array.isArray(json.palaces)) {
          libs.User.MemoryPalaces = json;

          const p = json.palaces[0];
          if (p?.locations?.length) {
            const loci = p.locations.map(l => l.label || "");
            window.applyUserPalaceToTables?.(loci, p.name || name);
          }

          updateUserLibraryStatus(
            `ðŸ›ï¸ <b>${p.name || name}</b> â€” ${p.locations.length} loci loaded 
             <span style="opacity:0.6;">(${new Date().toLocaleTimeString()})</span>`
          );
          alert("ðŸ›ï¸ User Memory Palace loaded!");
          return;
        }

        /* Characters Library */
        if (json.white && json.black) {
          libs.User.Characters = json;
          updateUserLibraryStatus(
            `â™Ÿï¸ <b>User Characters</b> loaded 
             <span style="opacity:0.6;">(${new Date().toLocaleTimeString()})</span>`
          );
          alert("â™Ÿï¸ User Characters loaded!");
          return;
        }

        /* PAO 00-99 */
        if (json["00"] || json["01"]) {
          libs.User.PAO_00_99 = json;
          updateUserLibraryStatus(
            `ðŸ”¢ <b>PAO 00â€“99</b> loaded 
             <span style="opacity:0.6;">(${new Date().toLocaleTimeString()})</span>`
          );
          alert("ðŸ”¢ User PAO 00â€“99 loaded!");
          return;
        }

        /* Squares Library */
        if (json.a1 || json.a2) {
          libs.User.Squares = json;
          const count = Object.keys(json).length;
          updateUserLibraryStatus(
            `ðŸ—ºï¸ <b>Squares Map</b> â€” ${count} squares loaded 
             <span style="opacity:0.6;">(${new Date().toLocaleTimeString()})</span>`
          );
          alert("ðŸ—ºï¸ User Squares loaded!");
          return;
        }

        /* Unknown Format */
        alert("âš ï¸ Unknown library format.");
      };

      reader.readAsText(file);
    };

    picker.click();
  });  // <-- Ï„Î­Î»Î¿Ï‚ importBtn.addEventListener
}       // <-- Ï„Î­Î»Î¿Ï‚ wireImportLibraryButton

/* ===========================================================
   11. LIBRARY SWITCHER (MODAL + DROPDOWN CHANGE)
   =========================================================== */

function openLibrarySelector() {
  const backdrop = document.createElement("div");
  backdrop.className = "ul-backdrop";

  const modal = document.createElement("div");
  modal.className = "ul-modal";
  modal.style.maxWidth = "420px";

  const header = document.createElement("div");
  header.className = "ul-modal-header";
  header.innerHTML = `<span>Select Active Mnemonic System</span>`;

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
  body.style.maxHeight = "400px";
  body.style.overflowY = "auto";

  const def = document.createElement("button");
  def.className = "epic-btn";
  def.textContent = "Default System";
  def.onclick = () => {
    setActiveLibrary("default", null);
    alert("âœ… Default system activated!");
    backdrop.remove();
  };
  body.appendChild(def);

  const renderUserLibraries = () => {
    body.querySelectorAll(".lib-row").forEach(r => r.remove());
    const saved = JSON.parse(localStorage.getItem("savedLibraries") || "[]");

    saved.forEach((lib, idx) => {
      const row = document.createElement("div");
      row.className = "lib-row";
      row.style.display = "flex";
      row.style.alignItems = "center";
      row.style.justifyContent = "space-between";
      row.style.gap = "8px";

      const btn = document.createElement("button");
      btn.className = "epic-btn";
      btn.textContent = lib.name || "Unnamed Library";
      btn.style.flex = "1";

      btn.onclick = () => {
        if (lib.path.startsWith("blob:")) {
          alert("âš ï¸ Blob URLs Î´ÎµÎ½ Ï…Ï€Î¿ÏƒÏ„Î·ÏÎ¯Î¶Î¿Î½Ï„Î±Î¹ ÏƒÏ„Î¿ GitHub Pages.\nÎ¦ÏŒÏÏ„Ï‰ÏƒÎµ Î²Î¹Î²Î»Î¹Î¿Î¸Î®ÎºÎ· Î±Ï€ÏŒ Ï„Î¿Î½ Ï†Î¬ÎºÎµÎ»Î¿ /user_libraries/.");
          return;
        }
        setActiveLibrary(lib.type, lib.path);
        alert(`âœ… Activated: ${lib.name}`);
      };

      const del = document.createElement("button");
      del.textContent = "âœ–";
      del.title = "Delete from local history";
      del.style.cssText = `
        background:none;
        border:none;
        color:#339CFF;
        font-size:1.1em;
        font-weight:bold;
        cursor:pointer;
        padding:0 8px;
        transition: color 0.2s ease;
      `;
      del.onmouseover = () => (del.style.color = "#66BFFF");
      del.onmouseout = () => (del.style.color = "#339CFF");

      del.onclick = (ev) => {
        ev.stopPropagation();
        if (confirm(`Delete library "${lib.name}" from local history?`)) {
          saved.splice(idx, 1);
          localStorage.setItem("savedLibraries", JSON.stringify(saved));
          const active = getActiveLibrary();
          if (active && active.path === lib.path) {
            localStorage.removeItem("activeLibrary");
          }
          console.log(`ðŸ—‘ï¸ Library "${lib.name}" deleted from history.`);
          renderUserLibraries();
          loadUserLibrariesIntoUI();
        }
      };

      row.append(btn, del);
      body.appendChild(row);
    });
  };

  renderUserLibraries();
  modal.appendChild(body);
  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);
}

/* dropdown: userLibrarySelect change â†’ load JSON and apply to libs.User */

function wireUserLibraryDropdown() {
  const sel = document.getElementById("userLibrarySelect");
  if (!sel) return;

  sel.addEventListener("change", async (e) => {
    const path = e.target.value;
    if (!path) return;

    try {
      if (path.startsWith("blob:")) {
        alert("âš ï¸ Blob URLs Î´ÎµÎ½ Ï…Ï€Î¿ÏƒÏ„Î·ÏÎ¯Î¶Î¿Î½Ï„Î±Î¹ ÏƒÏ„Î¿ GitHub Pages.\nÎ Î±ÏÎ±ÎºÎ±Î»ÏŽ Ï†ÏŒÏÏ„Ï‰ÏƒÎµ Î²Î¹Î²Î»Î¹Î¿Î¸Î®ÎºÎ· Î±Ï€ÏŒ /user_libraries/.");
        return;
      }

      const resp = await fetch(path);
      const json = await resp.json();
      libs = libs || {};
      libs.User = libs.User || {};
      if (json.white && json.black) {
        libs.User.Characters = json;
        console.log("âœ… Loaded User Characters Library");
      } else if (json.palaces) {
        libs.User.MemoryPalaces = json;
        console.log("âœ… Loaded User Memory Palace Library");
      } else if (json["00"] || json["01"]) {
        libs.User.PAO_00_99 = json;
        console.log("âœ… Loaded User PAO 00â€“99 Library");
      } else if (json.a1 || json.a2) {
        libs.User.Squares = json;
        console.log("âœ… Loaded User Squares Library");
      } else {
        console.warn("âš ï¸ Unknown library type:", json);
      }

      openLibrarySelector(); // Î±Î½ Î¸Î­Î»ÎµÎ¹Ï‚, Î¼Ï€Î¿ÏÎµÎ¯Ï‚ Î½Î± Ï„Î¿ Î±Ï†Î±Î¹ÏÎ­ÏƒÎµÎ¹Ï‚
      if (json.palaces?.length) {
        const palace = json.palaces[0];
        if (palace?.locations?.length) {
          const loci = palace.locations.map(l => l.label);
          window.applyUserPalaceToTables?.(loci, palace.name);
        }
      }
    } catch (err) {
      console.error("âŒ Error loading user library:", err);
      alert("âŒ Failed to load the selected library. Check file path or network.");
    }
  });
}
/* ===========================================================
   12. MEMORY PALACE â†’ TABLE MAPPER (FIXED: WAITS FOR TABLES)
   =========================================================== */

(() => {
  const TABLE_IDS = ["sanBody", "assocBody", "paoBody", "pao99Body", "shortnamesBody"];
  const LOCUS_COL = 3;

function updateLocusColumn(bodyId, lociArray) {
  const tbody = document.getElementById(bodyId);
  if (!tbody) return;

  const rows = Array.from(tbody.rows);
  if (!rows.length) return;

  // ÎºÎ±Î¸Î¬ÏÎ¹ÏƒÎ¼Î± Ï€Î±Î»Î¹ÏŽÎ½ loci
  rows.forEach(row => {
    if (row.cells[LOCUS_COL]) {
      row.cells[LOCUS_COL].textContent = "";
    }
  });

  // Î³Î­Î¼Î¹ÏƒÎ¼Î± Î¼Îµ Ï„Î± labels Ï„Î¿Ï… user palace
  lociArray.forEach((label, i) => {
    const row = rows[i];
    if (row && row.cells[LOCUS_COL]) {
      row.cells[LOCUS_COL].textContent = label;
    }
  });

  console.log(`âœ… Locus column updated in #${bodyId} with ${lociArray.length} loci`);
}

  function showPalaceInfo(palaceName, count) {
    let info = document.getElementById("activePalaceInfo");
    if (!info) {
      info = document.createElement("div");
      info.id = "activePalaceInfo";
      info.style.cssText = `
        color:#CFAF4A;
        margin-top:6px;
        font-size:0.9em;
        font-family:Georgia, 'Times New Roman', serif;
      `;
      const container = document.getElementById("userLibraryStatus");
      if (container) container.appendChild(info);
    }
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    info.innerHTML = `ðŸ›ï¸ <b>${palaceName}</b> â€” ${count} loci loaded 
                      <span style="color:#888;">(${now})</span>`;
  }

  function waitForTables(callback, lociArray, palaceName) {
    const allExist = TABLE_IDS.every(id => document.getElementById(id));
    if (allExist) {
      TABLE_IDS.forEach(id => updateLocusColumn(id, lociArray));
      showPalaceInfo(palaceName, lociArray.length);
    } else {
      setTimeout(() => waitForTables(callback, lociArray, palaceName), 100);
    }
  }

  window.applyUserPalaceToTables = function(lociArray, palaceName = "Unnamed") {
    if (!Array.isArray(lociArray) || !lociArray.length) return;
    waitForTables(updateLocusColumn, lociArray, palaceName);
  };
})();

/* ===========================================================
   13. PGN WIRING & INIT
   =========================================================== */
