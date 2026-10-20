/* ═══════════════════════════════════════════════════════════════════
   accounts.js — Skier Profiles, Squad State & Persistence
   ═══════════════════════════════════════════════════════════════════ */

import { nodes } from './resort-graph.js';

const initialNodeId = Object.keys(nodes)[0] || 'mountainBase';

export const DEFAULT_ACCOUNTS = [{
  id: 'operator',
  name: 'Operator',
  role: 'Alpine Skier',
  color: '#39ff14',
  location: initialNodeId,
  avatar: '🎿',
}];

export function loadAccounts() {
  try {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('apex_accounts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const profiles = parsed.filter(account => account?.isCustom);
          if (profiles.length > 0) {
            if (profiles.length !== parsed.length) {
              localStorage.setItem('apex_accounts', JSON.stringify(profiles));
            }
            return profiles;
          }
          localStorage.setItem('apex_accounts', JSON.stringify(DEFAULT_ACCOUNTS));
        }
      }
    }
  } catch (e) {
    console.warn('Failed to load accounts from storage', e);
  }
  return JSON.parse(JSON.stringify(DEFAULT_ACCOUNTS));
}

let availableAccounts = loadAccounts();
let savedAccountId = null;
try {
  if (typeof localStorage !== 'undefined') {
    savedAccountId = localStorage.getItem('apex_active_account');
  }
} catch (e) {
  console.warn('Failed to load active account from storage', e);
}
let currentAccountId = availableAccounts.some(account => account.id === savedAccountId)
  ? savedAccountId
  : availableAccounts[0]?.id;

if (typeof localStorage !== 'undefined' && currentAccountId) {
  try {
    localStorage.setItem('apex_active_account', currentAccountId);
  } catch (e) {
    console.warn('Failed to update active account in storage', e);
  }
}

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

  if (autoLogin) {
    availableAccounts = availableAccounts.filter(account => account.isCustom);
  }
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
    if (match.isCustom) {
      availableAccounts = availableAccounts.filter(account => account.isCustom);
      saveAccounts();
    }
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
