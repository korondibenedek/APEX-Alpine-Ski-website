import { nodes, getActiveAccount, locateEntity, getConditionsReport } from '../data/index.js';
import { aiSpeak } from '../voice/index.js';
import { renderNodes, renderSquad, clearRouteHighlight } from '../ui/map-renderer.js';
import { showSOSCard, clearSOS, updateTelemetry, addTranscript, flashMapNode, getIsSOSActive } from '../ui/tactical-hud.js';
import { showSquadMemberCard } from './route-handlers.js';
import { appState, telemetryCard, telemetryElements, transcriptLog, routeHL, sosCard, sosCardBody, nodesGroup, squadGroup, squadCardBody } from './dom.js';

export async function handleCheckConditions(args) {
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

export async function handleTriggerSOS(args) {
  const now = Date.now();
  if (getIsSOSActive() && now - appState.lastSOSTime < 15000) return;
  appState.lastSOSTime = now;

  const { location, injury } = args;
  clearRouteHighlight(routeHL);
  showSOSCard(sosCard, sosCardBody, location, injury, handleClearSOS);

  const locName = nodes[location]?.name || location;
  const resp = `Emergency beacon confirmed at ${locName}. Transponder locked: 45 point 09 21 North, 6 point 06 94 East. Rescue services have been alerted; estimated arrival is 8 minutes. ${injury ? `Reported condition: ${injury}.` : ''} Keep warm and remain stationary. Support is en route.`;

  addTranscript(transcriptLog, 'ai', `🚨 ${resp}`);
  await aiSpeak(resp);
}

export async function handleClearSOS() {
  clearSOS(sosCard, () => {
    renderNodes(nodesGroup);
    renderSquad(squadGroup);
  });
  const resp = "Emergency beacon cancelled. HUD restored to standard navigation. All systems normal.";
  addTranscript(transcriptLog, 'system', "✅ Emergency beacon dismissed. Normal HUD restored.");
  await aiSpeak(resp);
}

export async function handleLocateEntity(args) {
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
