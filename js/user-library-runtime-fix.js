// Runtime support for imported user libraries.
(function () {
  window.CMAUserLibraryFix = {
    squareText: function (square) {
      var item = libs && libs.User && libs.User.Squares && libs.User.Squares[square];
      if (!item) return "";
      return item.keyword || item.name || item.label || item.notes || "";
    },
    pao99: function (code) {
      var key = String(code).padStart(2, "0");
      var item = libs && libs.User && libs.User.PAO_00_99 && libs.User.PAO_00_99[key];
      if (!item) return null;
      return { person: item.person || "", action: item.action || "", object: item.object || "" };
    }
  };
})();
