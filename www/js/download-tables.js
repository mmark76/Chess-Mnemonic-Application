// download-tables.js
// Handles the "Download as…" dropdowns for all tables

(function () {

  function exportTable(sectionId, format) {
    const section = document.getElementById(sectionId);
    if (!section) {
      alert('Table section not found: ' + sectionId);
      return;
    }

    const table = section.querySelector('table');
    if (!table) {
      alert('Table not found in section: ' + sectionId);
      return;
    }

    const rows = [];
    table.querySelectorAll('tr').forEach(row => {
      const cells = Array.from(row.children).map(td =>
        td.innerText.replace(/\r?\n/g, ' ').trim()
      );
      if (cells.length) rows.push(cells);
    });

    let blob;
    if (format === 'csv') {
      const csv = rows
        .map(r => r.map(x => `"${x.replace(/"/g, '""')}"`).join(','))
        .join('\n');
      blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    } else if (format === 'json') {
      blob = new Blob(
        [JSON.stringify(rows, null, 2)],
        { type: 'application/json;charset=utf-8;' }
      );
    } else {
      return;
    }

    const filename = `${sectionId}.${format}`;

    // Prefer FileSaver.js when available
    if (typeof saveAs === 'function') {
      saveAs(blob, filename);
    } else {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  function removeTxtOptions() {
    document.querySelectorAll('.download-select option[value="txt"]').forEach(option => {
      option.remove();
    });
  }

  function initDownloadDropdowns() {
    removeTxtOptions();

    document.querySelectorAll('.download-select').forEach(sel => {
      sel.addEventListener('change', () => {
        const format = sel.value;
        if (!format) return;

        const sectionId = sel.dataset.table;
        if (!sectionId) return;

        exportTable(sectionId, format);
        sel.value = '';
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDownloadDropdowns);
  } else {
    initDownloadDropdowns();
  }

})();
