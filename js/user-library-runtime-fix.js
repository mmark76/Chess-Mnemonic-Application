// Runtime support for imported user libraries.
(function () {
  function squareText(square) {
    var item = libs && libs.User && libs.User.Squares && libs.User.Squares[square];
    if (!item) return "";
    return item.keyword || item.name || item.label || item.notes || "";
  }

  function applyFullMoveLocusDisplay() {
    if (typeof locusMode === "undefined" || locusMode !== "full") return;

    var tableIds = ["sanBody", "assocBody", "paoBody", "shortnamesBody"];
    var locusCol = 3;

    tableIds.forEach(function (bodyId) {
      var body = document.getElementById(bodyId);
      if (!body) return;

      Array.prototype.forEach.call(body.querySelectorAll("tr"), function (row) {
        var cells = row.children || [];
        var locusCell = cells[locusCol];
        if (!locusCell) return;

        var moveCellText = cells[0] ? cells[0].textContent.trim() : "";
        if (moveCellText.indexOf("...") !== -1) {
          locusCell.textContent = "";
        }
      });
    });
  }

  function getColumnIndexByHeaderText(table, exactText) {
    if (!table) return -1;
    var headers = table.querySelectorAll("thead th");
    for (var i = 0; i < headers.length; i++) {
      var text = (headers[i].textContent || "").trim();
      if (text === exactText) return i;
    }
    return -1;
  }

  function setColumnVisible(table, colIndex, visible) {
    if (!table || colIndex < 0) return;
    Array.prototype.forEach.call(table.querySelectorAll("tr"), function (row) {
      var cell = row.children && row.children[colIndex];
      if (cell) cell.style.display = visible ? "" : "none";
    });
  }

  function defaultHideTargetSquareColumns() {
    var sections = ["sanSection", "assocSection", "shortnamesSection"];

    sections.forEach(function (sectionId) {
      var section = document.getElementById(sectionId);
      if (!section) return;

      var table = section.querySelector("table");
      if (!table) return;

      var colIndex = getColumnIndexByHeaderText(table, "Target Square");
      if (colIndex < 0) return;

      var labels = section.querySelectorAll(".table-toolbar label");
      var label = labels && labels[colIndex];
      var checkbox = label && label.querySelector && label.querySelector('input[type="checkbox"]');

      if (checkbox && !checkbox.dataset.cmaDefaultTargetSquareApplied) {
        checkbox.checked = false;
        checkbox.dataset.cmaDefaultTargetSquareApplied = "1";
      }

      var visible = checkbox ? checkbox.checked : false;
      setColumnVisible(table, colIndex, visible);
    });
  }

  function retryDefaultHideTargetSquareColumns() {
    defaultHideTargetSquareColumns();
    setTimeout(defaultHideTargetSquareColumns, 250);
    setTimeout(defaultHideTargetSquareColumns, 750);
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

  if (typeof renderAll === "function") {
    var defaultRenderAll = renderAll;
    renderAll = function () {
      defaultRenderAll.apply(this, arguments);
      applyFullMoveLocusDisplay();
      defaultHideTargetSquareColumns();
    };
  }

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
    applyFullMoveLocusDisplay();
    retryDefaultHideTargetSquareColumns();

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

  window.CMAUserLibraryFix = {
    squareText: squareText,
    applyFullMoveLocusDisplay: applyFullMoveLocusDisplay,
    defaultHideTargetSquareColumns: defaultHideTargetSquareColumns
  };
})();