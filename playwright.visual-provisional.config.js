const { defineConfig } = require("@playwright/test");
const baseConfig = require("./playwright.config");

if (!process.env.CMA_BROWSER_EXECUTABLE_PATH) {
  throw new Error(
    "The provisional visual suite requires CMA_BROWSER_EXECUTABLE_PATH. "
    + "Set it to the Chrome executable used for the provisional PNG baselines."
  );
}

module.exports = defineConfig({
  ...baseConfig,
  grep: /@visual-provisional/,
  grepInvert: undefined
});
