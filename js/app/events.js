import { nodes, getActiveAccount, activeResortMeta, deleteCustomResort, applyResort, REAL_RESORTS } from '../data/index.js';
import { VoiceEngine, aiSpeak } from '../voice/index.js';
import { clearRouteHighlight } from '../ui/map-renderer.js';
import { renderRadioFeed, renderRadioChannelFilters } from '../ui/radio-feed.js';
import { initProfileCreationControls, renderAccountsModalList } from '../ui/profile-manager.js';
import { addTranscript } from '../ui/tactical-hud.js';
import { initResortSearchUI } from '../ui/resort-modal.js';
import { initIcons, refreshAll, initHUDTabs } from './map-ui.js';
import { handlePlanSkiRoute } from './route-handlers.js';
import { handleCreateProfile, handleSwitchAccount, handleDeleteProfile } from './profile-handlers.js';
import { renderDemoPrompts } from './demo-prompts.js';
import { btnMic, textInput, btnSendText, transcriptLog, btnApiKey, apiKeyModal, geminiKeyInput, groqKeyInput, btnCloseKeyModal, btnCancelKey, btnSaveKey, btnSwitchAccount, accountModal, accountsListContainer, btnCloseAccountModal, btnCreateSkierProfile, chkAutoLoginCreated, customColorSelector, customAvatarSelector, btnChangeResort, resortModal, resortSearchInput, resortStatusMessage, resortsListContainer, btnAiGenerateResort, btnCloseResortModal, btnTopBarDeleteCustomResort, routeHL, radioChannelFilters, radioFeed, radioMsgCount, activeChannelFilterLabel, customAccountName, customAccountRole, customAccountSector } from './dom.js';

// ── UI Wiring ───────────────────────────────────────────────────────
export function initUI() {
  // Mic button
  btnMic?.addEventListener('click', () => {
    VoiceEngine.toggleListening();
  });

  // Text input submit
  const submitText = () => {
    const text = (textInput?.value || '').trim();
    if (!text) return;
    if (VoiceEngine.isSpeaking) {
      VoiceEngine.cancelSpeech();
    }
    if (textInput) textInput.value = '';
    addTranscript(transcriptLog, 'user', text);
    VoiceEngine.processInput(text);
  };

  btnSendText?.addEventListener('click', submitText);
  textInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submitText();
  });

  // Delegate so dynamically generated profile prompts work as well.
  const demoPrompts = document.querySelector('#demoPrompts');
  demoPrompts?.addEventListener('click', (event) => {
    const chip = event.target.closest('.demo-chip');
    const prompt = chip?.dataset.prompt;
    if (!prompt || !demoPrompts.contains(chip)) return;
    if (VoiceEngine.isSpeaking) VoiceEngine.cancelSpeech();
    if (textInput) textInput.value = '';
    addTranscript(transcriptLog, 'user', prompt);
    VoiceEngine.processInput(prompt);
  });
  renderDemoPrompts();

  // API Key modal
  btnApiKey?.addEventListener('click', () => {
    apiKeyModal?.classList.remove('hidden');
    if (geminiKeyInput) geminiKeyInput.value = VoiceEngine.geminiApiKey || '';
    if (groqKeyInput) groqKeyInput.value = VoiceEngine.groqApiKey || '';
    initIcons();
  });
  btnCloseKeyModal?.addEventListener('click', () => {
    apiKeyModal?.classList.add('hidden');
  });
  btnCancelKey?.addEventListener('click', () => {
    apiKeyModal?.classList.add('hidden');
  });
  btnSaveKey?.addEventListener('click', () => {
    const gemKey = (geminiKeyInput?.value || '').trim();
    const groqKey = (groqKeyInput?.value || '').trim();
    VoiceEngine.geminiApiKey = gemKey;
    VoiceEngine.groqApiKey = groqKey;
    apiKeyModal?.classList.add('hidden');

    if (groqKey && gemKey) {
      addTranscript(transcriptLog, 'system', '⚡ Groq Whisper Turbo & ✨ Gemini 2.0 active — ultra-fast speech recognition and multimodal tool-calling enabled.');
    } else if (groqKey) {
      addTranscript(transcriptLog, 'system', '⚡ Groq Whisper Large v3 Turbo active — 150ms speech-to-text with local tactical intent router.');
    } else if (gemKey) {
      addTranscript(transcriptLog, 'system', '✨ Gemini 2.0 Flash Multimodal Audio active — direct helmet audio streaming & LLM tool-calling enabled.');
    } else {
      addTranscript(transcriptLog, 'system', '🛡️ Offline Mode active — browser Web Speech & built-in local intent router.');
    }
  });
  apiKeyModal?.addEventListener('click', (e) => {
    if (e.target === apiKeyModal) apiKeyModal.classList.add('hidden');
  });

  // Account modal
  btnSwitchAccount?.addEventListener('click', () => {
    renderAccountsModalList(accountsListContainer, {
      onSwitch: handleSwitchAccount,
      onDelete: handleDeleteProfile
    });
    accountModal?.classList.remove('hidden');
    initIcons();
  });
  btnCloseAccountModal?.addEventListener('click', () => {
    accountModal?.classList.add('hidden');
  });
  accountModal?.addEventListener('click', (e) => {
    if (e.target === accountModal) accountModal.classList.add('hidden');
  });

  // Profile creation
  btnCreateSkierProfile?.addEventListener('click', () => {
    const autoLogin = chkAutoLoginCreated ? chkAutoLoginCreated.checked : true;
    handleCreateProfile(autoLogin);
  });

  initProfileCreationControls({ customColorSelector, customAvatarSelector });

  // Resort modal & switcher
  let resortUI = null;
  if (resortModal) {
    resortUI = initResortSearchUI({
      resortModal,
      resortSearchInput,
      resortsListContainer,
      btnAiGenerateResort,
      resortStatusMessage,
      onResortChanged: async (resort) => {
        clearRouteHighlight(routeHL);
        refreshAll(handlePlanSkiRoute);
        renderRadioChannelFilters(radioChannelFilters, () => {
          renderRadioFeed(radioFeed, { radioMsgCount, activeChannelFilterLabel });
        });
        const active = getActiveAccount();
        const locName = nodes[active.location]?.name || 'Base';
        const msg = `Terrain loaded: ${resort.name} (${resort.country}), summit at ${resort.altitude} meters. Piste graph and squad telemetry synchronized. Ready for routing.`;
        addTranscript(transcriptLog, 'system', `🏔️ Active terrain switched to: ${resort.name} (${resort.country}) · Summit: ${resort.altitude}m · Operator at ${locName}`);
        await aiSpeak(msg);
      }
    });

    btnChangeResort?.addEventListener('click', () => {
      resortModal.classList.remove('hidden');
      if (resortSearchInput) resortSearchInput.value = '';
      if (resortStatusMessage) resortStatusMessage.classList.add('hidden');
      resortUI?.refreshList('');
      initIcons();
    });

    btnCloseResortModal?.addEventListener('click', () => {
      resortModal.classList.add('hidden');
    });

    resortModal.addEventListener('click', (e) => {
      if (e.target === resortModal) resortModal.classList.add('hidden');
    });

    btnTopBarDeleteCustomResort?.addEventListener('click', async () => {
      const currentId = activeResortMeta.id;
      const currentName = activeResortMeta.name || 'Generált síterep';
      if (confirm(`Félrement a képfelismerés? Biztosan törölni szeretnéd a(z) "${currentName}" terepet és visszaállítod az eredeti Mount Apex terepet?`)) {
        deleteCustomResort(currentId);
        applyResort(REAL_RESORTS.mountApex);
        clearRouteHighlight(routeHL);
        refreshAll(handlePlanSkiRoute);
        renderRadioChannelFilters(radioChannelFilters, () => {
          renderRadioFeed(radioFeed, { radioMsgCount, activeChannelFilterLabel });
        });
        addTranscript(transcriptLog, 'system', `🗑️ Törölve: ${currentName}. Alapértelmezett Mount Apex terep visszaállítva.`);
        resortUI?.refreshList('');
        await aiSpeak('Custom terrain deleted. Returning to Mount Apex.');
      }
    });
  }

  initHUDTabs();
}
