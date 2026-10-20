import { activeResortMeta, getCustomResorts, getActiveAccount, MountainData, nodes, simState } from '../data/index.js';
import { renderEdges, renderNodes, renderSquad, updateMapVisuals } from '../ui/map-renderer.js';
import { updateTopBarAccountUI } from '../ui/profile-manager.js';
import { updateTelemetry, addTranscript } from '../ui/tactical-hud.js';
import { renderRadioFeed, renderRadioChannelFilters, resetRadioUnreadCount } from '../ui/radio-feed.js';
import { appState, edgesGroup, nodesGroup, squadGroup, topBarResortName, topBarResortAlt, btnTopBarDeleteCustomResort, customAccountSector, telemetryElements, blizzardOvl, topBarAccountName, topBarAccountLoc, tabBtnTactical, tabBtnRadio, tabViewTactical, tabViewRadio, radioUnreadBadge, radioChannelFilters, radioFeed, radioMsgCount, activeChannelFilterLabel, clockDisplay, transcriptLog } from './dom.js';

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
export function initIcons() {
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
export function refreshAll(planRoute) {
  updateTopBarResortUI();
  updateSectorDropdown();
  renderEdges(edgesGroup);
  renderNodes(nodesGroup, (node) => {
    // Clicking node sets destination for quick routing
    const activeAcc = getActiveAccount();
    planRoute({
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
export function initSimControls() {
  document.querySelectorAll('.sim-btn').forEach(btn => {
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
export function switchHUDTab(tabName) {
  appState.activeTab = tabName;
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

export function initHUDTabs() {
  tabBtnTactical?.addEventListener('click', () => switchHUDTab('tactical'));
  tabBtnRadio?.addEventListener('click', () => switchHUDTab('radio'));
  renderRadioChannelFilters(radioChannelFilters, () => {
    renderRadioFeed(radioFeed, { radioMsgCount, activeChannelFilterLabel });
  });
}
