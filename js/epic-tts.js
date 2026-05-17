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
        <option value="0.45">0.45x</option>
        <option value="0.55">0.55x</option>
        <option value="0.65">0.65x</option>
        <option value="0.75">0.75x</option>
        <option value="0.9">0.90x</option>
        <option value="1" selected>1.00x</option>
        <option value="1.1">1.10x</option>
        <option value="1.25">1.25x</option>
      </select>
    </label>
    <span id="epicTtsStatus" style="font-size:0.85em;opacity:0.8;"></span>
  `;

  toolbar.appendChild(ttsGroup);

  const playBtn = document.getElementById("epicTtsPlayBtn");
  const pauseBtn = document.getElementById("epicTtsPauseBtn");
  const resumeBtn = document.getElementById("epicTtsResumeBtn");
  const stopBtn = document.getElementById("epicTtsStopBtn");
  const voiceSelect = document.getElementById("epicTtsVoiceSelect");
  const rateSelect = document.getElementById("epicTtsRateSelect");
  const status = document.getElementById("epicTtsStatus");

  let voices = [];
  let chunks = [];
  let chunkIndex = 0;
  let isStopped = true;
  let currentUtterance = null;

  function setStatus(message) {
    if (status) status.textContent = message || "";
  }

  function getPreferredVoice() {
    const selectedName = voiceSelect.value;
    return voices.find((voice) => voice.name === selectedName) || null;
  }

  function loadVoices() {
    voices = window.speechSynthesis.getVoices() || [];
    voiceSelect.innerHTML = "";

    if (!voices.length) {
      const option = document.createElement("option");
      option.value = "";
      option.textContent = "Default browser voice (English US preferred)";
      voiceSelect.appendChild(option);
      return;
    }

    voices.forEach((voice) => {
      const option = document.createElement("option");
      option.value = voice.name;
      option.textContent = `${voice.name} (${voice.lang})`;
      voiceSelect.appendChild(option);
    });

    const preferredVoice =
      voices.find((voice) => voice.lang && voice.lang.toLowerCase() === "en-us") ||
      voices.find((voice) => voice.lang && voice.lang.toLowerCase().startsWith("en-us")) ||
      voices.find((voice) => voice.name && voice.name.toLowerCase().includes("english") && voice.name.toLowerCase().includes("united states")) ||
      voices.find((voice) => voice.lang && voice.lang.toLowerCase().startsWith("en")) ||
      voices[0];

    if (preferredVoice) {
      voiceSelect.value = preferredVoice.name;
    }
  }

  function splitTextIntoChunks(text, maxLength = 900) {
    const cleaned = text.replace(/\s+/g, " ").trim();
    if (!cleaned) return [];

    const sentences = cleaned.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [cleaned];
    const result = [];
    let current = "";

    sentences.forEach((sentence) => {
      const part = sentence.trim();
      if (!part) return;

      if ((current + " " + part).trim().length <= maxLength) {
        current = (current + " " + part).trim();
      } else {
        if (current) result.push(current);

        if (part.length <= maxLength) {
          current = part;
        } else {
          for (let i = 0; i < part.length; i += maxLength) {
            result.push(part.slice(i, i + maxLength));
          }
          current = "";
        }
      }
    });

    if (current) result.push(current);
    return result;
  }

  function stopSpeech() {
    isStopped = true;
    chunks = [];
    chunkIndex = 0;
    currentUtterance = null;
    window.speechSynthesis.cancel();
    setStatus("Stopped");
  }

  function speakCurrentChunk() {
    if (isStopped) return;

    if (chunkIndex >= chunks.length) {
      currentUtterance = null;
      setStatus("Finished");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(chunks[chunkIndex]);
    utterance.lang = "en-US";
    utterance.voice = getPreferredVoice();
    utterance.rate = Number(rateSelect.value) || 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    currentUtterance = utterance;
    setStatus(`Reading ${chunkIndex + 1}/${chunks.length}`);

    utterance.onend = () => {
      if (isStopped) return;
      chunkIndex += 1;
      speakCurrentChunk();
    };

    utterance.onerror = () => {
      currentUtterance = null;
      setStatus("TTS error. Try another voice or browser.");
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  function speakEpicStory() {
    const text = (textView.textContent || "").trim();
    if (!text) {
      setStatus("No story text to read");
      return;
    }

    window.speechSynthesis.cancel();
    chunks = splitTextIntoChunks(text);
    chunkIndex = 0;
    isStopped = false;

    setTimeout(speakCurrentChunk, 100);
  }

  playBtn.addEventListener("click", speakEpicStory);

  pauseBtn.addEventListener("click", () => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setStatus("Paused");
    }
  });

  resumeBtn.addEventListener("click", () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setStatus(`Reading ${chunkIndex + 1}/${chunks.length}`);
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
