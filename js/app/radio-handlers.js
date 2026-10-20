import { MountainData, getActiveAccount, getAccounts, nodes } from '../data/index.js';
import { aiSpeak, formatRadioMessage } from '../voice/index.js';
import { showSquadCard, addTranscript } from '../ui/tactical-hud.js';
import { addRadioMessage } from '../ui/radio-feed.js';
import { appState, squadCard, squadCardBody, radioFeed, radioUnreadBadge, radioMsgCount, activeChannelFilterLabel, transcriptLog } from './dom.js';

export async function handlePingSquad(args) {
  const recipients = (args.recipients && args.recipients.length > 0) ? args.recipients : ['All Squad'];
  const rawMsg = args.text || args.message || args.rawMessage || '';
  const cleanText = formatRadioMessage(rawMsg, recipients, args.eta);

  const activeUser = getActiveAccount() || MountainData.squad.you;
  const isBroadcast = recipients.some(r => /all|everyone|everybody|squad/i.test(r));

  // 1. Post outgoing message to Radio Feed
  addRadioMessage({
    direction: 'outgoing',
    sender: activeUser.name,
    role: activeUser.role,
    avatar: activeUser.avatar || '⛷️',
    channel: 'Squad Voice Net',
    recipients,
    text: cleanText,
    autoSpeak: false
  }, {
    radioFeed,
    radioUnreadBadge,
    radioMsgCount,
    activeChannelFilterLabel,
    isRadioTabActive: appState.activeTab === 'radio'
  });

  // 2. Update Tactical Visor HUD squad card
  showSquadCard(squadCard, squadCardBody, recipients, cleanText, args.eta);

  // 3. APEX AI voice acknowledgement (speaks zero "Over"s)
  const spokenBody = cleanText.replace(/\s*\bOver\.?\s*$/i, '').trim();
  let resp = '';
  const etaText = args.eta ? `, ETA ${args.eta} minutes` : '';
  if (isBroadcast) {
    resp = `Roger, broadcasting to all squad units: "${spokenBody}"${etaText}.`;
  } else {
    resp = `Roger, message sent to ${recipients.join(' and ')}: "${spokenBody}"${etaText}.`;
  }

  addTranscript(transcriptLog, 'ai', resp);
  await aiSpeak(resp);

  // 4. Automated incoming squad response after 2.5s
  setTimeout(async () => {
    const primaryRecip = recipients[0];
    const pLower = primaryRecip.toLowerCase();
    const otherTeammates = getAccounts().filter(account => account.isCustom && account.id !== activeUser.id);
    const match = !isBroadcast && MountainData.matchBestPerson(primaryRecip);
    const targetAcc = (match?.account.id !== activeUser.id ? match?.account : null)
      || otherTeammates.find(account => account.name.toLowerCase() === pLower)
      || (isBroadcast ? otherTeammates[0] : null);
    if (!targetAcc) return;

    const nodeName = nodes[targetAcc.location]?.name || 'the mountain';
    const reply = {
      sender: targetAcc.name,
      role: targetAcc.role || 'Rider',
      avatar: targetAcc.avatar || '🎿',
      text: `${targetAcc.name} at ${nodeName} copying ${isBroadcast ? 'the squad broadcast' : `your message, ${activeUser.name}`} loud and clear. Over.`,
    };

    addRadioMessage({
      direction: 'incoming',
      sender: reply.sender,
      role: reply.role,
      avatar: reply.avatar,
      channel: 'Squad Voice Net',
      recipients: [activeUser.name],
      text: reply.text,
      autoSpeak: true
    }, {
      radioFeed,
      radioUnreadBadge,
      radioMsgCount,
      activeChannelFilterLabel,
      isRadioTabActive: appState.activeTab === 'radio'
    });
  }, 2500);
}
