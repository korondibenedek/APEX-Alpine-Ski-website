/* ═══════════════════════════════════════════════════════════════════
   fuzzy-matcher.js — Phonetic & Fuzzy Name & Location Matching
   ═══════════════════════════════════════════════════════════════════ */

import { nodes, edges } from './resort-graph.js';
import { getAccounts, getActiveAccount, getCurrentAccountId, squad } from './accounts.js';

export function normalizeText(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove accents (á->a, é->e, etc.)
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Fast Levenshtein distance
export function levenshtein(a, b) {
  const al = a.length, bl = b.length;
  if (al === 0) return bl;
  if (bl === 0) return al;
  const row = new Array(bl + 1);
  for (let j = 0; j <= bl; j++) row[j] = j;
  for (let i = 1; i <= al; i++) {
    let prev = i - 1;
    row[0] = i;
    const ac = a.charCodeAt(i - 1);
    for (let j = 1; j <= bl; j++) {
      const cur = row[j];
      const cost = (ac === b.charCodeAt(j - 1)) ? 0 : 1;
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + cost);
      prev = cur;
    }
  }
  return row[bl];
}

// Normalized similarity (0.0 to 1.0)
export function similarity(s1, s2) {
  if (!s1 || !s2) return 0;
  const a = normalizeText(s1), b = normalizeText(s2);
  if (a === b) return 1.0;
  if (a.includes(b) || b.includes(a)) {
    const minL = Math.min(a.length, b.length), maxL = Math.max(a.length, b.length);
    if (minL >= 3 && minL / maxL >= 0.7) return 0.95;
    return minL / maxL;
  }
  const dist = levenshtein(a, b);
  const maxL = Math.max(a.length, b.length);
  return Math.max(0, 1 - dist / maxL);
}

// Pre-configured phonetic aliases for alpine crew to bridge English ASR on Hungarian/European names
export const KNOWN_PERSON_ALIASES = {
  kajti: [
    'kajti', 'kaity', 'kaiti', 'kitey', 'kyte', 'kite', 'katie', 'katee',
    'kyti', 'cajti', 'caiti', 'kayti', 'kaitie', 'kity', 'kajty', 'kajto', 'keiti', 'kathy'
  ],
  renato: [
    'renato', 'renata', 'renate', 'renado', 'renault', 'ranato', 'ronato',
    'reynato', 'renatto', 'renat', 'renáto', 'renátó', 'reynaldo'
  ],
  benedek: [
    'benedek', 'benedict', 'benedic', 'benedec', 'benedeck', 'benedik',
    'benedick', 'bende', 'bennedek', 'benedet', 'benji', 'benci'
  ],
  patrol: [
    'patrol', 'petrol', 'patrole', 'ski patrol', 'rescue', 'medic', 'doctor',
    'hegyimento', 'hegyimentő', 'mentok', 'mentők', 'orvos', 'doktor', 'mentő'
  ]
};

// Reserved command and preposition words that must never falsely match skier names
export const RESERVED_WORDS = new Set([
  'send', 'radio', 'message', 'tell', 'ping', 'route', 'navigate', 'locate',
  'find', 'where', 'how', 'who', 'what', 'which', 'when', 'help', 'mayday',
  'squad', 'team', 'everyone', 'everybody', 'all', 'units', 'to', 'at', 'in', 'on',
  'with', 'from', 'a', 'the', 'is', 'are', 'and', 'that', 'this', 'for', 'of',
  'kuldj', 'kuldje', 'uzenet', 'radiouzenet', 'szolj', 'mondd', 'uzend', 'hol', 'merre'
]);

// Compare input text tokens against all registered skiers on the mountain
// and resolve to the closest match ("amelyikre a legjobban hajaz")
export function matchBestPerson(inputText, minThreshold = 0.65) {
  if (!inputText) return null;
  const clean = normalizeText(inputText);
  const tokens = clean.split(' ').filter(t => t.length > 1);
  if (tokens.length === 0) return null;

  // Generate single words and 2-word bigrams from the query
  const phrases = [...tokens];
  for (let i = 0; i < tokens.length - 1; i++) {
    phrases.push(tokens[i] + ' ' + tokens[i + 1]);
  }

  let bestAccount = null;
  let bestScore = 0;
  let bestMatchedTerm = '';

  const accounts = getAccounts();
  for (const acc of accounts) {
    const baseNorm = normalizeText(acc.name);
    const nameParts = baseNorm.split(' ').filter(p => p.length > 1);
    const aliases = new Set([
      baseNorm,
      acc.id,
      ...nameParts,
      ...(KNOWN_PERSON_ALIASES[acc.id] || []),
      ...(KNOWN_PERSON_ALIASES[baseNorm] || []),
    ]);

    // Add common Hungarian case suffixes for each name part
    nameParts.forEach(p => {
      ['nak', 'nek', 'hoz', 'hez', 'val', 'vel', 'tol', 'tel', 'on', 'en', 'ot', 'et', 't'].forEach(suf => {
        aliases.add(p + suf);
      });
    });

    for (const phrase of phrases) {
      if (RESERVED_WORDS.has(phrase)) continue;

      for (const alias of aliases) {
        let score = 0;
        if (phrase === alias) {
          score = 1.0;
        } else if (phrase.includes(alias) || alias.includes(phrase)) {
          const minL = Math.min(phrase.length, alias.length);
          const maxL = Math.max(phrase.length, alias.length);
          if (minL >= 3 && minL / maxL >= 0.7) score = 0.95;
          else score = minL / maxL;
        } else {
          const maxL = Math.max(phrase.length, alias.length);
          const dist = levenshtein(phrase, alias);
          if (maxL <= 5 && dist > 1) {
            score = 0; // Short words must have at most 1 edit distance
          } else {
            score = Math.max(0, 1 - dist / maxL);
          }
        }

        if (score > bestScore) {
          bestScore = score;
          bestAccount = acc;
          bestMatchedTerm = phrase;
        }
      }
    }
  }

  if (bestScore >= minThreshold) {
    return { account: bestAccount, score: bestScore, matchedTerm: bestMatchedTerm };
  }
  return null;
}

// Node & Target Location Resolution
export function resolveNodeName(text) {
  if (!text) return null;
  const lower = text.toLowerCase().trim();

  // 1. Station name keyword mappings (sorted by length descending for exact matches)
  const mappings = {
    'fővölgyi bázisállomás': 'mainValleyBase',
    'eagle középállomás': 'eagleMid',
    'avalanche chute': 'avalancheChute',
    'eagle mid-station': 'eagleMid',
    'eagle mid station': 'eagleMid',
    'main valley base': 'mainValleyBase',
    'south bowl lift': 'southBowlLift',
    'lavina-hasadék': 'avalancheChute',
    'glacier peak': 'glacierPeak',
    'panorama hut': 'panoramaHut',
    'panoráma hütte': 'panoramaHut',
    'bázisállomás': 'mainValleyBase',
    'középállomás': 'eagleMid',
    'gleccsercsúcs': 'glacierPeak',
    'gerincugrató': 'ridgeDrop',
    'déli katlan': 'southBowlLift',
    'fenyves erdő': 'pineForest',
    'ridge drop': 'ridgeDrop',
    'pine forest': 'pineForest',
    'mid station': 'eagleMid',
    'mid-station': 'eagleMid',
    'midstation': 'eagleMid',
    'valley base': 'mainValleyBase',
    'south bowl': 'southBowlLift',
    'south lift': 'southBowlLift',
    'bowl lift': 'southBowlLift',
    'main valley': 'mainValleyBase',
    'hütténél': 'panoramaHut',
    'huttenel': 'panoramaHut',
    'hüttéhez': 'panoramaHut',
    'huttehez': 'panoramaHut',
    'hüttében': 'panoramaHut',
    'hüttebe': 'panoramaHut',
    'avalanche': 'avalancheChute',
    'panorama': 'panoramaHut',
    'restaurant': 'panoramaHut',
    'crossroads': 'pineForest',
    'gleccser': 'glacierPeak',
    'glacier': 'glacierPeak',
    'lavina': 'avalancheChute',
    'summit': 'glacierPeak',
    'forest': 'pineForest',
    'village': 'mainValleyBase',
    'valley': 'mainValleyBase',
    'bottom': 'mainValleyBase',
    'chute': 'avalancheChute',
    'eagle': 'eagleMid',
    'ridge': 'ridgeDrop',
    'trees': 'pineForest',
    'lodge': 'mainValleyBase',
    'south': 'southBowlLift',
    'hütte': 'panoramaHut',
    'hutte': 'panoramaHut',
    'base': 'mainValleyBase',
    'peak': 'glacierPeak',
    'deck': 'panoramaHut',
    'pine': 'pineForest',
    'top': 'glacierPeak',
    'hut': 'panoramaHut'
  };

  // Check station names first (sorted longest to shortest; short tokens require word boundary)
  for (const [key, val] of Object.entries(mappings)) {
    if (key.length <= 4) {
      if (new RegExp('\\b' + key + '\\b', 'i').test(lower)) return val;
    } else {
      if (lower.includes(key)) return val;
    }
  }

  // 2. Resolve squad members using fuzzy matching
  const currentAccountId = getCurrentAccountId();
  const personMatch = matchBestPerson(lower);
  if (personMatch) {
    const acc = personMatch.account;
    if (acc.id === currentAccountId) {
      return squad.you?.currentNode || acc.location || 'glacierPeak';
    }
    const member = squad[acc.id];
    if (member) {
      if (member.currentNode) return member.currentNode;
      if (member.onEdge) {
        const edge = edges.find(e => e.id === member.onEdge);
        if (edge) return edge.to;
      }
    }
    return acc.location || 'mainValleyBase';
  }

  // 3. Generic station resolution ("a station", "nearest station", "the station")
  if (/\b(a\s*station|the\s*station|next\s*station|nearest\s*station|station)\b/i.test(lower)) {
    const cur = squad.you?.currentNode || 'glacierPeak';
    if (cur === 'glacierPeak') return 'eagleMid';
    if (cur === 'eagleMid') return 'panoramaHut';
    if (cur === 'panoramaHut') return 'southBowlLift';
    return 'mainValleyBase';
  }

  return null;
}

// Locate Entity (Person or Station)
export function locateEntity(query) {
  if (!query) query = '';
  const lower = query.toLowerCase().trim();
  const currentAccountId = getCurrentAccountId();
  const accounts = getAccounts();

  // 1. Current User (You / Me / Where am I / Hol vagyok)
  if (/where am i|who am i|myself|my position|hol vagyok|hol allok/i.test(normalizeText(lower))) {
    const active = getActiveAccount();
    const node = nodes[active.location] || nodes.glacierPeak;
    return {
      type: 'person',
      id: active.id,
      name: `${active.name} (You)`,
      role: active.role,
      color: '#39ff14',
      avatar: active.avatar || '🎿',
      nodeId: node.id,
      nodeName: node.name,
      altitude: node.altitude,
      status: active.status || `At ${node.name} (${node.altitude}m)`,
      description: `Your GPS position is confirmed at ${node.name}, altitude ${node.altitude} meters. Transceiver active, squad telemetry linked.`,
    };
  }

  // 2. Explicit Squad Overview (only if user explicitly asked about the team/squad/everyone)
  if (/\b(squad|team|everyone|everybody|all|csapat|többiek|tobbiek|összesen|osszesen)\b/i.test(lower)) {
    const active = getActiveAccount();
    const others = accounts.filter(a => a.id !== active.id);
    const squadDesc = others.map(a => {
      const node = nodes[a.location] || nodes.mainValleyBase;
      return `${a.name} is at ${node.name} (${node.altitude}m)`;
    }).join(', ');
    const yourNode = nodes[squad.you?.currentNode || active.location] || nodes.glacierPeak;
    return {
      type: 'squad',
      id: 'squad',
      name: 'Squad Overview',
      description: `Squad update: ${squadDesc}, and you (${active.name}) are at ${yourNode.name} (${yourNode.altitude}m). All radio channels active.`,
    };
  }

  // 3. Best Matching Person using fuzzy phonetic comparison against registered riders
  const personMatch = matchBestPerson(query);
  if (personMatch) {
    const acc = personMatch.account;
    const isYou = acc.id === currentAccountId;
    const targetNodeId = isYou ? (squad.you?.currentNode || acc.location) : (squad[acc.id]?.currentNode || acc.location);
    const node = nodes[targetNodeId] || nodes[acc.location] || nodes.mainValleyBase;
    const isKajtiCarving = acc.id === 'kajti' && acc.onEdge;
    const alt = isKajtiCarving ? 2000 : node.altitude;
    const locName = isKajtiCarving ? 'Red Run 4 (towards South Bowl)' : node.name;
    const statusText = acc.status || `Active at ${locName} (${alt}m)`;
    const desc = isYou
      ? `Your GPS position is confirmed at ${locName}, altitude ${alt} meters. Transceiver active, squad telemetry linked.`
      : `${acc.name} (${acc.role || 'Rider'}) is located at ${locName}, elevation ${alt} meters. Status: ${statusText}. Transceiver channel link is 100% with strong telemetry.`;

    return {
      type: 'person',
      id: acc.id,
      name: isYou ? `${acc.name} (You)` : acc.name,
      role: acc.role || 'Rider',
      color: isYou ? '#39ff14' : (acc.color || '#00e5ff'),
      avatar: acc.avatar || '🎿',
      nodeId: node.id,
      nodeName: locName,
      altitude: alt,
      status: statusText,
      description: desc,
    };
  }

  // 4. Specific mountain station or sector
  const nodeId = resolveNodeName(lower);
  if (nodeId && nodes[nodeId]) {
    const node = nodes[nodeId];
    return {
      type: 'station',
      id: node.id,
      name: node.name,
      altitude: node.altitude,
      nodeId: node.id,
      nodeName: node.name,
      description: `${node.name} is situated at altitude ${node.altitude} meters in Sector ${node.name.slice(0, 1)}. Target sector highlighted on your map.`,
    };
  }

  // 5. Target unknown fallback
  return {
    type: 'unknown',
    id: 'unknown',
    name: 'Target Unknown',
    description: `Rider or station not found on radar. You can ask for Kajti, Renato, Benedek, Ski Patrol, or any registered squad member or sector.`,
  };
}

