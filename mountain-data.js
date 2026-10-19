/* ═══════════════════════════════════════════════════════════════════
   mountain-data.js — Mount Apex Ski Resort Graph & Pathfinding
   ═══════════════════════════════════════════════════════════════════ */

const MountainData = (() => {
  // ── Node Definitions ──────────────────────────────────────────────
  // SVG coordinates tuned for the 900×680 viewBox
  const nodes = {
    glacierPeak: {
      id: 'glacierPeak',
      name: 'Glacier Peak',
      altitude: 3200,
      x: 420, y: 60,
      icon: '⛰️',
    },
    ridgeDrop: {
      id: 'ridgeDrop',
      name: 'Ridge Drop',
      altitude: 2950,
      x: 280, y: 150,
      icon: '🏔️',
    },
    avalancheChute: {
      id: 'avalancheChute',
      name: 'Avalanche Chute',
      altitude: 2600,
      x: 680, y: 190,
      icon: '⚠️',
    },
    eagleMid: {
      id: 'eagleMid',
      name: 'Eagle Mid-Station',
      altitude: 2400,
      x: 380, y: 290,
      icon: '🦅',
    },
    panoramaHut: {
      id: 'panoramaHut',
      name: 'Panorama Hut',
      altitude: 2200,
      x: 600, y: 350,
      icon: '🏠',
    },
    pineForest: {
      id: 'pineForest',
      name: 'Pine Forest Crossroads',
      altitude: 1950,
      x: 250, y: 430,
      icon: '🌲',
    },
    southBowlLift: {
      id: 'southBowlLift',
      name: 'South Bowl Lift',
      altitude: 1800,
      x: 550, y: 490,
      icon: '🚡',
    },
    mainValleyBase: {
      id: 'mainValleyBase',
      name: 'Main Valley Base',
      altitude: 1500,
      x: 400, y: 610,
      icon: '🏘️',
    },
  };

  // ── Edge Definitions ──────────────────────────────────────────────
  // difficulty: blue | red | black
  // type: run | lift
  // weight: traversal cost (lower = faster/easier)
  const edges = [
    // From Glacier Peak
    {
      id: 'e1', from: 'glacierPeak', to: 'ridgeDrop',
      name: 'Black Run 1', difficulty: 'black', type: 'run', weight: 5,
      waypoints: [[380, 90], [330, 120]],
    },
    {
      id: 'e2', from: 'glacierPeak', to: 'eagleMid',
      name: 'Blue Run 1', difficulty: 'blue', type: 'run', weight: 3,
      waypoints: [[410, 120], [400, 200]],
    },
    {
      id: 'e3', from: 'glacierPeak', to: 'avalancheChute',
      name: 'Black Run 2', difficulty: 'black', type: 'run', weight: 7,
      waypoints: [[490, 80], [580, 130], [660, 170]],
    },
    // From Ridge Drop
    {
      id: 'e4', from: 'ridgeDrop', to: 'eagleMid',
      name: 'Red Run 1', difficulty: 'red', type: 'run', weight: 4,
      waypoints: [[290, 200], [340, 250]],
    },
    {
      id: 'e5', from: 'ridgeDrop', to: 'pineForest',
      name: 'Blue Run 2', difficulty: 'blue', type: 'run', weight: 4,
      waypoints: [[270, 220], [260, 320], [252, 390]],
    },
    // From Avalanche Chute
    {
      id: 'e6', from: 'avalancheChute', to: 'panoramaHut',
      name: 'Red Run 2', difficulty: 'red', type: 'run', weight: 5,
      waypoints: [[670, 240], [650, 290], [620, 330]],
    },
    // From Eagle Mid-Station
    {
      id: 'e7', from: 'eagleMid', to: 'panoramaHut',
      name: 'Blue Run 3', difficulty: 'blue', type: 'run', weight: 3,
      waypoints: [[430, 310], [510, 330], [570, 345]],
    },
    {
      id: 'e8', from: 'eagleMid', to: 'pineForest',
      name: 'Red Run 3', difficulty: 'red', type: 'run', weight: 4,
      waypoints: [[350, 330], [310, 380], [270, 415]],
    },
    // From Panorama Hut
    {
      id: 'e9', from: 'panoramaHut', to: 'southBowlLift',
      name: 'Red Run 4', difficulty: 'red', type: 'run', weight: 3,
      waypoints: [[590, 400], [570, 450]],
    },
    // From Pine Forest
    {
      id: 'e10', from: 'pineForest', to: 'mainValleyBase',
      name: 'Blue Run 4', difficulty: 'blue', type: 'run', weight: 3,
      waypoints: [[280, 480], [320, 540], [370, 585]],
    },
    {
      id: 'e11', from: 'pineForest', to: 'southBowlLift',
      name: 'Red Run 5', difficulty: 'red', type: 'run', weight: 4,
      waypoints: [[310, 450], [420, 470], [510, 485]],
    },
    // From South Bowl Lift
    {
      id: 'e12', from: 'southBowlLift', to: 'mainValleyBase',
      name: 'Blue Run 5', difficulty: 'blue', type: 'run', weight: 2,
      waypoints: [[530, 530], [480, 570], [430, 600]],
    },
    // LIFTS (bidirectional in effect: uphill)
    {
      id: 'l1', from: 'mainValleyBase', to: 'eagleMid',
      name: 'Eagle Gondola', difficulty: 'lift', type: 'lift', weight: 2,
      waypoints: [[395, 560], [390, 450], [385, 340]],
    },
    {
      id: 'l2', from: 'southBowlLift', to: 'panoramaHut',
      name: 'South Bowl Chair', difficulty: 'lift', type: 'lift', weight: 2,
      waypoints: [[560, 460], [575, 410], [590, 370]],
    },
    {
      id: 'l3', from: 'eagleMid', to: 'glacierPeak',
      name: 'Summit Cable Car', difficulty: 'lift', type: 'lift', weight: 3,
      waypoints: [[395, 230], [405, 150], [415, 80]],
    },
  ];

  // ── Simulator State ───────────────────────────────────────────────
  const simState = {
    blizzard: false,      // blizzard at Glacier Peak
    liftClosed: false,    // South Bowl Lift closed
    iceBlack: false,      // ice on black runs
  };

  // ── Skier Accounts / Profiles ─────────────────────────────────────
  const availableAccounts = [
    {
      id: 'benedek',
      name: 'Benedek',
      role: 'Team Lead / Alpine Skier',
      color: '#39ff14',
      location: 'glacierPeak',
      status: 'At Summit (3,200m)',
      avatar: '🎿',
    },
    {
      id: 'renato',
      name: 'Renato',
      role: 'Alpine Scout / Radio Lead',
      color: '#ff6f00',
      location: 'panoramaHut',
      status: 'At Hütte Deck (2,200m)',
      avatar: '🏂',
    },
    {
      id: 'kajti',
      name: 'Kajti',
      role: 'Downhill Specialist',
      color: '#e040fb',
      location: 'southBowlLift',
      onEdge: 'e9',
      edgeProgress: 0.45,
      status: 'Carving Red Run 4',
      avatar: '⛷️',
    },
    {
      id: 'patrol',
      name: 'Ski Patrol #4',
      role: 'Mountain Rescue / Medic',
      color: '#ff2d2d',
      location: 'eagleMid',
      status: 'Mid-Station Stationed (2,400m)',
      avatar: '⛑️',
    },
  ];

  let currentAccountId = (typeof localStorage !== 'undefined' && localStorage.getItem('apex_active_account')) || 'benedek';

  // ── Squad Members State ───────────────────────────────────────────
  let squad = {};

  function syncSquadState() {
    const active = availableAccounts.find(a => a.id === currentAccountId) || availableAccounts[0];
    currentAccountId = active.id;

    // Reset squad
    squad = {
      you: {
        id: 'you',
        name: `${active.name} (You)`,
        color: '#39ff14', // High-vis radar green for active player
        currentNode: active.location,
        onEdge: active.onEdge || null,
        edgeProgress: active.edgeProgress || null,
        accountId: active.id,
      }
    };

    // Add other accounts as squad teammates
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
        };
      }
    });
  }

  // Initial sync
  syncSquadState();

  function switchAccount(accId, customName, customSector) {
    if (accId === 'custom' && customName) {
      const cleanName = customName.trim();
      const sector = customSector || 'mainValleyBase';
      const existing = availableAccounts.find(a => a.id === 'custom_' + cleanName.toLowerCase());
      if (existing) {
        existing.location = sector;
        currentAccountId = existing.id;
      } else {
        const newAcc = {
          id: 'custom_' + cleanName.toLowerCase(),
          name: cleanName,
          role: 'Guest Rider',
          color: '#00e5ff',
          location: sector,
          status: `At ${nodes[sector]?.name || 'Sector'}`,
          avatar: '🏂',
        };
        availableAccounts.push(newAcc);
        currentAccountId = newAcc.id;
      }
    } else {
      const match = availableAccounts.find(a => a.id === accId);
      if (match) {
        currentAccountId = match.id;
      }
    }
    try {
      localStorage.setItem('apex_active_account', currentAccountId);
    } catch (e) {}
    syncSquadState();
    return getActiveAccount();
  }

  function getActiveAccount() {
    return availableAccounts.find(a => a.id === currentAccountId) || availableAccounts[0];
  }

  function getAccounts() {
    return [...availableAccounts];
  }

  // ── Adjacency builder ─────────────────────────────────────────────
  function buildAdjacency(opts = {}) {
    const adj = {};
    for (const nid of Object.keys(nodes)) adj[nid] = [];

    for (const edge of edges) {
      // Skip closed lift
      if (edge.type === 'lift' && edge.id === 'l2' && simState.liftClosed) continue;

      // Skip black runs if avoidBlack
      if (opts.avoidBlack && edge.difficulty === 'black') continue;

      // Skip icy black runs if avoidIce and ice is on
      if (opts.avoidIce && simState.iceBlack && edge.difficulty === 'black') continue;

      let w = edge.weight;
      // Penalty for blizzard at peak
      if (simState.blizzard && (edge.from === 'glacierPeak' || edge.to === 'glacierPeak')) {
        w += 5;
      }
      // Penalty for ice on black runs
      if (simState.iceBlack && edge.difficulty === 'black') {
        w += 4;
      }

      // Runs go downhill (from -> to); lifts go uphill (from -> to)
      adj[edge.from].push({ to: edge.to, weight: w, edge });
      // Also allow traversal in reverse for runs (walking uphill penalty)
      if (edge.type === 'run') {
        adj[edge.to].push({ to: edge.from, weight: w + 5, edge });
      }
    }
    return adj;
  }

  // ── Dijkstra ──────────────────────────────────────────────────────
  function dijkstra(from, to, opts = {}) {
    const adj = buildAdjacency(opts);
    const dist = {};
    const prev = {};
    const prevEdge = {};
    const visited = new Set();

    for (const nid of Object.keys(nodes)) dist[nid] = Infinity;
    dist[from] = 0;

    while (true) {
      // Pick unvisited node with smallest dist
      let u = null;
      let best = Infinity;
      for (const nid of Object.keys(nodes)) {
        if (!visited.has(nid) && dist[nid] < best) {
          best = dist[nid];
          u = nid;
        }
      }
      if (u === null || u === to) break;
      visited.add(u);

      for (const neighbor of adj[u]) {
        const alt = dist[u] + neighbor.weight;
        if (alt < dist[neighbor.to]) {
          dist[neighbor.to] = alt;
          prev[neighbor.to] = u;
          prevEdge[neighbor.to] = neighbor.edge;
        }
      }
    }

    if (dist[to] === Infinity) return null;

    // Reconstruct path
    const path = [];
    const pathEdges = [];
    let cur = to;
    while (cur) {
      path.unshift(cur);
      if (prevEdge[cur]) pathEdges.unshift(prevEdge[cur]);
      cur = prev[cur];
    }

    // Compute hazards along route
    const hazards = [];
    if (simState.blizzard && path.includes('glacierPeak')) {
      hazards.push({ type: 'warning', text: 'Blizzard at Peak' });
    }
    if (simState.iceBlack) {
      const hasBlack = pathEdges.some(e => e.difficulty === 'black');
      if (hasBlack) hazards.push({ type: 'danger', text: 'Ice on Black Runs' });
    }
    if (simState.liftClosed) {
      const needsSouth = pathEdges.some(e => e.id === 'l2');
      if (needsSouth) hazards.push({ type: 'danger', text: 'South Lift Closed' });
    }

    // Compute ETA (weight ≈ minutes)
    const eta = dist[to];

    // Max difficulty on route
    const diffOrder = { blue: 0, red: 1, black: 2, lift: -1 };
    let maxDiff = 'blue';
    for (const e of pathEdges) {
      if (e.type === 'run' && diffOrder[e.difficulty] > diffOrder[maxDiff]) {
        maxDiff = e.difficulty;
      }
    }

    return { path, pathEdges, distance: dist[to], eta, hazards, maxDifficulty: maxDiff };
  }

  // ── Phonetic & Fuzzy Name Matching ─────────────────────────────────
  function normalizeText(str) {
    if (!str) return '';
    return str
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove accents (á->a, é->e, etc.)
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Fast Levenshtein distance
  function levenshtein(a, b) {
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
  function similarity(s1, s2) {
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
  const KNOWN_PERSON_ALIASES = {
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

  // Compare input text tokens against all registered skiers on the mountain
  // and resolve to the closest match ("amelyikre a legjobban hajaz")
  function matchBestPerson(inputText, minThreshold = 0.62) {
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

    for (const acc of availableAccounts) {
      const aliases = [
        normalizeText(acc.name),
        acc.id,
        ...(KNOWN_PERSON_ALIASES[acc.id] || [])
      ];

      for (const phrase of phrases) {
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
            score = similarity(phrase, alias);
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

  // ── Node & Target Location Resolution ──────────────────────────────
  function resolveNodeName(text) {
    if (!text) return null;
    const lower = text.toLowerCase().trim();

    // 1. Resolve squad members using fuzzy matching
    const personMatch = matchBestPerson(lower);
    if (personMatch) {
      const acc = personMatch.account;
      if (acc.id === 'kajti') {
        return squad.kajti?.currentNode || acc.location || 'southBowlLift';
      }
      if (acc.id === 'renato') {
        return squad.renato?.currentNode || acc.location || 'panoramaHut';
      }
      if (acc.id === 'benedek') {
        return squad.benedek?.currentNode || squad.you?.currentNode || acc.location || 'glacierPeak';
      }
      if (acc.id === 'patrol') {
        return 'eagleMid';
      }
      return acc.currentNode || acc.location || 'mainValleyBase';
    }

    // 2. Generic station resolution ("a station", "nearest station", "the station")
    if (/\b(a\s*station|the\s*station|next\s*station|nearest\s*station|station)\b/i.test(lower)) {
      const cur = squad.you?.currentNode || 'glacierPeak';
      if (cur === 'glacierPeak') return 'eagleMid';
      if (cur === 'eagleMid') return 'panoramaHut';
      if (cur === 'panoramaHut') return 'southBowlLift';
      return 'mainValleyBase';
    }

    // 3. Station name keyword mappings
    const mappings = {
      'glacier': 'glacierPeak', 'glacier peak': 'glacierPeak', 'peak': 'glacierPeak', 'summit': 'glacierPeak', 'top': 'glacierPeak',
      'ridge': 'ridgeDrop', 'ridge drop': 'ridgeDrop',
      'eagle': 'eagleMid', 'eagle mid': 'eagleMid', 'mid station': 'eagleMid', 'mid-station': 'eagleMid', 'midstation': 'eagleMid',
      'panorama': 'panoramaHut', 'hut': 'panoramaHut', 'hütte': 'panoramaHut', 'hutte': 'panoramaHut', 'panorama hut': 'panoramaHut', 'restaurant': 'panoramaHut', 'deck': 'panoramaHut',
      'pine': 'pineForest', 'pine forest': 'pineForest', 'forest': 'pineForest', 'crossroads': 'pineForest', 'trees': 'pineForest',
      'south bowl': 'southBowlLift', 'south lift': 'southBowlLift', 'bowl lift': 'southBowlLift', 'south': 'southBowlLift',
      'avalanche': 'avalancheChute', 'chute': 'avalancheChute', 'avalanche chute': 'avalancheChute',
      'valley': 'mainValleyBase', 'base': 'mainValleyBase', 'main valley': 'mainValleyBase', 'valley base': 'mainValleyBase', 'bottom': 'mainValleyBase', 'village': 'mainValleyBase', 'lodge': 'mainValleyBase'
    };
    for (const [key, val] of Object.entries(mappings)) {
      if (lower.includes(key)) return val;
    }
    return null;
  }

  // ── Locate Entity (Person or Station) ──────────────────────────────
  function locateEntity(query) {
    if (!query) query = '';
    const lower = query.toLowerCase().trim();

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
        nodeId: node.id,
        nodeName: node.name,
        altitude: node.altitude,
        status: active.status,
        description: `Your GPS position is confirmed at ${node.name}, altitude ${node.altitude} meters. Transceiver active, squad telemetry linked.`,
      };
    }

    // 2. Explicit Squad Overview (only if user explicitly asked about the team/squad/everyone)
    if (/\b(squad|team|everyone|everybody|all|csapat|többiek|összesen)\b/i.test(lower)) {
      return {
        type: 'squad',
        id: 'squad',
        name: 'Squad Overview',
        description: `Squad update: Renato is at Panorama Hut (2,200m), Kajti is on Red Run 4 (2,000m), and you are at ${nodes[squad.you?.currentNode]?.name || 'Glacier Peak'}. All radio channels active.`,
      };
    }

    // 3. Best Matching Person using fuzzy phonetic comparison against registered riders
    const personMatch = matchBestPerson(query);
    if (personMatch) {
      const acc = personMatch.account;
      if (acc.id === 'kajti') {
        const node = nodes.southBowlLift;
        return {
          type: 'person',
          id: 'kajti',
          name: 'Kajti',
          role: acc.role || 'Downhill Specialist',
          color: acc.color || '#e040fb',
          nodeId: node.id,
          nodeName: 'Red Run 4 (towards South Bowl)',
          altitude: 2000,
          status: acc.status || 'Carving Red Run 4',
          description: `Kajti is currently carving down Red Run 4 at 2,000 meters altitude, descending towards South Bowl Lift. Transceiver channel link is 100% with strong telemetry.`,
        };
      }
      if (acc.id === 'renato') {
        const node = nodes[acc.location] || nodes.panoramaHut;
        return {
          type: 'person',
          id: 'renato',
          name: 'Renato',
          role: acc.role || 'Alpine Scout / Radio Lead',
          color: acc.color || '#ff6f00',
          nodeId: node.id,
          nodeName: node.name,
          altitude: node.altitude,
          status: acc.status || 'At Hütte Deck (2,200m)',
          description: `Renato is located at ${node.name}, elevation ${node.altitude} meters. Status: taking a short break on the deck. Radio channel link is 100%.`,
        };
      }
      if (acc.id === 'benedek') {
        const node = nodes[acc.location] || nodes.glacierPeak;
        return {
          type: 'person',
          id: 'benedek',
          name: 'Benedek',
          role: acc.role || 'Team Lead / Alpine Skier',
          color: acc.color || '#39ff14',
          nodeId: node.id,
          nodeName: node.name,
          altitude: node.altitude,
          status: acc.status || 'At Summit (3,200m)',
          description: `Benedek is stationed at ${node.name}, elevation ${node.altitude} meters. Status: ${acc.status}. Helmet HUD transceiver active.`,
        };
      }
      if (acc.id === 'patrol') {
        const node = nodes[acc.location] || nodes.eagleMid;
        return {
          type: 'person',
          id: 'patrol',
          name: 'Ski Patrol #4',
          role: acc.role || 'Mountain Rescue / Medic',
          color: acc.color || '#ff2d2d',
          nodeId: node.id,
          nodeName: node.name,
          altitude: node.altitude,
          status: acc.status || 'Mid-Station Stationed (2,400m)',
          description: `Ski Patrol unit is stationed at ${node.name} (${node.altitude}m), ready on radio standby for immediate alpine response.`,
        };
      }
      // Any custom registered rider
      const node = nodes[acc.location] || nodes.mainValleyBase;
      return {
        type: 'person',
        id: acc.id,
        name: acc.name,
        role: acc.role || 'Rider',
        color: acc.color || '#00e5ff',
        nodeId: node.id,
        nodeName: node.name,
        altitude: node.altitude,
        status: acc.status || `At ${node.name}`,
        description: `${acc.name} (${acc.role}) is located at ${node.name}, elevation ${node.altitude} meters. Signal link active.`,
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

    // 5. Target unknown fallback - DO NOT dump other people's info!
    return {
      type: 'unknown',
      id: 'unknown',
      name: 'Target Unknown',
      description: `Rider or station not found on radar. You can ask for Kajti, Renato, Benedek, Ski Patrol, or any mountain sector.`,
    };
  }

  // ── Get conditions description ────────────────────────────────────
  function getConditionsReport(sector) {
    const parts = [];
    if (simState.blizzard) {
      parts.push('🌨️ BLIZZARD active at Glacier Peak — visibility near zero, extreme wind gusts.');
    }
    if (simState.liftClosed) {
      parts.push('🚫 South Bowl Lift is CLOSED due to high wind. Use alternative routes.');
    }
    if (simState.iceBlack) {
      parts.push('🧊 ICE WARNING on all Black runs — very slippery, expert only.');
    }
    if (parts.length === 0) {
      parts.push('✅ All clear. Conditions are good across the mountain. Temperature -8°C, wind 12 km/h NW, visibility good.');
    }

    // Sector-specific
    if (sector) {
      const nodeId = resolveNodeName(sector);
      if (nodeId) {
        const node = nodes[nodeId];
        if (nodeId === 'glacierPeak' && simState.blizzard) {
          parts.push(`⚠️ ${node.name} (${node.altitude}m) is in the blizzard zone. Recommend descending immediately.`);
        } else if (nodeId === 'southBowlLift' && simState.liftClosed) {
          parts.push(`⚠️ ${node.name} lift is non-operational. Ski down to Main Valley Base instead.`);
        } else {
          parts.push(`📍 ${node.name} (${node.altitude}m): No local alerts.`);
        }
      }
    }

    return parts.join('\n');
  }

  // Public API
  return {
    nodes,
    edges,
    simState,
    get squad() { return squad; },
    dijkstra,
    resolveNodeName,
    getConditionsReport,
    buildAdjacency,
    switchAccount,
    getActiveAccount,
    getAccounts,
    locateEntity,
    matchBestPerson,
    similarity,
    normalizeText,
  };
})();

