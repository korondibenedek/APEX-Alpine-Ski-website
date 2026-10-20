/* ═══════════════════════════════════════════════════════════════════
   main.js — APEX Application Entry Point, State Wiring & Event Dispatcher
   ═══════════════════════════════════════════════════════════════════ */

import {
  MountainData,
  nodes,
  simState,
  getActiveAccount,
  getAccounts,
  createProfile,
  deleteProfile,
  switchAccount,
  locateEntity,
  getConditionsReport,
  dijkstra,
  activeResortMeta,
  initResort,
  REAL_RESORTS,
  deleteCustomResort,
  getCustomResorts,
  applyResort
} from './data/index.js';
import { VoiceEngine, aiSpeak, formatRadioMessage } from './voice/index.js';
import { renderEdges, renderNodes, renderSquad, highlightRoute, clearRouteHighlight, updateMapVisuals } from './ui/map-renderer.js';
import { showNavCard, showSquadCard, showSOSCard, clearSOS, updateTelemetry, addTranscript, flashMapNode, getIsSOSActive } from './ui/tactical-hud.js';
import { renderRadioFeed, addRadioMessage, renderRadioChannelFilters, resetRadioUnreadCount } from './ui/radio-feed.js';
import { updateTopBarAccountUI, initProfileCreationControls, renderAccountsModalList, getSelectedColor, getSelectedAvatar } from './ui/profile-manager.js';
import { initResortSearchUI } from './ui/resort-modal.js';

// Expose on window for browser console debugging / backwards compatibility
if (typeof window !== 'undefined') {
  window.MountainData = MountainData;
  window.VoiceEngine = VoiceEngine;
}

// ── DOM References ──────────────────────────────────────────────────
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const edgesGroup   = $('#edgesGroup');
const nodesGroup   = $('#nodesGroup');
const squadGroup   = $('#squadGroup');
const routeHL      = $('#routeHighlight');

const navCard      = $('#navCard');
const navCardBody  = $('#navCardBody');
const squadCard    = $('#squadCard');
const squadCardBody = $('#squadCardBody');
const telemetryCard = $('#telemetryCard');
const sosCard      = $('#sosCard');
const sosCardBody  = $('#sosCardBody');
const transcriptLog = $('#transcriptLog');
const textInput    = $('#textInput');
const btnSendText  = $('#btnSendText');
const btnMic       = $('#btnMic');
const micStatus    = $('#micStatus');
const clockDisplay = $('#clockDisplay');
const blizzardOvl  = $('#blizzardOverlay');

// Telemetry fields
const telWind = $('#telWind');
const telTemp = $('#telTemp');
const telVis  = $('#telVis');
const telSnow = $('#telSnow');
const telLift = $('#telLift');
const telIce  = $('#telIce');

const telemetryElements = { telWind, telTemp, telVis, telSnow, telLift, telIce };

// API Key modal
const apiKeyModal      = $('#apiKeyModal');
const btnApiKey        = $('#btnApiKey');
const btnCloseKeyModal = $('#btnCloseKeyModal');
const btnCancelKey     = $('#btnCancelKey');
const btnSaveKey       = $('#btnSaveKey');
const geminiKeyInput   = $('#geminiKeyInput');
const groqKeyInput     = $('#groqKeyInput');

// Resort modal & switcher
const btnChangeResort              = $('#btnChangeResort');
const btnTopBarDeleteCustomResort  = $('#btnTopBarDeleteCustomResort');
const topBarResortName             = $('#topBarResortName');
const topBarResortAlt              = $('#topBarResortAlt');
const resortModal                  = $('#resortModal');
const btnCloseResortModal   = $('#btnCloseResortModal');
const resortSearchInput     = $('#resortSearchInput');
const btnAiGenerateResort   = $('#btnAiGenerateResort');
const resortStatusMessage   = $('#resortStatusMessage');
const resortsListContainer  = $('#resortsListContainer');

// Account modal & switcher
const btnSwitchAccount      = $('#btnSwitchAccount');
const accountModal          = $('#accountModal');
const btnCloseAccountModal  = $('#btnCloseAccountModal');
const accountsListContainer = $('#accountsListContainer');
const customAccountName     = $('#customAccountName');
const customAccountRole     = $('#customAccountRole');
const customAccountSector   = $('#customAccountSector');
const customColorSelector   = $('#customColorSelector');
const customAvatarSelector  = $('#customAvatarSelector');
const btnCreateSkierProfile = $('#btnCreateSkierProfile');
const chkAutoLoginCreated   = $('#chkAutoLoginCreated');
const topBarAccountName     = $('#topBarAccountName');
const topBarAccountLoc      = $('#topBarAccountLoc');

// HUD Navigation Tabs & Radio Comms
const tabBtnTactical           = $('#tabBtnTactical');
const tabBtnRadio              = $('#tabBtnRadio');
const radioUnreadBadge         = $('#radioUnreadBadge');
const tabViewTactical          = $('#tabViewTactical');
const tabViewRadio             = $('#tabViewRadio');
const radioFeed                = $('#radioFeed');
const radioMsgCount            = $('#radioMsgCount');
const activeChannelFilterLabel = $('#activeChannelFilterLabel');
const radioChannelFilters      = $('#radioChannelFilters');

let _activeTab = 'tactical';
let _lastSOSTime = 0;

// ── Clock ───────────────────────────────────────────────────────────
function updateClock() {
  if (clockDisplay) {
    const now = new Date();
    clockDisplay.textContent = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }
}
setInterval(updateClock, 1000);
updateClock();

// ── Initialize Lucide Icons ─────────────────────────────────────────
function initIcons() {
  if (typeof window !== 'undefined' && window.lucide) {
    window.lucide.createIcons();
  }
}

// ── Top Bar Resort & Sector Dropdown UI Helpers ─────────────────────
function updateTopBarResortUI() {
  if (topBarResortName) topBarResortName.textContent = activeResortMeta.name || 'Mount Apex';
  if (topBarResortAlt) topBarResortAlt.textContent = activeResortMeta.altitude ? `${activeResortMeta.altitude.toLocaleString()}m` : '3,200m';

  const isCustom = activeResortMeta.id.startsWith('img_') || activeResortMeta.id.startsWith('custom_') || activeResortMeta.id.startsWith('proc_') || getCustomResorts().some(r => r.id === activeResortMeta.id);
  if (btnTopBarDeleteCustomResort) {
    if (isCustom) {
      btnTopBarDeleteCustomResort.classList.remove('hidden');
      btnTopBarDeleteCustomResort.classList.add('flex');
    } else {
      btnTopBarDeleteCustomResort.classList.add('hidden');
      btnTopBarDeleteCustomResort.classList.remove('flex');
    }
  }
}

function updateSectorDropdown() {
  if (!customAccountSector) return;
  const currentVal = customAccountSector.value;
  customAccountSector.innerHTML = Object.entries(nodes).map(([id, n]) => {
    return `<option value="${id}">${n.name} (${n.altitude}m)</option>`;
  }).join('');
  if (nodes[currentVal]) {
    customAccountSector.value = currentVal;
  }
}

// ── Refresh Full UI State ───────────────────────────────────────────
function refreshAll() {
  updateTopBarResortUI();
  updateSectorDropdown();
  renderEdges(edgesGroup);
  renderNodes(nodesGroup, (node) => {
    // Clicking node sets destination for quick routing
    const activeAcc = getActiveAccount();
    handlePlanSkiRoute({
      from: activeAcc?.location || MountainData.squad.you?.currentNode || Object.keys(nodes)[0],
      to: node.id
    });
  });
  renderSquad(squadGroup);
  updateTopBarAccountUI({ topBarAccountName, topBarAccountLoc });
  updateTelemetry(telemetryElements);
  updateMapVisuals(blizzardOvl);
  initIcons();
}

// ── Simulator Controls ──────────────────────────────────────────────
function initSimControls() {
  $$('.sim-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const sim = btn.dataset.sim;
      simState[sim] = !simState[sim];
      btn.classList.toggle('active', simState[sim]);
      updateTelemetry(telemetryElements);
      updateMapVisuals(blizzardOvl);

      const stateText = simState[sim] ? 'ACTIVATED' : 'DEACTIVATED';
      addTranscript(transcriptLog, 'system', `⚡ Simulator: ${btn.querySelector('span').textContent} — ${stateText}`);
    });
  });
}

// ── Tab Switching ───────────────────────────────────────────────────
function switchHUDTab(tabName) {
  _activeTab = tabName;
  if (tabName === 'tactical') {
    tabBtnTactical?.classList.add('active');
    tabBtnRadio?.classList.remove('active');
    tabViewTactical?.classList.remove('hidden');
    tabViewRadio?.classList.add('hidden');
  } else {
    tabBtnRadio?.classList.add('active');
    tabBtnTactical?.classList.remove('active');
    tabViewRadio?.classList.remove('hidden');
    tabViewTactical?.classList.add('hidden');

    resetRadioUnreadCount(radioUnreadBadge);
    renderRadioFeed(radioFeed, { radioMsgCount, activeChannelFilterLabel });
  }
}

function initHUDTabs() {
  tabBtnTactical?.addEventListener('click', () => switchHUDTab('tactical'));
  tabBtnRadio?.addEventListener('click', () => switchHUDTab('radio'));
  renderRadioChannelFilters(radioChannelFilters, () => {
    renderRadioFeed(radioFeed, { radioMsgCount, activeChannelFilterLabel });
  });
}

// ── Squad Member Card Helper ────────────────────────────────────────
function showSquadMemberCard(entity) {
  if (!squadCardBody) return;
  const time = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  squadCardBody.innerHTML = `
    <div class="space-y-2">
      <div class="flex items-center justify-between text-xs">
        <div class="flex items-center gap-2">
          <span class="text-base p-1 rounded bg-hud-bg/80 border border-hud-border flex items-center justify-center">${entity.avatar || '🎿'}</span>
          <div>
            <div class="flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full inline-block" style="background:${entity.color || '#00e5ff'}; box-shadow:0 0 8px ${entity.color || '#00e5ff'}"></span>
              <span class="text-white font-bold font-mono tracking-wide">${entity.name.toUpperCase()}</span>
            </div>
            <span class="text-hud-text/50 text-[10px] font-mono">(${entity.role || 'Rider'})</span>
          </div>
        </div>
        <span class="text-hud-text/30 font-mono text-[9px]">${time}</span>
      </div>
      <div class="bg-hud-bg/60 border border-hud-border/40 rounded-lg p-2.5 text-xs space-y-1.5">
        <div class="flex justify-between items-center">
          <span class="text-hud-text/60">Location / Sector:</span>
          <span class="text-hud-cyan font-semibold text-right">${entity.nodeName}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-hud-text/60">Elevation:</span>
          <span class="text-white font-mono font-medium">${entity.altitude}m</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-hud-text/60">Current Status:</span>
          <span class="text-hud-green font-medium">${entity.status}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-hud-text/60">Squad Voice Link:</span>
          <span class="text-hud-cyan font-mono text-[10px]">VOICE NET · ONLINE</span>
        </div>
      </div>
    </div>
  `;
  squadCard?.classList.remove('hidden');
}

// ── Voice Function Handlers ─────────────────────────────────────────
async function handlePlanSkiRoute(args) {
  const { from, to, avoidBlack, avoidIce, targetPerson } = args;

  if (!to) {
    const resp = "Roger, but I need a destination. Where should I route you?";
    addTranscript(transcriptLog, 'ai', resp);
    await aiSpeak(resp);
    return;
  }

  const result = dijkstra(from, to, { avoidBlack, avoidIce });

  if (!result) {
    const fromName = nodes[from]?.name || from;
    const toName = nodes[to]?.name || to;
    const resp = `No route found from ${fromName} to ${toName} with your constraints. Try relaxing the avoid-black or avoid-ice filter.`;
    addTranscript(transcriptLog, 'ai', resp);
    await aiSpeak(resp);
    return;
  }

  highlightRoute(routeHL, result.pathEdges);
  showNavCard(navCard, navCardBody, result, from, to, targetPerson);

  const fromName = nodes[from].name;
  const toName = nodes[to].name;
  const viaNames = result.path.slice(1, -1).map(nid => nodes[nid].name);
  const viaText = viaNames.length > 0 ? ` via ${viaNames.join(', ')}` : '';
  const hazardText = result.hazards.length > 0
    ? ` Heads up: ${result.hazards.map(h => h.text).join(', ')}.`
    : '';

  let resp = '';
  if (targetPerson) {
    resp = `Copy that! Plotting intercept route to ${targetPerson} at ${toName}${viaText}. Max difficulty: ${result.maxDifficulty}. ETA approximately ${result.eta} minutes.${hazardText} Stay sharp, rider!`;
  } else {
    resp = `Copy that! Route locked from ${fromName} to ${toName}${viaText}. Max difficulty: ${result.maxDifficulty}. ETA approximately ${result.eta} minutes.${hazardText} Stay sharp, rider!`;
  }

  addTranscript(transcriptLog, 'ai', resp);
  await aiSpeak(resp);
}

async function handlePingSquad(args) {
  const recipients = (args.recipients && args.recipients.length > 0) ? args.recipients : ['All Squad'];
  const rawMsg = args.text || args.message || args.rawMessage || '';
  const cleanText = formatRadioMessage(rawMsg, recipients, args.eta);

  const activeUser = getActiveAccount() || MountainData.squad.you;
  const isBroadcast = recipients.some(r => /all|everyone|everybody|squad/i.test(r));

  // 1. Post outgoing message to Radio Feed
  addRadioMessage({
    direction: 'outgoing',
    sender: activeUser.name,
    role: activeUser.role,
    avatar: activeUser.avatar || '⛷️',
    channel: 'Squad Voice Net',
    recipients,
    text: cleanText,
    autoSpeak: false
  }, {
    radioFeed,
    radioUnreadBadge,
    radioMsgCount,
    activeChannelFilterLabel,
    isRadioTabActive: _activeTab === 'radio'
  });

  // 2. Update Tactical Visor HUD squad card
  showSquadCard(squadCard, squadCardBody, recipients, cleanText, args.eta);

  // 3. APEX AI voice acknowledgement (speaks zero "Over"s)
  const spokenBody = cleanText.replace(/\s*\bOver\.?\s*$/i, '').trim();
  let resp = '';
  const etaText = args.eta ? `, ETA ${args.eta} minutes` : '';
  if (isBroadcast) {
    resp = `Roger, broadcasting to all squad units: "${spokenBody}"${etaText}.`;
  } else {
    resp = `Roger, message sent to ${recipients.join(' and ')}: "${spokenBody}"${etaText}.`;
  }

  addTranscript(transcriptLog, 'ai', resp);
  await aiSpeak(resp);

  // 4. Automated incoming squad response after 2.5s
  setTimeout(async () => {
    const primaryRecip = isBroadcast ? 'Renato' : (recipients[0] || 'Renato');
    const pLower = primaryRecip.toLowerCase();

    let targetAcc = null;
    if (!isBroadcast) {
      const match = MountainData.matchBestPerson(primaryRecip);
      if (match && match.account.id !== activeUser.id) {
        targetAcc = match.account;
      } else {
        targetAcc = getAccounts().find(a => a.name.toLowerCase() === pLower && a.id !== activeUser.id);
      }
    }
    if (!targetAcc) {
      const otherTeammates = getAccounts().filter(a => a.id !== activeUser.id);
      targetAcc = otherTeammates.find(a => a.id === 'renato') || otherTeammates[0];
    }

    let reply = null;
    if (targetAcc) {
      const nodeName = nodes[targetAcc.location]?.name || 'the mountain';
      const targetName = targetAcc.name;
      const targetAvatar = targetAcc.avatar || '🎿';
      const targetRole = targetAcc.role || 'Rider';

      if (targetAcc.id === 'renato') {
        reply = {
          sender: targetName,
          role: targetRole,
          avatar: targetAvatar,
          text: isBroadcast
            ? "Apex Base, this is Renato at Panorama Hut. Copying squad broadcast loud and clear! Fireplace is roaring, hot tea ready. Over."
            : `Apex Base, this is Renato at Panorama Hut. Copy that, ${activeUser.name}! Fireplace is lit and hot tea ready. Take your time on the snow. Over.`
        };
      } else if (targetAcc.id === 'kajti') {
        reply = {
          sender: targetName,
          role: targetRole,
          avatar: targetAvatar,
          text: isBroadcast
            ? "Kajti on Red Run 4 copying squad broadcast. Snow surface is firm and fast. Proceeding down to sector 3. Over."
            : `Kajti on Red Run 4 copying your transmission, ${activeUser.name}. Surface is firm and fast. I'll link up with you at the junction. Over.`
        };
      } else if (targetAcc.id === 'patrol') {
        reply = {
          sender: 'Ski Patrol Echo-1',
          role: targetRole,
          avatar: targetAvatar,
          text: `Ski Patrol Echo-1 acknowledging transmission from ${activeUser.name}. Sector Bravo is clear. Wind picking up near Glacier Peak. Maintain visual contact. Over.`
        };
      } else {
        reply = {
          sender: targetName,
          role: targetRole,
          avatar: targetAvatar,
          text: isBroadcast
            ? `${targetName} at ${nodeName} copying squad broadcast loud and clear. Conditions are solid here. Radio link 100%. Over.`
            : `${targetName} at ${nodeName} copying your radio message, ${activeUser.name}. Transceiver signal is 100%. See you on the slopes! Over.`
        };
      }
    } else {
      reply = {
        sender: primaryRecip,
        role: 'Squad Member',
        avatar: '🎿',
        text: `Copy that, ${activeUser.name}. This is ${primaryRecip} copying loud and clear. See you on the snow. Over.`
      };
    }

    addRadioMessage({
      direction: 'incoming',
      sender: reply.sender,
      role: reply.role,
      avatar: reply.avatar,
      channel: 'Squad Voice Net',
      recipients: [activeUser.name],
      text: reply.text,
      autoSpeak: true
    }, {
      radioFeed,
      radioUnreadBadge,
      radioMsgCount,
      activeChannelFilterLabel,
      isRadioTabActive: _activeTab === 'radio'
    });
  }, 2500);
}

async function handleCheckConditions(args) {
  updateTelemetry(telemetryElements);

  if (telemetryCard) {
    telemetryCard.classList.remove('border-hud-cyan');
    void telemetryCard.offsetWidth;
    telemetryCard.classList.add('border-hud-cyan');
    setTimeout(() => {
      telemetryCard.classList.remove('border-hud-cyan');
    }, 3000);
  }

  const report = getConditionsReport(args ? args.sector : null);
  addTranscript(transcriptLog, 'ai', report.replace(/\n/g, '<br>'));
  const spoken = report.replace(/[🌨️🚫🧊✅⚠️📍]/g, '').replace(/\n/g, '. ');
  await aiSpeak(spoken);
}

async function handleTriggerSOS(args) {
  const now = Date.now();
  if (getIsSOSActive() && now - _lastSOSTime < 15000) return;
  _lastSOSTime = now;

  const { location, injury } = args;
  clearRouteHighlight(routeHL);
  showSOSCard(sosCard, sosCardBody, location, injury, handleClearSOS);

  const locName = nodes[location]?.name || location;
  const resp = `Emergency beacon confirmed at ${locName}. Transponder locked: 45 point 09 21 North, 6 point 06 94 East. Ski Patrol has been dispatched, rescue arrival estimated in 8 minutes. ${injury ? `Reported condition: ${injury}.` : ''} Keep warm and remain stationary. Support is en route.`;

  addTranscript(transcriptLog, 'ai', `🚨 ${resp}`);
  await aiSpeak(resp);
}

async function handleClearSOS() {
  clearSOS(sosCard, () => {
    renderNodes(nodesGroup);
    renderSquad(squadGroup);
  });
  const resp = "Emergency beacon cancelled. HUD restored to standard navigation. All systems normal.";
  addTranscript(transcriptLog, 'system', "✅ Emergency beacon dismissed. Normal HUD restored.");
  await aiSpeak(resp);
}

async function handleLocateEntity(args) {
  const entity = locateEntity(args.query || '');

  if (entity.type === 'person') {
    const activeAcc = getActiveAccount();
    const el = document.getElementById(`squad-${entity.id}`)
            || (entity.id === activeAcc.id ? document.getElementById('squad-you') : null)
            || document.querySelector(`[data-squad-id="${entity.id}"]`);

    if (el) {
      el.classList.add('highlighted');
      el.style.transform = 'scale(2.4)';
      setTimeout(() => {
        el.classList.remove('highlighted');
        el.style.transform = 'scale(1)';
      }, 3000);
    }
    if (entity.nodeId) {
      flashMapNode(entity.nodeId, entity.color || '#ff6f00');
    }
    showSquadMemberCard(entity);
  } else if (entity.type === 'squad') {
    document.querySelectorAll('.squad-dot').forEach(el => {
      el.style.transform = 'scale(1.5)';
      setTimeout(() => { el.style.transform = 'scale(1)'; }, 2500);
    });
    const activeAcc = getActiveAccount();
    flashMapNode(activeAcc.location, '#39ff14');
  } else if (entity.nodeId) {
    flashMapNode(entity.nodeId, '#00e5ff');
  }

  addTranscript(transcriptLog, 'ai', `📍 ${entity.description}`);
  await aiSpeak(entity.description);
}

// ── Profile Creation & Switching ────────────────────────────────────
async function handleCreateProfile(autoLogin = false) {
  const name = (customAccountName?.value || '').trim();
  const role = (customAccountRole?.value || '').trim() || 'Alpine Skier';
  const sector = customAccountSector ? customAccountSector.value : 'mainValleyBase';

  if (!name) {
    alert('Please enter a call sign or name.');
    return;
  }

  const created = createProfile({
    name,
    role,
    location: sector,
    avatar: getSelectedAvatar(),
    color: getSelectedColor(),
    autoLogin
  });

  if (!created) return;

  if (customAccountName) customAccountName.value = '';
  if (customAccountRole) customAccountRole.value = '';

  renderAccountsModalList(accountsListContainer, {
    onSwitch: handleSwitchAccount,
    onDelete: handleDeleteProfile
  });
  renderRadioChannelFilters(radioChannelFilters, () => {
    renderRadioFeed(radioFeed, { radioMsgCount, activeChannelFilterLabel });
  });
  renderSquad(squadGroup);
  updateTopBarAccountUI({ topBarAccountName, topBarAccountLoc });

  const locName = nodes[created.location]?.name || 'Mount Apex';

  if (autoLogin) {
    accountModal?.classList.add('hidden');
    clearRouteHighlight(routeHL);
    addTranscript(transcriptLog, 'system', `👤 Operator switched: ${created.name} (${created.role}) @ ${locName}`);
    await aiSpeak(`Operator switched. Welcome ${created.name}. Voice channel synchronized at ${locName}.`);
  } else {
    flashMapNode(created.location, created.color);
    addTranscript(transcriptLog, 'system', `➕ New squad operator linked: ${created.name} (${created.role}) stationed at ${locName}`);
    await aiSpeak(`${created.name} added to squad voice network at ${locName}. Voice link online.`);
  }
}

async function handleSwitchAccount(accId) {
  const newActive = switchAccount(accId);
  accountModal?.classList.add('hidden');
  updateTopBarAccountUI({ topBarAccountName, topBarAccountLoc });
  renderSquad(squadGroup);
  clearRouteHighlight(routeHL);
  renderRadioChannelFilters(radioChannelFilters, () => {
    renderRadioFeed(radioFeed, { radioMsgCount, activeChannelFilterLabel });
  });

  const locName = nodes[newActive.location]?.name || 'Mount Apex';
  addTranscript(transcriptLog, 'system', `👤 Operator switched: ${newActive.name} (${newActive.role}) @ ${locName}`);
  await aiSpeak(`Operator switched. Welcome ${newActive.name}. Voice channel synchronized at ${locName}.`);
}

function handleDeleteProfile(accId) {
  const target = getAccounts().find(a => a.id === accId);
  const name = target ? target.name : 'skier';
  if (confirm(`Remove ${name} from squad network?`)) {
    deleteProfile(accId);
    renderAccountsModalList(accountsListContainer, {
      onSwitch: handleSwitchAccount,
      onDelete: handleDeleteProfile
    });
    renderRadioChannelFilters(radioChannelFilters, () => {
      renderRadioFeed(radioFeed, { radioMsgCount, activeChannelFilterLabel });
    });
    renderSquad(squadGroup);
    updateTopBarAccountUI({ topBarAccountName, topBarAccountLoc });
    addTranscript(transcriptLog, 'system', `🗑️ Skier profile removed: ${name}`);
  }
}

// ── Voice Engine Wiring ─────────────────────────────────────────────
function initVoiceEngine() {
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

// ── UI Wiring ───────────────────────────────────────────────────────
function initUI() {
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

  // Demo prompt chips
  $$('.demo-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const prompt = chip.dataset.prompt;
      if (VoiceEngine.isSpeaking) {
        VoiceEngine.cancelSpeech();
      }
      if (textInput) textInput.value = '';
      addTranscript(transcriptLog, 'user', prompt);
      VoiceEngine.processInput(prompt);
    });
  });

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
        refreshAll();
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
        refreshAll();
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

// ── Application Boot ────────────────────────────────────────────────
export function boot() {
  initResort();
  refreshAll();
  initSimControls();
  initVoiceEngine();
  initUI();
  renderRadioFeed(radioFeed, { radioMsgCount, activeChannelFilterLabel });

  setTimeout(() => {
    const active = getActiveAccount();
    const locName = nodes[active.location]?.name || 'Glacier Peak';
    const resortName = activeResortMeta.name || 'Mount Apex';
    const alt = activeResortMeta.altitude || 3200;
    addTranscript(transcriptLog, 'ai', `🏔️ APEX online. ${resortName}, ${alt} meters. Operator: ${active.name} at ${locName}. Squad voice network online. What's the play, rider?`);
  }, 500);
}

// Auto-boot on load
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
}

