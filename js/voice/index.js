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
} from './gemini-client.js';

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
};

let _onAIResponse = null;
let _onFunctionCall = null;

// Initialize TTS voice cache on module load
initTTSVoices();

// AI Speech wrapper passing pauseRecognition to prevent mic feedback
export async function aiSpeak(text) {
  return ttsAiSpeak(text, pauseRecognition);
}

// Input processing dispatcher (supports both Gemini API and local NLU)
export async function processInput(text) {
  if (!text || !text.trim()) return;

  const geminiKey = getGeminiApiKey();
  const intent = classifyIntent(text);

  if (geminiKey && intent !== 'unknown') {
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

  // Local intent routing
  switch (intent) {
    case 'planSkiRoute': {
      const args = extractRouteArgs(text);
      if (!args.to) {
        const resp = "I couldn't determine your destination. Could you specify where you'd like to go? For example: Panorama Hut, Eagle Mid-Station, or Main Valley Base.";
        if (_onAIResponse) _onAIResponse(resp);
        await aiSpeak(resp);
        return;
      }
      if (_onFunctionCall) _onFunctionCall('planSkiRoute', args);
      break;
    }
    case 'pingSquad': {
      const args = extractSquadArgs(text);
      if (_onFunctionCall) _onFunctionCall('pingSquad', args);
      break;
    }
    case 'checkConditions': {
      const args = extractConditionsArgs(text);
      if (_onFunctionCall) _onFunctionCall('checkConditions', args);
      break;
    }
    case 'triggerSOS': {
      const args = extractSOSArgs(text);
      if (_onFunctionCall) _onFunctionCall('triggerSOS', args);
      break;
    }
    case 'clearSOS': {
      if (_onFunctionCall) _onFunctionCall('clearSOS', {});
      break;
    }
    case 'locateEntity': {
      if (_onFunctionCall) _onFunctionCall('locateEntity', { query: text });
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

  set onTranscript(fn) { setOnTranscript(fn); },
  set onAIResponse(fn) { _onAIResponse = fn; },
  set onFunctionCall(fn) { _onFunctionCall = fn; },
  set onListeningChange(fn) { setOnListeningChange(fn); },
  set onSpeakingChange(fn) { setOnSpeakingChange(fn); },
};
