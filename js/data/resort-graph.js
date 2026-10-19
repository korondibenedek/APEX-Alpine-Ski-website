/* ═══════════════════════════════════════════════════════════════════
   resort-graph.js — Mount Apex Ski Resort Topology & Map Graph
   ═══════════════════════════════════════════════════════════════════ */

// SVG coordinates tuned for the 900×680 viewBox
export const nodes = {
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

// difficulty: blue | red | black
// type: run | lift
// weight: traversal cost (lower = faster/easier)
export const edges = [
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
    name: 'Red Run 2', difficulty: 'red', type: 'run', weight: 4,
    waypoints: [[670, 240], [640, 300]],
  },
  // From Eagle Mid-Station
  {
    id: 'e7', from: 'eagleMid', to: 'panoramaHut',
    name: 'Blue Run 3', difficulty: 'blue', type: 'run', weight: 3,
    waypoints: [[440, 310], [520, 330]],
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
    id: 'l2', from: 'mainValleyBase', to: 'southBowlLift',
    name: 'South Express Chair', difficulty: 'lift', type: 'lift', weight: 2,
    waypoints: [[440, 580], [500, 540], [540, 510]],
  },
  {
    id: 'l3', from: 'eagleMid', to: 'glacierPeak',
    name: 'Summit Cable Car', difficulty: 'lift', type: 'lift', weight: 3,
    waypoints: [[395, 230], [405, 150], [415, 80]],
  },
];

// Simulator real-time environmental hazard state
export const simState = {
  blizzard: false,      // blizzard at Glacier Peak
  liftClosed: false,    // South Bowl Lift closed
  iceBlack: false,      // ice on black runs
};

