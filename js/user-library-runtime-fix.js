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
      var targetCell = row.children && row.children[4];
      var assocCell = row.children && row.children[7];
      if (!targetCell || !assocCell) return;
      var userText = squareText(targetCell.textContent.trim());
      if (userText) assocCell.textContent = userText;
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

  window.CMAUserLibraryFix = { squareText: squareText };
})();
