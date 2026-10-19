/* ═══════════════════════════════════════════════════════════════════
   speech-tts.js — Speech Synthesis & AI Visor Voice Output
   ═══════════════════════════════════════════════════════════════════ */

import { playRadioSquelch } from './audio-fx.js';

let _cachedEnglishVoice = null;
let _activeSpeechResolve = null;
let _isSpeaking = false;
let _lastSpokenText = '';
let _lastSpokenTime = 0;

let _onSpeakingChange = null;
export function setOnSpeakingChange(fn) { _onSpeakingChange = fn; }

// Pick highest quality English voice available in browser
export function pickBestEnglishVoice() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  const enVoices = voices.filter(v => /^en[-_]/i.test(v.lang));
  if (enVoices.length === 0) return null;

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
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    const tryCache = () => {
      _cachedEnglishVoice = pickBestEnglishVoice();
    };
    tryCache();
    window.speechSynthesis.onvoiceschanged = tryCache;
  }
}

// Strip emoji & normalize accented chars so TTS maintains natural English prosody
export function sanitizeForTTS(text) {
  return (text || '')
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{200D}\u{20E3}\u{E0020}-\u{E007F}]/gu, '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
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

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang  = 'en-US';
    utter.rate  = 1.05;
    utter.pitch = 0.95;
    utter.volume = 0.9;

    if (!_cachedEnglishVoice) _cachedEnglishVoice = pickBestEnglishVoice();
    if (_cachedEnglishVoice) utter.voice = _cachedEnglishVoice;

    _activeSpeechResolve = resolve;

    const finish = () => {
      if (_activeSpeechResolve === resolve) {
        _activeSpeechResolve = null;
      }
      resolve();
    };

    utter.onend = finish;
    utter.onerror = finish;

    window.speechSynthesis.speak(utter);
  });
}

// Immediately cancel any AI speech playback and reset indicators
export function cancelSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try { window.speechSynthesis.cancel(); } catch (e) {}
  }
  if (_activeSpeechResolve) {
    const r = _activeSpeechResolve;
    _activeSpeechResolve = null;
    try { r(); } catch (e) {}
  }
  _isSpeaking = false;
  _lastSpokenTime = Date.now();

  const waveform = document.getElementById('waveform');
  const speaker = document.getElementById('speakerIndicator');
  waveform?.classList.remove('waveform-speaking');
  if (speaker) speaker.classList.add('hidden');

  if (_onSpeakingChange) _onSpeakingChange(false);
}

// AI response speech with radio squelch and HUD animation
export async function aiSpeak(text, pauseRecFn) {
  const waveform = document.getElementById('waveform');
  const speaker = document.getElementById('speakerIndicator');

  cancelSpeech();

  _isSpeaking = true;
  _lastSpokenText = text.toLowerCase();
  _lastSpokenTime = Date.now();

  if (typeof pauseRecFn === 'function') {
    pauseRecFn();
  }
  if (_onSpeakingChange) _onSpeakingChange(true);

  try {
    await playRadioSquelch();
    if (!_isSpeaking) return;

    waveform?.classList.add('waveform-speaking');
    if (speaker) speaker.classList.remove('hidden');

    await speak(sanitizeForTTS(text));
  } finally {
    waveform?.classList.remove('waveform-speaking');
    if (speaker) speaker.classList.add('hidden');
    _isSpeaking = false;
    _lastSpokenTime = Date.now();
    if (_onSpeakingChange) _onSpeakingChange(false);
  }
}

export function isSpeaking() {
  return _isSpeaking;
}

export function getLastSpokenText() {
  return _lastSpokenText;
}

export function getLastSpokenTime() {
  return _lastSpokenTime;
}

