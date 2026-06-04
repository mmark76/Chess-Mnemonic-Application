// user-libraries-history.js
// Custom library import/history support and Library System panel UX.

(function () {
  // ----------------- helpers -----------------

  function loadRuntimeHelper() {
    if (window.__cmaUserRuntimeFixLoading) return;
    window.__cmaUserRuntimeFixLoading = true;
    const script = document.createElement("script");
    script.src = "js/user-library-runtime-fix.js";
    script.defer = true;
    document.head.appendChild(script);
  }

  function isCompleteLibraryBundle(json) {
    return !!(
      json &&
      typeof json === "object" &&
      json.Temporal &&
      json.Spatial &&
      json.Characters &&
      (json["PAO 0-9"] || json["PAO 00-99"])
    );
  }

  function detectLibraryType(json) {
    if (!json || typeof json !== "object") return null;
    if (isCompleteLibraryBundle(json)) return "CompleteLibrary";
    if (Array.isArray(json.palaces)) return "MemoryPalace";
    if (json.white && json.black) return "Characters";
    if (json["00"] || json["01"]) return "PAO_00_99";
    if (json.a1 || json.a2) return "Squares";
    return null;
  }

  function rebuildGameAndTablesAfterLibraryChange() {
    setTimeout(() => {
      try {
        const pgnEl = document.getElementById("pgnText");
        if (pgnEl && pgnEl.value.trim() && typeof parsePGN === "function") {
          const source = typeof cleanPGN === "function" ? cleanPGN(pgnEl.value) : pgnEl.value;
          if (source !== pgnEl.value) pgnEl.value = source;
          gameMoves = parsePGN(source);
        }

        if (typeof renderAll === "function") renderAll();
        if (typeof enableManualAnchors === "function") enableManualAnchors();

        const tableSelect = document.getElementById("tableSelect");
        if (tableSelect && typeof showOnlySection === "function") {
          showOnlySection(tableSelect.value || "sanSection");
        }
      } catch (e) {
        console.warn("user-libraries-history: table rebuild after library import failed", e);
      }
    }, 250);
  }

  function refreshTablesAfterUserLibraryImport() {
    rebuildGameAndTablesAfterLibraryChange();
  }

  function saveLibraryToHistory(fileName, json) {
    const type = detectLibraryType(json);
    if (!type) return;

    const baseName = (fileName || "").replace(/\.json$/i, "") || "User Library";
    let libName = baseName;

    if (json && typeof json === "object") {
      if (json.name) libName = json.name;
      if (Array.isArray(json.palaces) && json.palaces[0]?.name) {
        libName = json.palaces[0].name;
      }
      if (type === "CompleteLibrary") {
        libName = baseName || "Complete Mnemonic Library";
      }
    }

    const path = "user_libraries/" + (fileName || "user-library.json");

    let saved;
    try {
      saved = JSON.parse(localStorage.getItem("savedLibraries") || "[]");
      if (!Array.isArray(saved)) saved = [];
    } catch {
      saved = [];
    }

    const entry = { name: libName, type, path };
    const idxByPath = saved.findIndex((l) => l.path === entry.path);

    if (idxByPath >= 0) saved[idxByPath] = entry;
    else saved.push(entry);

    localStorage.setItem("savedLibraries", JSON.stringify(saved));

    try {
      localStorage.setItem("activeLibrary", JSON.stringify({ type, path }));
    } catch (e) {
      console.warn("user-libraries-history: activeLibrary save failed", e);
    }

    try {
      if (typeof loadUserLibrariesIntoUI === "function") loadUserLibrariesIntoUI();
    } catch (e) {
      console.warn("user-libraries-history: loadUserLibrariesIntoUI failed", e);
    }

    refreshTablesAfterUserLibraryImport();

    console.log(`💾 Saved user library → name="${libName}", type="${type}", path="${path}"`);
  }

  function applyImportedLibrary(fileName, json, options = {}) {
    const silent = options.silent === true;

    if (!json || typeof json !== "object") {
      const message = "Invalid JSON structure.";
      if (!silent) alert("❌ " + message);
      return { ok: false, fileName, type: null, message };
    }

    const type = detectLibraryType(json);
    const name = (fileName || "user-library.json").replace(/\.json$/i, "");

    if (type === "CompleteLibrary") {
      libs = json;
      try {
        window.libs = libs;
      } catch (e) {
        console.warn("user-libraries-history: window.libs sync failed", e);
      }

      updateUserLibraryStatus(
        `📚 <b>${name}</b> — complete mnemonic library loaded ` +
        `<span style="opacity:0.6;">(${new Date().toLocaleTimeString()})</span>`
      );
      saveLibraryToHistory(fileName, json);
      refreshTablesAfterUserLibraryImport();
      if (!silent) alert("📚 Complete mnemonic library loaded!");
      return { ok: true, fileName, type, name, message: "Complete mnemonic library loaded" };
    }

    libs = libs || {};
    libs.User = libs.User || {};

    if (type === "MemoryPalace") {
      libs.User.MemoryPalaces = json;
      const p = json.palaces[0] || {};
      const loci = Array.isArray(p.locations) ? p.locations.map(l => l.label || "") : [];

      if (loci.length) {
        window.applyUserPalaceToTables?.(loci, p.name || name);
      }

      updateUserLibraryStatus(
        `🏛️ <b>${p.name || name}</b> — ${loci.length} loci loaded ` +
        `<span style="opacity:0.6;">(${new Date().toLocaleTimeString()})</span>`
      );
      saveLibraryToHistory(fileName, json);
      if (!silent) alert("🏛️ User Memory Palace loaded!");
      return { ok: true, fileName, type, name: p.name || name, message: `${loci.length} loci loaded` };
    }

    if (type === "Characters") {
      libs.User.Characters = json;
      updateUserLibraryStatus(
        `♟️ <b>User Characters</b> loaded ` +
        `<span style="opacity:0.6;">(${new Date().toLocaleTimeString()})</span>`
      );
      saveLibraryToHistory(fileName, json);
      if (!silent) alert("♟️ User Characters loaded!");
      return { ok: true, fileName, type, name, message: "User Characters loaded" };
    }

    if (type === "PAO_00_99") {
      libs.User.PAO_00_99 = json;
      updateUserLibraryStatus(
        `🔢 <b>PAO 00–99</b> loaded ` +
        `<span style="opacity:0.6;">(${new Date().toLocaleTimeString()})</span>`
      );
      saveLibraryToHistory(fileName, json);
      if (!silent) alert("🔢 User PAO 00–99 loaded!");
      return { ok: true, fileName, type, name, message: "PAO 00–99 loaded" };
    }

    if (type === "Squares") {
      libs.User.Squares = json;
      const count = Object.keys(json).length;
      updateUserLibraryStatus(
        `🗺️ <b>Squares Map</b> — ${count} squares loaded ` +
        `<span style="opacity:0.6;">(${new Date().toLocaleTimeString()})</span>`
      );
      saveLibraryToHistory(fileName, json);
      if (!silent) alert("🗺️ User Squares loaded!");
      return { ok: true, fileName, type, name, message: `${count} squares loaded` };
    }

    const message = "Unknown library format.";
    if (!silent) alert("⚠️ " + message);
    return { ok: false, fileName, type: null, message };
  }

  function readAndApplyImportFile(file, options = {}) {
    return new Promise((resolve) => {
      if (!file) {
        resolve({ ok: false, fileName: "", type: null, message: "No file selected." });
        return;
      }

      const reader = new FileReader();
      reader.onload = (ev) => {
        let json;
        try {
          json = JSON.parse(ev.target.result);
        } catch (err) {
          const result = { ok: false, fileName: file.name, type: null, message: "Invalid JSON file: Cannot parse." };
          if (!options.silent) alert("❌ " + result.message);
          resolve(result);
          return;
        }

        resolve(applyImportedLibrary(file.name, json, options));
      };

      reader.onerror = () => {
        const result = { ok: false, fileName: file.name, type: null, message: "File read error." };
        if (!options.silent) alert("❌ " + result.message);
        resolve(result);
      };

      reader.readAsText(file);
    });
  }

  async function readAndApplyImportFiles(fileList) {
    const files = Array.from(fileList || []);
    if (!files.length) return;

    const results = [];
    for (const file of files) {
      results.push(await readAndApplyImportFile(file, { silent: files.length > 1 }));
    }

    if (files.length === 1) return;

    const loaded = results.filter(r => r.ok);
    const skipped = results.filter(r => !r.ok);

    const loadedHtml = loaded.length
      ? loaded.map(r => `✅ ${r.fileName} — ${r.type}`).join("<br>")
      : "None";

    const skippedHtml = skipped.length
      ? "<br><br><b>Skipped:</b><br>" + skipped.map(r => `⚠️ ${r.fileName} — ${r.message}`).join("<br>")
      : "";

    updateUserLibraryStatus(
      `<b>Custom libraries import complete</b><br>${loadedHtml}${skippedHtml}` +
      `<br><span style="opacity:0.6;">(${new Date().toLocaleTimeString()})</span>`
    );

    refreshTablesAfterUserLibraryImport();

    alert(`Import complete. Loaded: ${loaded.length}. Skipped: ${skipped.length}.`);
  }

  function openSingleImportPicker() {
    if (window.__cmaImportPickerOpen === "1") return;
    window.__cmaImportPickerOpen = "1";

    const unlockPicker = () => {
      setTimeout(() => {
        window.__cmaImportPickerOpen = "0";
      }, 250);
    };

    const picker = document.createElement("input");
    picker.type = "file";
    picker.accept = ".json,application/json";
    picker.multiple = true;
    picker.style.display = "none";

    picker.addEventListener("change", async (e) => {
      const files = e.target.files;
      await readAndApplyImportFiles(files);
      picker.remove();
      unlockPicker();
    }, { once: true });

    window.addEventListener("focus", unlockPicker, { once: true });
    document.body.appendChild(picker);
    picker.click();
  }

  function installSingleImportHandler() {
    if (typeof window === "undefined") return;

    window.wireImportLibraryButton = function () {
      const importBtn = document.getElementById("importLibraryBtn");
      if (!importBtn) return;
      importBtn.dataset.cmaImportWired = "1";
    };
  }

  function installImportClickGuard() {
    if (typeof document === "undefined") return;
    if (window.__cmaImportClickGuardInstalled === "1") return;
    window.__cmaImportClickGuardInstalled = "1";

    document.addEventListener("click", function (event) {
      const targetBtn = event.target && event.target.closest
        ? event.target.closest("#importLibraryBtn")
        : null;

      if (!targetBtn) return;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      openSingleImportPicker();
    }, true);
  }

  window.CMAUserLibrariesHistory = {
    detectLibraryType,
    saveLibraryToHistory,
    applyImportedLibrary,
    readAndApplyImportFile,
    readAndApplyImportFiles
  };

  if (typeof window !== "undefined") {
    loadRuntimeHelper();
    installSingleImportHandler();
    installImportClickGuard();
  }
})();

/* ===========================================================
   Library panel UX enhancement
   Clarifies default/custom libraries and adds a real Restore button.
   =========================================================== */
(function () {
  function injectLibraryPanelStyles() {
    if (document.getElementById("cmaLibraryPanelUxStyles")) return;

    const style = document.createElement("style");
    style.id = "cmaLibraryPanelUxStyles";
    style.textContent = `
      .right-panel h5 {
        margin: 0 !important;
        padding: 0 !important;
        line-height: 1.25 !important;
      }

      .right-panel .libraries-group,
      .right-panel .library {
        margin-top: 0 !important;
        padding-top: 0 !important;
      }

      .right-panel .library > br {
        display: none !important;
      }

      .library-panel-title {
        margin: 0 0 2px 0;
        color: #ffffff;
        font-size: 1rem;
        font-weight: 700;
        line-height: 1.15;
      }

      .library-panel-intro {
        margin: 0 0 5px 0;
        color: #dddddd;
        font-size: 0.84rem;
        line-height: 1.22;
      }

      .library-view-row {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        align-items: center;
        margin: 2px 0 4px 0;
      }

      .library-view-row label {
        font-weight: 700;
        color: #ffffff;
      }

      .library-actions-title {
        margin: 3px 0 2px 0;
        color: #CFAF4A;
        font-family: Georgia, 'Times New Roman', serif;
        font-size: 0.88rem;
        font-weight: 700;
        line-height: 1.15;
      }

      .library-actions-help {
        margin: 0 0 4px 0;
        color: #cfcfcf;
        font-size: 0.78rem;
        line-height: 1.18;
      }

      .user-lib-controls {
        display: flex;
        flex-wrap: wrap;
        gap: 4px 5px;
        align-items: center;
      }

      .user-lib-controls br {
        display: none;
      }

      .user-lib-controls button,
      .library-view-row select {
        padding: 3px 8px;
        font-size: 0.8rem;
        line-height: 1.15;
      }

      .library-status-card {
        width: 100%;
        margin: 4px 0 1px 0;
        padding: 5px 7px;
        border: 1px solid #4a3f1c;
        border-left: 4px solid #CFAF4A;
        border-radius: 6px;
        background: #141414;
        color: #CFAF4A;
        font-family: Georgia, 'Times New Roman', serif;
        font-size: 0.82rem;
        line-height: 1.18;
      }

      .library-note {
        width: 100%;
        margin: 1px 0 0 0 !important;
        color: #bfbfbf !important;
        font-size: 0.76rem !important;
        line-height: 1.18;
      }

      #restoreDefaultLibrariesBtn {
        border-color: #CFAF4A;
        color: #CFAF4A;
        margin-top: 0;
      }

      #activePalaceInfo {
        margin: 2px 0 0 0 !important;
        font-size: 0.82rem !important;
        line-height: 1.18 !important;
      }
    `;

    document.head.appendChild(style);
  }

  function removeLegacyPanelBreaks() {
    const library = document.querySelector(".right-panel .library");
    if (!library) return;
    Array.from(library.children).forEach((child) => {
      if (child.tagName === "BR") child.remove();
    });
  }

  function hasActiveUserLibrary() {
    try {
      if (localStorage.getItem("activeLibrary")) return true;
      return typeof libs !== "undefined" && libs && libs.User && Object.keys(libs.User).length > 0;
    } catch {
      return false;
    }
  }

  function setDefaultLibraryStatus(force) {
    const status = document.getElementById("userLibraryStatus");
    if (!status) return;
    if (!force && status.innerHTML.trim() && status.innerHTML.indexOf("Default Libraries") === -1) return;
    if (!force && hasActiveUserLibrary()) return;

    status.style.display = "block";
    status.classList.add("library-status-card");
    status.innerHTML = "Active system: <b>Default Libraries</b>";
  }

  async function restoreDefaultLibraries() {
    try {
      if (typeof loadLibraries === "function") {
        await loadLibraries();
      } else {
        if (window.libs && typeof window.libs === "object") delete window.libs.User;
        if (typeof libs !== "undefined" && libs && typeof libs === "object") delete libs.User;
      }
    } catch (err) {
      console.warn("restoreDefaultLibraries: could not reload default libraries", err);
      try {
        if (window.libs && typeof window.libs === "object") delete window.libs.User;
        if (typeof libs !== "undefined" && libs && typeof libs === "object") delete libs.User;
      } catch (clearErr) {
        console.warn("restoreDefaultLibraries: could not clear user libraries", clearErr);
      }
    }

    try {
      localStorage.removeItem("activeLibrary");
    } catch (err) {
      console.warn("restoreDefaultLibraries: could not clear activeLibrary", err);
    }

    const activePalaceInfo = document.getElementById("activePalaceInfo");
    if (activePalaceInfo) activePalaceInfo.textContent = "";

    setDefaultLibraryStatus(true);

    try {
      if (typeof renderAll === "function") renderAll();
      if (typeof enableManualAnchors === "function") enableManualAnchors();
    } catch (err) {
      console.warn("restoreDefaultLibraries: table refresh failed", err);
    }
  }

function enhanceLibraryPanel() {
  injectLibraryPanelStyles();
  removeLegacyPanelBreaks();

  const rightPanel = document.querySelector(".right-panel");
  if (!rightPanel) return;

  const heading = rightPanel.querySelector("h5");
  if (heading && !heading.dataset.cmaEnhanced) {
    heading.dataset.cmaEnhanced = "1";
    heading.innerHTML = `
      <div class="library-panel-title">Library System</div>
      <div class="library-panel-intro">
        Default libraries are locked and listed below for overview purposes only.<br>
        They can be found and studied in the Flashcards Application.<br>
        Create your own JSON libraries, and load custom or complete mnemonic libraries temporarily in your browser.
      </div>
    `;
  }
}

    const librarySelect = document.getElementById("librarySelect");
    const libraryRow = librarySelect ? librarySelect.closest(".row") : null;
    if (libraryRow && !libraryRow.dataset.cmaEnhanced) {
      libraryRow.dataset.cmaEnhanced = "1";
      libraryRow.classList.add("library-view-row");
      libraryRow.removeAttribute("style");

      const label = libraryRow.querySelector("label[for='librarySelect']");
      if (label) label.textContent = "View default library:";
    }

    const controls = document.querySelector(".user-lib-controls");
    if (!controls) return;

    if (!controls.dataset.cmaEnhanced) {
      controls.dataset.cmaEnhanced = "1";

      const actionsTitle = document.createElement("div");
      actionsTitle.className = "library-actions-title";
      actionsTitle.textContent = "Use custom libraries";
      controls.parentNode.insertBefore(actionsTitle, controls);

      const actionsHelp = document.createElement("p");
      actionsHelp.className = "library-actions-help";
      actionsHelp.textContent = "You can import official JSON templates or a complete mnemonic library bundle.";
      controls.parentNode.insertBefore(actionsHelp, controls);
    }

    const createBtn = document.getElementById("createLibraryBtn");
    const downloadBtn = document.getElementById("downloadTemplatesBtn");
    const importBtn = document.getElementById("importLibraryBtn");

    if (downloadBtn) downloadBtn.textContent = "Download libraries templates (json zip)";
    if (createBtn) createBtn.textContent = "Create your own custom libraries";
    if (importBtn) importBtn.textContent = "Import / load your own libraries";

    if (downloadBtn && createBtn && importBtn && !controls.dataset.cmaOrdered) {
      controls.dataset.cmaOrdered = "1";
      controls.prepend(importBtn);
      controls.prepend(createBtn);
      controls.prepend(downloadBtn);
    }

    let restoreBtn = document.getElementById("restoreDefaultLibrariesBtn");
    if (!restoreBtn) {
      restoreBtn = document.createElement("button");
      restoreBtn.id = "restoreDefaultLibrariesBtn";
      restoreBtn.className = "epic-btn";
      restoreBtn.type = "button";
      restoreBtn.textContent = "Restore Default Libraries";
      restoreBtn.addEventListener("click", restoreDefaultLibraries);
      controls.appendChild(restoreBtn);
    }

    const note = controls.querySelector(".library-note");
    if (note) {
      note.textContent = "Custom and complete libraries are applied locally. Use Restore Default Libraries to reload the protected default dataset without refreshing the page.";
    }

    setDefaultLibraryStatus(false);
  }

  function installStatusWrapper() {
    if (window.__cmaLibraryStatusWrapperInstalled) return;
    if (typeof updateUserLibraryStatus !== "function") return;

    window.__cmaLibraryStatusWrapperInstalled = true;
    const original = updateUserLibraryStatus;

    updateUserLibraryStatus = function (text) {
      original(text);
      const status = document.getElementById("userLibraryStatus");
      if (!status) return;
      status.style.display = "block";
      status.classList.add("library-status-card");
    };
  }

  function init() {
    enhanceLibraryPanel();
    installStatusWrapper();
    setTimeout(enhanceLibraryPanel, 250);
    setTimeout(enhanceLibraryPanel, 750);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

/* ===========================================================
   Safe templates ZIP download guard
   Prevents duplicate download handlers and rapid double-clicks.
   =========================================================== */
(function () {
  async function downloadTemplatesZip(btn) {
    if (!btn || btn.dataset.cmaTemplatesBusy === "1") return;

    btn.dataset.cmaTemplatesBusy = "1";
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Preparing ZIP...";

    try {
      if (typeof JSZip !== "function") {
        throw new Error("JSZip is not available.");
      }

      const templates = [
        { filename: "template_characters.json", path: "user_libraries/user_characters_template.json" },
        { filename: "template_memory_palaces.json", path: "user_libraries/user_memory_palaces_template.json" },
        { filename: "template_pao_00_99.json", path: "user_libraries/user_pao_00_99_template.json" },
        { filename: "template_squares.json", path: "user_libraries/user_squares_template.json" }
      ];

      const zip = new JSZip();

      for (const tpl of templates) {
        const resp = await fetch(tpl.path, { cache: "no-store" });
        if (!resp.ok) throw new Error(`Could not load ${tpl.path} (${resp.status})`);
        const json = await resp.json();
        zip.file(tpl.filename, JSON.stringify(json, null, 2));
      }

      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = "CMA_Templates.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);

      alert("📦 Templates ZIP downloaded!");
    } catch (err) {
      console.error("Templates ZIP download failed:", err);
      alert("❌ Templates ZIP download failed. Please try again.");
    } finally {
      btn.disabled = false;
      btn.textContent = originalText || "Download JSON Templates";
      delete btn.dataset.cmaTemplatesBusy;
    }
  }

  function installTemplatesDownloadGuard() {
    const btn = document.getElementById("downloadTemplatesBtn");
    if (!btn || btn.dataset.cmaTemplatesGuardInstalled === "1") return;

    btn.dataset.cmaTemplatesGuardInstalled = "1";

    document.addEventListener("click", function (event) {
      const targetBtn = event.target && event.target.closest
        ? event.target.closest("#downloadTemplatesBtn")
        : null;

      if (!targetBtn) return;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      downloadTemplatesZip(targetBtn);
    }, true);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", installTemplatesDownloadGuard);
  } else {
    installTemplatesDownloadGuard();
  }
})();
