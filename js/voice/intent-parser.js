/* ═══════════════════════════════════════════════════════════════════
   intent-parser.js — Alpine Command Intent Classification & Argument Extraction
   ═══════════════════════════════════════════════════════════════════ */

import { nodes } from '../data/resort-graph.js';
import { squad } from '../data/accounts.js';
import { resolveNodeName, matchBestPerson } from '../data/fuzzy-matcher.js';

// Classify voice intent from spoken transcript
export function classifyIntent(text) {
  const lower = (text || '').toLowerCase().trim();
  if (!lower) return 'unknown';

  // 1. Clear SOS / Dismiss beacon
  if (/\b(cancel\s*sos|clear\s*sos|dismiss\s*sos|dismiss\s*emergency|false\s*alarm|i'?m\s*fine|i'?m\s*ok|minden\s*rendben)\b/i.test(lower)) {
    return 'clearSOS';
  }

  // 2. Emergency SOS / MAYDAY (highest priority for genuine distress)
  // Ensure "send a message to ski patrol" or "radio ski patrol" is NOT treated as an SOS crash
  const isRadioMessage = /\b(send\s+(?:a\s+|an\s+|the\s+)?(?:radio\s+)?message|send\s+radio|send\s+message|message|radio|tell|küldj\s+(?:egy\s+)?(?:rádió)?üzenetet)\b/i.test(lower);
  const hasGenuineEmergency = /\b(mayday|emergency|crash|crashed|injured|injury|broken|broke|twisted|bleeding|rescue|help\s*me)\b/i.test(lower);

  const isExplicitDistress = /\b(mayday\s*mayday|mayday|sos|emergency\s*beacon|medical\s*emergency)\b/i.test(lower) ||
    (!isRadioMessage && /\b(call\s*ski\s*patrol|need\s*ski\s*patrol|send\s*ski\s*patrol|send\s*rescue|need\s*rescue)\b/i.test(lower));
  const isSevereInjury = /\b(i\s*crashed|crashed\s*off|broke\s*my|twisted\s*my|twisted\s*knee|severe\s*injury|serious\s*injury)\b/i.test(lower);
  const isEmergencyHelp = /\b(send\s*help|need\s*help|help\s*me)\b/i.test(lower) && /\b(patrol|rescue|crash|crashed|injured|bleeding|broken|chute)\b/i.test(lower);

  if ((isExplicitDistress || isSevereInjury || isEmergencyHelp) && (!isRadioMessage || hasGenuineEmergency)) {
    return 'triggerSOS';
  }

  // 3. Squad Comms / Radio Message Dispatch (high priority)
  // Any phrase starting with "send a message", "tell", "radio", etc. or dispatching a message
  // MUST immediately return pingSquad. It must NEVER trigger locateEntity, checkConditions, or planSkiRoute!
  const isMessageDispatch =
    /^(?:please\s+)?(?:send\s+(?:a\s+|an\s+|the\s+|any\s+)?(?:radio\s+)?message|send\s+radio|send\s+message|radio\b|tell\b|message\b|ping\b|notify\b|inform\b|küldj\b|szólj\b|üzend\b)/i.test(lower) ||
    /\b(send\s+(?:a\s+|an\s+|the\s+|any\s+)?(?:radio\s+)?message|send\s+message|radio\s+message|radio\s+check|ping\s*squad|message\s*squad|radio\s*squad)\b/i.test(lower) ||
    /\b(küldj\s+(?:egy\s+)?(?:rádió)?üzenetet|küldj\s+üzenetet|küldj\s+rádióüzenetet|küldj\s+rádiót|rádiózz)\b/i.test(lower);

  if (isMessageDispatch) {
    return 'pingSquad';
  }

  // 4. Route planning (evaluated before general conditions so "route avoiding ice" routes)
  if (/\b(route|navigate|take\s*me|go\s*to|get\s*to|how\s*(?:do\s*i|doi\s*i|can\s*i|to)\s*(?:get|reach|go|ski)|way\s*to|path\s*to|guide\s*me|direction|avoid|lead\s*me|head\s*to|ski\s*to|interception|útvonal|vigyél|menjünk)\b/i.test(lower)) {
    return 'planSkiRoute';
  }

  // 5. Conditions / Weather / Lift Status check
  // Matches explicit inquiries about weather, snow conditions, blizzards, wind, lifts, or telemetry
  const isWeatherInquiry =
    /\b(check|how('s| is| are)|what('s| is| are)|report|tell\s+me\s+about|info\s+(?:on|about)|show)\b.*\b(conditions?|weather|winds?|visibility|lifts?|snow|ice|icy|temperature|temp|blizzard|telemetry|forecast|időjárás|viszonyok|hóhelyzet)\b/i.test(lower) ||
    /\b(is\s+there\s+(?:a\s+)?blizzard|blizzard\s+alert|blizzard\s+status|are\s+lifts?\s+running|is\s+(?:the\s+)?(?:south\s+)?lift\s+(?:open|closed)|lifts?\s+status|lift\s+open|lift\s+closed|weather\s+report|snow\s+report|telemetry\s+report)\b/i.test(lower) ||
    /^(?:check\s+)?(?:conditions?|weather|telemetry|forecast|időjárás|viszonyok|hóhelyzet)\.?$/i.test(lower) ||
    /\b(check\s+conditions|check\s+weather|check\s+lifts?|check\s+snow|check\s+telemetry)\b/i.test(lower);

  if (isWeatherInquiry) {
    return 'checkConditions';
  }

  // 6. Locate / Where is / Find query
  // Explicit safety: Any message dispatch is strictly forbidden from reaching locateEntity
  if (!isMessageDispatch && /\b(where\s*(?:is|are|am|was)|locate|find|position\s*of|who\s*is\s*at|status\s*of|tell\s*me\s*about|info\s*(?:on|about)|hol\s*(?:van|vannak|jár)|merre\s*(?:van|jár)|hol\s*találom|helyzete|státusza|mit\s*csinál|mi\s*a\s*helyzet)\b/i.test(lower)) {
    return 'locateEntity';
  }

  // Direct person inquiry check using fuzzy phonetic matching against registered skiers
  // Never locate a person when dispatching a message to them
  if (!isMessageDispatch) {
    const personMatch = matchBestPerson(lower);
    if (personMatch) {
      return 'locateEntity';
    }
  }

  // Squad overview inquiry (explicitly requires an inquiry or standalone squad inquiry)
  if (!isMessageDispatch && (
    /\b(where\s*(?:is|are)\s*(?:the\s*)?(?:squad|team|everyone|everybody)|hol\s*van\s*(?:a\s*)?(?:csapat|mindenki)|csapat\s*helyzete)\b/i.test(lower) ||
    /^(?:squad|team|everyone|everybody|csapat|többiek|összesen)\.?$/i.test(lower)
  )) {
    return 'locateEntity';
  }

  // Fallback: try route if "to" + destination mentioned
  if (!isMessageDispatch && /\bto\b/i.test(lower)) {
    const dest = resolveNodeName(lower);
    if (dest) return 'planSkiRoute';
  }

  return 'unknown';
}

export function extractRouteArgs(text) {
  const lower = (text || '').toLowerCase();
  const args = {
    from: null,
    to: null,
    avoidBlack: false,
    avoidIce: false,
    targetPerson: null,
  };

  // Detect from
  const fromMatch = lower.match(/(?:from|at|i'm at|i am at|starting at)\s+([a-z\s]+?)(?:\.|,|$|\band\b|\bto\b|\bavoiding\b)/i);
  if (fromMatch) {
    args.from = resolveNodeName(fromMatch[1].trim());
  }
  // Default from: current player location
  if (!args.from) {
    args.from = squad.you?.currentNode || 'glacierPeak';
  }

  // Detect person in route query using fuzzy matching
  const personMatch = matchBestPerson(lower);
  if (personMatch) {
    args.targetPerson = personMatch.account.name;
    args.to = resolveNodeName(personMatch.account.id);
  }

  // Detect explicit destination with "to" or "reach"
  if (!args.to) {
    const toMatch = lower.match(/(?:to|toward|towards|reach|get\s*to|lead\s*me\s*to|take\s*me\s*to|ski\s*to)\s+([a-z\s]+?)(?:\.|,|$|\band\b|\bavoiding\b)/i);
    if (toMatch) {
      args.to = resolveNodeName(toMatch[1].trim());
    }
  }

  // If still no destination, scan entire phrase with resolveNodeName
  if (!args.to) {
    args.to = resolveNodeName(lower);
  }

  // Avoid flags
  if (/avoid.*black|no black|skip.*black|easy.*route|safe.*route|tired/i.test(lower)) {
    args.avoidBlack = true;
  }
  if (/avoid.*ice|no ice|skip.*ice/i.test(lower)) {
    args.avoidIce = true;
  }

  return args;
}

export function extractSOSArgs(text) {
  const lower = (text || '').toLowerCase();
  let location = 'avalancheChute';
  const loc = resolveNodeName(lower);
  if (loc) location = loc;

  let injury = 'unknown injury';
  if (/knee/i.test(lower)) injury = 'twisted knee';
  else if (/leg/i.test(lower)) injury = 'leg injury';
  else if (/arm/i.test(lower)) injury = 'arm injury';
  else if (/head/i.test(lower)) injury = 'head injury';
  else if (/back/i.test(lower)) injury = 'back injury';
  else if (/crash/i.test(lower)) injury = 'crash — assessing injuries';

  return { location, injury };
}

export function extractConditionsArgs(text) {
  const lower = (text || '').toLowerCase();
  let sector = null;
  const loc = resolveNodeName(lower);
  if (loc) sector = nodes[loc]?.name || null;
  if (/south.*lift|bowl lift/i.test(lower)) sector = 'South Bowl Lift';
  return { sector };
}

