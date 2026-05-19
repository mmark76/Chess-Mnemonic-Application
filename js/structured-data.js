// Structured Data for Chess Mnemonic Application and Epic Chess Stories Creator v3.3
// This script injects JSON-LD metadata for search engines.

(function () {
  var structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Chess Mnemonic Application and Epic Chess Stories Creator",
    "alternateName": "Chess Mnemonic System v3.3",
    "version": "3.3",
    "description": "A specialized memory training tool for chess players that converts PGN/SAN into mnemonic tables, PAO sequences, Rhythm structures and memory palace loci.",
    "applicationCategory": "EducationalApplication",
    "softwareHelp": "https://markellos-chess-mnemonic-system.blogspot.com/",
    "operatingSystem": "Web",
    "url": "https://chessmnemonics.net/index.html",
    "featureList": [
      "PGN/SAN Parser",
      "Associations Table",
      "PAO 0–9 and PAO 00–99 Tables",
      "Rhythm Tables",
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
      "memory palace",
      "pao system",
      "chess training",
      "chess notation",
      "epic story",
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
    "license": "© Markellos Markides 2025",
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

/* Add the purpose visual beside the existing header image. */
(function () {
  function addPurposeVisual() {
    var headerRow = document.querySelector(".header-top-row");
    var firstImage = headerRow ? headerRow.querySelector(".header-img") : null;

    if (!headerRow || !firstImage || document.getElementById("purposeVisualFigure")) return;

    var figure = document.createElement("figure");
    figure.id = "purposeVisualFigure";
    figure.style.cssText = "margin:0;display:flex;flex-direction:column;align-items:center;gap:3px;max-width:120px;text-align:center;";

    var img = document.createElement("img");
    img.className = "header-img";
    img.src = "assets/download.jfif";
    img.alt = "The purpose: transforming chess games into memorable epic stories.";

    var caption = document.createElement("figcaption");
    caption.textContent = "The purpose: transforming chess games into memorable epic stories.";
    caption.style.cssText = "font-size:0.62rem;line-height:1.1;color:#CFAF4A;max-width:120px;font-family:Arial,sans-serif;";

    figure.appendChild(img);
    figure.appendChild(caption);
    firstImage.insertAdjacentElement("afterend", figure);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", addPurposeVisual);
  } else {
    addPurposeVisual();
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
