/* ═══════════════════════════════════════════════════════════════════
   voice-engine.js — Speech I/O, Intent Router & Function Calling
   ═══════════════════════════════════════════════════════════════════ */

const VoiceEngine = (() => {
  // ── State ─────────────────────────────────────────────────────────
  let recognition = null;
  let isListening = false;
  let geminiApiKey = '';
  let audioCtx = null;
  let analyserNode = null;
  let micStream = null;
  let animFrameId = null;

  // Callbacks set by app.js
  let onTranscript = null;       // (text) => void
  let onAIResponse = null;       // (text) => void
  let onFunctionCall = null;     // (fnName, args) => void
  let onListeningChange = null;  // (bool) => void
  let onSpeakingChange = null;   // (bool) => void

  // ── Init Audio Context ────────────────────────────────────────────
  function ensureAudioCtx() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  // ── Walkie-Talkie Radio Sound ─────────────────────────────────────
  function playRadioSquelch() {
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

      // Bandpass filter to make it sound radio-like
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

  // ── Speech Synthesis ──────────────────────────────────────────────
  // Cached English voice — resolved once at init
  let _cachedEnglishVoice = null;

  function pickBestEnglishVoice() {
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) return null;

    // Only consider English voices
    const enVoices = voices.filter(v => /^en[-_]/i.test(v.lang));
    if (enVoices.length === 0) return null;

    // Ranked preference: native-sounding, well-known TTS voices
    const preferred = [
      'Google US English',
      'Google UK English Female',
      'Google UK English Male',
      'Microsoft Zira',
      'Microsoft David',
      'Microsoft Mark',
      'Samantha',           // macOS
      'Daniel',             // macOS British
      'Karen',              // macOS Australian
      'Alex',               // macOS
    ];

    for (const name of preferred) {
      const match = enVoices.find(v => v.name.includes(name));
      if (match) return match;
    }

    // Fallback: prefer en-US, then en-GB, then any en-*
    return enVoices.find(v => v.lang === 'en-US')
        || enVoices.find(v => v.lang === 'en-GB')
        || enVoices[0];
  }

  let _activeSpeechResolve = null;

  function speak(text) {
    return new Promise(resolve => {
      if (!('speechSynthesis' in window)) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();

      const utter = new SpeechSynthesisUtterance(text);
      utter.lang  = 'en-US';   // Force English regardless of system locale
      utter.rate  = 1.05;
      utter.pitch = 0.95;
      utter.volume = 0.9;

      // Use cached voice or resolve it now
      if (!_cachedEnglishVoice) _cachedEnglishVoice = pickBestEnglishVoice();
      if (_cachedEnglishVoice) utter.voice = _cachedEnglishVoice;

      _activeSpeechResolve = resolve;

      const finish = () => {
        if (_activeSpeechResolve === resolve) {
          _activeSpeechResolve = null;
        }
        resolve();
      };

      utter.onend = finish;
      utter.onerror = finish;

      window.speechSynthesis.speak(utter);
    });
  }

  // Strip emoji & accented chars so TTS never switches language
  function sanitizeForTTS(text) {
    return text
      // Remove emoji and symbol characters
      .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{200D}\u{20E3}\u{E0020}-\u{E007F}]/gu, '')
      // Normalize accented chars to ASCII
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Guard: true while AI is speaking — recognition results are ignored
  let _isSpeaking = false;
  let _lastSpokenText = '';
  let _lastSpokenTime = 0;

  // Immediately cancel any AI speech playback and reset indicators
  function cancelSpeech() {
    if ('speechSynthesis' in window) {
      try { window.speechSynthesis.cancel(); } catch (e) {}
    }
    if (_activeSpeechResolve) {
      const r = _activeSpeechResolve;
      _activeSpeechResolve = null;
      try { r(); } catch (e) {}
    }
    _isSpeaking = false;
    _lastSpokenTime = Date.now();

    const waveform = document.getElementById('waveform');
    const speaker = document.getElementById('speakerIndicator');
    waveform?.classList.remove('waveform-speaking');
    if (speaker) speaker.classList.add('hidden');

    if (onSpeakingChange) onSpeakingChange(false);
  }

  // Pause recognition so the mic doesn't hear TTS playback
  function pauseRecognition() {
    if (recognition) {
      try { recognition.abort(); } catch (e) {}
    }
  }

  async function aiSpeak(text) {
    const waveform = document.getElementById('waveform');
    const speaker = document.getElementById('speakerIndicator');

    // Cancel any previous speaking first
    cancelSpeech();

    // ── Stop mic while AI talks to prevent feedback loop ──
    _isSpeaking = true;
    _lastSpokenText = text.toLowerCase();
    _lastSpokenTime = Date.now();
    pauseRecognition();
    if (onSpeakingChange) onSpeakingChange(true);

    try {
      await playRadioSquelch();
      if (!_isSpeaking) return; // interrupted during radio squelch

      waveform?.classList.add('waveform-speaking');
      if (speaker) speaker.classList.remove('hidden');

      await speak(sanitizeForTTS(text));
    } finally {
      waveform?.classList.remove('waveform-speaking');
      if (speaker) speaker.classList.add('hidden');
      _isSpeaking = false;
      _lastSpokenTime = Date.now();
      if (onSpeakingChange) onSpeakingChange(false);

      // When the AI finishes answering, it toggles OFF and stays idle
      // as requested ("ezután válaszoljon majd toggleöljön ki").
      // Recognition remains paused/stopped.
    }
  }

  // ── Speech Recognition Setup ──────────────────────────────────────
  let _sessionTranscript = '';
  let _silenceTimer = null;

  function resetSilenceTimer() {
    clearTimeout(_silenceTimer);
    _silenceTimer = setTimeout(() => {
      if (isListening && _sessionTranscript.trim()) {
        console.log('Auto-submitting after pause in speech');
        finishRecordingAndSubmit();
      }
    }, 3800);
  }

  function isEchoOfAI(transcript) {
    if (!_lastSpokenText) return false;
    const cleanT = transcript.toLowerCase().trim();
    if (!cleanT) return true;

    // Discard any transcript if it contains canned phrases that the AI just uttered
    if (Date.now() - _lastSpokenTime < 3500) {
      if (cleanT.includes('emergency beacon') || cleanT.includes('transponder locked') || cleanT.includes('support is en route') || cleanT.includes('copy that') || cleanT.includes('route locked') || cleanT.includes('operator switched') || cleanT.includes('ski patrol has been')) {
        return true;
      }
      if (_lastSpokenText.includes(cleanT) && cleanT.length > 15) {
        return true;
      }
    }
    return false;
  }

  function initRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Speech Recognition not supported in this browser (common in Arc/Brave without cloud speech flags)');
      const micSt = document.getElementById('micStatus');
      if (micSt) micSt.textContent = 'Voice API unavailable in Arc · Use text box or Chrome/Edge';
      return;
    }
    recognition = new SpeechRecognition();
    recognition.continuous = true;          // Keep listening until user finishes or taps again
    recognition.interimResults = true;      // Real-time live transcript
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      // Hard guard: discard anything captured while AI is speaking
      if (_isSpeaking) return;

      let interim = '';
      let sessionFinal = '';

      for (let i = 0; i < event.results.length; i++) {
        const res = event.results[i];
        if (res.isFinal) {
          sessionFinal += res[0].transcript + ' ';
        } else {
          interim += res[0].transcript;
        }
      }

      const combined = (sessionFinal + ' ' + interim).replace(/\s+/g, ' ').trim();
      _sessionTranscript = combined;

      // Show live text in the mic status bar
      const micSt = document.getElementById('micStatus');
      if (micSt && isListening && !_isSpeaking) {
        if (combined) {
          micSt.textContent = '🎙️ "' + combined + '" · Tap mic to send';
        } else {
          micSt.textContent = '🔴 RECORDING… Speak now (Tap mic to send)';
        }
      }

      // If user pauses for a prolonged period, auto-submit fallback
      if (combined) {
        resetSilenceTimer();
      }
    };

    recognition.onerror = (event) => {
      // 'no-speech' is normal — just means silence, don't abort
      if (event.error === 'no-speech' || event.error === 'aborted') return;
      console.warn('Speech recognition error:', event.error);
      const micSt = document.getElementById('micStatus');
      if (event.error === 'network') {
        if (micSt) micSt.textContent = 'Arc/Network voice service blocked · Use text box or Chrome';
      } else if (event.error === 'not-allowed') {
        if (micSt) micSt.textContent = 'Mic permission denied in browser settings';
      }
      stopListening();
    };

    recognition.onend = () => {
      // Keep listening as long as user is actively recording
      if (isListening && !_isSpeaking) {
        try { recognition.start(); } catch (e) { /* already running */ }
      }
    };
  }

  // ── Mic Waveform Visualizer ───────────────────────────────────────
  function startWaveformViz(stream) {
    const ctx = ensureAudioCtx();
    const source = ctx.createMediaStreamSource(stream);
    analyserNode = ctx.createAnalyser();
    analyserNode.fftSize = 64;
    source.connect(analyserNode);

    const bars = document.querySelectorAll('#waveform .wave-bar');
    const dataArray = new Uint8Array(analyserNode.frequencyBinCount);

    function draw() {
      analyserNode.getByteFrequencyData(dataArray);
      bars.forEach((bar, i) => {
        const idx = Math.min(i, dataArray.length - 1);
        const val = dataArray[idx] / 255;
        bar.style.height = `${Math.max(4, val * 26)}px`;
      });
      animFrameId = requestAnimationFrame(draw);
    }
    draw();
  }

  function stopWaveformViz() {
    if (animFrameId) cancelAnimationFrame(animFrameId);
    animFrameId = null;
    // Reset bars
    document.querySelectorAll('#waveform .wave-bar').forEach(bar => {
      bar.style.height = '4px';
    });
  }

  // ── Start / Stop / Submit Listening ──────────────────────────────
  async function startListening() {
    if (isListening) return;
    if (_isSpeaking) cancelSpeech();

    _sessionTranscript = '';
    clearTimeout(_silenceTimer);
    _silenceTimer = null;

    if (!recognition) initRecognition();
    if (!recognition) return;

    try {
      micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      startWaveformViz(micStream);
    } catch (err) {
      console.warn('Microphone access denied:', err);
    }

    isListening = true;
    document.getElementById('waveform')?.classList.add('waveform-active');
    if (onListeningChange) onListeningChange(true);

    try {
      recognition.start();
    } catch (e) {
      // Already started
    }
  }

  function stopListening() {
    if (!isListening) return;
    isListening = false;

    clearTimeout(_silenceTimer);
    _silenceTimer = null;

    try { recognition?.stop(); } catch (e) {}
    if (micStream) {
      micStream.getTracks().forEach(t => t.stop());
      micStream = null;
    }
    stopWaveformViz();
    document.getElementById('waveform')?.classList.remove('waveform-active');
    if (onListeningChange) onListeningChange(false);
  }

  function finishRecordingAndSubmit() {
    clearTimeout(_silenceTimer);
    _silenceTimer = null;

    const spokenText = _sessionTranscript.trim();
    _sessionTranscript = '';

    // Stop listening immediately so the mic is closed
    stopListening();

    if (!spokenText) {
      const micSt = document.getElementById('micStatus');
      if (micSt) micSt.textContent = 'No speech detected · Tap to talk';
      setTimeout(() => {
        if (!isListening && !_isSpeaking && micSt) {
          micSt.textContent = 'TAP TO TALK · or use prompts above';
        }
      }, 1800);
      return;
    }

    if (isEchoOfAI(spokenText)) {
      console.log('Ignored speaker echo from AI:', spokenText);
      return;
    }

    if (onTranscript) onTranscript(spokenText);
    processInput(spokenText);
  }

  function toggleListening() {
    // 1. If AI is speaking, clicking immediately silences the AI!
    if (_isSpeaking) {
      cancelSpeech();
      const micSt = document.getElementById('micStatus');
      if (micSt) micSt.textContent = 'AI silenced · Tap to talk';
      setTimeout(() => {
        if (!isListening && !_isSpeaking && micSt) {
          micSt.textContent = 'TAP TO TALK · or use prompts above';
        }
      }, 1500);
      return;
    }

    // 2. If currently recording, clicking stops recording and submits to AI!
    if (isListening) {
      finishRecordingAndSubmit();
      return;
    }

    // 3. Otherwise (idle), start recording!
    startListening();
  }

  // ── Intent Router (built-in NLU) ─────────────────────────────────
  function classifyIntent(text) {
    const lower = text.toLowerCase().trim();

    // Cancel / Dismiss SOS
    if (/\b(cancel\s*(sos|emergency|beacon|mayday)|dismiss\s*(sos|emergency|beacon)|false\s*alarm|i('m| am)\s*(fine|okay|ok)|all\s*good)\b/i.test(lower)) {
      return 'clearSOS';
    }

    // SOS / Emergency — Calibrated Sensitivity:
    // Requires an explicit distress keyword ("mayday", "sos", "call ski patrol", "send rescue")
    // or clear crash/injury report. Never triggers on general words like "help" or "crash" alone.
    const isExplicitDistress = /\b(mayday\s*mayday|mayday|sos|emergency\s*beacon|call\s*ski\s*patrol|need\s*ski\s*patrol|send\s*ski\s*patrol|send\s*rescue|need\s*rescue|medical\s*emergency)\b/i.test(lower);
    const isSevereInjury = /\b(i\s*crashed|crashed\s*off|broke\s*my|twisted\s*my|twisted\s*knee|severe\s*injury|serious\s*injury)\b/i.test(lower);
    const isEmergencyHelp = /\b(send\s*help|need\s*help|help\s*me)\b/i.test(lower) && /\b(patrol|rescue|crash|crashed|injured|bleeding|broken|chute)\b/i.test(lower);

    if (isExplicitDistress || isSevereInjury || isEmergencyHelp) {
      return 'triggerSOS';
    }

    // Conditions / Weather / Lift Status check
    // Matches: "check conditions", "condition", "weather", "lift open", "snow", "wind", etc.
    if (/\b(conditions?|weather|winds?|visibility|lifts?|open|closed|status|snow|ice|icy|temperature|temp|blizzard|forecast|telemetry|időjárás|viszonyok|hóhelyzet)\b/i.test(lower)) {
      return 'checkConditions';
    }

    // Check if query is asking how/what the mountain status is
    if (/\b(check|how('s| is| are)|what('s| is| are)|report)\b/i.test(lower) && /\b(mountain|sector|peak|base|summit|run|slope)\b/i.test(lower)) {
      return 'checkConditions';
    }

    // Locate / Where is / Find query (e.g. "where is renato", "where is kajti", "where is the hut", "where am i")
    if (/\b(where\s*(is|are|am)|locate|find|position\s*of|who\s*is\s*at|hol\s*van)\b/i.test(lower)) {
      return 'locateEntity';
    }

    // Squad comms (explicit radio / message sending)
    if (/\b(tell|radio|ping\s*squad|message\s*squad|notify|send\s*message|üzenet|mondd|szólj|üzend)\b/i.test(lower)) {
      return 'pingSquad';
    }

    // Route planning (supports typos like "how doi i get to", "how to get to", "take me to", "ski to")
    if (/\b(route|navigate|take\s*me|go\s*to|get\s*to|how\s*(do\s*i|doi\s*i|can\s*i|to)\s*(get|reach|go|ski)|way\s*to|path\s*to|guide\s*me|direction|avoid|lead\s*me|head\s*to|ski\s*to|interception|útvonal|vigyél|menjünk)\b/i.test(lower)) {
      return 'planSkiRoute';
    }

    // Direct person inquiry check using fuzzy phonetic matching against registered skiers
    const personMatch = MountainData.matchBestPerson(lower);
    if (personMatch) {
      return 'locateEntity';
    }

    // Locate / Where is / Find query (e.g. "where is renato", "where is kajti", "where is the hut", "where am i", "hol van...", "merre...")
    if (/\b(where\s*(is|are|am|was)|locate|find|position\s*of|who\s*is\s*at|status\s*of|tell\s*me\s*about|info\s*(on|about)|hol\s*(van|vannak|jár)|merre\s*(van|jár)|hol\s*találom|helyzete|státusza|mit\s*csinál|mi\s*a\s*helyzet)\b/i.test(lower)) {
      return 'locateEntity';
    }

    // Squad overview inquiry (e.g. "squad", "team", "csapat", "where is everyone", "hol vannak a többiek")
    if (/\b(squad|team|everyone|everybody|csapat|többiek|összesen)\b/i.test(lower)) {
      return 'locateEntity';
    }

    // Fallback: try route if "to" + location/person mentioned
    if (/\bto\b/i.test(lower)) {
      const dest = MountainData.resolveNodeName(lower);
      if (dest) return 'planSkiRoute';
    }

    return 'unknown';
  }

  function extractRouteArgs(text) {
    const lower = text.toLowerCase();
    const args = {
      from: null,
      to: null,
      avoidBlack: false,
      avoidIce: false,
      targetPerson: null,
    };

    // Detect from
    const fromMatch = lower.match(/(?:from|at|i'm at|i am at|starting at)\s+([a-z\s]+?)(?:\.|,|$|\band\b|\bto\b|\bavoiding\b)/i);
    if (fromMatch) {
      args.from = MountainData.resolveNodeName(fromMatch[1].trim());
    }
    // Default from: current player location
    if (!args.from) {
      args.from = MountainData.squad.you?.currentNode || 'glacierPeak';
    }

    // Detect person in route query using fuzzy matching
    const personMatch = MountainData.matchBestPerson(lower);
    if (personMatch) {
      args.targetPerson = personMatch.account.name;
      args.to = MountainData.resolveNodeName(personMatch.account.id);
    }

    // Detect explicit destination with "to" or "reach"
    if (!args.to) {
      const toMatch = lower.match(/(?:to|toward|towards|reach|get\s*to|lead\s*me\s*to|take\s*me\s*to|ski\s*to)\s+([a-z\s]+?)(?:\.|,|$|\band\b|\bavoiding\b)/i);
      if (toMatch) {
        args.to = MountainData.resolveNodeName(toMatch[1].trim());
      }
    }

    // If still no destination, scan entire phrase with resolveNodeName
    if (!args.to) {
      args.to = MountainData.resolveNodeName(lower);
    }

    // Avoid flags
    if (/avoid.*black|no black|skip.*black|easy.*route|safe.*route|tired/i.test(lower)) {
      args.avoidBlack = true;
    }
    if (/avoid.*ice|no ice|skip.*ice/i.test(lower)) {
      args.avoidIce = true;
    }

    return args;
  }

  function extractSquadArgs(text) {
    const lower = text.toLowerCase();
    const recipients = [];

    const personMatch = MountainData.matchBestPerson(lower);
    if (personMatch) {
      recipients.push(personMatch.account.name);
    }

    if (recipients.length === 0) {
      recipients.push('Renato', 'Kajti'); // default: broadcast
    }

    // Extract ETA
    let eta = null;
    const etaMatch = lower.match(/(\d+)\s*(min|minute)/i);
    if (etaMatch) eta = parseInt(etaMatch[1]);

    // Extract message gist
    let message = text;
    const msgMatch = text.match(/(?:tell|ping|message|radio)\s+(?:[a-z0-9#\s]+?)\s+(?:that\s+)?(.+)/i);
    if (msgMatch) message = msgMatch[1];

    return { recipients, message, eta };
  }

  function extractSOSArgs(text) {
    const lower = text.toLowerCase();
    let location = 'avalancheChute'; // default
    const loc = MountainData.resolveNodeName(lower);
    if (loc) location = loc;

    let injury = 'unknown injury';
    if (/knee/i.test(lower)) injury = 'twisted knee';
    else if (/leg/i.test(lower)) injury = 'leg injury';
    else if (/arm/i.test(lower)) injury = 'arm injury';
    else if (/head/i.test(lower)) injury = 'head injury';
    else if (/back/i.test(lower)) injury = 'back injury';
    else if (/crash/i.test(lower)) injury = 'crash — assessing injuries';

    return { location, injury };
  }

  function extractConditionsArgs(text) {
    const lower = text.toLowerCase();
    let sector = null;
    const loc = MountainData.resolveNodeName(lower);
    if (loc) sector = MountainData.nodes[loc]?.name || null;
    // Check for 'south lift' specifically
    if (/south.*lift|bowl lift/i.test(lower)) sector = 'South Bowl Lift';
    return { sector };
  }

  // ── Process Input (main dispatcher) ───────────────────────────────
  async function processInput(text) {
    if (!text || !text.trim()) return;

    const intent = classifyIntent(text);

    // If Gemini API key is set, try LLM tool-calling first
    if (geminiApiKey && intent !== 'unknown') {
      try {
        await processWithGemini(text);
        return;
      } catch (err) {
        console.warn('Gemini API call failed, falling back to local router:', err);
      }
    }

    // Local intent routing
    switch (intent) {
      case 'planSkiRoute': {
        const args = extractRouteArgs(text);
        if (!args.to) {
          const resp = "I couldn't determine your destination. Could you specify where you'd like to go? For example: Panorama Hut, Eagle Mid-Station, or Main Valley Base.";
          if (onAIResponse) onAIResponse(resp);
          await aiSpeak(resp);
          return;
        }
        if (onFunctionCall) onFunctionCall('planSkiRoute', args);
        break;
      }
      case 'pingSquad': {
        const args = extractSquadArgs(text);
        if (onFunctionCall) onFunctionCall('pingSquad', args);
        break;
      }
      case 'checkConditions': {
        const args = extractConditionsArgs(text);
        if (onFunctionCall) onFunctionCall('checkConditions', args);
        break;
      }
      case 'triggerSOS': {
        const args = extractSOSArgs(text);
        if (onFunctionCall) onFunctionCall('triggerSOS', args);
        break;
      }
      case 'clearSOS': {
        if (onFunctionCall) onFunctionCall('clearSOS', {});
        break;
      }
      case 'locateEntity': {
        if (onFunctionCall) onFunctionCall('locateEntity', { query: text });
        break;
      }
      default: {
        const resp = "Copy that. I didn't quite catch a specific command. You can ask me to plan a route, check conditions, ping your squad, or call SOS. What do you need, rider?";
        if (onAIResponse) onAIResponse(resp);
        await aiSpeak(resp);
      }
    }
  }

  // ── Gemini API Tool-Calling (optional) ────────────────────────────
  async function processWithGemini(text) {
    const tools = [{
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

    const systemInstruction = `You are APEX, a tactical hands-free AI wingman for alpine skiing.
You help skiers navigate Mount Apex (3,200m), a ski resort with 8 key locations connected by blue (easy), red (intermediate), and black (expert) ski runs and gondola lifts.
The user is currently at ${MountainData.nodes[MountainData.squad.you.currentNode]?.name || 'Glacier Peak'}.
Their squad: Renato (at Panorama Hut) and Kajti (on Red Run 4).
Current conditions: ${MountainData.simState.blizzard ? 'BLIZZARD at peak' : 'Clear'}, ${MountainData.simState.liftClosed ? 'South Lift CLOSED' : 'All lifts open'}, ${MountainData.simState.iceBlack ? 'ICE on black runs' : 'No ice'}.
Be concise, tactical, and use a confident ski-wingman radio tone. Use function calls to execute actions.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemInstruction }] },
          contents: [{ role: 'user', parts: [{ text }] }],
          tools,
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
          args.from = MountainData.resolveNodeName(args.from || '') || MountainData.squad.you.currentNode;
          args.to = MountainData.resolveNodeName(args.to || '') || null;
          args.avoidBlack = args.avoidBlack || false;
          args.avoidIce = args.avoidIce || false;
        }
        if (fnName === 'triggerSOS') {
          args.location = MountainData.resolveNodeName(args.location || '') || 'avalancheChute';
        }

        if (onFunctionCall) onFunctionCall(fnName, args);
        return;
      }
      if (part.text) {
        if (onAIResponse) onAIResponse(part.text);
        await aiSpeak(part.text);
        return;
      }
    }
  }

  // ── Public API ────────────────────────────────────────────────────
  return {
    init() {
      initRecognition();
      // Preload voices and eagerly cache the best English one
      if ('speechSynthesis' in window) {
        const tryCache = () => {
          _cachedEnglishVoice = pickBestEnglishVoice();
        };
        tryCache();
        window.speechSynthesis.onvoiceschanged = tryCache;
      }
    },
    toggleListening,
    startListening,
    stopListening,
    cancelSpeech,
    processInput,
    aiSpeak,
    playRadioSquelch,
    get isListening() { return isListening; },
    get isSpeaking() { return _isSpeaking; },
    set geminiApiKey(key) { geminiApiKey = key; },
    get geminiApiKey() { return geminiApiKey; },

    // Callback setters
    set onTranscript(fn) { onTranscript = fn; },
    set onAIResponse(fn) { onAIResponse = fn; },
    set onFunctionCall(fn) { onFunctionCall = fn; },
    set onListeningChange(fn) { onListeningChange = fn; },
    set onSpeakingChange(fn) { onSpeakingChange = fn; },
  };
})();

