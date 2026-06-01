/* Experimental CMS — table section visibility. */
function showOnlySection(idToShow) {
  const ids = ['sanSection', 'assocSection', 'paoSection', 'pao99Section', 'shortnamesSection'];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = (id === idToShow) ? 'block' : 'none';
  });
}
function wireTableSelect() {
  const sel = document.getElementById('tableSelect');
  if (!sel) return;
  showOnlySection(sel.value || 'sanSection');
  sel.addEventListener('change', () => showOnlySection(sel.value));
}
