import { nodes, getAccounts, createProfile, deleteProfile, switchAccount } from '../data/index.js';
import { aiSpeak } from '../voice/index.js';
import { renderSquad, clearRouteHighlight } from '../ui/map-renderer.js';
import { addTranscript, flashMapNode } from '../ui/tactical-hud.js';
import { updateTopBarAccountUI as updateAccountBar, renderAccountsModalList, getSelectedColor, getSelectedAvatar } from '../ui/profile-manager.js';
import { renderRadioFeed, renderRadioChannelFilters } from '../ui/radio-feed.js';
import { renderDemoPrompts } from './demo-prompts.js';
import { squadGroup, routeHL, accountsListContainer, radioChannelFilters, radioFeed, radioMsgCount, activeChannelFilterLabel, topBarAccountName, topBarAccountLoc, customAccountName, customAccountRole, customAccountSector, accountModal, transcriptLog } from './dom.js';

// ── Profile Creation & Switching ────────────────────────────────────
export async function handleCreateProfile(autoLogin = false) {
  const name = (customAccountName?.value || '').trim();
  const role = (customAccountRole?.value || '').trim() || 'Alpine Skier';
  const sector = customAccountSector ? customAccountSector.value : 'mainValleyBase';

  if (!name) {
    alert('Please enter a call sign or name.');
    return;
  }

  const created = createProfile({
    name,
    role,
    location: sector,
    avatar: getSelectedAvatar(),
    color: getSelectedColor(),
    autoLogin
  });

  if (!created) return;

  if (customAccountName) customAccountName.value = '';
  if (customAccountRole) customAccountRole.value = '';

  renderAccountsModalList(accountsListContainer, {
    onSwitch: handleSwitchAccount,
    onDelete: handleDeleteProfile
  });
  renderRadioChannelFilters(radioChannelFilters, () => {
    renderRadioFeed(radioFeed, { radioMsgCount, activeChannelFilterLabel });
  });
  renderSquad(squadGroup);
  updateAccountBar({ topBarAccountName, topBarAccountLoc });
  renderDemoPrompts();

  const locName = nodes[created.location]?.name || 'Mount Apex';

  if (autoLogin) {
    accountModal?.classList.add('hidden');
    clearRouteHighlight(routeHL);
    addTranscript(transcriptLog, 'system', `👤 Operator switched: ${created.name} (${created.role}) @ ${locName}`);
    await aiSpeak(`Operator switched. Welcome ${created.name}. Voice channel synchronized at ${locName}.`);
  } else {
    flashMapNode(created.location, created.color);
    addTranscript(transcriptLog, 'system', `➕ New squad operator linked: ${created.name} (${created.role}) stationed at ${locName}`);
    await aiSpeak(`${created.name} added to squad voice network at ${locName}. Voice link online.`);
  }
}

export async function handleSwitchAccount(accId) {
  const newActive = switchAccount(accId);
  accountModal?.classList.add('hidden');
  updateAccountBar({ topBarAccountName, topBarAccountLoc });
  renderSquad(squadGroup);
  clearRouteHighlight(routeHL);
  renderDemoPrompts();
  renderRadioChannelFilters(radioChannelFilters, () => {
    renderRadioFeed(radioFeed, { radioMsgCount, activeChannelFilterLabel });
  });

  const locName = nodes[newActive.location]?.name || 'Mount Apex';
  addTranscript(transcriptLog, 'system', `👤 Operator switched: ${newActive.name} (${newActive.role}) @ ${locName}`);
  await aiSpeak(`Operator switched. Welcome ${newActive.name}. Voice channel synchronized at ${locName}.`);
}

export function handleDeleteProfile(accId) {
  const target = getAccounts().find(a => a.id === accId);
  const name = target ? target.name : 'skier';
  if (confirm(`Remove ${name} from squad network?`)) {
    deleteProfile(accId);
    renderAccountsModalList(accountsListContainer, {
      onSwitch: handleSwitchAccount,
      onDelete: handleDeleteProfile
    });
    renderRadioChannelFilters(radioChannelFilters, () => {
      renderRadioFeed(radioFeed, { radioMsgCount, activeChannelFilterLabel });
    });
    renderSquad(squadGroup);
    updateAccountBar({ topBarAccountName, topBarAccountLoc });
    renderDemoPrompts();
    addTranscript(transcriptLog, 'system', `🗑️ Skier profile removed: ${name}`);
  }
}
