// Runtime support for imported user libraries.
(function () {
  function squareText(square) {
    var item = libs && libs.User && libs.User.Squares && libs.User.Squares[square];
    if (!item) return "";
    return item.keyword || item.name || item.label || item.notes || "";
  }

  var defaultPao99 = p2p3Get;
  p2p3Get = function (code, collection) {
    var key = String(code).padStart(2, "0");
    var item = libs && libs.User && libs.User.PAO_00_99 && libs.User.PAO_00_99[key];
    if (item) return { person: item.person || "", action: item.action || "", object: item.object || "" };
    return defaultPao99(code, collection);
  };

  var defaultSquareShortname = squareShortname;
  squareShortname = function (square) {
    return squareText(square) || defaultSquareShortname(square);
  };

  var defaultAssociations = fillAssociationsTable;
  fillAssociationsTable = function (moves) {
    defaultAssociations(moves);
    var body = document.getElementById("assocBody");
    if (!body) return;

    Array.prototype.forEach.call(body.querySelectorAll("tr"), function (row) {
      var cells = row.children || [];
      var targetCell = cells[4];

      // Current Associations table layout has 9 columns:
      // 0 Move # | 1 SAN | 2 Anchor | 3 Mnemonic Locus | 4 Target Square |
      // 5 Color Turn | 6 Piece Association | 7 Action | 8 Target Square Association.
      // Keep a fallback for any older 8-column cached layout.
      var targetAssociationCell = cells.length >= 9 ? cells[8] : cells[7];

      if (!targetCell || !targetAssociationCell) return;
      var userText = squareText(targetCell.textContent.trim());
      if (userText) targetAssociationCell.textContent = userText;
    });
  };

  var defaultStatus = updateUserLibraryStatus;
  updateUserLibraryStatus = function (text) {
    defaultStatus(text);
    setTimeout(function () {
      if (typeof renderAll === "function") renderAll();
      if (typeof enableManualAnchors === "function") enableManualAnchors();
    }, 80);
  };

  function setToolbarLabel(label, text) {
    if (!label) return;
    var checkbox = label.querySelector && label.querySelector('input[type="checkbox"]');
    label.textContent = "";
    if (checkbox) {
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(" " + text));
    } else {
      label.textContent = text;
    }
  }

  function applySmallUiFixes() {
    var assocSection = document.getElementById("assocSection");
    if (assocSection) {
      var headers = assocSection.querySelectorAll("thead th");
      if (headers && headers.length >= 9) {
        headers[7].textContent = "Action";
        headers[8].textContent = "Target Square Association";
      }

      var labels = assocSection.querySelectorAll(".table-toolbar label");
      if (labels && labels.length >= 9) {
        setToolbarLabel(labels[7], "Action");
        setToolbarLabel(labels[8], "Target Square Association");
      }
    }

    var popup = document.getElementById("popupOverlay");
    var howTo = document.getElementById("howToModal");
    window.addEventListener("click", function (event) {
      if (popup && event.target === popup) popup.style.display = "none";
      if (howTo && event.target === howTo) howTo.style.display = "none";
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applySmallUiFixes);
  } else {
    applySmallUiFixes();
  }

  window.CMAUserLibraryFix = { squareText: squareText };
})();
