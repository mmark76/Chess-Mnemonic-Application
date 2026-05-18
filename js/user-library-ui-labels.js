/* ===========================================================
   User Library UI Labels
   Small text-only UI adjustments.
   =========================================================== */
(function () {
  function updateLabels() {
    var importBtn = document.getElementById("importLibraryBtn");
    if (importBtn) {
      importBtn.textContent = "Import / Load your own Libraries";
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateLabels);
  } else {
    updateLabels();
  }

  setTimeout(updateLabels, 250);
  setTimeout(updateLabels, 750);
})();
