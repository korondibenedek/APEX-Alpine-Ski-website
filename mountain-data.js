/* ═══════════════════════════════════════════════════════════════════
   mountain-data.js — Modular Architecture Bridge
   ═══════════════════════════════════════════════════════════════════
   This monolithic file has been refactored into clean, focused modules:
     - js/data/resort-graph.js   -> Mountain peaks, lifts & ski trails
     - js/data/accounts.js       -> Skier profiles & squad state
     - js/data/fuzzy-matcher.js  -> Levenshtein, Hungarian phonetics
     - js/data/telemetry.js      -> Real-time weather & hazard reports
     - js/algorithms/dijkstra.js -> Graph pathfinding & ETA routing
     - js/data/index.js          -> Unified MountainData interface
   ═══════════════════════════════════════════════════════════════════ */

export * from './js/data/index.js';
export { MountainData as default } from './js/data/index.js';
