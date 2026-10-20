/* ═══════════════════════════════════════════════════════════════════
   dijkstra.js — Single-Source Shortest Path Routing for Mount Apex
   ═══════════════════════════════════════════════════════════════════ */

import { nodes, edges, simState } from '../data/resort-graph.js';

// Build adjacency list for Dijkstra graph traversal
export function buildAdjacency(opts = {}) {
  const adj = {};
  for (const nid of Object.keys(nodes)) adj[nid] = [];

  for (const edge of edges) {
    // Skip lifts disabled by the active simulator controls.
    if (edge.type === 'lift' && edge.simControl === 'liftClosed' && simState.liftClosed) continue;

    // Skip black runs if avoidBlack requested
    if (opts.avoidBlack && edge.difficulty === 'black') continue;

    // Skip icy black runs if avoidIce and ice is on
    if (opts.avoidIce && simState.iceBlack && edge.difficulty === 'black') continue;

    let w = edge.weight;
    // Penalty for blizzard at peak
    if (simState.blizzard && (edge.from === 'glacierPeak' || edge.to === 'glacierPeak')) {
      w += 5;
    }
    // Penalty for ice on black runs
    if (simState.iceBlack && edge.difficulty === 'black') {
      w += 4;
    }

    // Runs go downhill and lifts go uphill, following each edge's direction.
    adj[edge.from].push({ to: edge.to, weight: w, edge });
  }
  return adj;
}

// Compute shortest trail route between two nodes on the mountain
export function dijkstra(from, to, opts = {}) {
  const adj = buildAdjacency(opts);
  const dist = {};
  const prev = {};
  const prevEdge = {};
  const visited = new Set();

  for (const nid of Object.keys(nodes)) dist[nid] = Infinity;
  dist[from] = 0;

  while (true) {
    // Pick unvisited node with smallest dist
    let u = null;
    let best = Infinity;
    for (const nid of Object.keys(nodes)) {
      if (!visited.has(nid) && dist[nid] < best) {
        best = dist[nid];
        u = nid;
      }
    }
    if (u === null || u === to) break;
    visited.add(u);

    for (const neighbor of adj[u]) {
      const alt = dist[u] + neighbor.weight;
      if (alt < dist[neighbor.to]) {
        dist[neighbor.to] = alt;
        prev[neighbor.to] = u;
        prevEdge[neighbor.to] = neighbor.edge;
      }
    }
  }

  if (dist[to] === Infinity) return null;

  // Reconstruct path
  const path = [];
  const pathEdges = [];
  let cur = to;
  while (cur) {
    path.unshift(cur);
    if (prevEdge[cur]) pathEdges.unshift(prevEdge[cur]);
    cur = prev[cur];
  }

  // Compute hazards along route
  const hazards = [];
  if (simState.blizzard && path.includes('glacierPeak')) {
    hazards.push({ type: 'warning', text: 'Blizzard at Peak' });
  }
  if (simState.iceBlack) {
    const hasBlack = pathEdges.some(e => e.difficulty === 'black');
    if (hasBlack) hazards.push({ type: 'danger', text: 'Ice on Black Runs' });
  }
  if (simState.liftClosed) {
    const needsSouth = pathEdges.some(e => e.simControl === 'liftClosed');
    if (needsSouth) hazards.push({ type: 'danger', text: 'South Lift Closed' });
  }

  // Compute ETA (weight ≈ minutes)
  const eta = dist[to];

  // Max difficulty on route
  const diffOrder = { blue: 0, red: 1, black: 2, lift: -1 };
  let maxDiff = 'blue';
  for (const e of pathEdges) {
    if (e.type === 'run' && diffOrder[e.difficulty] > diffOrder[maxDiff]) {
      maxDiff = e.difficulty;
    }
  }

  return { path, pathEdges, distance: dist[to], eta, hazards, maxDifficulty: maxDiff };
}
