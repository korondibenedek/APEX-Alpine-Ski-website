/* ═══════════════════════════════════════════════════════════════════
   tactical-hud.js — Tactical HUD Cards, Telemetry & SOS Emergency Beacon
   ═══════════════════════════════════════════════════════════════════ */

import { nodes, simState } from '../data/resort-graph.js';
import { matchBestPerson } from '../data/fuzzy-matcher.js';

let _isSOSActive = false;

export function getIsSOSActive() {
  return _isSOSActive;
}

export function updateTelemetry(telemetryElements) {
  const s = simState;
  const { telWind, telTemp, telVis, telLift, telIce, telSnow } = telemetryElements;

  if (s.blizzard) {
    if (telWind) { telWind.textContent = '85 km/h N'; telWind.className = 'text-red-400'; }
    if (telTemp) { telTemp.textContent = '-18 °C'; }
    if (telVis) { telVis.textContent = 'Near Zero'; telVis.className = 'text-red-400'; }
  } else {
    if (telWind) { telWind.textContent = '12 km/h NW'; telWind.className = 'text-white'; }
    if (telTemp) { telTemp.textContent = '-8 °C'; }
    if (telVis) { telVis.textContent = 'Good'; telVis.className = 'text-green-400'; }
  }

  if (telLift) {
    if (s.liftClosed) {
      telLift.innerHTML = '<span class="text-red-400">● Closed (Wind)</span>';
    } else {
      telLift.innerHTML = '<span class="text-green-400">● Open</span>';
    }
  }

  if (telIce && telSnow) {
    if (s.iceBlack) {
      telIce.innerHTML = '<span class="text-amber-400">● ICE WARNING</span>';
      telSnow.textContent = 'Icy Hardpack';
    } else {
      telIce.innerHTML = '<span class="text-green-400">● Clear</span>';
      telSnow.textContent = 'Packed Powder';
    }
  }
}

export function showNavCard(navCard, navCardBody, result, from, to, targetPerson) {
  if (!navCard || !navCardBody) return;

  const fromNode = nodes[from];
  const toNode = nodes[to];
  const fromName = fromNode ? fromNode.name : (from || 'Start Point');
  const toName = toNode ? toNode.name : (to || 'Destination');
  const destinationTitle = targetPerson ? `${toName} (${targetPerson})` : toName;

  const stepsHtml = (result.path || []).map((nid, i) => {
    const n = nodes[nid];
    const nName = n ? n.name : nid;
    const nAlt = n && n.altitude ? `(${n.altitude}m)` : '';
    const isFirst = i === 0;
    const isLast = i === result.path.length - 1;
    const marker = isFirst ? '🏁' : isLast ? '🎯' : '→';
    return `<span class="text-xs font-mono">${marker} ${nName} <span class="text-hud-text/40">${nAlt}</span></span>`;
  }).join('<br>');

  const hazardsHtml = (result.hazards && result.hazards.length > 0)
    ? result.hazards.map(h => `<span class="hazard-badge ${h.type === 'danger' ? 'danger' : 'warning'}">${h.text}</span>`).join(' ')
    : '<span class="hazard-badge ok">No hazards</span>';

  navCardBody.innerHTML = `
    <div class="space-y-2">
      <div class="flex items-center justify-between text-xs">
        <span class="font-semibold text-white">${fromName} → ${destinationTitle}</span>
        <span class="text-hud-cyan font-mono">ETA ~${result.eta || 0} min</span>
      </div>
      <div class="flex items-center gap-2 text-xs">
        <span class="text-hud-text/50">Max Difficulty:</span>
        <span class="diff-badge ${result.maxDifficulty || 'blue'}"></span>
        <span class="text-white capitalize">${result.maxDifficulty || 'blue'}</span>
      </div>
      <div class="flex flex-wrap gap-1">${hazardsHtml}</div>
      <div class="bg-hud-bg/50 rounded-lg p-2 mt-1">${stepsHtml}</div>
    </div>
  `;
  navCard.classList.remove('hidden');
}

export function showSquadCard(squadCard, squadCardBody, recipients, message, eta) {
  if (!squadCard || !squadCardBody) return;

  const time = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  const recipText = recipients.join(' & ');
  const etaText = eta ? ` — ETA ${eta} min` : '';

  squadCardBody.innerHTML = `
    <div class="space-y-2">
      <div class="text-xs">
        <span class="text-hud-text/50">📻 Sent to:</span>
        <span class="text-white font-semibold ml-1">${recipText}</span>
        <span class="text-hud-text/30 ml-2">${time}</span>
      </div>
      <div class="bg-hud-bg/50 rounded-lg p-2 text-xs text-hud-text italic">
        "${message}"${etaText}
      </div>
    </div>
  `;
  squadCard.classList.remove('hidden');

  // Animate squad dots on map
  recipients.forEach(name => {
    if (/all|everyone|everybody|squad/i.test(name)) {
      document.querySelectorAll('.squad-dot').forEach(el => {
        el.style.transform = 'scale(1.35)';
        setTimeout(() => { el.style.transform = 'scale(1)'; }, 1400);
      });
      return;
    }
    const match = matchBestPerson(name);
    const accId = match ? match.account.id : name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const el = document.getElementById(`squad-${accId}`)
            || document.querySelector(`[data-squad-id="${accId}"]`);
    if (el) {
      el.style.transform = 'scale(1.4)';
      setTimeout(() => { el.style.transform = 'scale(1)'; }, 1400);
    }
  });
}

export function flashMapNode(nodeId, color = '#00e5ff') {
  const nodeGroup = document.querySelector(`[data-node-id="${nodeId}"]`);
  if (nodeGroup) {
    const circle = nodeGroup.querySelector('.node-circle');
    if (circle) {
      const origStroke = circle.getAttribute('stroke');
      const origFill = circle.getAttribute('fill');
      circle.setAttribute('stroke', color);
      circle.setAttribute('fill', color === '#ff2d2d' ? '#3a0000' : '#003a45');
      setTimeout(() => {
        circle.setAttribute('stroke', origStroke);
        circle.setAttribute('fill', origFill);
      }, 3500);
    }
  }
}

export function showSOSCard(sosCard, sosCardBody, location, injury, onDismiss) {
  if (!sosCard || !sosCardBody) return;

  _isSOSActive = true;
  const node = nodes[location];
  const locName = node ? node.name : (location || 'Mountain Sector');
  const injuryDesc = injury || 'crash — assessing injuries';

  sosCardBody.innerHTML = `
    <div class="space-y-2">
      <div class="text-sm font-bold text-red-400 animate-pulse">🚨 EMERGENCY BEACON ACTIVE</div>
      <div class="grid grid-cols-2 gap-1 text-xs font-mono">
        <div><span class="text-red-300/60">Location:</span></div>
        <div class="text-white">${locName}</div>
        <div><span class="text-red-300/60">Injury:</span></div>
        <div class="text-white">${injuryDesc}</div>
        <div><span class="text-red-300/60">GPS:</span></div>
        <div class="text-white">45.0921° N, 6.0694° E</div>
        <div><span class="text-red-300/60">Altitude:</span></div>
        <div class="text-white">${node ? node.altitude + 'm' : '2100m'}</div>
        <div><span class="text-red-300/60">Status:</span></div>
        <div class="text-red-400 font-bold">TRANSMITTING</div>
      </div>
      <div class="text-[10px] text-red-300/60 mt-1">Rescue services notified • Estimated arrival ~8 min</div>
      <button id="btnDismissSOS" class="w-full mt-2 py-1.5 px-3 text-xs font-mono font-semibold rounded bg-red-900/60 border border-red-500/50 text-red-200 hover:bg-red-800/80 transition flex items-center justify-center gap-1.5 cursor-pointer">
        <i data-lucide="check-circle" class="w-3.5 h-3.5 text-hud-green"></i> Dismiss Emergency Beacon
      </button>
    </div>
  `;
  sosCard.classList.remove('hidden');
  document.body.classList.add('sos-active');

  if (typeof window !== 'undefined' && window.lucide) {
    window.lucide.createIcons();
  }

  const btnDismiss = document.getElementById('btnDismissSOS');
  if (btnDismiss && onDismiss) {
    btnDismiss.addEventListener('click', onDismiss);
  }

  if (node) {
    flashMapNode(location, '#ff2d2d');
  }
}

export function clearSOS(sosCard, restoreNodesFn) {
  _isSOSActive = false;
  if (sosCard) sosCard.classList.add('hidden');
  document.body.classList.remove('sos-active');
  if (typeof restoreNodesFn === 'function') {
    restoreNodesFn();
  }
}

export function addTranscript(transcriptLog, type, text) {
  if (!transcriptLog) return;

  const placeholder = transcriptLog.querySelector('.italic');
  if (placeholder) placeholder.remove();

  const entry = document.createElement('div');
  const time = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const typeClass = type === 'user' ? 'transcript-user' : type === 'ai' ? 'transcript-ai' : 'transcript-system';
  const typeLabel = type === 'user' ? 'YOU' : type === 'ai' ? 'APEX' : 'SYS';
  const labelColor = type === 'user' ? 'text-green-400' : type === 'ai' ? 'text-cyan-400' : 'text-amber-400';

  entry.className = `${typeClass} text-[11px]`;
  entry.innerHTML = `
    <div class="flex items-center gap-1 mb-0.5">
      <span class="${labelColor} font-bold font-mono text-[10px]">${typeLabel}</span>
      <span class="text-hud-text/30 font-mono text-[9px]">${time}</span>
    </div>
    <div class="text-hud-text/80">${text}</div>
  `;
  transcriptLog.appendChild(entry);
  transcriptLog.scrollTop = transcriptLog.scrollHeight;
}
