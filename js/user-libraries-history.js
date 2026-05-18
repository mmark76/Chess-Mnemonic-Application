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

  function detectLibraryType(json) {
    if (!json || typeof json !== "object") return null;
    if (Array.isArray(json.palaces)) return "MemoryPalace";
    if (json.white && json.black) return "Characters";
    if (json["00"] || json["01"]) return "PAO_00_99";
    if (json.a1 || json.a2) return "Squares";
    return null;
  }

  function refreshTablesAfterUserLibraryImport() {
    try {
      setTimeout(() => {
        if (typeof renderAll === "function") renderAll();
        if (typeof enableManualAnchors === "function") enableManualAnchors();
      }, 250);
    } catch (e) {
      console.warn("user-libraries-history: refresh after import failed", e);
    }
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

  function applyImportedLibrary(fileName, json) {
    if (!json || typeof json !== "object") {
      alert("❌ Invalid JSON structure.");
      return;
    }

    const type = detectLibraryType(json);
    const name = (fileName || "user-library.json").replace(/\.json$/i, "");

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
      alert("🏛️ User Memory Palace loaded!");
      return;
    }

    if (type === "Characters") {
      libs.User.Characters = json;
      updateUserLibraryStatus(
        `♟️ <b>User Characters</b> loaded ` +
        `<span style="opacity:0.6;">(${new Date().toLocaleTimeString()})</span>`
      );
      saveLibraryToHistory(fileName, json);
      alert("♟️ User Characters loaded!");
      return;
    }

    if (type === "PAO_00_99") {
      libs.User.PAO_00_99 = json;
      updateUserLibraryStatus(
        `🔢 <b>PAO 00–99</b> loaded ` +
        `<span style="opacity:0.6;">(${new Date().toLocaleTimeString()})</span>`
      );
      saveLibraryToHistory(fileName, json);
      alert("🔢 User PAO 00–99 loaded!");
      return;
    }

    if (type === "Squares") {
      libs.User.Squares = json;
      const count = Object.keys(json).length;
      updateUserLibraryStatus(
        `🗺️ <b>Squares Map</b> — ${count} squares loaded ` +
        `<span style="opacity:0.6;">(${new Date().toLocaleTimeString()})</span>`
      );
      saveLibraryToHistory(fileName, json);
      alert("🗺️ User Squares loaded!");
      return;
    }

    alert("⚠️ Unknown library format.");
  }

  function installSingleImportHandler() {
    if (typeof window === "undefined") return;

    window.wireImportLibraryButton = function () {
      const importBtn = document.getElementById("importLibraryBtn");
      if (!importBtn || importBtn.dataset.cmaImportWired === "1") return;

      importBtn.dataset.cmaImportWired = "1";
      importBtn.addEventListener("click", () => {
        const picker = document.createElement("input");
        picker.type = "file";
        picker.accept = ".json";

        picker.onchange = (e) => {
          const file = e.target.files && e.target.files[0];
          if (!file) return;

          const reader = new FileReader();
          reader.onload = (ev) => {
            let json;
            try {
              json = JSON.parse(ev.target.result);
            } catch (err) {
              alert("❌ Invalid JSON file: Cannot parse.");
              return;
            }

            applyImportedLibrary(file.name, json);
          };

          reader.onerror = () => alert("❌ File read error.");
          reader.readAsText(file);
        };

        picker.click();
      });
    };
  }

  window.CMAUserLibrariesHistory = {
    detectLibraryType,
    saveLibraryToHistory,
    applyImportedLibrary
  };

  if (typeof window !== "undefined") {
    loadRuntimeHelper();
    installSingleImportHandler();
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
      .library-panel-title {
        margin: 0 0 4px 0;
        color: #ffffff;
        font-size: 1rem;
        font-weight: 700;
        line-height: 1.2;
      }

      .library-panel-intro {
        margin: 0 0 8px 0;
        color: #dddddd;
        font-size: 0.86rem;
        line-height: 1.32;
      }

      .library-view-row {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        align-items: center;
        margin: 4px 0 10px 0;
      }

      .library-view-row label {
        font-weight: 700;
        color: #ffffff;
      }

      .library-actions-title {
        margin: 6px 0 3px 0;
        color: #CFAF4A;
        font-family: Georgia, 'Times New Roman', serif;
        font-size: 0.9rem;
        font-weight: 700;
        line-height: 1.2;
      }

      .library-actions-help {
        margin: 0 0 6px 0;
        color: #cfcfcf;
        font-size: 0.8rem;
        line-height: 1.25;
      }

      .user-lib-controls {
        display: flex;
        flex-wrap: wrap;
        gap: 5px 6px;
        align-items: center;
      }

      .user-lib-controls br {
        display: none;
      }

      .user-lib-controls button,
      .library-view-row select {
        padding: 4px 9px;
        font-size: 0.82rem;
        line-height: 1.2;
      }

      .library-status-card {
        width: 100%;
        margin: 6px 0 2px 0;
        padding: 6px 8px;
        border: 1px solid #4a3f1c;
        border-left: 4px solid #CFAF4A;
        border-radius: 6px;
        background: #141414;
        color: #CFAF4A;
        font-family: Georgia, 'Times New Roman', serif;
        font-size: 0.84rem;
        line-height: 1.25;
      }

      .library-note {
        width: 100%;
        margin: 2px 0 0 0 !important;
        color: #bfbfbf !important;
        font-size: 0.78rem !important;
        line-height: 1.25;
      }

      #restoreDefaultLibrariesBtn {
        border-color: #CFAF4A;
        color: #CFAF4A;
        margin-top: 0;
      }

      #activePalaceInfo {
        margin: 4px 0 0 0 !important;
        font-size: 0.84rem !important;
        line-height: 1.25 !important;
      }
    `;

    document.head.appendChild(style);
  }

  function hasActiveUserLibrary() {
    try {
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

  function restoreDefaultLibraries() {
    try {
      if (window.libs && typeof window.libs === "object") delete window.libs.User;
      if (typeof libs !== "undefined" && libs && typeof libs === "object") delete libs.User;
    } catch (err) {
      console.warn("restoreDefaultLibraries: could not clear user libraries", err);
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

    const rightPanel = document.querySelector(".right-panel");
    if (!rightPanel) return;

    const heading = rightPanel.querySelector("h5");
    if (heading && !heading.dataset.cmaEnhanced) {
      heading.dataset.cmaEnhanced = "1";
      heading.innerHTML = `
        <div class="library-panel-title">Library System</div>
        <div class="library-panel-intro">
          Default libraries are protected. You can view them here, create your own JSON libraries, and load custom libraries temporarily in your browser.
        </div>
      `;
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
      actionsHelp.textContent = "Custom libraries must follow the official JSON template structure.";
      controls.parentNode.insertBefore(actionsHelp, controls);
    }

    const createBtn = document.getElementById("createLibraryBtn");
    const downloadBtn = document.getElementById("downloadTemplatesBtn");
    const importBtn = document.getElementById("importLibraryBtn");

    if (downloadBtn) downloadBtn.textContent = "Download JSON Templates";
    if (createBtn) createBtn.textContent = "Create Custom Library";
    if (importBtn) importBtn.textContent = "Import Custom Library";

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
      note.textContent = "Custom libraries are applied locally. Use Restore Default Libraries to clear them without refreshing the page.";
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
