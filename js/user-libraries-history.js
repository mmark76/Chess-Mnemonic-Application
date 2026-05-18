// user-libraries-history.js
// Συνδέει το Import / Load Library με το User Libraries dropdown.

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

    // Ο δρόμος που θα χρησιμοποιήσει το dropdown / selector.
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
    if (idxByPath >= 0) {
      saved[idxByPath] = entry;
    } else {
      saved.push(entry);
    }

    localStorage.setItem("savedLibraries", JSON.stringify(saved));

    // Προαιρετικά: ορίζουμε αυτή τη βιβλιοθήκη ως ενεργή
    try {
      if (typeof window.setActiveLibrary === "function") {
        window.setActiveLibrary(type, path);
      }
    } catch (e) {
      console.warn("user-libraries-history: setActiveLibrary failed", e);
    }

    // Refresh dropdown αν υπάρχει
    try {
      if (typeof window.loadUserLibrariesIntoUI === "function") {
        window.loadUserLibrariesIntoUI();
      }
    } catch (e) {
      console.warn("user-libraries-history: loadUserLibrariesIntoUI failed", e);
    }

    refreshTablesAfterUserLibraryImport();

    console.log(
      `💾 Saved user library → name="${libName}", type="${type}", path="${path}"`
    );
  }

  // ----------------- FileReader hook -----------------

  function hookFileReaderForUserLibraries() {
    const proto = window.FileReader && window.FileReader.prototype;
    if (!proto || proto.__userLibHookInstalled) return;

    proto.__userLibHookInstalled = true;

    const originalReadAsText = proto.readAsText;
    if (!originalReadAsText) return;

    proto.readAsText = function (file) {
      try {
        if (file && file.name) {
          this.__cmsFileName = file.name;
        }

        if (!this.__userLibListenerAttached) {
          this.__userLibListenerAttached = true;

          this.addEventListener(
            "load",
            (ev) => {
              try {
                const text = ev.target.result;
                if (typeof text !== "string") return;

                let json;
                try {
                  json = JSON.parse(text);
                } catch {
                  // Όχι JSON (π.χ. PGN) → αγνόησε
                  return;
                }

                const fileName = this.__cmsFileName || "user-library.json";
                saveLibraryToHistory(fileName, json);
              } catch (err) {
                console.warn(
                  "user-libraries-history: error while processing FileReader load",
                  err
                );
              }
            },
            false
          );
        }
      } catch (err) {
        console.warn("user-libraries-history: readAsText hook error", err);
      }

      // Κλήση του αρχικού readAsText ώστε να δουλεύει κανονικά το υπόλοιπο app.
      return originalReadAsText.apply(this, arguments);
    };

    console.log("✅ user-libraries-history.js: FileReader hook installed");
  }

  // Εγκατάσταση hook
  if (typeof window !== "undefined") {
    loadRuntimeHelper();
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", hookFileReaderForUserLibraries);
    } else {
      hookFileReaderForUserLibraries();
    }
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
        margin: 0 0 8px 0;
        color: #ffffff;
        font-size: 1.05rem;
        font-weight: 700;
      }

      .library-panel-intro {
        margin: 0 0 14px 0;
        color: #dddddd;
        font-size: 0.92rem;
        line-height: 1.45;
      }

      .library-view-row {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        align-items: center;
        margin: 6px 0 14px 0;
      }

      .library-view-row label {
        font-weight: 700;
        color: #ffffff;
      }

      .library-actions-title {
        margin: 10px 0 6px 0;
        color: #CFAF4A;
        font-family: Georgia, 'Times New Roman', serif;
        font-size: 0.95rem;
        font-weight: 700;
      }

      .library-actions-help {
        margin: 0 0 8px 0;
        color: #cfcfcf;
        font-size: 0.84rem;
        line-height: 1.4;
      }

      .user-lib-controls {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
      }

      .user-lib-controls br {
        display: none;
      }

      .library-status-card {
        width: 100%;
        margin: 10px 0 4px 0;
        padding: 8px 10px;
        border: 1px solid #4a3f1c;
        border-left: 4px solid #CFAF4A;
        border-radius: 6px;
        background: #141414;
        color: #CFAF4A;
        font-family: Georgia, 'Times New Roman', serif;
        font-size: 0.9rem;
        line-height: 1.4;
      }

      .library-note {
        width: 100%;
        margin: 4px 0 0 0 !important;
        color: #bfbfbf !important;
        font-size: 0.82rem !important;
        line-height: 1.4;
      }

      #restoreDefaultLibrariesBtn {
        border-color: #CFAF4A;
        color: #CFAF4A;
      }
    `;

    document.head.appendChild(style);
  }

  function setDefaultLibraryStatus() {
    const status = document.getElementById("userLibraryStatus");
    if (!status) return;

    status.style.display = "block";
    status.classList.add("library-status-card");
    status.innerHTML = "Active system: <b>Default Libraries</b>";
  }

  function restoreDefaultLibraries() {
    try {
      if (window.libs && typeof window.libs === "object") {
        delete window.libs.User;
      }
      if (typeof libs !== "undefined" && libs && typeof libs === "object") {
        delete libs.User;
      }
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

    setDefaultLibraryStatus();

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

    setDefaultLibraryStatus();
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
