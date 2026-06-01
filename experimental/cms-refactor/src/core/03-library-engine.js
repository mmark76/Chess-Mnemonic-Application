/* Experimental CMS — active library persistence. */
function setActiveLibrary(type, path) {
  localStorage.setItem('activeLibrary', JSON.stringify({ type, path }));
  console.log(`📘 Active library set → ${type || 'default'} (${path || 'none'})`);
}
function getActiveLibrary() {
  const data = localStorage.getItem('activeLibrary');
  return data ? JSON.parse(data) : null;
}
