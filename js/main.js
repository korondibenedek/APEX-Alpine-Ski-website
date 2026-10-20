/* APEX application entry point. */
import { MountainData, getActiveAccount, initResort, activeResortMeta } from './data/index.js';
import { VoiceEngine } from './voice/index.js';
import { renderRadioFeed } from './ui/radio-feed.js';
import { refreshAll, initSimControls } from './app/map-ui.js';
import { handlePlanSkiRoute } from './app/route-handlers.js';
import { initVoiceEngine } from './app/voice-wiring.js';
import { initUI } from './app/events.js';
import { radioFeed, radioMsgCount, activeChannelFilterLabel, transcriptLog } from './app/dom.js';
import { addTranscript } from './ui/tactical-hud.js';

if (typeof window !== 'undefined') {
  window.MountainData = MountainData;
  window.VoiceEngine = VoiceEngine;
}

export function boot() {
  initResort();
  refreshAll(handlePlanSkiRoute);
  initSimControls();
  initVoiceEngine();
  initUI();
  renderRadioFeed(radioFeed, { radioMsgCount, activeChannelFilterLabel });

  setTimeout(() => {
    const active = getActiveAccount();
    const locName = MountainData.nodes[active.location]?.name || 'Glacier Peak';
    const resortName = activeResortMeta.name || 'Mount Apex';
    const altitude = activeResortMeta.altitude || 3200;
    addTranscript(transcriptLog, 'ai', `🏔️ APEX online. ${resortName}, ${altitude} meters. Operator: ${active.name} at ${locName}. Squad voice network online. What's the play, rider?`);
  }, 500);
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
}
