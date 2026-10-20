import { VoiceEngine } from '../voice/index.js';
import { addTranscript } from '../ui/tactical-hud.js';
import { handlePlanSkiRoute } from './route-handlers.js';
import { handlePingSquad } from './radio-handlers.js';
import { handleCheckConditions, handleTriggerSOS, handleClearSOS, handleLocateEntity } from './safety-handlers.js';
import { btnMic, micStatus, transcriptLog } from './dom.js';

// ── Voice Engine Wiring ─────────────────────────────────────────────
export function initVoiceEngine() {
  VoiceEngine.initRecognition();

  VoiceEngine.onTranscript = (text) => {
    addTranscript(transcriptLog, 'user', text);
  };

  VoiceEngine.onAIResponse = (text) => {
    addTranscript(transcriptLog, 'ai', text);
  };

  VoiceEngine.onFunctionCall = async (fnName, args) => {
    addTranscript(transcriptLog, 'system', `⚙️ ${fnName}(${JSON.stringify(args)})`);

    switch (fnName) {
      case 'planSkiRoute':
        await handlePlanSkiRoute(args);
        break;
      case 'pingSquad':
        await handlePingSquad(args);
        break;
      case 'checkConditions':
        await handleCheckConditions(args);
        break;
      case 'triggerSOS':
        await handleTriggerSOS(args);
        break;
      case 'clearSOS':
        await handleClearSOS();
        break;
      case 'locateEntity':
        await handleLocateEntity(args);
        break;
    }
  };

  VoiceEngine.onListeningChange = (listening) => {
    if (!btnMic) return;
    btnMic.classList.toggle('listening', listening);
    if (listening) {
      btnMic.classList.remove('speaking');
      btnMic.setAttribute('title', 'Recording… Tap mic to send message');
      if (micStatus) micStatus.textContent = '🔴 RECORDING… Speak now (Tap mic to send)';
    } else if (!VoiceEngine.isSpeaking) {
      btnMic.setAttribute('title', 'Push / Tap to Talk');
      if (micStatus) micStatus.textContent = 'TAP TO TALK · or use prompts above';
    }
  };

  VoiceEngine.onSpeakingChange = (speaking) => {
    if (!btnMic) return;
    btnMic.classList.toggle('speaking', speaking);
    if (speaking) {
      btnMic.classList.remove('listening');
      btnMic.setAttribute('title', 'APEX is speaking · Tap mic to silence');
      if (micStatus) micStatus.textContent = '🔊 APEX SPEAKING… (Tap mic to silence)';
    } else if (!VoiceEngine.isListening) {
      btnMic.setAttribute('title', 'Push / Tap to Talk');
      if (micStatus) micStatus.textContent = 'TAP TO TALK · or use prompts above';
    }
  };
}
