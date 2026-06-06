/* ===========================================================
   Table Header Fixes
   Keeps dynamically generated column controls aligned with table headers.
   =========================================================== */

(function () {
  function setLabelText(label, text) {
    if (!label) return;
    const checkbox = label.querySelector('input[type="checkbox"]');
    label.textContent = '';
    if (checkbox) {
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(' ' + text));
    } else {
      label.textContent = text;
    }
  }

  function fixAssociationsActionColumn() {
    const section = document.getElementById('assocSection');
    if (!section) return;

    const table = section.querySelector('table');
    if (!table) return;

    const headers = table.querySelectorAll('thead th');
    if (headers.length >= 9) {
      headers[7].textContent = 'Action';
      headers[8].textContent = 'Target Square Association';
    }

    const wrapper = section.querySelector('.table-wrapper');
    const toolbar = wrapper ? wrapper.querySelector('.table-toolbar') : null;
    if (!toolbar) return;

    const labels = toolbar.querySelectorAll('label');
    if (labels.length >= 9) {
      setLabelText(labels[7], 'Action');
      setLabelText(labels[8], 'Target Square Association');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixAssociationsActionColumn);
  } else {
    fixAssociationsActionColumn();
  }
})();
