/* ═══════════════════════════════════════════════════════════════════
   speech-tts.js — Speech Synthesis & AI Visor Voice Output
   ═══════════════════════════════════════════════════════════════════ */

import { playRadioSquelch } from './audio-fx.js';

let cachedEnglishVoice = null;
let activeSpeechResolve = null;
let isSpeakingFlag = false;
let lastSpokenText = '';
let lastSpokenTime = 0;
let onSpeakingChange = null;

export function setOnSpeakingChange(fn) {
  onSpeakingChange = fn;
}

export function pickBestEnglishVoice() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;

  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  const enVoices = voices.filter(v => /^en[-_]/i.test(v.lang));
  if (!enVoices.length) return null;

  const preferred = [
    'Google US English',
    'Google UK English Female',
    'Google UK English Male',
    'Microsoft Zira',
    'Microsoft David',
    'Microsoft Mark',
    'Samantha',
    'Daniel',
    'Karen',
    'Alex',
  ];

  for (const name of preferred) {
    const match = enVoices.find(v => v.name.includes(name));
    if (match) return match;
  }

  return enVoices.find(v => v.lang === 'en-US')
    || enVoices.find(v => v.lang === 'en-GB')
    || enVoices[0];
}

export function initTTSVoices() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  const refreshVoice = () => {
    cachedEnglishVoice = pickBestEnglishVoice();
  };

  refreshVoice();
  window.speechSynthesis.onvoiceschanged = refreshVoice;
}

export function sanitizeForTTS(text = '') {
  return String(text)
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{200D}\u{20E3}\u{E0020}-\u{E007F}]/gu, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function speak(text) {
  return new Promise(resolve => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve();
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1.05;
    utterance.pitch = 0.95;
    utterance.volume = 0.9;

    if (!cachedEnglishVoice) {
      cachedEnglishVoice = pickBestEnglishVoice();
    }
    if (cachedEnglishVoice) {
      utterance.voice = cachedEnglishVoice;
    }

    activeSpeechResolve = resolve;

    const finish = () => {
      if (activeSpeechResolve === resolve) {
        activeSpeechResolve = null;
      }
      resolve();
    };

    utterance.onend = finish;
    utterance.onerror = finish;

    window.speechSynthesis.speak(utterance);
  });
}

export function cancelSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }

  if (activeSpeechResolve) {
    const resolve = activeSpeechResolve;
    activeSpeechResolve = null;
    try {
      resolve();
    } catch {}
  }

  isSpeakingFlag = false;
  lastSpokenTime = Date.now();

  const waveform = typeof document !== 'undefined' ? document.getElementById('waveform') : null;
  const speaker = typeof document !== 'undefined' ? document.getElementById('speakerIndicator') : null;

  waveform?.classList.remove('waveform-speaking');
  speaker?.classList.add('hidden');

  onSpeakingChange?.(false);
}

export async function aiSpeak(text, pauseRecFn) {
  const waveform = typeof document !== 'undefined' ? document.getElementById('waveform') : null;
  const speaker = typeof document !== 'undefined' ? document.getElementById('speakerIndicator') : null;

  cancelSpeech();

  isSpeakingFlag = true;
  lastSpokenText = String(text).toLowerCase();
  lastSpokenTime = Date.now();

  pauseRecFn?.();
  onSpeakingChange?.(true);

  try {
    await playRadioSquelch();
    if (!isSpeakingFlag) return;

    waveform?.classList.add('waveform-speaking');
    speaker?.classList.remove('hidden');

    await speak(sanitizeForTTS(text));
  } finally {
    waveform?.classList.remove('waveform-speaking');
    speaker?.classList.add('hidden');

    isSpeakingFlag = false;
    lastSpokenTime = Date.now();
    onSpeakingChange?.(false);
  }
}

export function isSpeaking() {
  return isSpeakingFlag;
}

export function getLastSpokenText() {
  return lastSpokenText;
}

export function getLastSpokenTime() {
  return lastSpokenTime;
}

