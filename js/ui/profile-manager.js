/* ═══════════════════════════════════════════════════════════════════
   profile-manager.js — Skier Profile Creation, Switching & Modal UI
   ═══════════════════════════════════════════════════════════════════ */

import { nodes } from '../data/resort-graph.js';
import {
  getAccounts,
  getActiveAccount,
  createProfile,
  deleteProfile,
  switchAccount,
} from '../data/accounts.js';

let _selectedColor = '#00e5ff';
let _selectedAvatar = '🎿';

export function getSelectedColor() { return _selectedColor; }
export function getSelectedAvatar() { return _selectedAvatar; }

export function updateTopBarAccountUI({ topBarAccountName, topBarAccountLoc }) {
  const active = getActiveAccount();
  if (active) {
    if (topBarAccountName) topBarAccountName.textContent = active.name;
    const nodeName = nodes[active.location]?.name || 'Sector';
    if (topBarAccountLoc) topBarAccountLoc.textContent = `@ ${nodeName}`;
  }
}

export function initProfileCreationControls({ customColorSelector, customAvatarSelector }) {
  if (customColorSelector) {
    customColorSelector.querySelectorAll('.color-swatch-dot').forEach(btn => {
      btn.addEventListener('click', () => {
        customColorSelector.querySelectorAll('.color-swatch-dot').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        _selectedColor = btn.dataset.color || '#00e5ff';
      });
    });
  }

  if (customAvatarSelector) {
    customAvatarSelector.querySelectorAll('.avatar-pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        customAvatarSelector.querySelectorAll('.avatar-pill-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        _selectedAvatar = btn.dataset.avatar || '🎿';
      });
    });
  }
}

export function renderAccountsModalList(accountsListContainer, { onSwitch, onDelete }) {
  if (!accountsListContainer) return;
  const accounts = getAccounts();
  const active = getActiveAccount();

  accountsListContainer.innerHTML = accounts.map(acc => {
    const isActive = acc.id === active.id;
    const nodeName = nodes[acc.location]?.name || acc.location;
    return `
      <div class="p-3 rounded-lg border transition flex items-center justify-between ${
        isActive
          ? 'bg-hud-cyan/10 border-hud-cyan/80 text-white shadow-[0_0_15px_rgba(0,229,255,0.15)]'
          : 'bg-hud-card border-hud-border/60 hover:border-hud-border hover:bg-hud-card/80 text-hud-text'
      }">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-full flex items-center justify-center text-lg border" style="background-color: ${acc.color}22; border-color: ${acc.color}">
            ${acc.avatar || '🎿'}
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="font-bold text-sm text-white">${acc.name}</span>
              ${isActive ? '<span class="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-hud-cyan/20 text-hud-cyan border border-hud-cyan/40">ACTIVE (YOU)</span>' : ''}
            </div>
            <div class="text-[11px] text-hud-text/60 font-mono">${acc.role} · @ ${nodeName}</div>
          </div>
        </div>

        <div class="flex items-center gap-2">
          ${
            !isActive
              ? `<button class="btn-select-account px-2.5 py-1 text-xs rounded border border-hud-border hover:border-hud-cyan hover:text-hud-cyan bg-hud-bg/60 transition font-mono cursor-pointer" data-acc-id="${acc.id}">Switch</button>`
              : ''
          }
          ${
            accounts.length > 1
              ? `<button class="btn-delete-account p-1 text-hud-text/40 hover:text-red-400 transition" title="Delete Profile" data-acc-id="${acc.id}">
                  <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                </button>`
              : ''
          }
        </div>
      </div>
    `;
  }).join('');

  // Switch button listeners
  accountsListContainer.querySelectorAll('.btn-select-account').forEach(btn => {
    btn.addEventListener('click', () => {
      const accId = btn.dataset.accId;
      if (onSwitch) onSwitch(accId);
    });
  });

  // Delete button listeners
  accountsListContainer.querySelectorAll('.btn-delete-account').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const accId = btn.dataset.accId;
      if (onDelete) onDelete(accId);
    });
  });

  if (typeof window !== 'undefined' && window.lucide) {
    window.lucide.createIcons();
  }
}

