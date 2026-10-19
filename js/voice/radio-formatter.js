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

  // 0. If payload is empty or only contains trigger words (e.g. user just said "send a radio message" or "radio check")
  if (!text || /^(?:check|radio\s+check|send\s+(?:a\s+)?(?:radio\s+)?message|radio\s+message|radio|message|üzenet|rádióüzenet)$/i.test(text)) {
    if (isBroadcast) {
      return `Squad radio check. Transceiver online, telemetry operational. Standing by. Over.`;
    } else {
      return `Radio check for ${targetName}. Transceiver online, standing by for traffic. Over.`;
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

  // 4. Hazard alert (checked first so "ice near hut" or "watch out" takes precedence)
  if (/ice|icy|jeg|jég|wind|szél|szel|fog|köd|kod|caution|vigyáz|vigyazz|hazard|watch out|look out/i.test(lower)) {
    const destStrEn = targetNodeNameEn ? ` near ${targetNodeNameEn}` : '';
    return `Caution to all squad units: Hazard and icy surface reported${destStrEn}. Reduce speed and stay visible. Over.`;
  }

  // 5. Check for Rendezvous / Meeting at station
  if (/meet|találkoz|talalkoz|rendezvous|várj|varj|waiting|see you|\bhuts?\b|hütt|hutte|\bstations?\b|állomás|allomas|lodge/i.test(lower) && targetNodeNameEn) {
    const trailPhraseEn = trailEn ? ` Descending via ${trailEn}.` : '';
    return `Squad rendezvous at ${targetNodeNameEn}.${trailPhraseEn}${etaEn} Over.`;
  }

  // 6. Check for taking trail / descending
  if (trailEn || /taking|heading|going down|ereszked|csúsz|csusz|megyek|jövök|jovok|tartok/i.test(lower)) {
    const trailStrEn = trailEn || 'the marked run';
    const destStrEn = targetNodeNameEn ? ` towards ${targetNodeNameEn}` : '';
    return `Descending via ${trailStrEn}${destStrEn}.${etaEn} Proceeding with caution. Over.`;
  }

  // 7. Status check / check-in
  if (/status|helyzet|hol vagytok|where are|ready|kész|kesz|radio check/i.test(lower)) {
    return `Squad radio check. Transceiver online, telemetry operational. Standing by for position report. Over.`;
  }

  // 8. General clean-up fallback
  let clean = text;
  clean = clean
    .replace(/^(?:please\s+)?(?:send\s+(?:a\s+)?(?:radio\s+)?message(?:\s+to)?|send\s+radio(?:\s+to)?|radio(?:\s+to)?|tell|ping(?:\s+squad)?|message|notify)\s*/i, '')
    .replace(/^(?:kérlek\s+)?(?:küldj\s+(?:egy\s+)?(?:rádió)?üzenetet|küldj\s+rádióüzenetet|rádiózz|mondd\s+meg|szólj|üzend\s+meg|üzenj)\s*/i, '')
    .trim();

  // Strip trailing over/vétel if user already said it
  clean = clean.replace(/\s*\b(over|vétel|vetel)\b\.?\s*$/gi, '').trim();

  if (!clean || /^(?:check|radio\s+check|send\s+(?:a\s+)?(?:radio\s+)?message|radio\s+message|radio|message)$/i.test(clean)) {
    if (isBroadcast) {
      return `Squad radio check. Transceiver online, telemetry operational. Standing by. Over.`;
    } else {
      return `Radio check for ${targetName}. Transceiver online, standing by for traffic. Over.`;
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
    const accounts = getAccounts();
    for (const acc of accounts) {
      const nameLower = acc.name.toLowerCase();
      if (new RegExp('\\b' + nameLower + '\\b', 'i').test(lower)) {
        if (!recipients.includes(acc.name)) recipients.push(acc.name);
      }
    }

    // Check common squad aliases
    if (/ren[aá]t[oó]/i.test(lower) && !recipients.includes('Renato')) recipients.push('Renato');
    if (/kajti/i.test(lower) && !recipients.includes('Kajti')) recipients.push('Kajti');
    if (/patrol|hegyiment|ment[oö]k/i.test(lower) && !recipients.includes('Ski Patrol')) recipients.push('Ski Patrol');

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

  // Strip English triggers: "send a radio message to Renato that...", "radio David...", "tell everyone..."
  payload = payload.replace(/^(?:please\s+)?(?:send\s+(?:a\s+)?(?:radio\s+)?message(?:\s+to)?|send\s+radio(?:\s+to)?|radio(?:\s+to)?|tell|ping(?:\s+squad)?|message|notify)\s*/i, '');
  // Strip Hungarian triggers: "küldj egy rádióüzenetet...", "mondd meg...", "szólj..."
  payload = payload.replace(/^(?:kérlek\s+)?(?:küldj\s+(?:egy\s+)?(?:rádió)?üzenetet|küldj\s+rádióüzenetet|rádiózz|mondd\s+meg|szólj|üzend\s+meg|üzenj)\s*/i, '');

  // Strip recipient name or squad from start of payload if present
  const accounts = getAccounts();
  const allTargets = [
    'everyone', 'everybody', 'all squad', 'all units', 'all', 'the squad', 'squad',
    'mindenki', 'mindenkinek', 'csapat', 'csapatnak',
    'ski patrol', 'patrol', 'hegyimentők', 'hegyimento',
    'renato', 'renátó', 'kajti', 'benedek', 'bende',
    ...accounts.flatMap(a => [a.name.toLowerCase(), normalizeText(a.name)])
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

