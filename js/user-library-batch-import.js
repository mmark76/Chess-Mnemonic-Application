/* ===========================================================
   User Library Batch Import + Shortnames Support
   =========================================================== */
(function () {
  const LIBRARY_OPTIONS = [
    { key: "Memory Palace", label: "Memory Palace" },
    { key: "Characters", label: "Characters" },
    { key: "Squares", label: "Squares" },
    { key: "Shortnames", label: "Shortnames" },
    { key: "PAO 00–99", label: "PAO 00–99" },
    { key: "Combined", label: "Combined user template" }
  ];

  function ensureUserRoot() {
    if (typeof libs === "undefined") return null;
    libs = libs || {};
    libs.User = libs.User || {};
    return libs.User;
  }

  function shortnamesFrom(json) {
    if (!json || typeof json !== "object") return null;
    if (json.User && json.User.Shortnames) return json.User.Shortnames;
    if (json.Shortnames) return json.Shortnames;
    if (json.CharactersSN1 || json.SquaresSN1 || json.CastlingSN1 || json.Actions) return json;
    return null;
  }

  function detectType(json) {
    if (!json || typeof json !== "object") return null;
    if (json.User && typeof json.User === "object") return "Combined";
    if (Array.isArray(json.palaces)) return "Memory Palace";
    if (json.white && json.black) return "Characters";
    if (json.a1 || json.a2) return "Squares";
    if (json["00"] || json["01"]) return "PAO 00–99";
    if (shortnamesFrom(json)) return "Shortnames";
    return null;
  }

  function applyJson(json, sourceName) {
    const user = ensureUserRoot();
    if (!user) return [];

    const loaded = [];

    function applyMemoryPalace(data) {
      if (!data || !Array.isArray(data.palaces)) return;
      user.MemoryPalaces = data;
      loaded.push("Memory Palace");
      const palace = data.palaces[0];
      if (palace && Array.isArray(palace.locations) && typeof window.applyUserPalaceToTables === "function") {
        window.applyUserPalaceToTables(palace.locations.map(l => l.label || ""), palace.name || sourceName || "User Palace");
      }
    }

    function applyCharacters(data) {
      if (!data || !data.white || !data.black) return;
      user.Characters = data;
      loaded.push("Characters");
    }

    function applySquares(data) {
      if (!data || !(data.a1 || data.a2)) return;
      user.Squares = data;
      loaded.push("Squares");
    }

    function applyPao(data) {
      if (!data || !(data["00"] || data["01"])) return;
      user.PAO_00_99 = data;
      loaded.push("PAO 00–99");
    }

    function applyShortnames(data) {
      const s = shortnamesFrom(data);
      if (!s) return;
      user.Shortnames = s;
      loaded.push("Shortnames");
    }

    if (json.User && typeof json.User === "object") {
      applyMemoryPalace(json.User.MemoryPalaces);
      applyCharacters(json.User.Characters);
      applySquares(json.User.Squares);
      applyShortnames(json.User.Shortnames);
      applyPao(json.User.PAO_00_99);
      return loaded;
    }

    const type = detectType(json);
    if (type === "Memory Palace") applyMemoryPalace(json);
    else if (type === "Characters") applyCharacters(json);
    else if (type === "Squares") applySquares(json);
    else if (type === "Shortnames") applyShortnames(json);
    else if (type === "PAO 00–99") applyPao(json);

    return loaded;
  }

  function refreshTables() {
    try {
      if (typeof renderAll === "function") renderAll();
      if (typeof enableManualAnchors === "function") enableManualAnchors();
    } catch (err) {
      console.warn("User library refresh failed:", err);
    }
  }

  function readJsonFile(file) {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = ev => {
        try {
          resolve({ file, json: JSON.parse(ev.target.result), error: null });
        } catch (error) {
          resolve({ file, json: null, error });
        }
      };
      reader.onerror = () => resolve({ file, json: null, error: new Error("File read error") });
      reader.readAsText(file);
    });
  }

  async function importFiles(files, expectedTypes) {
    const loaded = [];
    const errors = [];

    for (const file of files) {
      const result = await readJsonFile(file);
      if (result.error) {
        errors.push(file.name + ": invalid JSON");
        continue;
      }

      const names = applyJson(result.json, file.name);
      if (names.length) loaded.push(...names);
      else errors.push(file.name + ": unknown library format");
    }

    refreshTables();

    const unique = Array.from(new Set(loaded));
    const message = unique.length ? "✅ Loaded: " + unique.join(", ") : "⚠️ No supported user libraries were loaded.";

    const expected = Array.isArray(expectedTypes) ? expectedTypes : [];
    const missing = expected.includes("Combined")
      ? []
      : expected.filter(type => !unique.includes(type));

    if (typeof updateUserLibraryStatus === "function") updateUserLibraryStatus(message);
    if (errors.length) console.warn("Some files were not loaded:", errors);
    if (missing.length) console.warn("Selected library types not loaded:", missing);

    alert(
      message +
      (missing.length ? "\n\nNot loaded from selected checklist: " + missing.join(", ") : "") +
      (errors.length ? "\n\nSome files were skipped. Check console for details." : "")
    );
  }

  function showLibraryTypeChooser() {
    return new Promise(resolve => {
      const backdrop = document.createElement("div");
      backdrop.className = "ul-backdrop";
      backdrop.style.display = "flex";
      backdrop.style.alignItems = "center";
      backdrop.style.justifyContent = "center";

      const modal = document.createElement("div");
      modal.className = "ul-modal";
      modal.style.maxWidth = "460px";

      const header = document.createElement("div");
      header.className = "ul-modal-header";
      header.innerHTML = `<span>Select user libraries to load</span>`;

      const closeBtn = document.createElement("button");
      closeBtn.className = "ul-close-btn";
      closeBtn.textContent = "✖";
      closeBtn.onclick = () => {
        backdrop.remove();
        resolve(null);
      };
      header.appendChild(closeBtn);

      const body = document.createElement("div");
      body.className = "ul-modal-body";
      body.style.display = "flex";
      body.style.flexDirection = "column";
      body.style.gap = "10px";

      const info = document.createElement("p");
      info.textContent = "Tick the library types you want to upload, then select the matching JSON files.";
      info.style.margin = "0 0 4px 0";
      info.style.fontSize = "0.92em";
      info.style.opacity = "0.85";
      body.appendChild(info);

      const checkboxWrap = document.createElement("div");
      checkboxWrap.style.display = "grid";
      checkboxWrap.style.gridTemplateColumns = "1fr";
      checkboxWrap.style.gap = "8px";

      LIBRARY_OPTIONS.forEach(option => {
        const label = document.createElement("label");
        label.style.display = "flex";
        label.style.alignItems = "center";
        label.style.gap = "8px";
        label.style.cursor = "pointer";

        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.value = option.key;
        cb.checked = option.key !== "Combined";

        label.appendChild(cb);
        label.appendChild(document.createTextNode(option.label));
        checkboxWrap.appendChild(label);
      });
      body.appendChild(checkboxWrap);

      const buttons = document.createElement("div");
      buttons.style.display = "flex";
      buttons.style.justifyContent = "flex-end";
      buttons.style.gap = "8px";
      buttons.style.marginTop = "10px";

      const cancel = document.createElement("button");
      cancel.className = "epic-btn";
      cancel.textContent = "Cancel";
      cancel.onclick = () => {
        backdrop.remove();
        resolve(null);
      };

      const continueBtn = document.createElement("button");
      continueBtn.className = "epic-btn";
      continueBtn.textContent = "Continue";
      continueBtn.onclick = () => {
        const selected = Array.from(modal.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
        if (!selected.length) {
          alert("Please select at least one library type.");
          return;
        }
        backdrop.remove();
        resolve(selected);
      };

      buttons.append(cancel, continueBtn);
      body.appendChild(buttons);

      modal.append(header, body);
      backdrop.appendChild(modal);
      document.body.appendChild(backdrop);
    });
  }

  function wireBatchImportButton() {
    const oldBtn = document.getElementById("importLibraryBtn");
    if (!oldBtn || oldBtn.dataset.batchImportReady === "1") return;

    const newBtn = oldBtn.cloneNode(true);
    newBtn.dataset.batchImportReady = "1";
    oldBtn.parentNode.replaceChild(newBtn, oldBtn);

    newBtn.addEventListener("click", async () => {
      const selectedTypes = await showLibraryTypeChooser();
      if (!selectedTypes) return;

      const picker = document.createElement("input");
      picker.type = "file";
      picker.accept = ".json,application/json";
      picker.multiple = true;
      picker.onchange = async () => {
        const files = Array.from(picker.files || []);
        if (!files.length) return;
        await importFiles(files, selectedTypes);
      };
      picker.click();
    });
  }

  function patchShortnameAccessors() {
    if (typeof characterShortnameBySquare === "function" && !characterShortnameBySquare.__userShortnamesPatched) {
      const original = characterShortnameBySquare;
      characterShortnameBySquare = function (square, pieceLetter) {
        const key = `${pieceLetter}${square || ""}`;
        const s = libs && libs.User && libs.User.Shortnames;
        return s?.CharactersSN1?.[key] || s?.PieceShortnames?.[key] || original(square, pieceLetter);
      };
      characterShortnameBySquare.__userShortnamesPatched = true;
    }

    if (typeof squareShortname === "function" && !squareShortname.__userShortnamesPatched) {
      const original = squareShortname;
      squareShortname = function (square) {
        const s = libs && libs.User && libs.User.Shortnames;
        return s?.SquaresSN1?.[square] || s?.SquareShortnames?.[square] || original(square);
      };
      squareShortname.__userShortnamesPatched = true;
    }

    if (typeof castlingShortnameName === "function" && !castlingShortnameName.__userShortnamesPatched) {
      const original = castlingShortnameName;
      castlingShortnameName = function (san) {
        const clean = String(san || "").replace(/[+#?!]+/g, "");
        const s = libs && libs.User && libs.User.Shortnames;
        return s?.CastlingSN1?.[clean] || original();
      };
      castlingShortnameName.__userShortnamesPatched = true;
    }
  }

  function wireTemplatesZipButton() {
    const oldBtn = document.getElementById("downloadTemplatesBtn");
    if (!oldBtn || oldBtn.dataset.extendedTemplatesReady === "1" || typeof JSZip === "undefined") return;

    const newBtn = oldBtn.cloneNode(true);
    newBtn.dataset.extendedTemplatesReady = "1";
    oldBtn.parentNode.replaceChild(newBtn, oldBtn);

    newBtn.addEventListener("click", async () => {
      const templates = [
        { filename: "template_characters.json", path: "user_libraries/user_characters_template.json" },
        { filename: "template_memory_palaces.json", path: "user_libraries/user_memory_palaces_template.json" },
        { filename: "template_pao_00_99.json", path: "user_libraries/user_pao_00_99_template.json" },
        { filename: "template_squares.json", path: "user_libraries/user_squares_template.json" },
        { filename: "template_shortnames.json", path: "user_libraries/user_shortnames_template.json" },
        { filename: "libraries_user_template.json", path: "user_libraries/libraries_user_template.json" }
      ];

      const zip = new JSZip();
      for (const tpl of templates) {
        const resp = await fetch(tpl.path);
        if (!resp.ok) throw new Error("Could not load " + tpl.path);
        const json = await resp.json();
        zip.file(tpl.filename, JSON.stringify(json, null, 2));
      }

      const content = await zip.generateAsync({ type: "blob" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(content);
      a.download = "CMA_User_Library_Templates.zip";
      a.click();
      alert("📦 User library templates ZIP downloaded!");
    });
  }

  function init() {
    patchShortnameAccessors();
    setTimeout(() => {
      patchShortnameAccessors();
      wireBatchImportButton();
      wireTemplatesZipButton();
    }, 0);
    setTimeout(patchShortnameAccessors, 500);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  window.CMAUserLibraryBatchImport = { applyJson, detectType, importFiles };
})();
