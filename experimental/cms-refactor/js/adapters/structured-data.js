// Experimental adapter — loads production helpers with correct relative paths.
(function () {
  var structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Chess Mnemonic Application (Experimental Refactor)",
    "description": "Experimental modular build; not deployed to production.",
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "Web",
    "url": "https://chessmnemonics.net/experimental/cms-refactor/",
    "robots": "noindex"
  };
  try {
    var script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);
  } catch (e) { /* SEO only */ }
})();

(function () {
  function inject(src) {
    try {
      var script = document.createElement("script");
      script.src = src;
      script.defer = true;
      document.head.appendChild(script);
    } catch (e) { /* optional */ }
  }
  inject("../../js/user-library-batch-import.js?v=20260518-4");
  inject("../../js/user-library-ui-labels.js?v=20260518-2");
  inject("../../js/feedback.js?v=20260527-1");
})();
