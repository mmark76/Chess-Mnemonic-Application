/* Experimental CMS — global state (fullmove is the default move concept). */
let libs = null;
let gameMoves = [];
let selectedLang = 'en';
/** @type {'half'|'full'} Default aligns with product docs; production uses runtime patch instead. */
let locusMode = 'full';
let manualAnchors = {};
window.locusMode = locusMode;
