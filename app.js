/* ═══════════════════════════════════════════════════════════════════
   app.js — Main Application: Map Rendering, HUD Updates, Wiring
   ═══════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── DOM References ────────────────────────────────────────────────
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const mapSVG       = $('#skiMap');
  const edgesGroup   = $('#edgesGroup');
  const nodesGroup   = $('#nodesGroup');
  const squadGroup   = $('#squadGroup');
  const routeHL      = $('#routeHighlight');

  const navCard      = $('#navCard');
  const navCardBody  = $('#navCardBody');
  const squadCard    = $('#squadCard');
  const squadCardBody = $('#squadCardBody');
  const telemetryCard = $('#telemetryCard');
  const sosCard      = $('#sosCard');
  const sosCardBody  = $('#sosCardBody');
  const transcriptLog = $('#transcriptLog');
  const textInput    = $('#textInput');
  const btnSendText  = $('#btnSendText');
  const btnMic       = $('#btnMic');
  const micStatus    = $('#micStatus');
  const waveform     = $('#waveform');
  const clockDisplay = $('#clockDisplay');
  const blizzardOvl  = $('#blizzardOverlay');

  // Telemetry fields
  const telWind = $('#telWind');
  const telTemp = $('#telTemp');
  const telVis  = $('#telVis');
  const telSnow = $('#telSnow');
  const telLift = $('#telLift');
  const telIce  = $('#telIce');

  // API Key modal
  const apiKeyModal   = $('#apiKeyModal');
  const btnApiKey     = $('#btnApiKey');
  const btnCancelKey  = $('#btnCancelKey');
  const btnSaveKey    = $('#btnSaveKey');
  const geminiKeyInput = $('#geminiKeyInput');

  // Account modal & switcher
  const btnSwitchAccount      = $('#btnSwitchAccount');
  const accountModal          = $('#accountModal');
  const btnCloseAccountModal  = $('#btnCloseAccountModal');
  const accountsListContainer = $('#accountsListContainer');
  const customAccountName     = $('#customAccountName');
  const customAccountSector   = $('#customAccountSector');
  const btnLoginCustomAccount = $('#btnLoginCustomAccount');
  const topBarAccountName     = $('#topBarAccountName');
  const topBarAccountLoc      = $('#topBarAccountLoc');

  // ── Clock ─────────────────────────────────────────────────────────
  function updateClock() {
    const now = new Date();
    clockDisplay.textContent = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }
  setInterval(updateClock, 1000);
  updateClock();

  // ── Render SVG Map ────────────────────────────────────────────────
  function renderEdges() {
    edgesGroup.innerHTML = '';
    const { edges, nodes } = MountainData;

    for (const edge of edges) {
      const fromNode = nodes[edge.from];
      const toNode = nodes[edge.to];
      const pts = [
        [fromNode.x, fromNode.y],
        ...(edge.waypoints || []),
        [toNode.x, toNode.y],
      ];

      // Build path "d"
      const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ');

      // Hit area (invisible wide path for hover)
      const hitArea = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      hitArea.setAttribute('d', d);
      hitArea.setAttribute('class', 'ski-edge-hitarea');
      hitArea.dataset.edgeId = edge.id;

      // Visible path
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', d);
      path.setAttribute('id', `edge-${edge.id}`);
      const diffClass = edge.type === 'lift' ? 'lift' : edge.difficulty;
      path.setAttribute('class', `ski-edge ${diffClass}`);
      path.setAttribute('stroke-width', edge.type === 'lift' ? '2' : '3');
      if (edge.type === 'lift') {
        path.setAttribute('marker-mid', 'url(#liftArrow)');
      }

      // Label
      const midIdx = Math.floor(pts.length / 2);
      const midPt = pts[midIdx];
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', midPt[0] + 8);
      label.setAttribute('y', midPt[1] - 6);
      label.setAttribute('class', 'run-label');
      label.textContent = edge.name;

      edgesGroup.appendChild(hitArea);
      edgesGroup.appendChild(path);
      edgesGroup.appendChild(label);
    }
  }

  function renderNodes() {
    nodesGroup.innerHTML = '';
    const { nodes } = MountainData;

    for (const [id, node] of Object.entries(nodes)) {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', 'node-group');
      g.dataset.nodeId = id;

      // Outer glow ring
      const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      ring.setAttribute('cx', node.x);
      ring.setAttribute('cy', node.y);
      ring.setAttribute('r', '16');
      ring.setAttribute('fill', 'none');
      ring.setAttribute('stroke', '#00e5ff');
      ring.setAttribute('stroke-width', '1');
      ring.setAttribute('stroke-opacity', '0.2');

      // Main circle
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', node.x);
      circle.setAttribute('cy', node.y);
      circle.setAttribute('r', '10');
      circle.setAttribute('fill', '#1a2236');
      circle.setAttribute('stroke', '#00e5ff');
      circle.setAttribute('stroke-width', '2');
      circle.setAttribute('class', 'node-circle');
      circle.setAttribute('filter', 'url(#nodeShadow)');

      // Icon text
      const icon = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      icon.setAttribute('x', node.x);
      icon.setAttribute('y', node.y + 4);
      icon.setAttribute('text-anchor', 'middle');
      icon.setAttribute('font-size', '10');
      icon.setAttribute('class', 'pointer-events-none');
      icon.textContent = node.icon;

      // Name label
      const nameLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      const labelX = node.x + 16;
      const labelY = node.y - 6;
      nameLabel.setAttribute('x', labelX);
      nameLabel.setAttribute('y', labelY);
      nameLabel.setAttribute('class', 'node-label');
      nameLabel.textContent = node.name;

      // Altitude label
      const altLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      altLabel.setAttribute('x', labelX);
      altLabel.setAttribute('y', labelY + 14);
      altLabel.setAttribute('class', 'node-altitude');
      altLabel.textContent = `${node.altitude}m`;

      g.appendChild(ring);
      g.appendChild(circle);
      g.appendChild(icon);
      g.appendChild(nameLabel);
      g.appendChild(altLabel);
      nodesGroup.appendChild(g);
    }
  }

  function renderSquad() {
    squadGroup.innerHTML = '';
    const { squad, nodes, edges } = MountainData;

    for (const [key, member] of Object.entries(squad)) {
      let x, y;
      if (member.currentNode) {
        const node = nodes[member.currentNode];
        x = node.x;
        y = node.y;
      } else if (member.onEdge) {
        // Interpolate position along edge
        const edge = edges.find(e => e.id === member.onEdge);
        if (edge) {
          const fromNode = nodes[edge.from];
          const toNode = nodes[edge.to];
          const allPts = [
            [fromNode.x, fromNode.y],
            ...(edge.waypoints || []),
            [toNode.x, toNode.y],
          ];
          const progress = member.edgeProgress || 0.5;
          const totalPts = allPts.length - 1;
          const segIdx = Math.min(Math.floor(progress * totalPts), totalPts - 1);
          const segProgress = (progress * totalPts) - segIdx;
          const p0 = allPts[segIdx];
          const p1 = allPts[segIdx + 1];
          x = p0[0] + (p1[0] - p0[0]) * segProgress;
          y = p0[1] + (p1[1] - p0[1]) * segProgress;
        } else {
          x = 400; y = 400;
        }
      } else {
        continue;
      }

      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', 'squad-dot');
      g.setAttribute('id', `squad-${key}`);
      g.setAttribute('data-squad-id', member.accountId || key);

      // Pulse ring
      const pulse = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      pulse.setAttribute('cx', x);
      pulse.setAttribute('cy', y);
      pulse.setAttribute('r', '12');
      pulse.setAttribute('fill', 'none');
      pulse.setAttribute('stroke', member.color);
      pulse.setAttribute('stroke-width', '1.5');
      pulse.setAttribute('opacity', '0.5');
      pulse.innerHTML = `<animate attributeName="r" values="8;18;8" dur="2s" repeatCount="indefinite"/>
                          <animate attributeName="opacity" values="0.6;0.1;0.6" dur="2s" repeatCount="indefinite"/>`;

      // Dot
      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('cx', x);
      dot.setAttribute('cy', y);
      dot.setAttribute('r', '5');
      dot.setAttribute('fill', member.color);
      dot.setAttribute('stroke', '#0a0e17');
      dot.setAttribute('stroke-width', '2');

      // Name label
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', x);
      label.setAttribute('y', y + 20);
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('class', 'squad-label');
      label.setAttribute('fill', member.color);
      label.textContent = member.name;

      g.appendChild(pulse);
      g.appendChild(dot);
      g.appendChild(label);
      squadGroup.appendChild(g);
    }
  }

  // ── Route Highlight ───────────────────────────────────────────────
  function highlightRoute(pathEdges) {
    routeHL.innerHTML = '';
    if (!pathEdges || pathEdges.length === 0) return;

    const { nodes } = MountainData;

    for (const edge of pathEdges) {
      const fromNode = nodes[edge.from];
      const toNode = nodes[edge.to];
      const pts = [
        [fromNode.x, fromNode.y],
        ...(edge.waypoints || []),
        [toNode.x, toNode.y],
      ];
      const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ');

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', d);
      path.setAttribute('class', 'route-highlight');
      routeHL.appendChild(path);
    }
  }

  function clearRouteHighlight() {
    routeHL.innerHTML = '';
  }

  // ── Simulator Controls ────────────────────────────────────────────
  function initSimControls() {
    $$('.sim-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const sim = btn.dataset.sim;
        MountainData.simState[sim] = !MountainData.simState[sim];
        btn.classList.toggle('active', MountainData.simState[sim]);
        updateTelemetry();
        updateMapVisuals();

        const stateText = MountainData.simState[sim] ? 'ACTIVATED' : 'DEACTIVATED';
        addTranscript('system', `⚡ Simulator: ${btn.querySelector('span').textContent} — ${stateText}`);
      });
    });
  }

  function updateMapVisuals() {
    // Blizzard overlay
    blizzardOvl.classList.toggle('hidden', !MountainData.simState.blizzard);

    // Ice on black runs
    const blackEdges = document.querySelectorAll('.ski-edge.black');
    blackEdges.forEach(el => {
      el.classList.toggle('ice-warning-edge', MountainData.simState.iceBlack);
    });

    // Closed lift visual
    const liftEdge = document.getElementById('edge-l2');
    if (liftEdge) {
      liftEdge.style.opacity = MountainData.simState.liftClosed ? '0.2' : '1';
      liftEdge.style.strokeDasharray = MountainData.simState.liftClosed ? '2 8' : '8 6';
    }
  }

  function updateTelemetry() {
    const s = MountainData.simState;

    if (s.blizzard) {
      telWind.textContent = '85 km/h N';
      telWind.className = 'text-red-400';
      telTemp.textContent = '-18 °C';
      telVis.textContent = 'Near Zero';
      telVis.className = 'text-red-400';
    } else {
      telWind.textContent = '12 km/h NW';
      telWind.className = 'text-white';
      telTemp.textContent = '-8 °C';
      telVis.textContent = 'Good';
      telVis.className = 'text-green-400';
    }

    if (s.liftClosed) {
      telLift.innerHTML = '<span class="text-red-400">● Closed (Wind)</span>';
    } else {
      telLift.innerHTML = '<span class="text-green-400">● Open</span>';
    }

    if (s.iceBlack) {
      telIce.innerHTML = '<span class="text-amber-400">● ICE WARNING</span>';
      telSnow.textContent = 'Icy Hardpack';
    } else {
      telIce.innerHTML = '<span class="text-green-400">● Clear</span>';
      telSnow.textContent = 'Packed Powder';
    }
  }

  // ── HUD Card Updates ──────────────────────────────────────────────
  function showNavCard(result, from, to, targetPerson) {
    const fromNode = MountainData.nodes[from];
    const toNode = MountainData.nodes[to];
    const destinationTitle = targetPerson ? `${toNode.name} (${targetPerson})` : toNode.name;

    const stepsHtml = result.path.map((nid, i) => {
      const n = MountainData.nodes[nid];
      const isFirst = i === 0;
      const isLast = i === result.path.length - 1;
      const marker = isFirst ? '🏁' : isLast ? '🎯' : '→';
      return `<span class="text-xs font-mono">${marker} ${n.name} <span class="text-hud-text/40">(${n.altitude}m)</span></span>`;
    }).join('<br>');

    const hazardsHtml = result.hazards.length > 0
      ? result.hazards.map(h => `<span class="hazard-badge ${h.type === 'danger' ? 'danger' : 'warning'}">${h.text}</span>`).join(' ')
      : '<span class="hazard-badge ok">No hazards</span>';

    navCardBody.innerHTML = `
      <div class="space-y-2">
        <div class="flex items-center justify-between text-xs">
          <span class="font-semibold text-white">${fromNode.name} → ${destinationTitle}</span>
          <span class="text-hud-cyan font-mono">ETA ~${result.eta} min</span>
        </div>
        <div class="flex items-center gap-2 text-xs">
          <span class="text-hud-text/50">Max Difficulty:</span>
          <span class="diff-badge ${result.maxDifficulty}"></span>
          <span class="text-white capitalize">${result.maxDifficulty}</span>
        </div>
        <div class="flex flex-wrap gap-1">${hazardsHtml}</div>
        <div class="bg-hud-bg/50 rounded-lg p-2 mt-1">${stepsHtml}</div>
      </div>
    `;
    navCard.classList.remove('hidden');
  }

  function showSquadCard(recipients, message, eta) {
    const time = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const recipText = recipients.join(' & ');
    const etaText = eta ? ` — ETA ${eta} min` : '';

    squadCardBody.innerHTML = `
      <div class="space-y-2">
        <div class="text-xs">
          <span class="text-hud-text/50">📻 Sent to:</span>
          <span class="text-white font-semibold ml-1">${recipText}</span>
          <span class="text-hud-text/30 ml-2">${time}</span>
        </div>
        <div class="bg-hud-bg/50 rounded-lg p-2 text-xs text-hud-text italic">
          "${message}"${etaText}
        </div>
      </div>
    `;
    squadCard.classList.remove('hidden');

    // Animate squad dots
    recipients.forEach(name => {
      const key = name.toLowerCase().replace('ó', 'o').replace('renató', 'renato');
      const el = document.getElementById(`squad-${key}`);
      if (el) {
        el.style.transform = 'scale(1.3)';
        setTimeout(() => { el.style.transform = 'scale(1)'; }, 1200);
      }
    });
  }

  let _isSOSActive = false;
  let _lastSOSTime = 0;

  function flashMapNode(nodeId, color = '#00e5ff') {
    const nodeGroup = document.querySelector(`[data-node-id="${nodeId}"]`);
    if (nodeGroup) {
      const circle = nodeGroup.querySelector('.node-circle');
      if (circle) {
        const origStroke = circle.getAttribute('stroke');
        const origFill = circle.getAttribute('fill');
        circle.setAttribute('stroke', color);
        circle.setAttribute('fill', color === '#ff2d2d' ? '#3a0000' : '#003a45');
        setTimeout(() => {
          circle.setAttribute('stroke', origStroke);
          circle.setAttribute('fill', origFill);
        }, 3500);
      }
    }
  }

  function showSOSCard(location, injury) {
    _isSOSActive = true;
    _lastSOSTime = Date.now();
    const node = MountainData.nodes[location];
    const locName = node ? node.name : location;

    sosCardBody.innerHTML = `
      <div class="space-y-2">
        <div class="text-sm font-bold text-red-400 animate-pulse">🚨 EMERGENCY BEACON ACTIVE</div>
        <div class="grid grid-cols-2 gap-1 text-xs font-mono">
          <div><span class="text-red-300/60">Location:</span></div>
          <div class="text-white">${locName}</div>
          <div><span class="text-red-300/60">Injury:</span></div>
          <div class="text-white">${injury}</div>
          <div><span class="text-red-300/60">GPS:</span></div>
          <div class="text-white">45.0921° N, 6.0694° E</div>
          <div><span class="text-red-300/60">Altitude:</span></div>
          <div class="text-white">${node ? node.altitude + 'm' : 'Unknown'}</div>
          <div><span class="text-red-300/60">Status:</span></div>
          <div class="text-red-400 font-bold">TRANSMITTING</div>
        </div>
        <div class="text-[10px] text-red-300/60 mt-1">Ski Patrol notified • Rescue ETA ~8 min</div>
        <button id="btnDismissSOS" class="w-full mt-2 py-1.5 px-3 text-xs font-mono font-semibold rounded bg-red-900/60 border border-red-500/50 text-red-200 hover:bg-red-800/80 transition flex items-center justify-center gap-1.5 cursor-pointer">
          <i data-lucide="check-circle" class="w-3.5 h-3.5 text-hud-green"></i> Dismiss Emergency Beacon
        </button>
      </div>
    `;
    sosCard.classList.remove('hidden');
    document.body.classList.add('sos-active');
    initIcons();

    const btnDismiss = document.getElementById('btnDismissSOS');
    if (btnDismiss) {
      btnDismiss.addEventListener('click', () => {
        handleClearSOS();
      });
    }

    // Flash the node on map
    if (node) {
      flashMapNode(location, '#ff2d2d');
    }
  }

  function clearSOS() {
    _isSOSActive = false;
    sosCard.classList.add('hidden');
    document.body.classList.remove('sos-active');
    // Restore node visuals
    renderNodes();
    renderSquad();
  }

  async function handleClearSOS() {
    clearSOS();
    const resp = "Emergency beacon cancelled. HUD restored to standard navigation. All systems normal.";
    addTranscript('system', "✅ Emergency beacon dismissed. Normal HUD restored.");
    await VoiceEngine.aiSpeak(resp);
  }

  // ── Transcript Log ────────────────────────────────────────────────
  function addTranscript(type, text) {
    // Remove placeholder
    const placeholder = transcriptLog.querySelector('.italic');
    if (placeholder) placeholder.remove();

    const entry = document.createElement('div');
    const time = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const typeClass = type === 'user' ? 'transcript-user' : type === 'ai' ? 'transcript-ai' : 'transcript-system';
    const typeLabel = type === 'user' ? 'YOU' : type === 'ai' ? 'APEX' : 'SYS';
    const labelColor = type === 'user' ? 'text-green-400' : type === 'ai' ? 'text-cyan-400' : 'text-amber-400';

    entry.className = `${typeClass} text-[11px]`;
    entry.innerHTML = `
      <div class="flex items-center gap-1 mb-0.5">
        <span class="${labelColor} font-bold font-mono text-[10px]">${typeLabel}</span>
        <span class="text-hud-text/30 font-mono text-[9px]">${time}</span>
      </div>
      <div class="text-hud-text/80">${text}</div>
    `;
    transcriptLog.appendChild(entry);
    transcriptLog.scrollTop = transcriptLog.scrollHeight;
  }

  // ── Function Call Handlers ────────────────────────────────────────
  async function handlePlanSkiRoute(args) {
    const { from, to, avoidBlack, avoidIce, targetPerson } = args;

    if (!to) {
      const resp = "Roger, but I need a destination. Where should I route you?";
      addTranscript('ai', resp);
      await VoiceEngine.aiSpeak(resp);
      return;
    }

    const result = MountainData.dijkstra(from, to, { avoidBlack, avoidIce });

    if (!result) {
      const fromName = MountainData.nodes[from]?.name || from;
      const toName = MountainData.nodes[to]?.name || to;
      const resp = `No route found from ${fromName} to ${toName} with your constraints. Try relaxing the avoid-black or avoid-ice filter.`;
      addTranscript('ai', resp);
      await VoiceEngine.aiSpeak(resp);
      return;
    }

    // Highlight on map
    highlightRoute(result.pathEdges);

    // Update nav card
    showNavCard(result, from, to, targetPerson);

    // Build spoken response
    const fromName = MountainData.nodes[from].name;
    const toName = MountainData.nodes[to].name;
    const viaNames = result.path.slice(1, -1).map(nid => MountainData.nodes[nid].name);
    const viaText = viaNames.length > 0 ? ` via ${viaNames.join(', ')}` : '';
    const hazardText = result.hazards.length > 0
      ? ` Heads up: ${result.hazards.map(h => h.text).join(', ')}.`
      : '';

    let resp = '';
    if (targetPerson) {
      resp = `Copy that! Plotting intercept route to ${targetPerson} at ${toName}${viaText}. Max difficulty: ${result.maxDifficulty}. ETA approximately ${result.eta} minutes.${hazardText} Stay sharp, rider!`;
    } else {
      resp = `Copy that! Route locked from ${fromName} to ${toName}${viaText}. Max difficulty: ${result.maxDifficulty}. ETA approximately ${result.eta} minutes.${hazardText} Stay sharp, rider!`;
    }

    addTranscript('ai', resp);
    await VoiceEngine.aiSpeak(resp);
  }

  function showSquadMemberCard(entity) {
    const time = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    squadCardBody.innerHTML = `
      <div class="space-y-2">
        <div class="flex items-center justify-between text-xs">
          <div class="flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full inline-block" style="background:${entity.color || '#00e5ff'}; box-shadow:0 0 8px ${entity.color || '#00e5ff'}"></span>
            <span class="text-white font-bold font-mono tracking-wide">${entity.name.toUpperCase()}</span>
            <span class="text-hud-text/50 text-[10px] font-mono">(${entity.role || 'Rider'})</span>
          </div>
          <span class="text-hud-text/30 font-mono text-[9px]">${time}</span>
        </div>
        <div class="bg-hud-bg/60 border border-hud-border/40 rounded-lg p-2.5 text-xs space-y-1.5">
          <div class="flex justify-between items-center">
            <span class="text-hud-text/60">Location / Sector:</span>
            <span class="text-hud-cyan font-semibold text-right">${entity.nodeName}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-hud-text/60">Elevation:</span>
            <span class="text-white font-mono font-medium">${entity.altitude}m</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-hud-text/60">Current Status:</span>
            <span class="text-hud-green font-medium">${entity.status}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-hud-text/60">Squad Radio Link:</span>
            <span class="text-hud-cyan font-mono text-[10px]">CH-04 · 100% SIGNAL</span>
          </div>
        </div>
      </div>
    `;
    squadCard.classList.remove('hidden');
  }

  async function handleLocateEntity(args) {
    const entity = MountainData.locateEntity(args.query || '');

    // Visual map response:
    if (entity.type === 'person') {
      const activeAcc = MountainData.getActiveAccount();
      const el = document.getElementById(`squad-${entity.id}`)
              || (entity.id === activeAcc.id ? document.getElementById('squad-you') : null)
              || document.querySelector(`[data-squad-id="${entity.id}"]`);

      if (el) {
        el.classList.add('highlighted');
        el.style.transform = 'scale(2.4)';
        setTimeout(() => {
          el.classList.remove('highlighted');
          el.style.transform = 'scale(1)';
        }, 3000);
      }
      if (entity.nodeId) {
        flashMapNode(entity.nodeId, entity.color || '#ff6f00');
      }
      showSquadMemberCard(entity);
    } else if (entity.nodeId) {
      flashMapNode(entity.nodeId, '#00e5ff');
    }

    addTranscript('ai', `📍 ${entity.description}`);
    await VoiceEngine.aiSpeak(entity.description);
  }

  async function handlePingSquad(args) {
    const { recipients, message, eta } = args;
    showSquadCard(recipients, message, eta);

    const recipText = recipients.join(' and ');
    const etaText = eta ? `, ETA ${eta} minutes` : '';
    const resp = `Roger, radio message sent to ${recipText}: "${message}"${etaText}. They'll get the ping on their helmet display. Over.`;

    addTranscript('ai', resp);
    await VoiceEngine.aiSpeak(resp);
  }

  async function handleCheckConditions(args) {
    updateTelemetry();

    // Visual HUD pulse on telemetry card
    if (telemetryCard) {
      telemetryCard.classList.remove('border-hud-cyan');
      void telemetryCard.offsetWidth; // trigger reflow
      telemetryCard.classList.add('border-hud-cyan');
      setTimeout(() => {
        telemetryCard.classList.remove('border-hud-cyan');
      }, 3000);
    }

    const report = MountainData.getConditionsReport(args ? args.sector : null);
    addTranscript('ai', report.replace(/\n/g, '<br>'));
    // Speak a concise version
    const spoken = report.replace(/[🌨️🚫🧊✅⚠️📍]/g, '').replace(/\n/g, '. ');
    await VoiceEngine.aiSpeak(spoken);
  }

  async function handleTriggerSOS(args) {
    const now = Date.now();
    if (_isSOSActive && now - _lastSOSTime < 15000) {
      console.log('SOS already active, suppressing loop');
      return;
    }
    _isSOSActive = true;
    _lastSOSTime = now;

    const { location, injury } = args;

    // Clear any active route
    clearRouteHighlight();

    // Show SOS
    showSOSCard(location, injury);

    const locName = MountainData.nodes[location]?.name || location;
    // CRITICAL: Avoid speaking the trigger word "mayday" or "help" through the speakers!
    // Speaking "mayday" causes the microphone to hear "mayday" and loop infinitely.
    const resp = `Emergency beacon confirmed at ${locName}. Transponder locked: 45 point 09 21 North, 6 point 06 94 East. Ski Patrol has been dispatched, rescue arrival estimated in 8 minutes. ${injury ? `Reported condition: ${injury}.` : ''} Keep warm and remain stationary. Support is en route.`;

    addTranscript('ai', `🚨 ${resp}`);
    await VoiceEngine.aiSpeak(resp);
  }

  // ── Wire Up Voice Engine ──────────────────────────────────────────
  function initVoiceEngine() {
    VoiceEngine.init();

    VoiceEngine.onTranscript = (text) => {
      addTranscript('user', text);
    };

    VoiceEngine.onAIResponse = (text) => {
      addTranscript('ai', text);
    };

    VoiceEngine.onFunctionCall = async (fnName, args) => {
      addTranscript('system', `⚙️ ${fnName}(${JSON.stringify(args)})`);

      switch (fnName) {
        case 'planSkiRoute':
          await handlePlanSkiRoute(args);
          break;
        case 'pingSquad':
          await handlePingSquad(args);
          break;
        case 'checkConditions':
          await handleCheckConditions(args);
          break;
        case 'triggerSOS':
          await handleTriggerSOS(args);
          break;
        case 'clearSOS':
          await handleClearSOS();
          break;
        case 'locateEntity':
          await handleLocateEntity(args);
          break;
      }
    };

    VoiceEngine.onListeningChange = (listening) => {
      btnMic.classList.toggle('listening', listening);
      if (listening) {
        btnMic.classList.remove('speaking');
        btnMic.setAttribute('title', 'Recording… Tap mic to send message');
        micStatus.textContent = '🔴 RECORDING… Speak now (Tap mic to send)';
      } else if (!VoiceEngine.isSpeaking) {
        btnMic.setAttribute('title', 'Push / Tap to Talk');
        micStatus.textContent = 'TAP TO TALK · or use prompts above';
      }
    };

    VoiceEngine.onSpeakingChange = (speaking) => {
      btnMic.classList.toggle('speaking', speaking);
      if (speaking) {
        btnMic.classList.remove('listening');
        btnMic.setAttribute('title', 'APEX is speaking · Tap mic to silence');
        micStatus.textContent = '🔊 APEX SPEAKING… (Tap mic to silence)';
      } else if (!VoiceEngine.isListening) {
        btnMic.setAttribute('title', 'Push / Tap to Talk');
        micStatus.textContent = 'TAP TO TALK · or use prompts above';
      }
    };
  }

  // ── UI Event Wiring ───────────────────────────────────────────────
  function initUI() {
    // Mic button
    btnMic.addEventListener('click', () => {
      VoiceEngine.toggleListening();
    });

    // Text input
    const submitText = () => {
      const text = textInput.value.trim();
      if (!text) return;
      if (VoiceEngine.isSpeaking) {
        VoiceEngine.cancelSpeech();
      }
      textInput.value = '';
      addTranscript('user', text);
      VoiceEngine.processInput(text);
    };
    btnSendText.addEventListener('click', submitText);
    textInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') submitText();
    });

    // Demo chips
    $$('.demo-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const prompt = chip.dataset.prompt;
        if (VoiceEngine.isSpeaking) {
          VoiceEngine.cancelSpeech();
        }
        textInput.value = '';
        addTranscript('user', prompt);
        VoiceEngine.processInput(prompt);
      });
    });

    // API Key modal
    btnApiKey.addEventListener('click', () => {
      apiKeyModal.classList.remove('hidden');
      geminiKeyInput.value = VoiceEngine.geminiApiKey || '';
    });
    btnCancelKey.addEventListener('click', () => {
      apiKeyModal.classList.add('hidden');
    });
    btnSaveKey.addEventListener('click', () => {
      VoiceEngine.geminiApiKey = geminiKeyInput.value.trim();
      apiKeyModal.classList.add('hidden');
      if (VoiceEngine.geminiApiKey) {
        addTranscript('system', '🔑 Gemini API key set — LLM tool-calling enabled.');
      } else {
        addTranscript('system', '🔑 Gemini API key cleared — using built-in intent router.');
      }
    });
    apiKeyModal.addEventListener('click', (e) => {
      if (e.target === apiKeyModal) apiKeyModal.classList.add('hidden');
    });

    // Account modal wiring
    if (btnSwitchAccount) {
      btnSwitchAccount.addEventListener('click', () => {
        renderAccountsModalList();
        accountModal.classList.remove('hidden');
        initIcons();
      });
    }
    if (btnCloseAccountModal) {
      btnCloseAccountModal.addEventListener('click', () => {
        accountModal.classList.add('hidden');
      });
    }
    if (accountModal) {
      accountModal.addEventListener('click', (e) => {
        if (e.target === accountModal) accountModal.classList.add('hidden');
      });
    }

    if (btnLoginCustomAccount) {
      btnLoginCustomAccount.addEventListener('click', () => {
        const name = customAccountName.value.trim();
        const sector = customAccountSector.value;
        if (!name) {
          alert('Please enter a call sign or name.');
          return;
        }
        customAccountName.value = '';
        handleSwitchAccount('custom', name, sector);
      });
    }
  }

  // ── Account & Profile Helpers ─────────────────────────────────────
  function updateTopBarAccountUI() {
    const active = MountainData.getActiveAccount();
    if (active) {
      if (topBarAccountName) topBarAccountName.textContent = active.name;
      const nodeName = MountainData.nodes[active.location]?.name || 'Sector';
      if (topBarAccountLoc) topBarAccountLoc.textContent = `@ ${nodeName}`;
    }
  }

  function renderAccountsModalList() {
    if (!accountsListContainer) return;
    const accounts = MountainData.getAccounts();
    const active = MountainData.getActiveAccount();

    accountsListContainer.innerHTML = accounts.map(acc => {
      const isActive = acc.id === active.id;
      const nodeName = MountainData.nodes[acc.location]?.name || 'Mount Apex';
      return `
        <div class="flex items-center justify-between p-2.5 rounded-lg border transition ${
          isActive
            ? 'bg-hud-cyan/10 border-hud-cyan text-white shadow-lg shadow-hud-cyan/5'
            : 'bg-hud-card border-hud-border/60 hover:border-hud-border hover:bg-hud-card/80 text-hud-text'
        }">
          <div class="flex items-center gap-2.5">
            <span class="text-base p-1.5 rounded-md bg-hud-bg/80 border border-hud-border">${acc.avatar || '🎿'}</span>
            <div>
              <div class="flex items-center gap-2">
                <span class="font-bold text-xs ${isActive ? 'text-white' : 'text-hud-text'}">${acc.name}</span>
                ${isActive ? '<span class="text-[9px] px-1.5 py-0.2 rounded bg-hud-green/20 text-hud-green font-mono font-semibold uppercase">Active Profile</span>' : ''}
              </div>
              <div class="text-[10px] text-hud-text/50 font-mono mt-0.5">
                ${acc.role} · <span class="text-hud-cyan">${nodeName}</span>
              </div>
            </div>
          </div>
          <div>
            ${
              isActive
                ? '<span class="text-xs text-hud-green font-mono font-bold px-2 py-1">LOGGED IN</span>'
                : `<button class="btn-select-account px-2.5 py-1 text-xs rounded border border-hud-border hover:border-hud-cyan hover:text-hud-cyan bg-hud-bg/60 transition font-mono cursor-pointer" data-acc-id="${acc.id}">Switch</button>`
            }
          </div>
        </div>
      `;
    }).join('');

    // Attach click listeners to Switch buttons
    accountsListContainer.querySelectorAll('.btn-select-account').forEach(btn => {
      btn.addEventListener('click', () => {
        const accId = btn.dataset.accId;
        handleSwitchAccount(accId);
      });
    });
  }

  async function handleSwitchAccount(accId, customName, customSector) {
    const newActive = MountainData.switchAccount(accId, customName, customSector);
    accountModal.classList.add('hidden');
    updateTopBarAccountUI();
    renderSquad();
    clearRouteHighlight();

    const locName = MountainData.nodes[newActive.location]?.name || 'Mount Apex';
    addTranscript('system', `👤 Operator switched: ${newActive.name} (${newActive.role}) @ ${locName}`);
    await VoiceEngine.aiSpeak(`Operator switched. Welcome ${newActive.name}. Radio channel synchronized at ${locName}.`);
  }

  // ── Initialize Lucide Icons ───────────────────────────────────────
  function initIcons() {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // ── Boot ──────────────────────────────────────────────────────────
  function boot() {
    renderEdges();
    renderNodes();
    renderSquad();
    updateTopBarAccountUI();
    initSimControls();
    initVoiceEngine();
    initUI();
    initIcons();
    updateTelemetry();

    // Startup message
    setTimeout(() => {
      const active = MountainData.getActiveAccount();
      const locName = MountainData.nodes[active.location]?.name || 'Glacier Peak';
      addTranscript('ai', `🏔️ APEX online. Mount Apex, 3200 meters. Operator: ${active.name} at ${locName}. Squad transceivers linked. What's the play, rider?`);
    }, 500);
  }

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

