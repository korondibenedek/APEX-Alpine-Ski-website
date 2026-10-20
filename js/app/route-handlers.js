import { nodes, dijkstra } from '../data/index.js';
import { aiSpeak } from '../voice/index.js';
import { highlightRoute, clearRouteHighlight } from '../ui/map-renderer.js';
import { showNavCard, addTranscript } from '../ui/tactical-hud.js';
import { routeHL, navCard, navCardBody, transcriptLog, squadCard, squadCardBody } from './dom.js';

// ── Squad Member Card Helper ────────────────────────────────────────
export function showSquadMemberCard(entity) {
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
export async function handlePlanSkiRoute(args) {
  const { from, to, avoidBlack, avoidIce, targetPerson } = args;

  if (!to) {
    const resp = "Roger, but I need a destination. Where should I route you?";
    addTranscript(transcriptLog, 'ai', resp);
    await aiSpeak(resp);
    return;
  }

  const result = dijkstra(from, to, { avoidBlack, avoidIce });

  if (!result) {
    clearRouteHighlight(routeHL);
    navCard?.classList.add('hidden');
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
