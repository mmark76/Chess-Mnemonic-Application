// feedback.js
// Adds a small feedback button next to the Disclaimer button.

(function () {
  function initFeedbackButton() {
    if (document.getElementById("feedbackBtn")) return;

    var style = document.createElement("style");
    style.textContent = `
      .top-action-row { display: flex; justify-content: center; align-items: center; gap: 10px; margin: 6px 0 12px; flex-wrap: wrap; transform: translateX(-36px); }
      .feedback-top-btn { margin-left: -8px; padding: 8px 18px; color: #CFAF4A; background: #111; border: 1px solid #CFAF4A; border-radius: 8px; font-weight: 700; cursor: pointer; box-shadow: 0 0 8px rgba(207,175,74,.45); }
      .feedback-top-btn:hover { color: #fff; background: #222; }
      .feedback-modal { display: none; position: fixed; z-index: 7000; inset: 0; background: rgba(0,0,0,.72); overflow: auto; }
      .feedback-box { width: min(92vw, 480px); margin: 60px auto; background: #111; color: #eee; border: 1px solid #CFAF4A; border-radius: 10px; box-shadow: 0 12px 30px rgba(0,0,0,.65); font-family: Arial, sans-serif; }
      .feedback-header { display: flex; align-items: center; justify-content: space-between; background: #222; color: #CFAF4A; border-bottom: 1px solid #CFAF4A; padding: 10px 14px; font-family: Georgia,'Times New Roman',serif; font-weight: 700; font-size: 18px; }
      .feedback-close-btn { background: transparent; color: #CFAF4A; border: none; font-size: 24px; line-height: 1; cursor: pointer; }
      .feedback-intro { margin: 14px; padding: 12px; background: #1b1b1b; border: 1px solid #333; border-radius: 8px; }
      .feedback-intro strong { color: #CFAF4A; }
      .feedback-textarea-wrap { padding: 0 14px 16px; }
      .feedback-textarea-wrap label { display: block; margin: 12px 0 6px; color: #CFAF4A; font-weight: 700; }
      .feedback-textarea-wrap textarea, .feedback-textarea-wrap input { width: 100%; padding: 10px; color: #eee; background: #181818; border: 1px solid #444; border-radius: 8px; font: inherit; box-sizing: border-box; }
      .feedback-textarea-wrap textarea { min-height: 140px; resize: vertical; }
      .feedback-submit-btn { margin-top: 14px; padding: 10px 18px; color: #111; background: #CFAF4A; border: 1px solid #8d7427; border-radius: 8px; font-weight: 700; cursor: pointer; }
      .feedback-submit-btn:hover { background: #e2c760; }
      .feedback-status { margin: 10px 0 0; font-size: .9em; color: #CFAF4A; }
      @media (max-width: 700px) { .top-action-row { transform: none; } .feedback-top-btn { margin-left: 0; } }
    `;
    document.head.appendChild(style);

    var goldBtn = document.getElementById("goldBtn");
    if (goldBtn) {
      var row = document.createElement("div");
      row.className = "top-action-row";
      goldBtn.parentNode.insertBefore(row, goldBtn);
      row.appendChild(goldBtn);

      var feedbackBtn = document.createElement("button");
      feedbackBtn.id = "feedbackBtn";
      feedbackBtn.className = "feedback-top-btn";
      feedbackBtn.type = "button";
      feedbackBtn.textContent = "Feedback";
      row.appendChild(feedbackBtn);
    }

    var modal = document.createElement("div");
    modal.id = "feedbackModal";
    modal.className = "feedback-modal";
    modal.innerHTML = `
      <div class="feedback-box">
        <div class="feedback-header">
          <span>Feedback</span>
          <button id="feedbackCloseBtn" class="feedback-close-btn" type="button">×</button>
        </div>
        <div class="feedback-intro">
          <strong>Found a bug? Have a suggestion?</strong>
          <p>Write a quick note. It helps a lot. Even the smallest issues matter.</p>
        </div>
        <form id="feedbackForm" class="feedback-textarea-wrap">
          <label for="feedbackMessage">Message</label>
          <textarea id="feedbackMessage" placeholder="Write your feedback here..." required></textarea>
          <label for="feedbackEmail">Email (optional)</label>
          <input id="feedbackEmail" type="email" placeholder="you@example.com">
          <button type="submit" class="feedback-submit-btn">Send feedback</button>
          <p id="feedbackStatus" class="feedback-status"></p>
        </form>
      </div>
    `;
    document.body.appendChild(modal);

    var openBtn = document.getElementById("feedbackBtn");
    var closeBtn = document.getElementById("feedbackCloseBtn");
    var form = document.getElementById("feedbackForm");
    var status = document.getElementById("feedbackStatus");

    if (openBtn) openBtn.addEventListener("click", function () { modal.style.display = "block"; });
    if (closeBtn) closeBtn.addEventListener("click", function () { modal.style.display = "none"; });
    window.addEventListener("click", function (event) { if (event.target === modal) modal.style.display = "none"; });

    if (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var message = document.getElementById("feedbackMessage").value.trim();
        var email = document.getElementById("feedbackEmail").value.trim();
        if (!message) {
          if (status) status.textContent = "Please write a message first.";
          return;
        }

        var recipient = ["markellos.markides", "gmail.com"].join("@");
        var subject = encodeURIComponent("Chess Mnemonic Application Feedback");
        var body = encodeURIComponent("Feedback message:\n\n" + message + "\n\nEmail:\n" + (email || "Not provided"));
        window.location.href = "mailto:" + recipient + "?subject=" + subject + "&body=" + body;
        if (status) status.textContent = "Your email app should open now.";
      });
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initFeedbackButton);
  else initFeedbackButton();
})();
