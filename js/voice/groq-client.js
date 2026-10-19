/* ═══════════════════════════════════════════════════════════════════
   groq-client.js — Ultra-Fast Groq Whisper Large v3 Turbo Client
   ═══════════════════════════════════════════════════════════════════ */

let _groqApiKey = (typeof localStorage !== 'undefined' && localStorage.getItem('apex_groq_key')) || '';

export function setGroqApiKey(key) {
  _groqApiKey = (key || '').trim();
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('apex_groq_key', _groqApiKey);
    }
  } catch (e) {}
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
  formData.append(
    'prompt',
    'Mount Apex ski resort, Renato, Kajti, Benedek, Ski Patrol, Panorama Hut, Glacier Peak, Ridge Drop, Avalanche Chute, Eagle Mid-Station, South Bowl Lift, Main Valley Base, hütte, gleccser, merre, útvonal.'
  );

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

