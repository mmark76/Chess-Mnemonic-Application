/* Experimental CMS — single DOMContentLoaded (mirrors production wiring). */
document.addEventListener('DOMContentLoaded', async () => {
  const langSel = document.getElementById('langSelect');
  if (langSel) {
    selectedLang = (langSel.value || 'en');
    langSel.addEventListener('change', () => {
      selectedLang = langSel.value || 'en';
      renderAll();
    });
  }

  const locusSelect = document.getElementById('locusMode');
  if (locusSelect) {
    locusSelect.value = locusMode;
    locusSelect.addEventListener('change', e => {
      locusMode = e.target.value;
      window.locusMode = locusMode;
      if (gameMoves && gameMoves.length) {
        renderAll();
        enableManualAnchors();
      }
    });
  }

  await loadLibraries();
  loadUserLibrariesIntoUI();

  wirePGN();
  wireTableSelect();
  wireImportLibraryButton();
  wireCreateLibraryButton();
  wireUserLibraryDropdown();

  const openBtn = document.getElementById('openLibrarySelectorBtn');
  if (openBtn) {
    openBtn.addEventListener('click', () => openLibrarySelector());
  }

  const pao99Sel = document.getElementById('pao99CollectionSelect');
  if (pao99Sel) {
    pao99Sel.addEventListener('change', () => {
      renderAll();
      const tableSel = document.getElementById('tableSelect');
      if (tableSel) showOnlySection(tableSel.value || 'sanSection');
    });
  }

  const ta = document.getElementById('pgnText');
  if (ta && ta.value.trim()) {
    gameMoves = parsePGN(ta.value);
  }
  renderAll();
  enableManualAnchors();

  const fenBtn = document.getElementById('openFenBuilderBtn');
  if (fenBtn) {
    fenBtn.addEventListener('click', () => window.open('https://lichess.org/editor', '_blank'));
  }

  const demoBtn = document.getElementById('demoGamesBtn');
  if (demoBtn) demoBtn.addEventListener('click', openDemoGamesModal);

  const tplBtn = document.getElementById('downloadTemplatesBtn');
  if (tplBtn) {
    tplBtn.addEventListener('click', async () => {
      const templates = [
        { filename: 'template_characters.json', path: '../../user_libraries/user_characters_template.json' },
        { filename: 'template_memory_palaces.json', path: '../../user_libraries/user_memory_palaces_template.json' },
        { filename: 'template_pao_00_99.json', path: '../../user_libraries/user_pao_00_99_template.json' },
        { filename: 'template_squares.json', path: '../../user_libraries/user_squares_template.json' }
      ];
      const zip = new JSZip();
      for (const tpl of templates) {
        const resp = await fetch(tpl.path);
        const json = await resp.json();
        zip.file(tpl.filename, JSON.stringify(json, null, 2));
      }
      const content = await zip.generateAsync({ type: 'blob' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(content);
      a.download = 'CMA_Templates.zip';
      a.click();
      alert('📦 Templates ZIP downloaded!');
    });
  }

  const refreshBtn = document.getElementById('refreshLociBtn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      try {
        renderAll();
        enableManualAnchors();
        console.log('🔄 Loci refreshed.');
      } catch (err) {
        console.error('Refresh Loci error:', err);
      }
    });
  }

  document.querySelectorAll('table').forEach((table) => {
    const headers = table.querySelectorAll('th');
    if (!headers.length) return;
    const toolbar = document.createElement('div');
    toolbar.className = 'table-toolbar';
    toolbar.style.marginBottom = '8px';
    headers.forEach((th, idx) => {
      const colName = th.textContent.trim() || `Column ${idx + 1}`;
      const label = document.createElement('label');
      label.style.marginRight = '8px';
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = true;
      cb.addEventListener('change', () => {
        const show = cb.checked;
        table.querySelectorAll('tr').forEach(row => {
          const cell = row.children[idx];
          if (cell) cell.style.display = show ? '' : 'none';
        });
      });
      label.append(cb, ' ' + colName);
      toolbar.appendChild(label);
    });
    if (table.parentNode) {
      table.parentNode.insertBefore(toolbar, table);
    }
  });
});
