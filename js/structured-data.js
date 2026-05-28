// Structured Data for Chess Mnemonic Application and Epic Chess Stories Creator
// This script injects JSON-LD structured data for search engines.
// It does not modify any visible part of the page.

(function () {
  var structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Chess Mnemonic Application and Epic Chess Stories Creator",
    "alternateName": "Chess Mnemonic System",
    "description": "A specialized memory training tool for chess players that converts PGN/SAN into mnemonic tables, PAO sequences, shortnames, epic chess stories and memory palace loci.",
    "applicationCategory": "EducationalApplication",
    "softwareHelp": "https://markellos-chess-mnemonic-system.blogspot.com/",
    "operatingSystem": "Web",
    "url": "https://chessmnemonics.net/",
    "image": "https://chessmnemonics.net/assets/chess-and-mnemonics.png",
    "featureList": [
      "PGN/SAN Parser",
      "Associations Table",
      "Shortnames Table",
      "PAO 0–9 and PAO 00–99 Tables",
      "Memory Palace Mode",
      "Epic Story Generator",
      "Flashcards Training Module"
    ],
    "softwareAddOn": {
      "@type": "SoftwareApplication",
      "name": "Chess Mnemonics Flashcards Trainer",
      "url": "https://chessmnemonics.net/flashcards/"
    },
    "keywords": [
      "chess mnemonics",
      "chess mnemonic app",
      "chess mnemonic system",
      "memorize chess games",
      "chess memory training",
      "blindfold chess training",
      "memory palace",
      "pao system",
      "chess training",
      "chess notation",
      "epic chess stories",
      "san to mnemonic",
      "memory techniques",
      "PGN visualization"
    ],
    "author": {
      "@type": "Person",
      "name": "Markellos Markides",
      "url": "https://markellos-chess-mnemonic-system.blogspot.com/"
    },
    "creator": {
      "@type": "Person",
      "name": "Markellos Markides"
    },
    "copyrightHolder": "Markellos Markides",
    "inLanguage": "en",
    "learningResourceType": "Mnemonic-based training",
    "publisher": {
      "@type": "Organization",
      "name": "Chess Mnemonics"
    }
  };

  try {
    var script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);
  } catch (e) {
    // Structured data only; this must not affect the app.
  }
})();

/* Add Start Here link to the existing ecosystem menu. */
(function () {
  function addStartHereLink() {
    try {
      var panel = document.querySelector(".br-panel");
      if (!panel || panel.querySelector('a[href="https://chessmnemonics.net/start-here.html"]')) return;

      var link = document.createElement("a");
      link.href = "https://chessmnemonics.net/start-here.html";
      link.textContent = "Start Here - Chess Mnemonic System";
      panel.insertBefore(link, panel.firstChild);
    } catch (e) {
      // Menu helper only; this must not affect the app.
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", addStartHereLink);
  } else {
    addStartHereLink();
  }
})();

/* Load optional user-library batch import support.
   This keeps the feature isolated from the main application bundle. */
(function () {
  try {
    var script = document.createElement("script");
    script.src = "js/user-library-batch-import.js?v=20260518-4";
    script.defer = true;
    document.head.appendChild(script);
  } catch (e) {
    // Optional helper only; this must not affect the app.
  }
})();

/* Load small UI label and spacing adjustments. */
(function () {
  try {
    var script = document.createElement("script");
    script.src = "js/user-library-ui-labels.js?v=20260518-2";
    script.defer = true;
    document.head.appendChild(script);
  } catch (e) {
    // Optional helper only; this must not affect the app.
  }
})();

/* Load feedback UI helper. */
(function () {
  try {
    var script = document.createElement("script");
    script.src = "js/feedback.js?v=20260527-1";
    script.defer = true;
    document.head.appendChild(script);
  } catch (e) {
    // Optional helper only; this must not affect the app.
  }
})();
