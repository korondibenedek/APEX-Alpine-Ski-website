/* ═══════════════════════════════════════════════════════════════════
   intent-parser.js — Alpine Command Intent Classification & Argument Extraction
   ═══════════════════════════════════════════════════════════════════ */

import { nodes } from '../data/resort-graph.js';
import { squad } from '../data/accounts.js';
import { resolveNodeName, matchBestPerson } from '../data/fuzzy-matcher.js';

// Classify voice intent from spoken transcript
export function classifyIntent(text) {
  const lower = (text || '').toLowerCase().trim();

  // Emergency SOS / MAYDAY (highest priority)
  const isExplicitDistress = /\b(mayday\s*mayday|mayday|sos|emergency\s*beacon|call\s*ski\s*patrol|need\s*ski\s*patrol|send\s*ski\s*patrol|send\s*rescue|need\s*rescue|medical\s*emergency)\b/i.test(lower);
  const isSevereInjury = /\b(i\s*crashed|crashed\s*off|broke\s*my|twisted\s*my|twisted\s*knee|severe\s*injury|serious\s*injury)\b/i.test(lower);
  const isEmergencyHelp = /\b(send\s*help|need\s*help|help\s*me)\b/i.test(lower) && /\b(patrol|rescue|crash|crashed|injured|bleeding|broken|chute)\b/i.test(lower);

  if (isExplicitDistress || isSevereInjury || isEmergencyHelp) {
    return 'triggerSOS';
  }

  // Conditions / Weather / Lift Status check
  if (/\b(conditions?|weather|winds?|visibility|lifts?|open|closed|status|snow|ice|icy|temperature|temp|blizzard|forecast|telemetry|időjárás|viszonyok|hóhelyzet)\b/i.test(lower)) {
    return 'checkConditions';
  }

  if (/\b(check|how('s| is| are)|what('s| is| are)|report)\b/i.test(lower) && /\b(mountain|sector|peak|base|summit|run|slope)\b/i.test(lower)) {
    return 'checkConditions';
  }

  // Locate / Where is / Find query
  if (/\b(where\s*(is|are|am)|locate|find|position\s*of|who\s*is\s*at|hol\s*van)\b/i.test(lower)) {
    return 'locateEntity';
  }

  // Squad comms (explicit radio / message sending)
  if (/\b(tell|radio|ping\s*squad|message\s*squad|notify|send\s*message|üzenet|mondd|szólj|üzend)\b/i.test(lower)) {
    return 'pingSquad';
  }

  // Route planning
  if (/\b(route|navigate|take\s*me|go\s*to|get\s*to|how\s*(do\s*i|doi\s*i|can\s*i|to)\s*(get|reach|go|ski)|way\s*to|path\s*to|guide\s*me|direction|avoid|lead\s*me|head\s*to|ski\s*to|interception|útvonal|vigyél|menjünk)\b/i.test(lower)) {
    return 'planSkiRoute';
  }

  // Direct person inquiry check using fuzzy phonetic matching against registered skiers
  const personMatch = matchBestPerson(lower);
  if (personMatch) {
    return 'locateEntity';
  }

  // Hungarian locate patterns
  if (/\b(where\s*(is|are|am|was)|locate|find|position\s*of|who\s*is\s*at|status\s*of|tell\s*me\s*about|info\s*(on|about)|hol\s*(van|vannak|jár)|merre\s*(van|jár)|hol\s*találom|helyzete|státusza|mit\s*csinál|mi\s*a\s*helyzet)\b/i.test(lower)) {
    return 'locateEntity';
  }

  // Squad overview inquiry
  if (/\b(squad|team|everyone|everybody|csapat|többiek|összesen)\b/i.test(lower)) {
    return 'locateEntity';
  }

  // Fallback: try route if "to" + destination mentioned
  if (/\bto\b/i.test(lower)) {
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

