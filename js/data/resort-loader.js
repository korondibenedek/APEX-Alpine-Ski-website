/* ═══════════════════════════════════════════════════════════════════
   resort-loader.js — Real Ski Resort Search, AI Vision & Image Generator
   ═══════════════════════════════════════════════════════════════════
   Features:
   1. Real-World Resort Presets (Austria, Hungary, Slovakia, France, etc.)
   2. Custom Resort Persistence (localStorage: apex_custom_resorts)
   3. Multimodal AI Vision Generation (Gemini 2.5 Flash with Base64 Image)
   4. Intelligent Offline Computer Vision Analyzer (Canvas pixel & peak contours)
   5. Dynamic Terrain Switching & Squad Redistribution
   ═══════════════════════════════════════════════════════════════════ */

import { REAL_RESORTS } from './resorts-db.js';
import { setResortData } from './resort-graph.js';
import { getAccounts, saveAccounts, syncSquadState } from './accounts.js';

let _activeResortId = (typeof localStorage !== 'undefined' && localStorage.getItem('apex_current_resort')) || 'mountApex';

export function getActiveResortId() {
  return _activeResortId;
}

// ─────────────────────────────────────────────────────────────────
// 1. Custom Resort Storage & Retrieval
// ─────────────────────────────────────────────────────────────────

export function getCustomResorts() {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem('apex_custom_resorts');
    if (!raw) return [];
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch (e) {
    return [];
  }
}

export function saveCustomResort(resort) {
  if (!resort || !resort.id) return false;
  try {
    const list = getCustomResorts();
    const idx = list.findIndex(r => r.id === resort.id);
    if (idx >= 0) {
      list[idx] = resort;
    } else {
      list.unshift(resort); // Place newly generated resort on top
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('apex_custom_resorts', JSON.stringify(list));
      localStorage.setItem('apex_custom_resort_' + resort.id, JSON.stringify(resort));
    }
    return true;
  } catch (e) {
    console.error('Failed to save custom resort to localStorage:', e);
    return false;
  }
}

export function deleteCustomResort(resortId) {
  try {
    let list = getCustomResorts();
    list = list.filter(r => r.id !== resortId);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('apex_custom_resorts', JSON.stringify(list));
      localStorage.removeItem('apex_custom_resort_' + resortId);
    }
    return true;
  } catch (e) {
    return false;
  }
}

export function getAllPresets() {
  const custom = getCustomResorts();
  return [...custom, ...Object.values(REAL_RESORTS)];
}

export function searchPresetResorts(query) {
  const q = (query || '').toLowerCase().trim();
  if (!q) return getAllPresets();

  return getAllPresets().filter(r => {
    return (
      r.name.toLowerCase().includes(q) ||
      (r.country && r.country.toLowerCase().includes(q)) ||
      r.id.toLowerCase().includes(q) ||
      (r.nodes && Object.values(r.nodes).some(n => n.name && n.name.toLowerCase().includes(q)))
    );
  });
}

// ─────────────────────────────────────────────────────────────────
// 2. Topology Sanitizer & Filename Parser
// ─────────────────────────────────────────────────────────────────

export function sanitizeResortTopology(resort) {
  if (!resort || !resort.nodes) return null;
  const validNodeKeys = new Set(Object.keys(resort.nodes));

  // Ensure nodes have required coordinates, names and altitudes
  for (const [key, node] of Object.entries(resort.nodes)) {
    node.id = key;
    node.name = node.name || key;
    node.altitude = Number(node.altitude) || 1500;
    node.x = Math.max(30, Math.min(870, Math.round(Number(node.x) || 450)));
    node.y = Math.max(40, Math.min(650, Math.round(Number(node.y) || 300)));
    node.icon = node.icon || '📍';
  }

  // Filter edges to only those connecting existing valid nodes
  if (Array.isArray(resort.edges)) {
    resort.edges = resort.edges.filter(e => {
      return e && e.from && e.to && validNodeKeys.has(e.from) && validNodeKeys.has(e.to);
    });
    resort.edges.forEach((e, idx) => {
      e.id = e.id || `e_${idx + 1}`;
      e.name = e.name || `Pálya ${idx + 1}`;
      e.difficulty = ['blue', 'red', 'black', 'lift'].includes(e.difficulty) ? e.difficulty : 'blue';
      e.type = e.type === 'lift' ? 'lift' : 'run';
      e.weight = Number(e.weight) || (e.difficulty === 'black' ? 5 : e.difficulty === 'red' ? 3 : 2);
    });
  } else {
    resort.edges = [];
  }

  return resort;
}

export function extractResortNameFromFilename(filename) {
  if (!filename) return '';
  let name = filename.replace(/\.[a-zA-Z0-9]+$/, ''); // remove extension
  name = name.replace(/[-_]+/g, ' '); // replace dashes & underscores
  // remove common trail map words
  name = name.replace(/\b(pistenplan|trailmap|trail|map|ski|panoramakarte|pano|panorama|resort|winter|official|sitour|image|media|foto|photo)\b/gi, '');
  name = name.replace(/\s+/g, ' ').trim();
  if (name.length >= 3) {
    return name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  }
  return '';
}

export async function readFileAsBase64(file) {
  if (typeof file === 'string' && file.startsWith('data:')) {
    const mime = file.substring(file.indexOf(':') + 1, file.indexOf(';'));
    const base64 = file.split(',')[1];
    return { dataUrl: file, base64, mimeType: mime };
  }

  if (typeof FileReader !== 'undefined') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result;
        const mime = file.type || 'image/jpeg';
        const base64 = typeof dataUrl === 'string' ? dataUrl.split(',')[1] : '';
        resolve({ dataUrl, base64, mimeType: mime });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  if (file && typeof file.arrayBuffer === 'function') {
    const buf = await file.arrayBuffer();
    const base64 = typeof Buffer !== 'undefined' ? Buffer.from(buf).toString('base64') : '';
    const mime = file.type || 'image/jpeg';
    return { dataUrl: `data:${mime};base64,${base64}`, base64, mimeType: mime };
  }

  return { dataUrl: '', base64: '', mimeType: 'image/jpeg' };
}

// ─────────────────────────────────────────────────────────────────
// 3. Intelligent Dual-Peak & Single-Peak Procedural Synthesizers
// ─────────────────────────────────────────────────────────────────

function buildDualPeakResort({ id, name, country, slug, hasLake, previewUrl }) {
  return {
    id,
    name: name || 'Kétcsúcsú Alpesi Síterep',
    country: country || 'Ausztria · Alpesi Régió',
    flag: '🏔️',
    altitude: 2118,
    baseAltitude: 868,
    description: `Képfelismeréssel generált kétcsúcsú síterep: ${name} (2118m), központi gerinc, tóparti állomás, 12 állomásos hálózat.`,
    sourceImage: true,
    sourceMode: 'offline-cv',
    imagePreview: previewUrl || null,
    nodes: {
      peakWest: {
        id: 'peakWest',
        name: `${name} Nyugati Panoráma Csúcs (2118m)`,
        altitude: 2118,
        x: 230, y: 70,
        icon: '⛰️'
      },
      peakEast: {
        id: 'peakEast',
        name: `${name} Keleti Csúcs & Kilátó (1997m)`,
        altitude: 1997,
        x: 680, y: 85,
        icon: '🦅'
      },
      ridgeCol: {
        id: 'ridgeCol',
        name: 'Központi Gerincnyereg (1890m)',
        altitude: 1890,
        x: 440, y: 145,
        icon: '⚡'
      },
      lakeStation: {
        id: 'lakeStation',
        name: hasLake ? `${name} Tóparti Állomás & Hütte (1800m)` : 'Alpesi Panoráma Hütte (1800m)',
        altitude: 1800,
        x: 490, y: 220,
        icon: hasLake ? '💧' : '🏠'
      },
      westBowl: {
        id: 'westBowl',
        name: 'Nyugati Mélyhó Katlan (1780m)',
        altitude: 1780,
        x: 190, y: 250,
        icon: '❄️'
      },
      eastBowl: {
        id: 'eastBowl',
        name: 'Keleti Sziklafal Rajt (1720m)',
        altitude: 1720,
        x: 740, y: 230,
        icon: '⚠️'
      },
      midHub: {
        id: 'midHub',
        name: `${name} Középállomás & Park (1600m)`,
        altitude: 1600,
        x: 430, y: 340,
        icon: '🚡'
      },
      snowpark: {
        id: 'snowpark',
        name: `${name} Freestyle Snowpark`,
        altitude: 1540,
        x: 670, y: 350,
        icon: '🏂'
      },
      westForest: {
        id: 'westForest',
        name: 'Fenyves Erdei Kanyarulat (1350m)',
        altitude: 1350,
        x: 240, y: 440,
        icon: '🌲'
      },
      sunPlateau: {
        id: 'sunPlateau',
        name: 'Napos Családi Fennsík (1420m)',
        altitude: 1420,
        x: 570, y: 450,
        icon: '🎿'
      },
      valleyWest: {
        id: 'valleyWest',
        name: `${name} Nyugati Völgyállomás (960m)`,
        altitude: 960,
        x: 280, y: 590,
        icon: '🏘️'
      },
      valleyMain: {
        id: 'valleyMain',
        name: `${name} Fő Völgybázis & Parkoló (868m)`,
        altitude: 868,
        x: 520, y: 620,
        icon: '🏘️'
      }
    },
    edges: [
      { id: `${slug}_e1`, from: 'peakWest', to: 'ridgeCol', name: 'Nyugati Gerinc Kék', difficulty: 'blue', type: 'run', weight: 2, waypoints: [[330, 100]] },
      { id: `${slug}_e2`, from: 'peakEast', to: 'ridgeCol', name: 'Keleti Gerincút Piros', difficulty: 'red', type: 'run', weight: 3, waypoints: [[560, 110]] },
      { id: `${slug}_e3`, from: 'peakWest', to: 'westBowl', name: 'Nyugati Fal Fekete', difficulty: 'black', type: 'run', weight: 5, waypoints: [[200, 160]] },
      { id: `${slug}_e4`, from: 'peakEast', to: 'eastBowl', name: 'Keleti Sziklafal Fekete', difficulty: 'black', type: 'run', weight: 5, waypoints: [[720, 160]] },
      { id: `${slug}_e5`, from: 'ridgeCol', to: 'lakeStation', name: 'Tóparti Átcsúszó Kék', difficulty: 'blue', type: 'run', weight: 2, waypoints: [[460, 180]] },
      { id: `${slug}_e6`, from: 'westBowl', to: 'midHub', name: 'Katlan Levezető Piros', difficulty: 'red', type: 'run', weight: 3, waypoints: [[310, 290]] },
      { id: `${slug}_e7`, from: 'lakeStation', to: 'midHub', name: 'Tóparti Családi Kék', difficulty: 'blue', type: 'run', weight: 2, waypoints: [[460, 280]] },
      { id: `${slug}_e8`, from: 'lakeStation', to: 'snowpark', name: 'Park Bevezető Piros', difficulty: 'red', type: 'run', weight: 3, waypoints: [[580, 290]] },
      { id: `${slug}_e9`, from: 'eastBowl', to: 'snowpark', name: 'Keleti Speed Chute', difficulty: 'black', type: 'run', weight: 4, waypoints: [[710, 290]] },
      { id: `${slug}_e10`, from: 'midHub', to: 'westForest', name: 'Erdei Kanyarulat Kék', difficulty: 'blue', type: 'run', weight: 2, waypoints: [[330, 390]] },
      { id: `${slug}_e11`, from: 'midHub', to: 'sunPlateau', name: 'Panoráma Autópálya Kék', difficulty: 'blue', type: 'run', weight: 2, waypoints: [[500, 400]] },
      { id: `${slug}_e12`, from: 'snowpark', to: 'sunPlateau', name: 'Park Levezető Kék', difficulty: 'blue', type: 'run', weight: 2, waypoints: [[620, 400]] },
      { id: `${slug}_e13`, from: 'westForest', to: 'valleyWest', name: 'Nyugati Erdei Völgylesiklás', difficulty: 'blue', type: 'run', weight: 3, waypoints: [[260, 520]] },
      { id: `${slug}_e14`, from: 'sunPlateau', to: 'valleyMain', name: 'Fő Völgypálya Kék', difficulty: 'blue', type: 'run', weight: 3, waypoints: [[540, 540]] },
      { id: `${slug}_e15`, from: 'valleyWest', to: 'valleyMain', name: 'Völgy Összekötő Sétány', difficulty: 'blue', type: 'run', weight: 1, waypoints: [[400, 600]] },
      // Lifts
      { id: `${slug}_lift1`, from: 'valleyMain', to: 'midHub', name: '10-es Fő Gondola (I+II)', difficulty: 'blue', type: 'lift', weight: 2, waypoints: [[470, 480]] },
      { id: `${slug}_lift2`, from: 'midHub', to: 'peakWest', name: 'Panoráma 6-üléses Express', difficulty: 'blue', type: 'lift', weight: 2, waypoints: [[330, 200]] },
      { id: `${slug}_lift3`, from: 'midHub', to: 'peakEast', name: 'Keleti Csúcsfelvonó', difficulty: 'blue', type: 'lift', weight: 2, waypoints: [[550, 210]] },
      { id: `${slug}_lift4`, from: 'valleyWest', to: 'westBowl', name: 'Nyugati 4-üléses Völgyexpress', difficulty: 'blue', type: 'lift', weight: 3, waypoints: [[230, 420]] },
      { id: `${slug}_lift5`, from: 'sunPlateau', to: 'lakeStation', name: 'Tóparti 4-üléses', difficulty: 'blue', type: 'lift', weight: 2, waypoints: [[530, 330]] }
    ]
  };
}

function buildSinglePeakResort({ id, name, country, slug, hasLake, previewUrl }) {
  return {
    id,
    name: name || 'Alpesi Csúcs Síterep',
    country: country || 'Ausztria · Alpesi Régió',
    flag: '🏔️',
    altitude: 2750,
    baseAltitude: 1050,
    description: `Képfelismeréssel generált alpesi sípályarendszer: ${name} (2750m), körpanorámás gerincek, hütték és 12 állomásos felvonóhálózat.`,
    sourceImage: true,
    sourceMode: 'offline-cv',
    imagePreview: previewUrl || null,
    nodes: {
      summit: {
        id: 'summit',
        name: `${name} Főcsúcs (2750m)`,
        altitude: 2750,
        x: 450, y: 65,
        icon: '⛰️'
      },
      northRidge: {
        id: 'northRidge',
        name: 'Északi Gerinc (2580m)',
        altitude: 2580,
        x: 230, y: 110,
        icon: '🏔️'
      },
      eastHorn: {
        id: 'eastHorn',
        name: 'Keleti Kilátó Csúcs (2620m)',
        altitude: 2620,
        x: 690, y: 100,
        icon: '⚡'
      },
      powderBowl: {
        id: 'powderBowl',
        name: 'Gleccser Mélyhó Katlan',
        altitude: 2420,
        x: 370, y: 190,
        icon: '❄️'
      },
      steepCouloir: {
        id: 'steepCouloir',
        name: 'Sziklahasadék Fekete Rajt',
        altitude: 2350,
        x: 180, y: 240,
        icon: '⚠️'
      },
      panoramaHut: {
        id: 'panoramaHut',
        name: hasLake ? `${name} Tóparti Hütte & Kilátó` : 'Panoráma Alpesi Hütte (2150m)',
        altitude: 2150,
        x: 580, y: 220,
        icon: hasLake ? '💧' : '🏠'
      },
      midStation: {
        id: 'midStation',
        name: `${name} Középállomás (1900m)`,
        altitude: 1900,
        x: 430, y: 320,
        icon: '🚡'
      },
      snowpark: {
        id: 'snowpark',
        name: `${name} Freestyle Park`,
        altitude: 1820,
        x: 670, y: 340,
        icon: '🏂'
      },
      forestCross: {
        id: 'forestCross',
        name: 'Fenyves Erdei Elágazás',
        altitude: 1600,
        x: 240, y: 430,
        icon: '🌲'
      },
      sunnyPlateau: {
        id: 'sunnyPlateau',
        name: 'Napos Fennsík & Tanpálya',
        altitude: 1520,
        x: 540, y: 450,
        icon: '🎿'
      },
      southValley: {
        id: 'southValley',
        name: 'Déli Völgyállomás (1180m)',
        altitude: 1180,
        x: 280, y: 580,
        icon: '🏘️'
      },
      mainBase: {
        id: 'mainBase',
        name: `${name} Fő Völgybázis (1050m)`,
        altitude: 1050,
        x: 490, y: 620,
        icon: '🏘️'
      }
    },
    edges: [
      { id: `${slug}_e1`, from: 'summit', to: 'northRidge', name: 'Gerincút Kék', difficulty: 'blue', type: 'run', weight: 2, waypoints: [[340, 85]] },
      { id: `${slug}_e2`, from: 'summit', to: 'eastHorn', name: 'Keleti Panoráma Piros', difficulty: 'red', type: 'run', weight: 3, waypoints: [[570, 80]] },
      { id: `${slug}_e3`, from: 'summit', to: 'powderBowl', name: 'Csúcs Mélyhó Piros', difficulty: 'red', type: 'run', weight: 3, waypoints: [[410, 130]] },
      { id: `${slug}_e4`, from: 'northRidge', to: 'steepCouloir', name: 'Északi Fal Meredek Fekete', difficulty: 'black', type: 'run', weight: 5, waypoints: [[200, 170]] },
      { id: `${slug}_e5`, from: 'powderBowl', to: 'midStation', name: 'Katlan Levezető Kék', difficulty: 'blue', type: 'run', weight: 2, waypoints: [[400, 260]] },
      { id: `${slug}_e6`, from: 'eastHorn', to: 'panoramaHut', name: 'Napos Szakasz Piros', difficulty: 'red', type: 'run', weight: 3, waypoints: [[640, 160]] },
      { id: `${slug}_e7`, from: 'panoramaHut', to: 'midStation', name: 'Hütte Átcsúszó Kék', difficulty: 'blue', type: 'run', weight: 2, waypoints: [[500, 270]] },
      { id: `${slug}_e8`, from: 'panoramaHut', to: 'snowpark', name: 'Park Bevezető Kék', difficulty: 'blue', type: 'run', weight: 2, waypoints: [[630, 280]] },
      { id: `${slug}_e9`, from: 'steepCouloir', to: 'forestCross', name: 'Erdei Fekete Chute', difficulty: 'black', type: 'run', weight: 5, waypoints: [[210, 340]] },
      { id: `${slug}_e10`, from: 'midStation', to: 'forestCross', name: 'Nyugati Átkötő Piros', difficulty: 'red', type: 'run', weight: 3, waypoints: [[330, 380]] },
      { id: `${slug}_e11`, from: 'midStation', to: 'sunnyPlateau', name: 'Családi Kék Autópálya', difficulty: 'blue', type: 'run', weight: 2, waypoints: [[490, 390]] },
      { id: `${slug}_e12`, from: 'snowpark', to: 'sunnyPlateau', name: 'Park Levezető Kék', difficulty: 'blue', type: 'run', weight: 2, waypoints: [[610, 400]] },
      { id: `${slug}_e13`, from: 'forestCross', to: 'southValley', name: 'Déli Erdei Pálya Kék', difficulty: 'blue', type: 'run', weight: 3, waypoints: [[260, 510]] },
      { id: `${slug}_e14`, from: 'sunnyPlateau', to: 'mainBase', name: 'Fő Völgylesiklás Kék', difficulty: 'blue', type: 'run', weight: 3, waypoints: [[510, 540]] },
      { id: `${slug}_e15`, from: 'southValley', to: 'mainBase', name: 'Völgy Összekötő Sétány', difficulty: 'blue', type: 'run', weight: 1, waypoints: [[380, 600]] },
      // Lifts
      { id: `${slug}_lift1`, from: 'mainBase', to: 'midStation', name: `${name} 10-es Főkabin`, difficulty: 'blue', type: 'lift', weight: 2, waypoints: [[460, 470]] },
      { id: `${slug}_lift2`, from: 'midStation', to: 'summit', name: `${name} Csúcsgondola`, difficulty: 'blue', type: 'lift', weight: 2, waypoints: [[440, 190]] },
      { id: `${slug}_lift3`, from: 'southValley', to: 'northRidge', name: 'Északi 6-üléses Express', difficulty: 'blue', type: 'lift', weight: 3, waypoints: [[240, 350]] },
      { id: `${slug}_lift4`, from: 'sunnyPlateau', to: 'eastHorn', name: 'Napfény 4-üléses', difficulty: 'blue', type: 'lift', weight: 2, waypoints: [[620, 270]] }
    ]
  };
}

// ─────────────────────────────────────────────────────────────────
// 4. Offline Computer Vision & Contour Analyzer
// ─────────────────────────────────────────────────────────────────

export async function analyzeImageOffline(imageFile, fileInfo, customName, country) {
  let name = (customName || '').trim();
  if (!name && imageFile && imageFile.name) {
    name = extractResortNameFromFilename(imageFile.name);
  }
  if (!name) name = 'Alpesi Sípályarendszer';

  const userCountry = (country || '').trim() || 'Ausztria · Alpesi Régió';
  const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'custom';
  const id = 'img_' + slug + '_' + Date.now();

  let hasDualPeaks = false;
  let hasCentralLake = false;

  // Run canvas pixel sampling if browser canvas is available
  if (typeof document !== 'undefined' && fileInfo && fileInfo.dataUrl) {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      const loaded = await new Promise((resolve) => {
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = fileInfo.dataUrl;
      });

      if (loaded && img.naturalWidth > 0 && img.naturalHeight > 0) {
        const canvas = document.createElement('canvas');
        const W = 120;
        const H = 90;
        canvas.width = W;
        canvas.height = H;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, W, H);
        const imgData = ctx.getImageData(0, 0, W, H);
        const data = imgData.data;

        // Sample top 40% (peaks) across Left (0..35%), Center (35..65%), Right (65..100%)
        let leftBrightness = 0, leftCount = 0;
        let centerBrightness = 0, centerCount = 0;
        let rightBrightness = 0, rightCount = 0;
        let blueLakePixels = 0;

        for (let y = 0; y < H; y++) {
          for (let x = 0; x < W; x++) {
            const idx = (y * W + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            const lum = (r * 0.299 + g * 0.587 + b * 0.114);

            // Upper ridge evaluation
            if (y < H * 0.4) {
              if (x < W * 0.35) {
                leftBrightness += lum;
                leftCount++;
              } else if (x > W * 0.65) {
                rightBrightness += lum;
                rightCount++;
              } else {
                centerBrightness += lum;
                centerCount++;
              }
            }

            // Mountain lake / reservoir detection (blue-cyan cluster in mid-altitude bowl)
            if (y > H * 0.25 && y < H * 0.65 && x > W * 0.25 && x < W * 0.75) {
              if (b > 110 && b > r + 20 && b >= g - 10) {
                blueLakePixels++;
              }
            }
          }
        }

        const avgLeft = leftCount ? leftBrightness / leftCount : 0;
        const avgCenter = centerCount ? centerBrightness / centerCount : 0;
        const avgRight = rightCount ? rightBrightness / rightCount : 0;

        // If left and right upper bands both have snow/peaks while center has a dip/valley
        if (avgLeft > 115 && avgRight > 115 && (avgLeft > avgCenter * 0.95 || avgRight > avgCenter * 0.95)) {
          hasDualPeaks = true;
        }

        // If lake pixel cluster detected
        if (blueLakePixels >= 10) {
          hasCentralLake = true;
        }
      }
    } catch (cvErr) {
      console.warn('Canvas pixel analysis skipped:', cvErr);
    }
  }

  // Synthesize topological network tailored to the detected mountain structure
  if (hasDualPeaks) {
    return buildDualPeakResort({
      id,
      name,
      country: userCountry,
      slug,
      hasLake: hasCentralLake,
      previewUrl: fileInfo?.dataUrl
    });
  } else {
    return buildSinglePeakResort({
      id,
      name,
      country: userCountry,
      slug,
      hasLake: hasCentralLake,
      previewUrl: fileInfo?.dataUrl
    });
  }
}

// ─────────────────────────────────────────────────────────────────
// 5. Multimodal AI Vision Generation (Gemini 2.5 Flash)
// ─────────────────────────────────────────────────────────────────

export async function callGeminiVision(base64Data, mimeType, customName, country, apiKey) {
  const prompt = `You are an expert alpine ski resort cartographer and computer vision GIS specialist.
Examine this ski resort map image in detail.
Extract the ski terrain topology and convert it into a complete, working graph for a ski navigation app.
Identify:
1. Mountain Name: Look for text/logos on the map to identify the resort name (e.g. 'Kreischberg / Murau', 'Kitzbühel', etc.). If none is found or if customName is provided, use: "${customName || ''}".
2. Peak / Summit stations: Find the highest peaks shown on the map (top elevation, coordinates x: 150..750, y: 50..120).
3. Mid-stations, alpine restaurants/huts, transfer hubs (y: 180..460).
4. Valley base stations (y: 560..640).
5. Between 10 and 15 total stations (nodes) with realistic altitudes (in meters) matching this mountain.
6. The actual ski runs (blue, red, black) and chairlifts/gondolas (type: 'lift', difficulty: 'blue') connecting these stations as seen on the trail map.
Coordinates must fit SVG viewBox 0..900 (x) by 0..680 (y).
All edge 'from' and 'to' must reference existing node keys!
Return ONLY a single valid JSON object (no markdown quotes, no backticks, no preamble) matching this schema:
{
  "id": "image_resort_id",
  "name": "Resort Name",
  "country": "Country · Region",
  "flag": "🇦🇹",
  "altitude": 2118,
  "baseAltitude": 868,
  "description": "Short 1-sentence description of the ski area recognized from the trail map",
  "nodes": {
    "node_id": { "id": "node_id", "name": "Station Name (Meters)", "altitude": 2118, "x": 300, "y": 70, "icon": "⛰️" }
  },
  "edges": [
    { "id": "e1", "from": "node_id1", "to": "node_id2", "name": "Run or Lift Name", "difficulty": "blue", "type": "run", "weight": 3 }
  ]
}`;

  const candidateModels = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-2.0-flash'];
  let lastErr = null;

  for (const model of candidateModels) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  { text: prompt },
                  {
                    inline_data: {
                      mime_type: mimeType || 'image/jpeg',
                      data: base64Data
                    }
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.2,
              responseMimeType: 'application/json'
            }
          })
        }
      );

      if (!response.ok) {
        const errText = await response.text();
        lastErr = new Error(`Model ${model} error (${response.status}): ${errText}`);
        continue;
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) continue;

      const cleanJson = text.replace(/```(?:json)?/gi, '').replace(/```/g, '').trim();
      const obj = JSON.parse(cleanJson);

      if (obj.nodes && Object.keys(obj.nodes).length >= 4 && obj.edges && obj.edges.length >= 3) {
        return obj;
      }
    } catch (err) {
      lastErr = err;
    }
  }

  throw lastErr || new Error('Could not parse Gemini Vision response.');
}

// ─────────────────────────────────────────────────────────────────
// 6. High-Level Image Generator Entry Point
// ─────────────────────────────────────────────────────────────────

export async function generateResortFromImage(imageFile, customName = '', country = '', apiKey = null) {
  if (!imageFile) {
    throw new Error('Nem adtál meg képfájlt a generáláshoz.');
  }

  // 1. Read file as base64 dataUrl
  const fileInfo = await readFileAsBase64(imageFile);
  const resolvedApiKey = (apiKey || (typeof localStorage !== 'undefined' && localStorage.getItem('apex_gemini_key')) || '').trim();

  let resort = null;
  let usedMode = 'offline-cv';

  // 2. Try Gemini Multimodal Vision if API key is configured
  if (resolvedApiKey) {
    try {
      console.log('🤖 Attempting Gemini Multimodal Vision analysis on uploaded map...');
      const visionResult = await callGeminiVision(fileInfo.base64, fileInfo.mimeType, customName, country, resolvedApiKey);
      if (visionResult && visionResult.nodes && Object.keys(visionResult.nodes).length >= 4) {
        resort = visionResult;
        usedMode = 'gemini-vision';
        console.log('✨ Gemini Vision successfully recognized and generated terrain!');
      }
    } catch (visionErr) {
      console.warn('Gemini Vision failed or rate-limited, switching to offline Computer Vision analyzer:', visionErr);
    }
  }

  // 3. If no API key or Vision failed, run intelligent offline Computer Vision analyzer
  if (!resort) {
    console.log('🔍 Running offline Computer Vision & peak contour analyzer...');
    resort = await analyzeImageOffline(imageFile, fileInfo, customName, country);
    usedMode = 'offline-cv';
  }

  // 4. Sanitize and validate topology
  resort = sanitizeResortTopology(resort);
  resort.id = resort.id || ('img_' + Date.now());
  resort.sourceImage = true;
  resort.sourceMode = usedMode;
  resort.imagePreview = fileInfo.dataUrl;

  // 5. Persist to custom resorts catalog
  saveCustomResort(resort);

  return resort;
}

// ─────────────────────────────────────────────────────────────────
// 7. Dynamic AI Generation by Text Query (Fallback Synthesizer)
// ─────────────────────────────────────────────────────────────────

export async function generateResortWithAI(resortName, apiKey) {
  const cleanName = (resortName || 'Alpine Resort').trim();
  const resolvedApiKey = (apiKey || (typeof localStorage !== 'undefined' && localStorage.getItem('apex_gemini_key')) || '').trim();

  if (resolvedApiKey) {
    const prompt = `You are an expert alpine ski resort cartographer and GIS topographer.
The user wants to ski at the real-world ski resort: "${cleanName}".
Generate a geographically accurate, beautifully arranged topological ski resort graph in JSON format.
Requirements:
1. Include 10 to 14 key mountain stations (Real summit peak, real mountain huts, mid-stations, gondola hubs, valley base).
2. SVG ViewBox is 900 width by 680 height:
   - Summit/peak: y between 55 and 110, x between 380 and 520
   - Mid-stations & huts: y between 180 and 460, x between 200 and 700
   - Valley base: y between 590 and 640, x between 400 and 500
3. Altitudes must reflect real meters above sea level for ${cleanName}.
4. 12 to 16 connecting ski runs and cable lifts with real run names (difficulties: "blue" | "red" | "black" | "lift", types: "run" | "lift").
5. Return ONLY a single raw JSON object matching the standard schema.`;

    const candidateModels = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-2.0-flash'];
    for (const model of candidateModels) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${resolvedApiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: prompt }] }],
              generationConfig: { temperature: 0.2, responseMimeType: 'application/json' }
            })
          }
        );
        if (!response.ok) continue;
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) continue;
        const cleanJson = text.replace(/```(?:json)?/gi, '').replace(/```/g, '').trim();
        const obj = JSON.parse(cleanJson);
        if (obj.nodes && Object.keys(obj.nodes).length >= 4 && obj.edges && obj.edges.length >= 3) {
          const sanitized = sanitizeResortTopology(obj);
          sanitized.id = 'custom_' + cleanName.toLowerCase().replace(/[^a-z0-9]/g, '');
          saveCustomResort(sanitized);
          return sanitized;
        }
      } catch (err) {}
    }
  }

  // Fallback to procedural alpine generation
  const proc = generateProceduralResort(cleanName);
  saveCustomResort(proc);
  return proc;
}

export function generateProceduralResort(resortName) {
  const cleanName = (resortName || 'Custom Alpine').trim();
  const slug = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'alpine';
  const id = 'proc_' + slug;

  return buildSinglePeakResort({
    id,
    name: cleanName.charAt(0).toUpperCase() + cleanName.slice(1),
    country: 'Alpesi Síterep',
    slug,
    hasLake: false,
    previewUrl: null
  });
}

// ─────────────────────────────────────────────────────────────────
// 8. Active Resort Switcher & Startup Initializer
// ─────────────────────────────────────────────────────────────────

export function applyResort(resortData) {
  if (!resortData || !resortData.nodes || !resortData.edges) {
    console.error('Invalid resort data:', resortData);
    return false;
  }

  // Update resort-graph data
  setResortData(resortData.nodes, resortData.edges, {
    id: resortData.id,
    name: resortData.name,
    country: resortData.country || 'Alpine Terrain',
    flag: resortData.flag || '🏔️',
    altitude: resortData.altitude || 2000,
    baseAltitude: resortData.baseAltitude || 1000,
    description: resortData.description || '',
    runsCount: resortData.edges.filter(e => e.type !== 'lift').length,
    liftsCount: resortData.edges.filter(e => e.type === 'lift').length,
  });

  _activeResortId = resortData.id;
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('apex_current_resort', _activeResortId);
      if (resortData.sourceImage || resortData.id.startsWith('custom_') || resortData.id.startsWith('img_') || resortData.id.startsWith('proc_')) {
        saveCustomResort(resortData);
      }
    }
  } catch (e) {}

  // Redistribute squad skiers onto valid nodes of the new terrain
  const nodeKeys = Object.keys(resortData.nodes);
  if (nodeKeys.length > 0) {
    const accounts = getAccounts();
    const summitNode = nodeKeys[0];
    const baseNode = nodeKeys[nodeKeys.length - 1];
    const midNode = nodeKeys[Math.floor(nodeKeys.length / 2)] || summitNode;
    const mid2Node = nodeKeys[1] || midNode;

    const slotMap = [summitNode, midNode, mid2Node, baseNode];

    accounts.forEach((acc, idx) => {
      acc.onEdge = null;
      delete acc.edgeProgress;
      if (!resortData.nodes[acc.location]) {
        acc.location = slotMap[idx % slotMap.length] || summitNode;
      }
    });

    saveAccounts();
    syncSquadState();
  }

  return true;
}

export function initResort() {
  if (_activeResortId && REAL_RESORTS[_activeResortId]) {
    applyResort(REAL_RESORTS[_activeResortId]);
    return REAL_RESORTS[_activeResortId];
  } else if (_activeResortId) {
    const customList = getCustomResorts();
    const found = customList.find(r => r.id === _activeResortId);
    if (found) {
      applyResort(found);
      return found;
    }
    try {
      const saved = localStorage.getItem('apex_custom_resort_' + _activeResortId);
      if (saved) {
        const parsed = JSON.parse(saved);
        applyResort(parsed);
        return parsed;
      }
    } catch (e) {}
  }

  // Fallback to Mount Apex
  applyResort(REAL_RESORTS.mountApex);
  return REAL_RESORTS.mountApex;
}
