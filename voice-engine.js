/* ═══════════════════════════════════════════════════════════════════
   voice-engine.js — Modular Architecture Bridge
   ═══════════════════════════════════════════════════════════════════
   This monolithic file has been refactored into clean, focused modules:
     - js/voice/audio-fx.js        -> Procedural radio squelch & AudioContext
     - js/voice/speech-rec.js      -> Web Speech recognition & 3-state mic
     - js/voice/speech-tts.js      -> Speech synthesis & AI vocal response
     - js/voice/intent-parser.js   -> Intent router & argument extractors
     - js/voice/radio-formatter.js -> Tactical radio phrasing & Hungarian grammar
     - js/voice/gemini-client.js   -> Gemini 2.0 Flash tool-calling
     - js/voice/index.js           -> Unified VoiceEngine interface
   ═══════════════════════════════════════════════════════════════════ */

export * from './js/voice/index.js';
export { VoiceEngine as default } from './js/voice/index.js';
