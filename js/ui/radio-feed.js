/* ═══════════════════════════════════════════════════════════════════
   radio-feed.js — Radio Comms Feed, Channel Filtering & Unread Tracking
   ═══════════════════════════════════════════════════════════════════ */

import { getAccounts } from '../data/accounts.js';
import { playRadioSquelch } from '../voice/audio-fx.js';
import { aiSpeak } from '../voice/speech-tts.js';

let _activeRadioChannel = 'all'; // 'all' | account name
let _radioUnreadCount = 0;
const _radioMessages = []; // Full per-profile logged transmissions

export function getActiveRadioChannel() {
  return _activeRadioChannel;
}

export function setActiveRadioChannel(channel) {
  _activeRadioChannel = channel;
}

export function getRadioUnreadCount() {
  return _radioUnreadCount;
}

export function resetRadioUnreadCount(radioUnreadBadge) {
  _radioUnreadCount = 0;
  if (radioUnreadBadge) {
    radioUnreadBadge.textContent = '0';
    radioUnreadBadge.classList.add('hidden');
  }
}

export function updateChannelBadges() {
  const countAll = _radioMessages.length;
  const badgeAll = document.getElementById('badgeCountAll');
  if (badgeAll) badgeAll.textContent = countAll;

  document.querySelectorAll('[data-badge-for]').forEach(badgeEl => {
    const targetName = (badgeEl.getAttribute('data-badge-for') || '').toLowerCase();
    const count = _radioMessages.filter(m => {
      const isRecip = (m.recipients || []).some(r => r.toLowerCase().includes(targetName) || r.toLowerCase().includes('all'));
      const isSender = (m.sender || '').toLowerCase().includes(targetName);
      return isRecip || isSender;
    }).length;
    badgeEl.textContent = count;
  });
}

export function renderRadioChannelFilters(radioChannelFilters, onChannelChange) {
  if (!radioChannelFilters) return;
  const accounts = getAccounts();

  let html = `
    <button class="channel-filter-pill ${_activeRadioChannel === 'all' ? 'active' : ''}" data-channel="all">
      <span>📢 ALL SQUAD</span>
      <span class="badge" id="badgeCountAll">0</span>
    </button>
  `;

  accounts.forEach(acc => {
    const isSel = _activeRadioChannel.toLowerCase() === acc.name.toLowerCase();
    html += `
      <button class="channel-filter-pill ${isSel ? 'active' : ''}" data-channel="${acc.name}">
        <span>${acc.avatar || '🎿'} ${acc.name}</span>
        <span class="badge" data-badge-for="${acc.name}">0</span>
      </button>
    `;
  });

  radioChannelFilters.innerHTML = html;

  radioChannelFilters.querySelectorAll('.channel-filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      radioChannelFilters.querySelectorAll('.channel-filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      _activeRadioChannel = pill.dataset.channel || 'all';
      if (onChannelChange) onChannelChange(_activeRadioChannel);
    });
  });

  updateChannelBadges();
}

export function renderRadioFeed(radioFeed, elements = {}) {
  if (!radioFeed) return;
  const { radioMsgCount, activeChannelFilterLabel } = elements;
  updateChannelBadges();

  // Update active filter label
  if (activeChannelFilterLabel) {
    if (_activeRadioChannel === 'all') {
      activeChannelFilterLabel.textContent = '📢 ALL SQUAD';
    } else {
      const acc = getAccounts().find(a => a.name.toLowerCase() === _activeRadioChannel.toLowerCase());
      const icon = acc ? (acc.avatar || '👤') : '👤';
      activeChannelFilterLabel.textContent = `${icon} ${_activeRadioChannel.toUpperCase()}'S LOG`;
    }
  }

  const filterLower = _activeRadioChannel.toLowerCase();
  const filtered = _radioMessages.filter(msg => {
    if (_activeRadioChannel === 'all') return true;
    const isRecipient = (msg.recipients || []).some(r =>
      r.toLowerCase().includes(filterLower) || r.toLowerCase().includes('all')
    );
    const isSender = (msg.sender || '').toLowerCase().includes(filterLower);
    return isRecipient || isSender;
  });

  if (radioMsgCount) {
    radioMsgCount.textContent = `${filtered.length} MESSAGE${filtered.length === 1 ? '' : 'S'}`;
  }

  if (filtered.length === 0) {
    radioFeed.innerHTML = `
      <div class="py-8 px-4 text-center text-xs font-mono text-hud-text/40 border border-dashed border-hud-border/40 rounded-xl space-y-1.5">
        <i data-lucide="radio" class="w-6 h-6 mx-auto mb-2 text-hud-text/30"></i>
        <div class="text-white/80 font-semibold tracking-wider uppercase">NO MESSAGES LOGGED</div>
        <div class="text-[10px] text-hud-text/40">
          ${_activeRadioChannel === 'all'
            ? 'Squad voice network online. Use the quick prompts or microphone to talk.'
            : `Channel for ${_activeRadioChannel} is clear. Direct messages will log here.`}
        </div>
      </div>
    `;
    if (typeof window !== 'undefined' && window.lucide) {
      window.lucide.createIcons();
    }
    return;
  }

  radioFeed.innerHTML = '';
  filtered.forEach(msg => {
    const isIncoming = msg.direction === 'incoming';
    const badgeClass = isIncoming
      ? 'bg-hud-green/20 text-hud-green border border-hud-green/40'
      : 'bg-hud-cyan/20 text-hud-cyan border border-hud-cyan/40';
    const dirLabel = isIncoming ? 'INCOMING' : 'OUTGOING';

    const card = document.createElement('div');
    card.className = `radio-card ${isIncoming ? 'incoming' : 'outgoing'} space-y-2`;
    card.innerHTML = `
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider ${badgeClass}">${dirLabel}</span>
          <span class="text-xs font-bold text-white flex items-center gap-1">
            <span>${msg.avatar}</span>
            <span>${msg.sender}</span>
            <span class="text-[10px] text-hud-text/40 font-mono font-normal">(${msg.role})</span>
          </span>
        </div>
        <span class="text-[10px] font-mono text-hud-text/40">${msg.timeStr}</span>
      </div>

      <div class="flex items-center justify-between text-[10px] font-mono text-hud-text/40 border-b border-hud-border/40 pb-1">
        <span>${msg.channel}</span>
        <span class="text-hud-cyan font-semibold">TO: ${(msg.recipients || []).join(', ')}</span>
      </div>

      <!-- Tactical English Radio Dispatch -->
      <div>
        <div class="text-xs font-mono text-white/95 font-medium leading-relaxed">
          "${msg.text}"
        </div>
        <div class="mt-1.5 flex items-center justify-between">
          <button class="radio-audio-btn btn-replay-radio" title="Replay radio squelch and speech">
            <i data-lucide="volume-2" class="w-3 h-3"></i>
            <span>REPLAY AUDIO</span>
          </button>
          <span class="text-[9px] font-mono text-hud-text/30">NATO / ALPINE ENG</span>
        </div>
      </div>
    `;

    const btnReplay = card.querySelector('.btn-replay-radio');
    if (btnReplay) {
      btnReplay.addEventListener('click', async () => {
        btnReplay.disabled = true;
        btnReplay.classList.add('opacity-50');
        await playRadioSquelch();
        await aiSpeak(msg.text);
        btnReplay.disabled = false;
        btnReplay.classList.remove('opacity-50');
      });
    }

    radioFeed.appendChild(card);
  });

  radioFeed.scrollTop = radioFeed.scrollHeight;
  if (typeof window !== 'undefined' && window.lucide) {
    window.lucide.createIcons();
  }
}

export function addRadioMessage({
  direction = 'incoming',
  sender = 'Renato',
  role = 'Snowboarder',
  avatar = '🏂',
  channel = 'Squad Voice Net',
  recipients = ['All Squad'],
  text = '',
  autoSpeak = false
}, { radioFeed, radioUnreadBadge, radioMsgCount, activeChannelFilterLabel, isRadioTabActive }) {
  const isIncoming = direction === 'incoming';

  if (isIncoming && !isRadioTabActive) {
    _radioUnreadCount++;
    if (radioUnreadBadge) {
      radioUnreadBadge.textContent = `${_radioUnreadCount}`;
      radioUnreadBadge.classList.remove('hidden');
    }
  }

  const newMsg = {
    id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
    direction,
    sender,
    role,
    avatar,
    channel,
    recipients: Array.isArray(recipients) ? recipients : [recipients || 'All Squad'],
    text,
    timeStr: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    timestamp: Date.now()
  };

  _radioMessages.push(newMsg);
  renderRadioFeed(radioFeed, { radioMsgCount, activeChannelFilterLabel });

  if (autoSpeak) {
    playRadioSquelch().then(() => {
      aiSpeak(text);
    });
  }
}

