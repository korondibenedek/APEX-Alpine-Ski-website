/* ═══════════════════════════════════════════════════════════════════
   audio-fx.js — Procedural Audio Synthesis (Radio Squelch & Cues)
   ═══════════════════════════════════════════════════════════════════ */

let audioCtx = null;

// Initialize and resume browser AudioContext
export function ensureAudioCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Procedural walkie-talkie radio squelch burst (white noise + bandpass filter + gain envelope)
export function playRadioSquelch() {
  return new Promise(resolve => {
    const ctx = ensureAudioCtx();
    const duration = 0.18;

    // White noise burst
    const bufferSize = ctx.sampleRate * duration;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3;
    }
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    // Bandpass filter to create authentic VHF/FM transceiver timbre
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 2000;
    bandpass.Q.value = 0.8;

    // Gain envelope
    const gain = ctx.createGain();
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.5, now + 0.02);
    gain.gain.setValueAtTime(0.5, now + duration - 0.04);
    gain.gain.linearRampToValueAtTime(0, now + duration);

    // Short tone pop
    const osc = ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.value = 1200;
    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(0, now);
    oscGain.gain.linearRampToValueAtTime(0.15, now + 0.01);
    oscGain.gain.linearRampToValueAtTime(0, now + 0.06);

    noiseSource.connect(bandpass).connect(gain).connect(ctx.destination);
    osc.connect(oscGain).connect(ctx.destination);

    noiseSource.start(now);
    noiseSource.stop(now + duration);
    osc.start(now);
    osc.stop(now + duration);

    setTimeout(resolve, duration * 1000 + 50);
  });
}

