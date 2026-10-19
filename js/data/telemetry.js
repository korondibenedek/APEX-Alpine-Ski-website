/* ═══════════════════════════════════════════════════════════════════
   telemetry.js — Mountain Weather, Snow Conditions & Hazard Reports
   ═══════════════════════════════════════════════════════════════════ */

import { nodes, simState } from './resort-graph.js';
import { resolveNodeName } from './fuzzy-matcher.js';

export function getConditionsReport(sector) {
  const parts = [];
  if (simState.blizzard) {
    parts.push('🌨️ BLIZZARD active at Glacier Peak — visibility near zero, extreme wind gusts.');
  }
  if (simState.liftClosed) {
    parts.push('🚫 South Bowl Lift is CLOSED due to high wind. Use alternative routes.');
  }
  if (simState.iceBlack) {
    parts.push('🧊 ICE WARNING on all Black runs — very slippery, expert only.');
  }
  if (parts.length === 0) {
    parts.push('✅ All clear. Conditions are good across the mountain. Temperature -8°C, wind 12 km/h NW, visibility good.');
  }

  // Sector-specific
  if (sector) {
    const nodeId = resolveNodeName(sector);
    if (nodeId) {
      const node = nodes[nodeId];
      if (nodeId === 'glacierPeak' && simState.blizzard) {
        parts.push(`⚠️ ${node.name} (${node.altitude}m) is in the blizzard zone. Recommend descending immediately.`);
      } else if (nodeId === 'southBowlLift' && simState.liftClosed) {
        parts.push(`⚠️ ${node.name} lift is non-operational. Ski down to Main Valley Base instead.`);
      } else {
        parts.push(`📍 ${node.name} (${node.altitude}m): No local alerts.`);
      }
    }
  }

  return parts.join('\n');
}

