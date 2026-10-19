/* ═══════════════════════════════════════════════════════════════════
   gemini-client.js — Gemini 2.0 Flash Multimodal Audio & Tool-Calling
   ═══════════════════════════════════════════════════════════════════ */

import { nodes, simState } from '../data/resort-graph.js';
import { squad, getActiveAccount } from '../data/accounts.js';
import { resolveNodeName } from '../data/fuzzy-matcher.js';
import { aiSpeak } from './speech-tts.js';

let _geminiApiKey = (typeof localStorage !== 'undefined' && localStorage.getItem('apex_gemini_key')) || '';

export function setGeminiApiKey(key) {
  _geminiApiKey = (key || '').trim();
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('apex_gemini_key', _geminiApiKey);
    }
  } catch (e) {}
}

export function getGeminiApiKey() {
  return _geminiApiKey;
}

export function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result;
      const base64 = dataUrl.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export const GEMINI_TOOLS = [{
  function_declarations: [
    {
      name: 'planSkiRoute',
      description: 'Plan a ski route between two locations or to a teammate on the mountain, optionally avoiding black runs or icy conditions.',
      parameters: {
        type: 'object',
        properties: {
          from: { type: 'string', description: 'Starting location name or node ID' },
          to: { type: 'string', description: 'Destination location name, teammate name, or node ID' },
          avoidBlack: { type: 'boolean', description: 'Whether to avoid black (expert) runs' },
          avoidIce: { type: 'boolean', description: 'Whether to avoid icy runs' },
          targetPerson: { type: 'string', description: 'Target squad teammate name if routing to intercept a person' },
        },
        required: ['from', 'to'],
      },
    },
    {
      name: 'pingSquad',
      description: 'Send a tactical radio message or transmission to squad members (Renato, Kajti, Ski Patrol, or All Squad). Use this whenever the user wants to send a message, radio someone, or alert teammates/ski patrol about anything (including blizzards, weather, hazards, or meetups).',
      parameters: {
        type: 'object',
        properties: {
          recipients: { type: 'array', items: { type: 'string' }, description: 'List of squad member names or ["All Squad"]' },
          message: { type: 'string', description: 'Clean tactical message content to transmit over squad voice network (excluding command trigger words)' },
          eta: { type: 'number', description: 'Estimated time of arrival in minutes if mentioned' },
        },
        required: ['recipients', 'message'],
      },
    },
    {
      name: 'locateEntity',
      description: 'Locate a teammate, skier, squad overview, or mountain station/hut on the radar map (e.g., Renato, Kajti, Benedek, Ski Patrol, Panorama Hut, or "where is everyone").',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Name of the person, squad, or station to locate' },
        },
        required: ['query'],
      },
    },
    {
      name: 'checkConditions',
      description: 'Check and report current mountain weather, snow condition, blizzard alerts, and lift status overall or at a specific sector. Only call this when the user is ASKING about or checking the weather/conditions, NOT when sending a message about the weather.',
      parameters: {
        type: 'object',
        properties: {
          sector: { type: 'string', description: 'Specific sector or station to check' },
        },
      },
    },
    {
      name: 'triggerSOS',
      description: 'Trigger emergency SOS beacon — report crash, injury, or need for ski patrol rescue.',
      parameters: {
        type: 'object',
        properties: {
          location: { type: 'string', description: 'Location of the emergency on Mount Apex' },
          injury: { type: 'string', description: 'Description of injury or emergency situation' },
        },
        required: ['location'],
      },
    },
    {
      name: 'clearSOS',
      description: 'Dismiss or cancel active emergency SOS beacon when skier confirms they are safe or it was a false alarm.',
      parameters: {
        type: 'object',
        properties: {},
      },
    },
  ],
}];

function buildSystemInstruction() {
  const activeUser = getActiveAccount() || squad.you || { name: 'Benedek', location: 'glacierPeak' };
  const currentLocNode = nodes[activeUser.location]?.name || 'Glacier Peak';

  return `You are APEX, a tactical hands-free AI visor wingman for alpine skiing and snowboard exploration on Mount Apex (3,200m).
Current Operator: ${activeUser.name} (${activeUser.role || 'Skier'}) stationed at ${currentLocNode}.
Mount Apex key locations: Glacier Peak (summit 3200m), Ridge Drop (2950m), Avalanche Chute (2600m), Eagle Mid-Station (2400m), Panorama Hut (2200m), Pine Forest Crossroads (1950m), South Bowl Lift (1800m), Main Valley Base (1500m).
Squad members: Renato (Panorama Hut), Kajti (Red Run 4 / South Bowl), Ski Patrol (Eagle Mid-Station), and registered teammates.
Current weather: ${simState.blizzard ? 'BLIZZARD active at summit' : 'Clear'}, ${simState.liftClosed ? 'South Express Lift CLOSED due to high wind' : 'All lifts operational'}, ${simState.iceBlack ? 'ICE alert on black runs' : 'Groomed packed powder'}.

Guidelines:
1. When receiving direct user audio or text, transcribe the user's speech verbatim in the original spoken language (Hungarian or English).
2. If the user wants to send a message, radio someone, or alert teammates/ski patrol (e.g. "send a message to ski patrol that a blizzard has started", "tell Kajti watch out for ice", "küldj rádióüzenetet"), ALWAYS call pingSquad. Do NOT call checkConditions when the user is dispatching a message.
3. The user may speak Hungarian (e.g. "Hol van Renátó?", "Küldj rádióüzenetet a csapatnak hogy találkozzunk a hütténél", "Navigálj a Panoráma hüttéhez elkerülve a fekete pályákat", "Segítség, elestem a lavina hasadéknál"). Understand Hungarian phonetics, names, and declensions (Renátónak, Kajtihoz, hüttéhez, stb.) and trigger the exact tactical function call.
4. Be concise, tactical, and use an authentic alpine-wingman radio tone. Always prefer executing the matching function call.`;
}

// 1. Process direct raw audio with Gemini 2.0 Flash Multimodal Input
export async function processWithGeminiAudio(base64Audio, mimeType, { onFunctionCall, onAIResponse, onTranscript }) {
  if (!_geminiApiKey) return false;

  const systemInstruction = buildSystemInstruction();
  const cleanMimeType = (mimeType || 'audio/webm').split(';')[0];

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${_geminiApiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemInstruction }] },
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType: cleanMimeType,
                  data: base64Audio,
                },
              },
              {
                text: 'Listen to the skier helmet audio transmission. First transcribe what the skier said in the original language. Then execute the appropriate function call.',
              },
            ],
          },
        ],
        tools: GEMINI_TOOLS,
      }),
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini Multimodal Audio error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const candidate = data.candidates?.[0];
  if (!candidate) throw new Error('No candidate returned from Gemini');

  const parts = candidate.content?.parts || [];

  // Look for any transcribed text from Gemini
  let userTranscription = '';
  for (const part of parts) {
    if (part.text && !part.functionCall) {
      userTranscription = part.text.trim();
    }
  }

  for (const part of parts) {
    if (part.functionCall) {
      const fnName = part.functionCall.name;
      const args = part.functionCall.args || {};

      // If Gemini provided transcription text before the function call, display it
      if (userTranscription && onTranscript) {
        onTranscript(userTranscription);
      }

      // Normalization of locations
      if (fnName === 'planSkiRoute') {
        const active = getActiveAccount() || squad.you;
        args.from = resolveNodeName(args.from || '') || active?.location || 'glacierPeak';
        args.to = resolveNodeName(args.to || '') || null;
        args.avoidBlack = args.avoidBlack || false;
        args.avoidIce = args.avoidIce || false;
      }
      if (fnName === 'triggerSOS') {
        args.location = resolveNodeName(args.location || '') || 'avalancheChute';
      }

      if (onFunctionCall) onFunctionCall(fnName, args);
      return true;
    }
  }

  // If no function call, output conversational text
  if (userTranscription) {
    if (onAIResponse) onAIResponse(userTranscription);
    await aiSpeak(userTranscription);
    return true;
  }

  return false;
}

// 2. Process text with Gemini 2.0 Flash
export async function processWithGemini(text, { onFunctionCall, onAIResponse }) {
  if (!_geminiApiKey) return false;

  const systemInstruction = buildSystemInstruction();

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${_geminiApiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemInstruction }] },
        contents: [{ role: 'user', parts: [{ text }] }],
        tools: GEMINI_TOOLS,
      }),
    }
  );

  if (!response.ok) throw new Error(`Gemini API error: ${response.status}`);

  const data = await response.json();
  const candidate = data.candidates?.[0];
  if (!candidate) throw new Error('No candidates returned');

  const parts = candidate.content?.parts || [];
  for (const part of parts) {
    if (part.functionCall) {
      const fnName = part.functionCall.name;
      const args = part.functionCall.args || {};

      if (fnName === 'planSkiRoute') {
        const active = getActiveAccount() || squad.you;
        args.from = resolveNodeName(args.from || '') || active?.location || 'glacierPeak';
        args.to = resolveNodeName(args.to || '') || null;
        args.avoidBlack = args.avoidBlack || false;
        args.avoidIce = args.avoidIce || false;
      }
      if (fnName === 'triggerSOS') {
        args.location = resolveNodeName(args.location || '') || 'avalancheChute';
      }

      if (onFunctionCall) onFunctionCall(fnName, args);
      return true;
    }
    if (part.text) {
      if (onAIResponse) onAIResponse(part.text);
      await aiSpeak(part.text);
      return true;
    }
  }
  return false;
}
