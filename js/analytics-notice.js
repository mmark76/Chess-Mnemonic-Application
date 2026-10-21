(function () {
  const dismissalKey = 'chessmnemonics.analytics-notice-dismissed.v1';

  function isDismissed() {
    try {
      return window.localStorage.getItem(dismissalKey) === 'true';
    } catch (_error) {
      return false;
    }
  }

  function dismiss() {
    try {
      window.localStorage.setItem(dismissalKey, 'true');
    } catch (_error) {
      // Storage is optional; the notice still closes for the current visit.
    }
  }

  function initializeAnalyticsNotice() {
    const notice = document.getElementById('analyticsConsent');
    const close = document.getElementById('analyticsClose');
    const reopen = document.getElementById('analyticsInfo');

    if (!notice || !close) return;

    const show = function () { notice.hidden = false; };
    close.addEventListener('click', function () {
      dismiss();
      notice.hidden = true;
    });
    if (reopen) reopen.addEventListener('click', show);
    if (!isDismissed()) show();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAnalyticsNotice);
  } else {
    initializeAnalyticsNotice();
  }
}());
