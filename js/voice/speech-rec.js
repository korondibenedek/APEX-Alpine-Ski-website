/* ═══════════════════════════════════════════════════════════════════
   speech-rec.js — Web Speech Recognition, Visualizer & 3-State Mic Toggle
   ═══════════════════════════════════════════════════════════════════ */

import { ensureAudioCtx } from './audio-fx.js';
import { cancelSpeech, isSpeaking, getLastSpokenText, getLastSpokenTime } from './speech-tts.js';

let recognition = null;
let isListening = false;
let micStream = null;
let analyserNode = null;
let animFrameId = null;

let _sessionTranscript = '';
let _silenceTimer = null;

let _onTranscript = null;
let _onListeningChange = null;
let _processInputFn = null;

export function setOnTranscript(fn) { _onTranscript = fn; }
export function setOnListeningChange(fn) { _onListeningChange = fn; }
export function setProcessInputHandler(fn) { _processInputFn = fn; }

export function getIsListening() { return isListening; }

export function pauseRecognition() {
  if (recognition) {
    try { recognition.abort(); } catch (e) {}
  }
}

function resetSilenceTimer() {
  clearTimeout(_silenceTimer);
  _silenceTimer = setTimeout(() => {
    if (isListening && _sessionTranscript.trim()) {
      finishRecordingAndSubmit();
    }
  }, 3800);
}

function isEchoOfAI(transcript) {
  const lastSpokenText = getLastSpokenText();
  const lastSpokenTime = getLastSpokenTime();
  if (!lastSpokenText) return false;
  const cleanT = transcript.toLowerCase().trim();
  if (!cleanT) return true;

  if (Date.now() - lastSpokenTime < 3500) {
    if (cleanT.includes('emergency beacon') || cleanT.includes('transponder locked')
      || cleanT.includes('support is en route') || cleanT.includes('copy that')
      || cleanT.includes('route locked') || cleanT.includes('operator switched')
      || cleanT.includes('ski patrol has been')) {
      return true;
    }
    if (lastSpokenText.includes(cleanT) && cleanT.length > 15) {
      return true;
    }
  }
  return false;
}

export function initRecognition() {
  if (typeof window === 'undefined') return;
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    console.warn('Speech Recognition not supported in this browser.');
    const micSt = document.getElementById('micStatus');
    if (micSt) micSt.textContent = 'Voice API unavailable · Use text box or Chrome/Edge';
    return;
  }

  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';
  recognition.maxAlternatives = 1;

  recognition.onresult = (event) => {
    if (isSpeaking()) return;

    let interim = '';
    let sessionFinal = '';

    for (let i = 0; i < event.results.length; i++) {
      const res = event.results[i];
      if (res.isFinal) {
        sessionFinal += res[0].transcript + ' ';
      } else {
        interim += res[0].transcript;
      }
    }

    const combined = (sessionFinal + ' ' + interim).replace(/\s+/g, ' ').trim();
    _sessionTranscript = combined;

    const micSt = document.getElementById('micStatus');
    if (micSt && isListening && !isSpeaking()) {
      if (combined) {
        micSt.textContent = '🎙️ "' + combined + '" · Tap mic to send';
      } else {
        micSt.textContent = '🔴 RECORDING… Speak now (Tap mic to send)';
      }
    }

    if (combined) {
      resetSilenceTimer();
    }
  };

  recognition.onerror = (event) => {
    if (event.error === 'no-speech' || event.error === 'aborted') return;
    console.warn('Speech recognition error:', event.error);
    const micSt = document.getElementById('micStatus');
    if (event.error === 'network') {
      if (micSt) micSt.textContent = 'Network speech service blocked · Use text box or Chrome';
    } else if (event.error === 'not-allowed') {
      if (micSt) micSt.textContent = 'Mic permission denied in browser settings';
    }
    stopListening();
  };

  recognition.onend = () => {
    if (isListening && !isSpeaking()) {
      try { recognition.start(); } catch (e) {}
    }
  };
}

function startWaveformViz(stream) {
  const ctx = ensureAudioCtx();
  const source = ctx.createMediaStreamSource(stream);
  analyserNode = ctx.createAnalyser();
  analyserNode.fftSize = 64;
  source.connect(analyserNode);

  const bars = document.querySelectorAll('#waveform .wave-bar');
  const dataArray = new Uint8Array(analyserNode.frequencyBinCount);

  function draw() {
    analyserNode.getByteFrequencyData(dataArray);
    bars.forEach((bar, i) => {
      const idx = Math.min(i, dataArray.length - 1);
      const val = dataArray[idx] / 255;
      bar.style.height = `${Math.max(4, val * 26)}px`;
    });
    animFrameId = requestAnimationFrame(draw);
  }
  draw();
}

function stopWaveformViz() {
  if (animFrameId) cancelAnimationFrame(animFrameId);
  animFrameId = null;
  document.querySelectorAll('#waveform .wave-bar').forEach(bar => {
    bar.style.height = '4px';
  });
}

export async function startListening() {
  if (isListening) return;
  if (isSpeaking()) cancelSpeech();

  _sessionTranscript = '';
  clearTimeout(_silenceTimer);
  _silenceTimer = null;

  if (!recognition) initRecognition();
  if (!recognition) return;

  try {
    micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    startWaveformViz(micStream);
  } catch (err) {
    console.warn('Microphone access denied:', err);
  }

  isListening = true;
  document.getElementById('waveform')?.classList.add('waveform-active');
  if (_onListeningChange) _onListeningChange(true);

  try {
    recognition.start();
  } catch (e) {}
}

export function stopListening() {
  if (!isListening) return;
  isListening = false;

  clearTimeout(_silenceTimer);
  _silenceTimer = null;

  try { recognition?.stop(); } catch (e) {}
  if (micStream) {
    micStream.getTracks().forEach(t => t.stop());
    micStream = null;
  }
  stopWaveformViz();
  document.getElementById('waveform')?.classList.remove('waveform-active');
  if (_onListeningChange) _onListeningChange(false);
}

export function finishRecordingAndSubmit() {
  clearTimeout(_silenceTimer);
  _silenceTimer = null;

  const spokenText = _sessionTranscript.trim();
  _sessionTranscript = '';

  stopListening();

  if (!spokenText) {
    const micSt = document.getElementById('micStatus');
    if (micSt) micSt.textContent = 'No speech detected · Tap to talk';
    setTimeout(() => {
      if (!isListening && !isSpeaking() && micSt) {
        micSt.textContent = 'TAP TO TALK · or use prompts above';
      }
    }, 1800);
    return;
  }

  if (isEchoOfAI(spokenText)) {
    return;
  }

  if (_onTranscript) _onTranscript(spokenText);
  if (_processInputFn) _processInputFn(spokenText);
}

export function toggleListening() {
  // 1. If AI is speaking, clicking immediately silences the AI!
  if (isSpeaking()) {
    cancelSpeech();
    const micSt = document.getElementById('micStatus');
    if (micSt) micSt.textContent = 'AI silenced · Tap to talk';
    setTimeout(() => {
      if (!isListening && !isSpeaking() && micSt) {
        micSt.textContent = 'TAP TO TALK · or use prompts above';
      }
    }, 1500);
    return;
  }

  // 2. If currently recording, clicking stops recording and submits to AI
  if (isListening) {
    finishRecordingAndSubmit();
    return;
  }

  // 3. Otherwise (idle), start recording!
  startListening();
}

