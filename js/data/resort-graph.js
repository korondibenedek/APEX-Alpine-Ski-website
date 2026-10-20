/* ═══════════════════════════════════════════════════════════════════
   resort-graph.js — Mount Apex Ski Resort Topology & Map Graph
   ═══════════════════════════════════════════════════════════════════ */

import { REAL_RESORTS } from './resorts-db.js';

const initialResort = REAL_RESORTS.mountApex;

// Active topological nodes (stations, peaks, huts)
export const nodes = { ...initialResort.nodes };

// Active topological edges (runs, lifts)
export const edges = [ ...initialResort.edges ];

// Simulator real-time environmental hazard state
export const simState = {
  blizzard: false,      // blizzard at summit
  liftClosed: false,    // main lift closed
  iceBlack: false,      // ice on black runs
};

export const activeResortMeta = {
  id: initialResort.id,
  name: initialResort.name,
  country: initialResort.country,
  flag: initialResort.flag,
  altitude: initialResort.altitude,
  baseAltitude: initialResort.baseAltitude,
  description: initialResort.description,
  runsCount: initialResort.edges.filter(e => e.type === 'run').length,
  liftsCount: initialResort.edges.filter(e => e.type === 'lift').length,
};

export function setResortData(newNodes, newEdges, newMeta) {
  for (const k of Object.keys(nodes)) {
    delete nodes[k];
  }
  Object.assign(nodes, newNodes);

  edges.length = 0;
  edges.push(...newEdges);

  if (newMeta) {
    Object.assign(activeResortMeta, newMeta);
    if (!newMeta.runsCount) {
      activeResortMeta.runsCount = newEdges.filter(e => e.type === 'run').length;
    }
    if (!newMeta.liftsCount) {
      activeResortMeta.liftsCount = newEdges.filter(e => e.type === 'lift').length;
    }
  }
}
