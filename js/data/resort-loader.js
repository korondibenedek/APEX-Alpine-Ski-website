/* Resort catalog, active terrain switching, and startup restoration. */

import { REAL_RESORTS } from './resorts-db.js';
import { setResortData } from './resort-graph.js';
import { getAccounts, saveAccounts, syncSquadState } from './accounts.js';
import { getCustomResorts, saveCustomResort } from './resort-storage.js';

let _activeResortId = (typeof localStorage !== 'undefined' && localStorage.getItem('apex_current_resort')) || 'mountApex';

export function getActiveResortId() {
  return _activeResortId;
}

export function getAllPresets() {
  const custom = getCustomResorts();
  return [...custom, ...Object.values(REAL_RESORTS)];
}

export function searchPresetResorts(query) {
  const q = (query || '').toLowerCase().trim();
  if (!q) return getAllPresets();

  return getAllPresets().filter(r => {
    return (
      r.name.toLowerCase().includes(q) ||
      (r.country && r.country.toLowerCase().includes(q)) ||
      r.id.toLowerCase().includes(q) ||
      (r.nodes && Object.values(r.nodes).some(n => n.name && n.name.toLowerCase().includes(q)))
    );
  });
}

export function applyResort(resortData) {
  if (!resortData || !resortData.nodes || !resortData.edges) {
    console.error('Invalid resort data:', resortData);
    return false;
  }

  // Update resort-graph data
  setResortData(resortData.nodes, resortData.edges, {
    id: resortData.id,
    name: resortData.name,
    country: resortData.country || 'Alpine Terrain',
    flag: resortData.flag || '🏔️',
    altitude: resortData.altitude || 2000,
    baseAltitude: resortData.baseAltitude || 1000,
    description: resortData.description || '',
    runsCount: resortData.edges.filter(e => e.type !== 'lift').length,
    liftsCount: resortData.edges.filter(e => e.type === 'lift').length,
  });

  _activeResortId = resortData.id;
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('apex_current_resort', _activeResortId);
      if (resortData.sourceImage || resortData.id.startsWith('custom_') || resortData.id.startsWith('img_') || resortData.id.startsWith('proc_')) {
        saveCustomResort(resortData);
      }
    }
  } catch (e) {}

  // Redistribute squad skiers onto valid nodes of the new terrain
  const nodeKeys = Object.keys(resortData.nodes);
  if (nodeKeys.length > 0) {
    const accounts = getAccounts();
    const summitNode = nodeKeys[0];
    const baseNode = nodeKeys[nodeKeys.length - 1];
    const midNode = nodeKeys[Math.floor(nodeKeys.length / 2)] || summitNode;
    const mid2Node = nodeKeys[1] || midNode;

    const slotMap = [summitNode, midNode, mid2Node, baseNode];

    accounts.forEach((acc, idx) => {
      acc.onEdge = null;
      delete acc.edgeProgress;
      if (!resortData.nodes[acc.location]) {
        acc.location = slotMap[idx % slotMap.length] || summitNode;
      }
    });

    saveAccounts();
    syncSquadState();
  }

  return true;
}

export function initResort() {
  if (_activeResortId && REAL_RESORTS[_activeResortId]) {
    applyResort(REAL_RESORTS[_activeResortId]);
    return REAL_RESORTS[_activeResortId];
  } else if (_activeResortId) {
    const customList = getCustomResorts();
    const found = customList.find(r => r.id === _activeResortId);
    if (found) {
      applyResort(found);
      return found;
    }
    try {
      const saved = localStorage.getItem('apex_custom_resort_' + _activeResortId);
      if (saved) {
        const parsed = JSON.parse(saved);
        applyResort(parsed);
        return parsed;
      }
    } catch (e) {}
  }

  // Fallback to Mount Apex
  applyResort(REAL_RESORTS.mountApex);
  return REAL_RESORTS.mountApex;
}


export {
  getCustomResorts,
  saveCustomResort,
  deleteCustomResort,
} from './resort-storage.js';
export {
  sanitizeResortTopology,
  extractResortNameFromFilename,
  readFileAsBase64,
} from './resort-topology.js';
export {
  generateProceduralResort,
} from './resort-generators.js';
export {
  analyzeImageOffline,
  callGeminiVision,
  generateResortFromImage,
} from './resort-image-generator.js';
export { generateResortWithAI } from './resort-ai-generator.js';
