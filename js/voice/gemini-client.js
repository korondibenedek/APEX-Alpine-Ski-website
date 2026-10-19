/* ═══════════════════════════════════════════════════════════════════
   gemini-client.js — Optional Gemini 2.0 Flash Tool-Calling Integration
   ═══════════════════════════════════════════════════════════════════ */

import { nodes, simState } from '../data/resort-graph.js';
import { squad } from '../data/accounts.js';
import { resolveNodeName } from '../data/fuzzy-matcher.js';
import { aiSpeak } from './speech-tts.js';

let _geminiApiKey = '';

export function setGeminiApiKey(key) {
  _geminiApiKey = key;
}

export function getGeminiApiKey() {
  return _geminiApiKey;
}

export const GEMINI_TOOLS = [{
  function_declarations: [
    {
      name: 'planSkiRoute',
      description: 'Plan a ski route between two locations on the mountain, optionally avoiding black runs or icy conditions.',
      parameters: {
        type: 'object',
        properties: {
          from: { type: 'string', description: 'Starting location name' },
          to: { type: 'string', description: 'Destination location name' },
          avoidBlack: { type: 'boolean', description: 'Whether to avoid black (expert) runs' },
          avoidIce: { type: 'boolean', description: 'Whether to avoid icy runs' },
        },
        required: ['from', 'to'],
      },
    },
    {
      name: 'pingSquad',
      description: 'Send a radio message to squad members (Renato and/or Kajti).',
      parameters: {
        type: 'object',
        properties: {
          recipients: { type: 'array', items: { type: 'string' }, description: 'List of squad member names' },
          message: { type: 'string', description: 'Message to send' },
          eta: { type: 'number', description: 'Estimated time of arrival in minutes' },
        },
        required: ['recipients', 'message'],
      },
    },
    {
      name: 'checkConditions',
      description: 'Check current mountain conditions and weather at a specific sector or overall.',
      parameters: {
        type: 'object',
        properties: {
          sector: { type: 'string', description: 'Specific sector or location to check' },
        },
      },
    },
    {
      name: 'triggerSOS',
      description: 'Trigger emergency SOS — report crash, injury, or need for ski patrol rescue.',
      parameters: {
        type: 'object',
        properties: {
          location: { type: 'string', description: 'Location of the emergency' },
          injury: { type: 'string', description: 'Description of injury or situation' },
        },
        required: ['location'],
      },
    },
  ],
}];

export async function processWithGemini(text, { onFunctionCall, onAIResponse }) {
  if (!_geminiApiKey) return false;

  const currentLocNode = nodes[squad.you?.currentNode]?.name || 'Glacier Peak';
  const systemInstruction = `You are APEX, a tactical hands-free AI wingman for alpine skiing.
You help skiers navigate Mount Apex (3,200m), a ski resort with 8 key locations connected by blue (easy), red (intermediate), and black (expert) ski runs and gondola lifts.
The user is currently at ${currentLocNode}.
Their squad: Renato (at Panorama Hut) and Kajti (on Red Run 4).
Current conditions: ${simState.blizzard ? 'BLIZZARD at peak' : 'Clear'}, ${simState.liftClosed ? 'South Lift CLOSED' : 'All lifts open'}, ${simState.iceBlack ? 'ICE on black runs' : 'No ice'}.
Be concise, tactical, and use a confident ski-wingman radio tone. Use function calls to execute actions.`;

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

      // Resolve node names from Gemini's text
      if (fnName === 'planSkiRoute') {
        args.from = resolveNodeName(args.from || '') || squad.you?.currentNode;
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

