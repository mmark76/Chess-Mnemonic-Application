/* ================================================
   Markellos CMS — Epic Story Text-to-Speech Controls
   Browser-based TTS using the Web Speech API.
   ================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const toolbar = document.querySelector(".epic-copy-toolbar");
  const textView = document.getElementById("epicTextView");

  if (!toolbar || !textView) return;

  if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
    const notice = document.createElement("span");
    notice.textContent = "TTS is not supported by this browser.";
    notice.style.fontSize = "0.85em";
    notice.style.opacity = "0.8";
    toolbar.appendChild(notice);
    return;
  }

  const ttsGroup = document.createElement("div");
  ttsGroup.className = "epic-tts-controls";
  ttsGroup.style.display = "inline-flex";
  ttsGroup.style.alignItems = "center";
  ttsGroup.style.gap = "6px";
  ttsGroup.style.flexWrap = "wrap";

  ttsGroup.innerHTML = `
    <button id="epicTtsPlayBtn" class="btn btn-primary" type="button">▶ Listen</button>
    <button id="epicTtsPauseBtn" class="btn" type="button">⏸ Pause</button>
    <button id="epicTtsResumeBtn" class="btn" type="button">▶ Resume</button>
    <button id="epicTtsStopBtn" class="btn" type="button">■ Stop</button>
    <label for="epicTtsVoiceSelect" style="display:inline-flex;align-items:center;gap:4px;">
      Voice:
      <select id="epicTtsVoiceSelect" style="max-width:180px;"></select>
    </label>
    <label for="epicTtsRateSelect" style="display:inline-flex;align-items:center;gap:4px;">
      Speed:
      <select id="epicTtsRateSelect">
        <option value="0.75">0.75x</option>
        <option value="0.9">0.90x</option>
        <option value="1" selected>1.00x</option>
        <option value="1.1">1.10x</option>
        <option value="1.25">1.25x</option>
      </select>
    </label>
  `;

  toolbar.appendChild(ttsGroup);

  const playBtn = document.getElementById("epicTtsPlayBtn");
  const pauseBtn = document.getElementById("epicTtsPauseBtn");
  const resumeBtn = document.getElementById("epicTtsResumeBtn");
  const stopBtn = document.getElementById("epicTtsStopBtn");
  const voiceSelect = document.getElementById("epicTtsVoiceSelect");
  const rateSelect = document.getElementById("epicTtsRateSelect");

  let voices = [];
  let currentUtterance = null;

  function getPreferredVoice() {
    const selectedName = voiceSelect.value;
    return voices.find((voice) => voice.name === selectedName) || null;
  }

  function loadVoices() {
    voices = window.speechSynthesis.getVoices() || [];
    voiceSelect.innerHTML = "";

    voices.forEach((voice) => {
      const option = document.createElement("option");
      option.value = voice.name;
      option.textContent = `${voice.name} (${voice.lang})`;
      voiceSelect.appendChild(option);
    });

    const preferredVoice =
      voices.find((voice) => voice.lang && voice.lang.toLowerCase().startsWith("en")) || voices[0];

    if (preferredVoice) {
      voiceSelect.value = preferredVoice.name;
    }
  }

  function stopSpeech() {
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending || window.speechSynthesis.paused) {
      window.speechSynthesis.cancel();
    }
    currentUtterance = null;
  }

  function speakEpicStory() {
    const text = (textView.textContent || "").trim();
    if (!text) return;

    stopSpeech();

    currentUtterance = new SpeechSynthesisUtterance(text);
    currentUtterance.voice = getPreferredVoice();
    currentUtterance.rate = Number(rateSelect.value) || 1;
    currentUtterance.pitch = 1;
    currentUtterance.volume = 1;

    currentUtterance.onend = () => {
      currentUtterance = null;
    };

    currentUtterance.onerror = () => {
      currentUtterance = null;
    };

    window.speechSynthesis.speak(currentUtterance);
  }

  playBtn.addEventListener("click", speakEpicStory);

  pauseBtn.addEventListener("click", () => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
    }
  });

  resumeBtn.addEventListener("click", () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  });

  stopBtn.addEventListener("click", stopSpeech);

  voiceSelect.addEventListener("change", () => {
    if (window.speechSynthesis.speaking || window.speechSynthesis.paused) {
      speakEpicStory();
    }
  });

  rateSelect.addEventListener("change", () => {
    if (window.speechSynthesis.speaking || window.speechSynthesis.paused) {
      speakEpicStory();
    }
  });

  const closeBtn = document.getElementById("epicCloseBtn");
  if (closeBtn) {
    closeBtn.addEventListener("click", stopSpeech);
  }

  const epicModal = document.getElementById("epicModal");
  window.addEventListener("click", (event) => {
    if (event.target === epicModal) stopSpeech();
  });

  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
});
