/* ═══════════════════════════════════════════════════════════════════
   index.js — Unified MountainData Module Export
   ═══════════════════════════════════════════════════════════════════ */

import { nodes, edges, simState } from './resort-graph.js';
import {
  DEFAULT_ACCOUNTS,
  loadAccounts,
  saveAccounts,
  squad,
  syncSquadState,
  createProfile,
  deleteProfile,
  switchAccount,
  getActiveAccount,
  getAccounts,
  getCurrentAccountId,
} from './accounts.js';
import {
  normalizeText,
  levenshtein,
  similarity,
  KNOWN_PERSON_ALIASES,
  RESERVED_WORDS,
  matchBestPerson,
  resolveNodeName,
  locateEntity,
} from './fuzzy-matcher.js';
import { getConditionsReport } from './telemetry.js';
import { buildAdjacency, dijkstra } from '../algorithms/dijkstra.js';

export {
  nodes,
  edges,
  simState,
  DEFAULT_ACCOUNTS,
  loadAccounts,
  saveAccounts,
  squad,
  syncSquadState,
  createProfile,
  deleteProfile,
  switchAccount,
  getActiveAccount,
  getAccounts,
  getCurrentAccountId,
  normalizeText,
  levenshtein,
  similarity,
  KNOWN_PERSON_ALIASES,
  RESERVED_WORDS,
  matchBestPerson,
  resolveNodeName,
  locateEntity,
  getConditionsReport,
  buildAdjacency,
  dijkstra,
};

export const MountainData = {
  nodes,
  edges,
  simState,
  get squad() { return squad; },
  dijkstra,
  resolveNodeName,
  getConditionsReport,
  buildAdjacency,
  switchAccount,
  createProfile,
  deleteProfile,
  saveAccounts,
  getActiveAccount,
  getAccounts,
  locateEntity,
  matchBestPerson,
  similarity,
  normalizeText,
};

