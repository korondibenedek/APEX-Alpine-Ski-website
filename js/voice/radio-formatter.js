/* ═══════════════════════════════════════════════════════════════════
   radio-formatter.js — Tactical Radio Phrasing & Argument Extraction
   ═══════════════════════════════════════════════════════════════════ */

import { nodes } from '../data/resort-graph.js';
import { getAccounts } from '../data/accounts.js';
import { resolveNodeName, matchBestPerson, normalizeText } from '../data/fuzzy-matcher.js';

export function formatRadioMessage(rawText, recipients = [], eta = null) {
  const text = (rawText || '').trim();
  const lower = text.toLowerCase();
  const isBroadcast = recipients.some(r => /all|everyone|everybody|squad/i.test(r));
  const targetName = isBroadcast ? 'all squad units' : recipients.join(' & ');

  // 0. If payload is empty or only contains trigger words (e.g. user just said "send a message" or "check")
  if (!text || /^(?:check|radio\s+check|comms?\s+check|send\s+(?:a\s+)?(?:radio\s+)?message|radio\s+message|radio|message|üzenet|rádióüzenet)$/i.test(text)) {
    if (isBroadcast) {
      return `Squad comms check. Voice network online, telemetry operational. Standing by. Over.`;
    } else {
      return `Comms check for ${targetName}. Voice link online, standing by. Over.`;
    }
  }

  // 1. Resolve any mentioned station / node
  let targetNodeId = null;
  let targetNodeNameEn = '';

  const nodeMatch = resolveNodeName(lower);
  if (nodeMatch && nodes[nodeMatch]) {
    targetNodeId = nodeMatch;
    targetNodeNameEn = nodes[nodeMatch].name;
  }

  // 2. Trail color detection
  let trailEn = '';
  if (/blue|kék|kek/i.test(lower)) {
    trailEn = 'Blue Trail';
  } else if (/red|piros/i.test(lower)) {
    trailEn = 'Red Run';
  } else if (/black|fekete/i.test(lower)) {
    trailEn = 'Black Run';
  }

  // 3. ETA phrasing
  const etaEn = eta ? ` ETA ~${eta} min.` : '';

  // 4. Hazard alert shorthand (only for terse phrases like "hazard", "ice alert")
  if (/^(?:caution|hazard|watch out|look out|vigyázz|vigyazz|ice|icy|jég|fog|köd)(?:\s+near\s+[a-z\s]+)?$/i.test(lower)) {
    const destStrEn = targetNodeNameEn ? ` near ${targetNodeNameEn}` : '';
    const alertTarget = isBroadcast ? 'all squad units' : targetName;
    return `Caution to ${alertTarget}: Hazard and icy surface reported${destStrEn}. Reduce speed and stay visible. Over.`;
  }

  // 5. Check for concise rendezvous shorthand (e.g. "meet at panorama hut")
  if (/^(?:meet|rendezvous|találkozzunk)(?:\s+at|\s+near)?(?:\s+[a-z\s]+)?$/i.test(lower) && targetNodeNameEn) {
    const trailPhraseEn = trailEn ? ` Descending via ${trailEn}.` : '';
    return `Squad rendezvous at ${targetNodeNameEn}.${trailPhraseEn}${etaEn} Over.`;
  }

  // 6. Check for taking trail / descending shorthand
  if (/^(?:taking|heading|going down|ereszkedek|csúszok|megyek|jövök)\s+(?:the\s+)?(?:blue|red|black)\b/i.test(lower)) {
    const trailStrEn = trailEn || 'the marked run';
    const destStrEn = targetNodeNameEn ? ` towards ${targetNodeNameEn}` : '';
    return `Descending via ${trailStrEn}${destStrEn}.${etaEn} Proceeding with caution. Over.`;
  }

  // 7. Status check / check-in shorthand
  if (/^(?:status|helyzet|hol vagytok|where are you|ready|kész|kesz|radio check|comms?\s+check)\.?$/i.test(lower)) {
    return `Squad comms check. Voice network online, telemetry operational. Standing by for position report. Over.`;
  }

  // 8. General clean-up fallback (preserves user's actual transmission verbatim)
  let clean = text;
  clean = clean
    .replace(/^(?:please\s+)?(?:send\s+(?:a\s+|an\s+|the\s+)?(?:radio\s+)?message(?:\s+to)?|send\s+radio(?:\s+to)?|radio(?:\s+to)?|tell|ping(?:\s+squad)?|message|notify)\s*/i, '')
    .replace(/^(?:kérlek\s+)?(?:küldj\s+(?:egy\s+)?(?:rádió)?üzenetet|küldj\s+rádióüzenetet|rádiózz|mondd\s+meg|szólj|üzend\s+meg|üzenj)\s*/i, '')
    .trim();

  // Strip trailing over/vétel if user already said it
  clean = clean.replace(/\s*\b(over|vétel|vetel)\b\.?\s*$/gi, '').trim();

  if (!clean || /^(?:check|radio\s+check|comms?\s+check|send\s+(?:a\s+)?(?:radio\s+)?message|radio\s+message|radio|message)$/i.test(clean)) {
    if (isBroadcast) {
      return `Squad comms check. Voice network online, telemetry operational. Standing by. Over.`;
    } else {
      return `Comms check for ${targetName}. Voice link online, standing by. Over.`;
    }
  }

  clean = clean.charAt(0).toUpperCase() + clean.slice(1);
  if (!clean.endsWith('.')) clean += '.';

  return `${clean}${etaEn} Over.`;
}

export function extractSquadArgs(text) {
  const rawInput = (text || '').trim();
  const lower = rawInput.toLowerCase();
  const recipients = [];

  // 1. Check for explicit broadcast keywords
  const isBroadcast = /\b(everyone|everybody|all units|all squad|the squad|squad|broadcast|mindenki|mindenkinek|csapat|csapatnak)\b/i.test(lower);

  if (!isBroadcast) {
    // Check known accounts for explicit mention
    const accounts = getAccounts().filter(account => account.isCustom);
    for (const acc of accounts) {
      const phrases = [acc.name, ...(acc.aliases || [])];
      if (phrases.some(phrase => {
        const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return new RegExp(`\\b${escaped}\\b`, 'i').test(lower);
      })) {
        if (!recipients.includes(acc.name)) recipients.push(acc.name);
      }
    }

    // Fuzzy fallback if still empty: strip dispatch trigger words so "send", "radio", "message" do not trigger false matches
    if (recipients.length === 0) {
      const cleanedForPersonMatch = lower
        .replace(/\b(send|a|radio|message|to|tell|ping|notify|küldj|egy|üzenetet|rádióüzenetet|szólj|mondd)\b/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      if (cleanedForPersonMatch) {
        const personMatch = matchBestPerson(cleanedForPersonMatch);
        if (personMatch) {
          recipients.push(personMatch.account.name);
        }
      }
    }
  }

  // If still empty or broadcast explicitly requested
  if (recipients.length === 0 || isBroadcast) {
    recipients.length = 0;
    recipients.push('All Squad');
  }

  // 2. Extract ETA
  let eta = null;
  const etaMatch = lower.match(/(\d+)\s*(min|minute|perc)/i);
  if (etaMatch) eta = parseInt(etaMatch[1]);

  // 3. Extract pure message payload by stripping all leading dispatch trigger phrases
  let payload = rawInput;

  // Strip English dispatch triggers before extracting the message payload.
  payload = payload.replace(/^(?:please\s+)?(?:send\s+(?:a\s+)?(?:radio\s+)?message(?:\s+to)?|send\s+radio(?:\s+to)?|radio(?:\s+to)?|tell|ping(?:\s+squad)?|message|notify)\s*/i, '');
  // Strip Hungarian triggers: "küldj egy rádióüzenetet...", "mondd meg...", "szólj..."
  payload = payload.replace(/^(?:kérlek\s+)?(?:küldj\s+(?:egy\s+)?(?:rádió)?üzenetet|küldj\s+rádióüzenetet|rádiózz|mondd\s+meg|szólj|üzend\s+meg|üzenj)\s*/i, '');

  // Strip recipient name or squad from start of payload if present
  const accounts = getAccounts().filter(account => account.isCustom);
  const allTargets = [
    'everyone', 'everybody', 'all squad', 'all units', 'all', 'the squad', 'squad',
    'mindenki', 'mindenkinek', 'csapat', 'csapatnak',
    ...accounts.flatMap(account => [
      account.name.toLowerCase(),
      normalizeText(account.name),
      ...(account.aliases || []).map(normalizeText),
    ])
  ];
  allTargets.sort((a, b) => b.length - a.length);

  const targetRegexPart = allTargets.filter(Boolean).map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  const recipientPrefixRegex = new RegExp(
    `^(?:to\\s+|a\\s+|az\\s+)?(?:${targetRegexPart})(?:nak|nek|hoz|hez|höz)?(?:\\s+and\\s+[a-z0-9]+)?(?:\\s*(?:that|hogy|:|,))?\\s*`,
    'i'
  );
  payload = payload.replace(recipientPrefixRegex, '').trim();
  payload = payload.replace(/^(?:that|hogy|:|,)\s*/i, '').trim();

  // 4. Format dispatch message using the extracted payload
  const formattedText = formatRadioMessage(payload, recipients, eta);

  return {
    recipients,
    isBroadcast: recipients.includes('All Squad'),
    message: formattedText,
    rawMessage: payload || formattedText,
    text: formattedText,
    textEn: formattedText,
    eta
  };
}
