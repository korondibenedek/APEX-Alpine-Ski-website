/* ═══════════════════════════════════════════════════════════════════
   index.js — Unified VoiceEngine Module Export
   ═══════════════════════════════════════════════════════════════════ */

import { ensureAudioCtx, playRadioSquelch } from './audio-fx.js';
import {
  initTTSVoices,
  aiSpeak as ttsAiSpeak,
  cancelSpeech,
  isSpeaking,
  setOnSpeakingChange,
} from './speech-tts.js';
import {
  initRecognition,
  startListening,
  stopListening,
  toggleListening,
  finishRecordingAndSubmit,
  pauseRecognition,
  getIsListening,
  setOnTranscript,
  setOnListeningChange,
  setProcessInputHandler,
} from './speech-rec.js';
import {
  classifyIntent,
  extractRouteArgs,
  extractSOSArgs,
  extractConditionsArgs,
} from './intent-parser.js';
import {
  formatRadioMessage,
  extractSquadArgs,
} from './radio-formatter.js';
import {
  setGeminiApiKey,
  getGeminiApiKey,
  processWithGemini,
  processWithGeminiAudio,
  blobToBase64,
} from './gemini-client.js';
import {
  setGroqApiKey,
  getGroqApiKey,
  transcribeWithGroq,
} from './groq-client.js';
import { nodes } from '../data/resort-graph.js';

export {
  ensureAudioCtx,
  playRadioSquelch,
  initTTSVoices,
  cancelSpeech,
  isSpeaking,
  setOnSpeakingChange,
  initRecognition,
  startListening,
  stopListening,
  toggleListening,
  finishRecordingAndSubmit,
  pauseRecognition,
  getIsListening,
  setOnTranscript,
  setOnListeningChange,
  classifyIntent,
  extractRouteArgs,
  extractSOSArgs,
  extractConditionsArgs,
  formatRadioMessage,
  extractSquadArgs,
  setGeminiApiKey,
  getGeminiApiKey,
  processWithGemini,
  processWithGeminiAudio,
  blobToBase64,
  setGroqApiKey,
  getGroqApiKey,
  transcribeWithGroq,
};

let _onTranscript = null;
let _onAIResponse = null;
let _onFunctionCall = null;

// Initialize TTS voice cache on module load
initTTSVoices();

// AI Speech wrapper passing pauseRecognition to prevent mic feedback
export async function aiSpeak(text) {
  return ttsAiSpeak(text, pauseRecognition);
}

// Input processing dispatcher (supports raw audio blobs, Groq Whisper, Gemini 2.0 Multimodal & Local NLU)
export async function processInput(input) {
  let text = '';
  let audioBlob = null;
  let mimeType = 'audio/webm';

  if (typeof input === 'string') {
    text = input.trim();
  } else if (input && typeof input === 'object') {
    text = (input.text || '').trim();
    audioBlob = input.audioBlob || null;
    mimeType = input.mimeType || 'audio/webm';
  }

  const micSt = typeof document !== 'undefined' ? document.getElementById('micStatus') : null;
  const groqKey = getGroqApiKey();
  const geminiKey = getGeminiApiKey();

  // 1. If audio recording exists and Groq Whisper key is configured:
  // Ultra-fast (150-250ms) Whisper Large v3 Turbo transcription
  if (audioBlob && audioBlob.size > 500 && groqKey) {
    try {
      if (micSt) micSt.textContent = '⚡ Groq Whisper: transcribing audio…';
      const groqTranscript = await transcribeWithGroq(audioBlob);
      if (groqTranscript) {
        text = groqTranscript;
        if (_onTranscript) _onTranscript(text);
        if (micSt) micSt.textContent = `⚡ Whisper: "${text}"`;
      }
    } catch (groqErr) {
      console.warn('Groq Whisper transcription failed, falling back:', groqErr);
      if (text && _onTranscript) _onTranscript(text);
    }
  }

  // 2. If audio recording exists and Gemini API key is configured (and Groq was not used for ASR):
  // Directly send the raw audio to Gemini 2.0 Flash Multimodal Input
  if (audioBlob && audioBlob.size > 500 && geminiKey && !groqKey) {
    try {
      if (micSt) micSt.textContent = '✨ Gemini 2.0: processing multimodal audio…';
      const base64Audio = await blobToBase64(audioBlob);
      const handled = await processWithGeminiAudio(base64Audio, mimeType, {
        onFunctionCall: _onFunctionCall,
        onAIResponse: _onAIResponse,
        onTranscript: (t) => {
          if (t && _onTranscript) _onTranscript(t);
        },
      });
      if (handled) return;
    } catch (geminiAudioErr) {
      console.warn('Gemini 2.0 Multimodal audio failed, falling back to text routing:', geminiAudioErr);
    }
  }

  // If text was captured via Web Speech or Groq, and user wasn't shown the transcript yet:
  if (text && !groqKey && _onTranscript && typeof input !== 'string') {
    _onTranscript(text);
  }

  if (!text) return;

  // 3. If Gemini API key is available, use Gemini for text-based tool calling
  if (geminiKey) {
    try {
      const handled = await processWithGemini(text, {
        onFunctionCall: _onFunctionCall,
        onAIResponse: _onAIResponse,
      });
      if (handled) return;
    } catch (err) {
      console.warn('Gemini API call failed, falling back to local router:', err);
    }
  }

  // 4. Built-in Local Intent Router fallback (instant, offline, zero API key)
  const intent = classifyIntent(text);
  switch (intent) {
    case 'planSkiRoute': {
      const args = extractRouteArgs(text);
      if (!args.to) {
        const sampleNodes = Object.values(nodes).slice(0, 3).map(n => n.name).join(', ');
        const resp = `I need a destination to calculate your route. Where would you like to go? For example: ${sampleNodes || 'the summit or valley base'}.`;
        if (_onAIResponse) _onAIResponse(resp);
        await aiSpeak(resp);
        return;
      }
      if (_onFunctionCall) await _onFunctionCall('planSkiRoute', args);
      break;
    }
    case 'pingSquad': {
      const args = extractSquadArgs(text);
      if (_onFunctionCall) await _onFunctionCall('pingSquad', args);
      break;
    }
    case 'checkConditions': {
      const args = extractConditionsArgs(text);
      if (_onFunctionCall) await _onFunctionCall('checkConditions', args);
      break;
    }
    case 'triggerSOS': {
      const args = extractSOSArgs(text);
      if (_onFunctionCall) await _onFunctionCall('triggerSOS', args);
      break;
    }
    case 'clearSOS': {
      if (_onFunctionCall) await _onFunctionCall('clearSOS', {});
      break;
    }
    case 'locateEntity': {
      if (_onFunctionCall) await _onFunctionCall('locateEntity', { query: text });
      break;
    }
    default: {
      const resp = "Copy that. I didn't quite catch a specific command. You can ask me to plan a route, check conditions, ping your squad, or call SOS. What do you need, rider?";
      if (_onAIResponse) _onAIResponse(resp);
      await aiSpeak(resp);
    }
  }
}

// Wire speech-rec submission to processInput
setProcessInputHandler(processInput);

export const VoiceEngine = {
  initRecognition,
  toggleListening,
  startListening,
  stopListening,
  cancelSpeech,
  processInput,
  aiSpeak,
  playRadioSquelch,
  formatRadioMessage,
  formatAndTranslateRadioMessage: formatRadioMessage,
  extractSquadArgs,
  classifyIntent,
  extractRouteArgs,
  extractSOSArgs,
  extractConditionsArgs,
  get isListening() { return getIsListening(); },
  get isSpeaking() { return isSpeaking(); },
  set geminiApiKey(key) { setGeminiApiKey(key); },
  get geminiApiKey() { return getGeminiApiKey(); },
  set groqApiKey(key) { setGroqApiKey(key); },
  get groqApiKey() { return getGroqApiKey(); },

  set onTranscript(fn) { _onTranscript = fn; setOnTranscript(fn); },
  set onAIResponse(fn) { _onAIResponse = fn; },
  set onFunctionCall(fn) { _onFunctionCall = fn; },
  set onListeningChange(fn) { setOnListeningChange(fn); },
  set onSpeakingChange(fn) { setOnSpeakingChange(fn); },
};
