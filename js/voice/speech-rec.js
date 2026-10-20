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
let sessionTranscript = '';
let silenceTimer = null;
let mediaRecorder = null;
let recordedAudioChunks = [];
let currentAudioMimeType = '';

let onTranscript = null;
let onListeningChange = null;
let processInputFn = null;

export function setOnTranscript(fn) {
  onTranscript = fn;
}

export function setOnListeningChange(fn) {
  onListeningChange = fn;
}

export function setProcessInputHandler(fn) {
  processInputFn = fn;
}

export function getIsListening() {
  return isListening;
}

export function pauseRecognition() {
  recognition?.abort();
}

function getMicStatusEl() {
  return typeof document !== 'undefined' ? document.getElementById('micStatus') : null;
}

function resetSilenceTimer() {
  clearTimeout(silenceTimer);
  silenceTimer = setTimeout(() => {
    if (isListening && sessionTranscript.trim()) {
      finishRecordingAndSubmit();
    }
  }, 3800);
}

function isEchoOfAI(transcript) {
  const lastSpokenText = getLastSpokenText();
  const lastSpokenTime = getLastSpokenTime();
  if (!lastSpokenText) return false;

  const cleanText = transcript.toLowerCase().trim();
  if (!cleanText) return true;

  if (Date.now() - lastSpokenTime >= 3500) return false;

  const echoPhrases = [
    'emergency beacon',
    'transponder locked',
    'support is en route',
    'copy that',
    'route locked',
    'operator switched',
    'ski patrol has been',
  ];

  if (echoPhrases.some(phrase => cleanText.includes(phrase))) {
    return true;
  }

  return lastSpokenText.includes(cleanText) && cleanText.length > 15;
}

export function initRecognition() {
  if (typeof window === 'undefined') return;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    console.warn('Speech Recognition not supported in this browser.');
    const micStatus = getMicStatusEl();
    if (micStatus) {
      micStatus.textContent = 'Voice API unavailable · Use text box or Chrome/Edge';
    }
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
    let finalResults = '';

    for (let i = 0; i < event.results.length; i++) {
      const result = event.results[i];
      if (result.isFinal) {
        finalResults += `${result[0].transcript} `;
      } else {
        interim += result[0].transcript;
      }
    }

    const combined = `${finalResults} ${interim}`.replace(/\s+/g, ' ').trim();
    sessionTranscript = combined;

    const micStatus = getMicStatusEl();
    if (micStatus && isListening && !isSpeaking()) {
      micStatus.textContent = combined
        ? `🎙️ "${combined}" · Tap mic to send`
        : '🔴 RECORDING… Speak now (Tap mic to send)';
    }

    if (combined) {
      resetSilenceTimer();
    }
  };

  recognition.onerror = (event) => {
    if (event.error === 'no-speech' || event.error === 'aborted') return;

    console.warn('Speech recognition error:', event.error);
    const micStatus = getMicStatusEl();

    if (event.error === 'network') {
      if (micStatus) micStatus.textContent = 'Network speech service blocked · Use text box or Chrome';
    } else if (event.error === 'not-allowed') {
      if (micStatus) micStatus.textContent = 'Mic permission denied in browser settings';
    }

    stopListening();
  };

  recognition.onend = () => {
    if (isListening && !isSpeaking()) {
      try {
        recognition.start();
      } catch {}
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

  const draw = () => {
    analyserNode.getByteFrequencyData(dataArray);
    bars.forEach((bar, index) => {
      const value = dataArray[Math.min(index, dataArray.length - 1)] / 255;
      bar.style.height = `${Math.max(4, value * 26)}px`;
    });
    animFrameId = requestAnimationFrame(draw);
  };

  draw();
}

function stopWaveformViz() {
  if (animFrameId) {
    cancelAnimationFrame(animFrameId);
    animFrameId = null;
  }

  document.querySelectorAll('#waveform .wave-bar').forEach(bar => {
    bar.style.height = '4px';
  });
}

export function getSupportedAudioMimeType() {
  if (typeof window === 'undefined' || typeof MediaRecorder === 'undefined') return '';

  const candidates = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/ogg;codecs=opus',
    'audio/mp4',
    'audio/wav',
  ];

  for (const candidate of candidates) {
    if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(candidate)) {
      return candidate;
    }
  }

  return '';
}

export async function startListening() {
  if (isListening) return;
  if (isSpeaking()) cancelSpeech();

  sessionTranscript = '';
  clearTimeout(silenceTimer);
  silenceTimer = null;
  recordedAudioChunks = [];

  if (!recognition) initRecognition();

  try {
    micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    startWaveformViz(micStream);

    currentAudioMimeType = getSupportedAudioMimeType();
    try {
      mediaRecorder = new MediaRecorder(
        micStream,
        currentAudioMimeType ? { mimeType: currentAudioMimeType } : undefined
      );
      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedAudioChunks.push(event.data);
        }
      };
      mediaRecorder.start(100);
    } catch (error) {
      console.warn('MediaRecorder not available or failed:', error);
      mediaRecorder = null;
    }
  } catch (error) {
    console.warn('Microphone access denied:', error);
  }

  isListening = true;
  document.getElementById('waveform')?.classList.add('waveform-active');
  onListeningChange?.(true);

  try {
    recognition?.start();
  } catch {}
}

export function stopListening() {
  if (!isListening) return;

  isListening = false;
  clearTimeout(silenceTimer);
  silenceTimer = null;

  try {
    recognition?.stop();
  } catch {}

  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    try {
      mediaRecorder.stop();
    } catch {}
  }

  if (micStream) {
    micStream.getTracks().forEach(track => track.stop());
    micStream = null;
  }

  stopWaveformViz();
  document.getElementById('waveform')?.classList.remove('waveform-active');
  onListeningChange?.(false);
}

export function finishRecordingAndSubmit() {
  clearTimeout(silenceTimer);
  silenceTimer = null;

  const spokenText = sessionTranscript.trim();
  sessionTranscript = '';

  const chunks = [...recordedAudioChunks];
  recordedAudioChunks = [];
  const mimeType = currentAudioMimeType || 'audio/webm';
  const audioBlob = chunks.length > 0 ? new Blob(chunks, { type: mimeType }) : null;

  stopListening();

  if (!spokenText && (!audioBlob || audioBlob.size < 500)) {
    const micStatus = getMicStatusEl();
    if (micStatus) micStatus.textContent = 'No speech detected · Tap to talk';
    setTimeout(() => {
      if (!isListening && !isSpeaking() && micStatus) {
        micStatus.textContent = 'TAP TO TALK · or use prompts above';
      }
    }, 1800);
    return;
  }

  if (spokenText && isEchoOfAI(spokenText)) {
    return;
  }

  const payload = { text: spokenText, audioBlob, mimeType };

  if (processInputFn) {
    processInputFn(payload);
  } else if (onTranscript && spokenText) {
    onTranscript(spokenText);
  }
}

export function toggleListening() {
  if (isSpeaking()) {
    cancelSpeech();
    const micStatus = getMicStatusEl();
    if (micStatus) micStatus.textContent = 'AI silenced · Tap to talk';
    setTimeout(() => {
      if (!isListening && !isSpeaking() && micStatus) {
        micStatus.textContent = 'TAP TO TALK · or use prompts above';
      }
    }, 1500);
    return;
  }

  if (isListening) {
    finishRecordingAndSubmit();
    return;
  }

  startListening();
}

