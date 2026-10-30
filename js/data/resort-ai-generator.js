/* Text-based resort generation using Gemini or procedural fallback. */

import { generateProceduralResort } from './resort-generators.js';
import { saveCustomResort } from './resort-storage.js';
import { sanitizeResortTopology } from './resort-topology.js';

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
