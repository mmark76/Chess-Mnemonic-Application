/* ===========================================================
   User Library UI Labels
   Small text and spacing UI adjustments.
   =========================================================== */
(function () {
  function injectLibraryPanelSpacingStyles() {
    if (document.getElementById("cmaLibraryPanelSpacingStyles")) return;

    var style = document.createElement("style");
    style.id = "cmaLibraryPanelSpacingStyles";
    style.textContent = `
      .right-panel,
      .right-panel * {
        font-family: Arial, sans-serif !important;
      }

      .right-panel .library-panel-title {
        line-height: 1.25 !important;
        margin-bottom: 4px !important;
      }

      .right-panel .library-panel-intro {
        line-height: 1.4 !important;
        margin-bottom: 8px !important;
      }

      .right-panel .library-view-row {
        margin: 6px 0 9px 0 !important;
      }

      .right-panel .library-actions-title {
        line-height: 1.3 !important;
        margin: 9px 0 4px 0 !important;
      }

      .right-panel .library-actions-help {
        line-height: 1.4 !important;
        margin: 0 0 8px 0 !important;
      }

      .right-panel .user-lib-controls {
        gap: 6px 6px !important;
      }

      .right-panel .library-note {
        line-height: 1.4 !important;
        margin: 7px 0 0 0 !important;
      }

      .right-panel .library-status-card {
        line-height: 1.35 !important;
        margin: 9px 0 6px 0 !important;
      }

      .right-panel #restoreDefaultLibrariesBtn {
        margin-top: 2px !important;
      }
    `;

    document.head.appendChild(style);
  }

  function updateLabels() {
    var importBtn = document.getElementById("importLibraryBtn");
    if (importBtn) {
      importBtn.textContent = "Import / Load your own Libraries";
    }

    var menuLabel = document.querySelector(".br-menu > summary span[style*='margin-left']");
    if (menuLabel) {
      menuLabel.textContent = "Ecosystem ↓ ";
    }
  }

  function applyUiAdjustments() {
    injectLibraryPanelSpacingStyles();
    updateLabels();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyUiAdjustments);
  } else {
    applyUiAdjustments();
  }

  setTimeout(applyUiAdjustments, 250);
  setTimeout(applyUiAdjustments, 750);
})();