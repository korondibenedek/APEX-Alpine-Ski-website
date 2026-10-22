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

// Strong reference to prevent V8 from garbage collecting active utterance during speech
let activeUtterance = null;
let chromeKeepAliveTimer = null;
let speechSafetyTimeout = null;

export function setOnSpeakingChange(fn) {
  onSpeakingChange = fn;
}

export function pickBestEnglishVoice() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;

  const voices = window.speechSynthesis.getVoices();
  if (!voices || !voices.length) return null;

  const enVoices = voices.filter(v => /^en[-_]/i.test(v.lang));
  const pool = enVoices.length > 0 ? enVoices : voices;

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
    const match = pool.find(v => v.name && v.name.includes(name));
    if (match) return match;
  }

  return pool.find(v => v.lang === 'en-US')
    || pool.find(v => v.lang === 'en-GB')
    || pool[0];
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

    const cleanText = sanitizeForTTS(text);
    if (!cleanText) {
      resolve();
      return;
    }

    // Ensure browser speech engine is active / unpaused
    try {
      window.speechSynthesis.resume();
    } catch {}

    const utterance = new SpeechSynthesisUtterance(cleanText);
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
    activeUtterance = utterance;

    const finish = () => {
      if (chromeKeepAliveTimer) {
        clearInterval(chromeKeepAliveTimer);
        chromeKeepAliveTimer = null;
      }
      if (speechSafetyTimeout) {
        clearTimeout(speechSafetyTimeout);
        speechSafetyTimeout = null;
      }
      activeUtterance = null;

      if (activeSpeechResolve === resolve) {
        activeSpeechResolve = null;
      }
      resolve();
    };

    utterance.onend = finish;
    utterance.onerror = (err) => {
      console.warn('SpeechSynthesis playback ended with status:', err);
      finish();
    };

    // Chrome 15s freeze watchdog: Chromium pauses long SpeechSynthesisUtterances after ~15s
    chromeKeepAliveTimer = setInterval(() => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        if (!window.speechSynthesis.speaking) {
          clearInterval(chromeKeepAliveTimer);
          chromeKeepAliveTimer = null;
        } else {
          try {
            window.speechSynthesis.pause();
            window.speechSynthesis.resume();
          } catch {}
        }
      }
    }, 6000);

    // Safety timeout ensures promise resolves even if the browser drops onend
    const safetyMs = Math.max(8000, cleanText.length * 120 + 8000);
    speechSafetyTimeout = setTimeout(finish, safetyMs);

    try {
      window.speechSynthesis.speak(utterance);
      // Double resume for Chromium audio state
      window.speechSynthesis.resume();
    } catch (e) {
      console.warn('speechSynthesis.speak call failed:', e);
      finish();
    }
  });
}

export function cancelSpeech() {
  if (chromeKeepAliveTimer) {
    clearInterval(chromeKeepAliveTimer);
    chromeKeepAliveTimer = null;
  }
  if (speechSafetyTimeout) {
    clearTimeout(speechSafetyTimeout);
    speechSafetyTimeout = null;
  }
  activeUtterance = null;

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();
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
  lastSpokenText = String(text || '').toLowerCase();
  lastSpokenTime = Date.now();

  pauseRecFn?.();
  onSpeakingChange?.(true);

  try {
    try {
      await playRadioSquelch();
    } catch (squelchErr) {
      console.warn('Radio squelch playback failed:', squelchErr);
    }

    if (!isSpeakingFlag) return;

    waveform?.classList.add('waveform-speaking');
    speaker?.classList.remove('hidden');

    await speak(text);
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
