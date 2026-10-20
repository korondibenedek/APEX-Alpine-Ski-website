/* ═══════════════════════════════════════════════════════════════════
   map-renderer.js — SVG Alpine Resort Map & GPS Radar Rendering
   ═══════════════════════════════════════════════════════════════════ */

import { nodes, edges, simState, activeResortMeta } from '../data/resort-graph.js';
import { squad } from '../data/accounts.js';

const isMapPoint = ([x, y]) =>
  Number.isFinite(x) && Number.isFinite(y) && x >= 0 && x <= 900 && y >= 0 && y <= 680;

function getEdgePoints(edge) {
  const fromNode = nodes[edge.from];
  const toNode = nodes[edge.to];
  if (!fromNode || !toNode || !isMapPoint([fromNode.x, fromNode.y]) || !isMapPoint([toNode.x, toNode.y])) {
    return null;
  }

  const waypoints = (edge.waypoints || []).filter(point => Array.isArray(point) && isMapPoint(point));
  return [[fromNode.x, fromNode.y], ...waypoints, [toNode.x, toNode.y]];
}

export function renderMountainBackdrop() {
  const poly = document.getElementById('mountainSilhouette');
  const altGroup = document.getElementById('altitudeLabelsGroup');

  if (poly) {
    const isDualPeak = activeResortMeta.id === 'murau' || (Boolean(nodes.peakWest) && Boolean(nodes.peakEast));
    if (isDualPeak) {
      // Distinctive dual peak silhouette (e.g. Rosenkranzhöhe on left, Kreischberg on right)
      poly.setAttribute('points', '0,680 40,480 120,280 220,55 330,120 440,160 540,120 640,75 750,180 840,320 900,480 900,680');
    } else {
      poly.setAttribute('points', '0,680 50,500 150,380 250,200 350,120 450,60 550,90 620,180 700,250 780,340 850,420 900,500 900,680');
    }
  }

  if (altGroup && activeResortMeta.altitude && activeResortMeta.baseAltitude) {
    const peak = activeResortMeta.altitude;
    const base = activeResortMeta.baseAltitude;
    const step = (peak - base) / 5;
    const labels = altGroup.querySelectorAll('text');
    labels.forEach((lbl, i) => {
      const alt = Math.round(peak - i * step);
      lbl.textContent = `${alt}m`;
    });
  }
}

export function renderEdges(edgesGroup) {
  if (!edgesGroup) return;
  edgesGroup.innerHTML = '';

  for (const edge of edges) {
    const pts = getEdgePoints(edge);
    if (!pts) continue;

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

export function renderNodes(nodesGroup, onNodeClick) {
  if (!nodesGroup) return;
  nodesGroup.innerHTML = '';
  renderMountainBackdrop();

  for (const [id, node] of Object.entries(nodes)) {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'node-group cursor-pointer');
    g.dataset.nodeId = id;

    const isLake = node.icon === '💧' || node.id.includes('see') || node.id.includes('lake');

    // Outer glow ring
    const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    ring.setAttribute('cx', node.x);
    ring.setAttribute('cy', node.y);
    ring.setAttribute('r', isLake ? '20' : '16');
    ring.setAttribute('fill', isLake ? '#38bdf8' : 'none');
    ring.setAttribute('fill-opacity', isLake ? '0.15' : '0');
    ring.setAttribute('stroke', isLake ? '#38bdf8' : '#00e5ff');
    ring.setAttribute('stroke-width', '1');
    ring.setAttribute('stroke-opacity', isLake ? '0.6' : '0.2');

    // Main circle
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', node.x);
    circle.setAttribute('cy', node.y);
    circle.setAttribute('r', isLake ? '12' : '10');
    circle.setAttribute('fill', isLake ? '#07273d' : '#1a2236');
    circle.setAttribute('stroke', isLake ? '#38bdf8' : '#00e5ff');
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
    const isRightAligned = node.x > 680;
    const nameLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    const labelX = isRightAligned ? node.x - 16 : node.x + 16;
    const labelY = node.y - 6;
    nameLabel.setAttribute('x', labelX);
    nameLabel.setAttribute('y', labelY);
    nameLabel.setAttribute('class', 'node-label');
    if (isRightAligned) nameLabel.setAttribute('text-anchor', 'end');
    nameLabel.textContent = node.name;

    // Altitude label
    const altLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    altLabel.setAttribute('x', labelX);
    altLabel.setAttribute('y', labelY + 14);
    altLabel.setAttribute('class', 'node-altitude');
    if (isRightAligned) altLabel.setAttribute('text-anchor', 'end');
    altLabel.textContent = `${node.altitude}m`;

    g.appendChild(ring);
    g.appendChild(circle);
    g.appendChild(icon);
    g.appendChild(nameLabel);
    g.appendChild(altLabel);

    if (onNodeClick) {
      g.addEventListener('click', () => onNodeClick(node));
    }

    nodesGroup.appendChild(g);
  }
}

export function renderSquad(squadGroup) {
  if (!squadGroup) return;
  squadGroup.innerHTML = '';

  for (const [key, member] of Object.entries(squad)) {
    let x, y;
    if (member.currentNode) {
      const node = nodes[member.currentNode];
      if (!node || !isMapPoint([node.x, node.y])) continue;
      x = node.x;
      y = node.y;
    } else if (member.onEdge) {
      const edge = edges.find(e => e.id === member.onEdge);
      const allPts = edge && getEdgePoints(edge);
      if (allPts) {
        const edgeProgress = Number(member.edgeProgress);
        const progress = Number.isFinite(edgeProgress) ? Math.max(0, Math.min(1, edgeProgress)) : 0.5;
        const totalPts = allPts.length - 1;
        const progressAlongEdge = progress * totalPts;
        const segIdx = Math.min(Math.floor(progressAlongEdge), totalPts - 1);
        const segProgress = progressAlongEdge - segIdx;
        const p0 = allPts[segIdx];
        const p1 = allPts[segIdx + 1];
        x = p0[0] + (p1[0] - p0[0]) * segProgress;
        y = p0[1] + (p1[1] - p0[1]) * segProgress;
      } else {
        continue;
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

export function highlightRoute(routeHL, pathEdges) {
  if (!routeHL) return;
  routeHL.innerHTML = '';
  if (!pathEdges || pathEdges.length === 0) return;

  for (const edge of pathEdges) {
    const pts = getEdgePoints(edge);
    if (!pts) continue;
    const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    path.setAttribute('class', 'route-highlight');
    routeHL.appendChild(path);
  }
}

export function clearRouteHighlight(routeHL) {
  if (routeHL) routeHL.innerHTML = '';
}

export function updateMapVisuals(blizzardOvl) {
  if (blizzardOvl) {
    blizzardOvl.classList.toggle('hidden', !simState.blizzard);
  }

  // Ice on black runs
  const blackEdges = document.querySelectorAll('.ski-edge.black');
  blackEdges.forEach(el => {
    el.classList.toggle('ice-warning-edge', simState.iceBlack);
  });

  // Closed lift visual
  for (const edge of edges.filter(item => item.type === 'lift' && item.simControl === 'liftClosed')) {
    const liftEdge = document.getElementById(`edge-${edge.id}`);
    if (!liftEdge) continue;
    liftEdge.style.opacity = simState.liftClosed ? '0.2' : '1';
    liftEdge.style.strokeDasharray = simState.liftClosed ? '2 8' : '8 6';
  }
}
