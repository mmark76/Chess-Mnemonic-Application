/* Experimental CMS — default library v5.4 (no separate override file). */
async function loadLibraries() {
  const res = await fetch('../../json/libraries_v.5.4.json');
  libs = await res.json();
  console.log('LIBS KEYS:', Object.keys(libs));
}

function loadUserLibrariesIntoUI() {
  const sel = document.getElementById('userLibrarySelect');
  if (!sel) return;
  sel.innerHTML = '<option value="">— none —</option>';
  const saved = JSON.parse(localStorage.getItem('savedLibraries') || '[]');
  for (const lib of saved) {
    const opt = document.createElement('option');
    opt.value = lib.path;
    opt.textContent = `${lib.name} (${lib.type})`;
    sel.appendChild(opt);
  }
}

function updateUserLibraryStatus(text) {
  function write() {
    const status = document.getElementById('userLibraryStatus');
    if (!status) return setTimeout(write, 100);
    status.innerHTML = text;
  }
  write();
}
