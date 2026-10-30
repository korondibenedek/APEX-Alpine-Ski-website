/* Image-based resort generation: AI vision with an offline fallback. */

import { buildDualPeakResort, buildSinglePeakResort } from './resort-generators.js';
import { saveCustomResort } from './resort-storage.js';
import {
  extractResortNameFromFilename,
  readFileAsBase64,
  sanitizeResortTopology,
} from './resort-topology.js';

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
