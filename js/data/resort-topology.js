/* Validation and file helpers for resort topology imports. */

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
