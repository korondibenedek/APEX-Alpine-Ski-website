/* ═══════════════════════════════════════════════════════════════════
   accounts.js — Skier Profiles, Squad State & Persistence
   ═══════════════════════════════════════════════════════════════════ */

import { nodes } from './resort-graph.js';

export const DEFAULT_ACCOUNTS = [
  {
    id: 'benedek',
    name: 'Benedek',
    role: 'Team Lead / Alpine Skier',
    color: '#39ff14',
    location: 'glacierPeak',
    status: 'At Summit (3,200m)',
    avatar: '🎿',
  },
  {
    id: 'renato',
    name: 'Renato',
    role: 'Alpine Scout / Radio Lead',
    color: '#ff6f00',
    location: 'panoramaHut',
    status: 'At Hütte Deck (2,200m)',
    avatar: '🏂',
  },
  {
    id: 'kajti',
    name: 'Kajti',
    role: 'Downhill Specialist',
    color: '#e040fb',
    location: 'southBowlLift',
    onEdge: 'e9',
    edgeProgress: 0.45,
    status: 'Carving Red Run 4',
    avatar: '⛷️',
  },
  {
    id: 'patrol',
    name: 'Ski Patrol #4',
    role: 'Mountain Rescue / Medic',
    color: '#ff2d2d',
    location: 'eagleMid',
    status: 'Mid-Station Stationed (2,400m)',
    avatar: '⛑️',
  },
];

export function loadAccounts() {
  try {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('apex_accounts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    }
  } catch (e) {
    console.warn('Failed to load accounts from storage', e);
  }
  return JSON.parse(JSON.stringify(DEFAULT_ACCOUNTS));
}

let availableAccounts = loadAccounts();
let currentAccountId = (typeof localStorage !== 'undefined' && localStorage.getItem('apex_active_account'))
  || availableAccounts[0]?.id
  || 'benedek';

export function saveAccounts() {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('apex_accounts', JSON.stringify(availableAccounts));
    }
  } catch (e) {
    console.warn('Failed to save accounts to storage', e);
  }
}

// Squad state object accessed by rendering and locating
export const squad = {};

export function syncSquadState() {
  let active = availableAccounts.find(a => a.id === currentAccountId);
  if (!active) {
    active = availableAccounts[0] || DEFAULT_ACCOUNTS[0];
    currentAccountId = active.id;
  }

  // Clear existing keys in squad
  for (const k of Object.keys(squad)) {
    delete squad[k];
  }

  // Active player is mapped to 'you'
  squad.you = {
    id: 'you',
    name: `${active.name} (You)`,
    color: '#39ff14', // High-vis radar green for active operator
    currentNode: active.location,
    onEdge: active.onEdge || null,
    edgeProgress: active.edgeProgress || null,
    accountId: active.id,
    avatar: active.avatar || '🎿',
  };

  // Add all other accounts as squad teammates
  availableAccounts.forEach(acc => {
    if (acc.id !== active.id) {
      squad[acc.id] = {
        id: acc.id,
        name: acc.name,
        color: acc.color,
        currentNode: acc.onEdge ? null : acc.location,
        onEdge: acc.onEdge || null,
        edgeProgress: acc.edgeProgress || null,
        accountId: acc.id,
        avatar: acc.avatar || '🎿',
      };
    }
  });
}

// Initial squad sync
syncSquadState();

export function createProfile({ name, role, location, avatar, color, autoLogin = false }) {
  const rawName = (name || '').trim();
  if (!rawName) return null;

  let baseId = 'acc_' + rawName.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (!baseId || baseId === 'acc_') baseId = 'acc_' + Date.now().toString(36);
  let id = baseId;
  let counter = 1;
  while (availableAccounts.some(a => a.id === id)) {
    id = `${baseId}_${counter++}`;
  }

  const sector = location || Object.keys(nodes)[0] || 'mainValleyBase';
  const node = nodes[sector] || Object.values(nodes)[0] || { id: sector, name: 'Mountain Base', altitude: 1000 };
  const newAcc = {
    id,
    name: rawName,
    role: (role || 'Alpine Skier').trim(),
    color: color || '#00e5ff',
    location: node.id,
    status: `At ${node.name} (${node.altitude}m)`,
    avatar: avatar || '🎿',
    isCustom: true,
  };

  availableAccounts.push(newAcc);
  saveAccounts();

  if (autoLogin) {
    currentAccountId = newAcc.id;
    try {
      localStorage.setItem('apex_active_account', currentAccountId);
    } catch (e) {}
  }

  syncSquadState();
  return newAcc;
}

export function deleteProfile(accId) {
  const idx = availableAccounts.findIndex(a => a.id === accId);
  if (idx === -1) return false;
  if (availableAccounts.length <= 1) return false; // keep at least 1 account

  const isCurrentActive = currentAccountId === accId;
  availableAccounts.splice(idx, 1);
  saveAccounts();

  if (isCurrentActive) {
    currentAccountId = availableAccounts[0].id;
    try {
      localStorage.setItem('apex_active_account', currentAccountId);
    } catch (e) {}
  }

  syncSquadState();
  return true;
}

export function switchAccount(accId, customName, customSector, customRole, customAvatar, customColor) {
  if (accId === 'custom' && customName) {
    return createProfile({
      name: customName,
      role: customRole || 'Alpine Skier',
      location: customSector || Object.keys(nodes)[0] || 'mainValleyBase',
      avatar: customAvatar || '🎿',
      color: customColor || '#00e5ff',
      autoLogin: true,
    });
  }

  const match = availableAccounts.find(a => a.id === accId);
  if (match) {
    currentAccountId = match.id;
    try {
      localStorage.setItem('apex_active_account', currentAccountId);
    } catch (e) {}
    syncSquadState();
  }
  return getActiveAccount();
}

export function getActiveAccount() {
  return availableAccounts.find(a => a.id === currentAccountId) || availableAccounts[0];
}

export function getAccounts() {
  return [...availableAccounts];
}

export function getCurrentAccountId() {
  return currentAccountId;
}

