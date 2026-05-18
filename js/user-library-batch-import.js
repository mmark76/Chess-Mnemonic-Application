/* ===========================================================
   User Library Import + Shortnames + CSV/XLSX Support
   Direct multi-file import. JSON remains the official app format.
   =========================================================== */
(function () {
  const SHEETJS_URL = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";

  function clean(value) {
    return String(value == null ? "" : value).trim();
  }

  function normalHeader(value) {
    return clean(value).toLowerCase().replace(/\s+/g, "_").replace(/-/g, "_");
  }

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

  function parseCSV(text) {
    const rows = [];
    let row = [];
    let cell = "";
    let quoted = false;

    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      const next = text[i + 1];
      if (quoted) {
        if (ch === '"' && next === '"') { cell += '"'; i++; }
        else if (ch === '"') quoted = false;
        else cell += ch;
      } else {
        if (ch === '"') quoted = true;
        else if (ch === ',') { row.push(cell); cell = ""; }
        else if (ch === '\n') { row.push(cell); rows.push(row); row = []; cell = ""; }
        else if (ch !== '\r') cell += ch;
      }
    }
    row.push(cell);
    rows.push(row);
    return rows.filter(r => r.some(c => clean(c) !== ""));
  }

  function rowsToObjects(rows) {
    if (!rows || rows.length < 2) return [];
    const headers = rows[0].map(normalHeader);
    return rows.slice(1).map(row => {
      const obj = {};
      headers.forEach((h, i) => { obj[h] = clean(row[i]); });
      return obj;
    }).filter(obj => Object.values(obj).some(v => clean(v) !== ""));
  }

  function tableRowsToJson(rows, fileName) {
    const objects = rowsToObjects(rows);
    if (!objects.length) return null;
    const headers = Object.keys(objects[0]);
    const has = names => names.every(n => headers.includes(n));

    if (has(["code", "person", "action", "object"])) {
      const out = {};
      objects.forEach(r => {
        const code = clean(r.code).padStart(2, "0");
        if (/^\d{2}$/.test(code)) out[code] = { person: r.person || "", action: r.action || "", object: r.object || "" };
      });
      return Object.keys(out).length ? out : null;
    }

    if (has(["square", "keyword"])) {
      const out = {};
      objects.forEach(r => {
        const square = clean(r.square).toLowerCase();
        if (/^[a-h][1-8]$/.test(square)) out[square] = { keyword: r.keyword || "", image: r.image || "", notes: r.notes || "" };
      });
      return Object.keys(out).length ? out : null;
    }

    if (has(["color", "piece", "square", "name"])) {
      const out = { white: {}, black: {} };
      objects.forEach(r => {
        const color = clean(r.color).toLowerCase();
        const piece = clean(r.piece).toLowerCase();
        const square = clean(r.square).toLowerCase();
        if (!out[color] || !piece || !/^[a-h][1-8]$/.test(square)) return;
        out[color][piece] = out[color][piece] || {};
        out[color][piece][square] = { name: r.name || "", notes: r.notes || "" };
      });
      return (Object.keys(out.white).length || Object.keys(out.black).length) ? out : null;
    }

    if (has(["id", "label"]) || has(["locus", "label"])) {
      const first = objects[0] || {};
      const palaceName = first.palace_name || first.palace || fileName.replace(/\.(csv|xlsx|xls)$/i, "") || "User Palace";
      const description = first.palace_description || first.description || "";
      const locations = objects.map((r, index) => ({
        id: r.id || r.locus || `L${index + 1}`,
        label: r.label || "",
        image: r.image || "",
        notes: r.notes || ""
      })).filter(loc => loc.id || loc.label || loc.notes);
      return locations.length ? { palaces: [{ name: palaceName, description, locations }] } : null;
    }

    if (has(["type", "key", "shortname"])) {
      const out = { CharactersSN1: {}, SquaresSN1: {}, CastlingSN1: {}, Actions: {} };
      objects.forEach(r => {
        const type = clean(r.type).toLowerCase();
        const key = clean(r.key);
        const value = r.shortname || r.value || "";
        if (!key) return;
        if (type === "character" || type === "piece") out.CharactersSN1[key] = value;
        else if (type === "square") out.SquaresSN1[key.toLowerCase()] = value;
        else if (type === "castling") out.CastlingSN1[key] = value;
        else if (type === "action") out.Actions[key] = value;
      });
      return (Object.keys(out.CharactersSN1).length || Object.keys(out.SquaresSN1).length || Object.keys(out.CastlingSN1).length || Object.keys(out.Actions).length) ? out : null;
    }
    return null;
  }

  function loadSheetJS() {
    return new Promise((resolve, reject) => {
      if (window.XLSX) return resolve(window.XLSX);
      const script = document.createElement("script");
      script.src = SHEETJS_URL;
      script.onload = () => window.XLSX ? resolve(window.XLSX) : reject(new Error("XLSX library unavailable"));
      script.onerror = () => reject(new Error("Could not load XLSX parser"));
      document.head.appendChild(script);
    });
  }

  function readAsText(file) {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = ev => resolve({ value: ev.target.result, error: null });
      reader.onerror = () => resolve({ value: "", error: new Error("File read error") });
      reader.readAsText(file);
    });
  }

  function readAsArrayBuffer(file) {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = ev => resolve({ value: ev.target.result, error: null });
      reader.onerror = () => resolve({ value: null, error: new Error("File read error") });
      reader.readAsArrayBuffer(file);
    });
  }

  async function readLibraryFile(file) {
    const name = file.name || "";
    const lower = name.toLowerCase();

    if (lower.endsWith(".json")) {
      const result = await readAsText(file);
      if (result.error) return { file, json: null, error: result.error };
      try { return { file, json: JSON.parse(result.value), error: null }; }
      catch (error) { return { file, json: null, error }; }
    }

    if (lower.endsWith(".csv")) {
      const result = await readAsText(file);
      if (result.error) return { file, json: null, error: result.error };
      const json = tableRowsToJson(parseCSV(result.value), name);
      return json ? { file, json, error: null } : { file, json: null, error: new Error("Unknown CSV structure") };
    }

    if (lower.endsWith(".xlsx") || lower.endsWith(".xls")) {
      const result = await readAsArrayBuffer(file);
      if (result.error) return { file, json: null, error: result.error };
      try {
        const XLSX = await loadSheetJS();
        const workbook = XLSX.read(result.value, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1, defval: "" });
        const json = tableRowsToJson(rows, name);
        return json ? { file, json, error: null } : { file, json: null, error: new Error("Unknown Excel structure") };
      } catch (error) {
        return { file, json: null, error };
      }
    }

    return { file, json: null, error: new Error("Unsupported file type") };
  }

  async function importFiles(files) {
    const loaded = [];
    const errors = [];

    if (files.length > 1) {
      const ok = confirm(
        "You selected multiple library files.\n\n" +
        "If two files contain the same library type or the same keys, later files may overwrite earlier values.\n\n" +
        "Continue with import?"
      );
      if (!ok) return;
    }

    for (const file of files) {
      const result = await readLibraryFile(file);
      if (result.error) {
        errors.push(file.name + ": " + result.error.message);
        continue;
      }
      const names = applyJson(result.json, file.name);
      if (names.length) loaded.push(...names);
      else errors.push(file.name + ": unknown library format");
    }

    refreshTables();
    const unique = Array.from(new Set(loaded));
    const message = unique.length ? "✅ Loaded: " + unique.join(", ") : "⚠️ No supported user libraries were loaded.";
    if (typeof updateUserLibraryStatus === "function") updateUserLibraryStatus(message);
    if (errors.length) console.warn("Some files were not loaded:", errors);
    alert(message + (errors.length ? "\n\nSome files were skipped. Check console for details." : ""));
  }

  function openFilePicker() {
    const picker = document.createElement("input");
    picker.type = "file";
    picker.accept = ".json,.csv,.xlsx,.xls,application/json,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel";
    picker.multiple = true;
    picker.onchange = async () => {
      const files = Array.from(picker.files || []);
      if (!files.length) return;
      await importFiles(files);
    };
    picker.click();
  }

  function wireImportButton() {
    const oldBtn = document.getElementById("importLibraryBtn");
    if (!oldBtn || oldBtn.dataset.directImportReady === "1") return;
    const newBtn = oldBtn.cloneNode(true);
    newBtn.dataset.directImportReady = "1";
    oldBtn.parentNode.replaceChild(newBtn, oldBtn);
    newBtn.addEventListener("click", openFilePicker);
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
        const cleanSan = String(san || "").replace(/[+#?!]+/g, "");
        const s = libs && libs.User && libs.User.Shortnames;
        return s?.CastlingSN1?.[cleanSan] || original();
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
        { filename: "template_characters.json", path: "user_libraries/user_characters_template.json", type: "json" },
        { filename: "template_memory_palaces.json", path: "user_libraries/user_memory_palaces_template.json", type: "json" },
        { filename: "template_pao_00_99.json", path: "user_libraries/user_pao_00_99_template.json", type: "json" },
        { filename: "template_squares.json", path: "user_libraries/user_squares_template.json", type: "json" },
        { filename: "template_shortnames.json", path: "user_libraries/user_shortnames_template.json", type: "json" },
        { filename: "libraries_user_template.json", path: "user_libraries/libraries_user_template.json", type: "json" },
        { filename: "csv_template_characters.csv", path: "user_libraries/csv_template_characters.csv", type: "text" },
        { filename: "csv_template_memory_palaces.csv", path: "user_libraries/csv_template_memory_palaces.csv", type: "text" },
        { filename: "csv_template_pao_00_99.csv", path: "user_libraries/csv_template_pao_00_99.csv", type: "text" },
        { filename: "csv_template_squares.csv", path: "user_libraries/csv_template_squares.csv", type: "text" },
        { filename: "csv_template_shortnames.csv", path: "user_libraries/csv_template_shortnames.csv", type: "text" }
      ];
      const zip = new JSZip();
      for (const tpl of templates) {
        const resp = await fetch(tpl.path);
        if (!resp.ok) throw new Error("Could not load " + tpl.path);
        if (tpl.type === "json") zip.file(tpl.filename, JSON.stringify(await resp.json(), null, 2));
        else zip.file(tpl.filename, await resp.text());
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
      wireImportButton();
      wireTemplatesZipButton();
    }, 0);
    setTimeout(patchShortnameAccessors, 500);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  window.CMAUserLibraryBatchImport = { applyJson, detectType, importFiles, openFilePicker };
})();
