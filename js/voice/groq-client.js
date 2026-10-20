/* ═══════════════════════════════════════════════════════════════════
   groq-client.js — Ultra-Fast Groq Whisper Large v3 Turbo Client
   ═══════════════════════════════════════════════════════════════════ */

import { nodes, activeResortMeta } from '../data/resort-graph.js';
import { getAccounts } from '../data/accounts.js';

function loadGroqApiKey() {
  try {
    return typeof localStorage !== 'undefined' ? localStorage.getItem('apex_groq_key') || '' : '';
  } catch (error) {
    console.warn('Failed to load Groq API key from browser storage', error);
    return '';
  }
}

let _groqApiKey = loadGroqApiKey();

export function setGroqApiKey(key) {
  const normalizedKey = (key || '').trim();
  try {
    if (typeof localStorage === 'undefined') throw new Error('Browser storage is unavailable.');
    if (normalizedKey) {
      localStorage.setItem('apex_groq_key', normalizedKey);
    } else {
      localStorage.removeItem('apex_groq_key');
    }
  } catch (error) {
    throw new Error(`Could not save the Groq API key in this browser: ${error.message}`);
  }
  _groqApiKey = normalizedKey;
}

export function getGroqApiKey() {
  return _groqApiKey;
}

// Transcribe audio using Groq's high-speed Whisper Large v3 Turbo endpoint
export async function transcribeWithGroq(audioBlob) {
  if (!_groqApiKey) {
    throw new Error('Groq API key not configured');
  }

  const formData = new FormData();
  formData.append('file', audioBlob, 'recording.webm');
  formData.append('model', 'whisper-large-v3-turbo');
  formData.append('temperature', '0');
  const names = getAccounts().filter(account => account.isCustom).map(account => account.name);
  const locations = Object.values(nodes).map(node => node.name);
  const promptTerms = [activeResortMeta.name, ...names, ...locations, 'hütte', 'gleccser', 'merre', 'útvonal'];
  formData.append('prompt', promptTerms.filter(Boolean).join(', '));

  const res = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${_groqApiKey}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Groq Whisper API error (${res.status}): ${errorBody}`);
  }

  const data = await res.json();
  return (data.text || '').trim();
}
