# APEX — Hands-Free Alpine & Ski Wingman
## Development & Iteration Log (`ai.md`)

**Project**: Hiya Voice AI Challenge — Prototype  
**Date**: October 19, 2026  
**Stack**: Vanilla HTML5/SVG, Tailwind CSS (CDN), Lucide Icons (CDN), Web Speech API, Web Audio API, Pure JavaScript (zero build step)

---

## 1. Initial Challenge & Architecture Setup

### Objective
Create a dark-mode tactical HUD ski wingman called **APEX** featuring an interactive alpine map and a hands-free voice AI agent.

### Files Created
- [`index.html`](file:///home/benedek/SÍapp/index.html) — Dual-panel layout:
  - **Left Panel (60%)**: "Alpine Sector Map & Live Simulator" (Mount Apex, 3,200m) with 8 stations, color-coded ski runs, live animated squad dots, and interactive simulator buttons (Blizzard, South Lift Closed, Ice on Black Runs).
  - **Right Panel (40%)**: "Helmet Visor HUD & Voice AI Agent" with Web Audio waveform visualizer, push-to-talk mic button, live transcript log, telemetry card, active navigation card, squad comms card, and emergency SOS card.
- [`styles.css`](file:///home/benedek/SÍapp/styles.css) — Tactical dark alpine theme, animated cyan route pulse stroke, snow/blizzard CSS animation, waveform audio bars, and red SOS beacon mode.
- [`mountain-data.js`](file:///home/benedek/SÍapp/mountain-data.js) — 8 nodes, 12+ ski runs and lifts, Dijkstra shortest-path pathfinding with dynamic avoidance constraints (`avoidBlack`, `avoidIce`), and mountain telemetry state.
- [`voice-engine.js`](file:///home/benedek/SÍapp/voice-engine.js) — Browser Web Speech API (`webkitSpeechRecognition` & `speechSynthesis`), synthesized walkie-talkie radio squelch burst (Web Audio API oscillator + white noise), regex-based intent classification, and optional Gemini 2.0 Flash tool-calling.
- [`app.js`](file:///home/benedek/SÍapp/app.js) — Application coordinator connecting SVG rendering, route drawing, simulator controls, and HUD state cards.

---

## 2. English Voice & Accent Stabilization

### Problem
- The AI was speaking in a Hungarian accent or falling back to the Hungarian system voice because the user's host OS locale is Hungarian.
- German/Hungarian accented characters in place names (*"Panorama Hütte"*, *"Renátó"*) tricked the browser's language detector into switching voices mid-sentence.

### Solution
- **Strict English Voice Selection**: Explicitly set `utter.lang = 'en-US'` and built a ranked voice selector preferring native voices (`Google US English`, `Microsoft Zira`, `Samantha`, `Daniel`).
- **Anglicized Data & Scripts**: Renamed *"Panorama Hütte"* to *"Panorama Hut"* and *"Renátó"* to *"Renato"*.
- **`sanitizeForTTS()`**: Implemented a sanitization pipeline that strips emoji, symbol glyphs, and normalizes unicode characters (`normalize('NFD')`) before passing text to `speechSynthesis`.

---

## 3. Microphone Recording Duration & Continuous Mode

### Problem
- The browser microphone was closing after very brief speech or single pauses because `continuous: false` and `interimResults: false` were initially set.

### Solution
- Set `recognition.continuous = true` and `recognition.interimResults = true`.
- Real-time partial speech is streamed to the status bar (`🎙️ interim text...`).
- Implemented auto-restart on unexpected recognition termination when the mic is actively toggled on.
- Silenced harmless `no-speech` events to prevent abrupt session termination.

---

## 4. Arc Browser Compatibility & Voice Feedback Loop

### Problem
- **Arc Browser**: In Arc (and other Chromium derivatives like Brave), Google's cloud speech recognition service is blocked, resulting in `network` or `not-allowed` errors on `webkitSpeechRecognition`.
- **Edge / Feedback Loop**: The microphone stayed open while the AI spoke its synthetic voice response, picking up its own audio and triggering an infinite loop.

### Solution
- **`_isSpeaking` Guard**: `pauseRecognition()` aborts the microphone while speech synthesis is active and automatically resumes 600ms after speech ends.
- **`onresult` & `onend` Locks**: Hard check `if (_isSpeaking) return;` prevents buffered speaker audio from being dispatched as user input.
- **Arc Browser Graceful Fallback**: Added descriptive status bar notices explaining that cloud voice services are restricted in Arc, encouraging use of the text box or testing in Edge/Chrome.

---

## 5. Skier Accounts & Profile Login System

### User Request
> *"how do i log in with other accounts?"*

### Solution
Implemented a full **Squad Accounts & Profile Login** subsystem:
- **Top Bar Operator Pill**: Clickable `[SKIER: Benedek @ Glacier Peak ▾]` badge in the top navigation bar.
- **Account Switcher Modal**:
  - **Benedek**: Team Lead / Alpine Skier at *Glacier Peak (3,200m)*
  - **Renato**: Alpine Scout / Radio Lead at *Panorama Hut (2,200m)*
  - **Kajti**: Downhill Specialist carving *Red Run 4 (2,000m)*
  - **Ski Patrol #4**: Mountain Rescue stationed at *Eagle Mid-Station (2,400m)*
  - **Custom Skier Registration**: Form allowing the user to enter any call sign (e.g. *Alex*, *David*) and select a starting mountain sector.
- **Map & Telemetry Synchronization**:
  - The map's green radar dot **"You"** immediately rebinds to the selected skier's coordinates.
  - Other skiers appear as teammates on the squad transceiver net.
  - Route planning origin dynamically updates to the active skier's position.
  - Session state persists in `localStorage.getItem('apex_active_account')`.

---

## 6. "Check Conditions" Voice Command Fix

### Problem
- Saying *"check conditions"* by voice failed to trigger `checkConditions`.

### Root Cause
1. **Regex Word Boundary**: The regex pattern was `\b(condition)\b`. The `\b` word boundary prevented matching plural `"conditions"`.
2. **Echo Filter Collision**: Because the default greeting message contained the phrase *"check conditions"*, the echo filter treated the user's incoming voice command as speaker echo and discarded it.

### Solution
- Updated regex to `\b(conditions?|weather|winds?|visibility|lifts?|open|closed|status|snow|ice|icy|temperature|temp|blizzard|forecast|telemetry)\b/i`.
- Refactored `isEchoOfAI()` to never drop user commands under 28 characters.
- Added visual HUD pulse to the Mountain Telemetry card upon condition queries.

---

## 7. Mayday / SOS Sensitivity & Loop Elimination

### Problem
- SOS mode was triggering too easily on ordinary words like *"help"* (e.g. *"can you help me route to..."*).
- Once triggered, the AI spoke *"MAYDAY received!"*, which the microphone picked up through the speakers, triggering an infinite Mayday loop.

### Solution
- **Removed Trigger Words from AI Speech**: The AI now announces *"Emergency beacon confirmed at [Location]... Support is en route."* (0 occurrences of *"mayday"*, *"sos"*, or *"help"* in audio).
- **Calibrated Intent Matching**: Requires explicit distress keywords (`mayday`, `sos`, `call ski patrol`, `send rescue`) or clear crash/injury statements (`i crashed`, `twisted knee`, `broke my leg`). General words like *"help"* in isolation no longer trigger SOS.
- **Debounce Lock**: Added a 15-second debounce preventing repeat triggers while an emergency beacon is active.
- **"Dismiss Emergency Beacon"**:
  - Voice command: *"Cancel SOS"*, *"Dismiss emergency"*, *"False alarm, I'm okay"*.
  - UI button: Added a **[Dismiss Emergency Beacon]** button directly on the red SOS HUD card.

---

## 8. Squad Member Tracking & Person/Station Routing

### User Request
> *"it does not react to the question where is renato or how doi i get to renato or a station make it do that"*

### Problem
1. **No "Where is..." Intent**: Inquiries like *"Where is Renato?"*, *"Where is Kajti?"*, or *"Where am I?"* did not match any intent pattern and fell to `unknown`.
2. **Station-Only Node Resolution**: `resolveNodeName()` only matched static station names. If a user asked *"How do I get to Renato?"*, the destination was returned as `null` because `renato` was not recognized as a destination.
3. **Generic "Station" Query**: *"How do I get to a station?"* was unrecognized because `"station"` alone had no default resolution.

### Solution
1. **Added `locateEntity` Intent**:
   - Matches: `where is`, `where are`, `where am i`, `locate`, `find`, `position of`.
   - Returns full status and coordinates for squad members (Renato, Kajti, Benedek, Ski Patrol) or any mountain station.
   - Highlights the member's animated pulsing dot on the SVG map and flashes their station circle.
2. **Dynamic Person & Station Resolution in `resolveNodeName()`**:
   - Person names (`renato`, `kajti`, `benedek`, `patrol`) now automatically resolve to their actual mountain coordinates (e.g. `renato` -> `panoramaHut`).
   - Generic queries (`"a station"`, `"the station"`, `"nearest station"`) dynamically resolve to the nearest downhill station from the skier's current position (e.g. `glacierPeak` -> `eagleMid`).
3. **Personalized Intercept Routing**:
   - `handlePlanSkiRoute()` now recognizes when the destination is a squad mate, announcing an intercept course:
     > *"Copy that! Plotting intercept route to Renato at Panorama Hut via Eagle Mid-Station. Max difficulty: blue. ETA approximately 6 minutes. Stay sharp, rider!"*
   - Displays `Panorama Hut (Renato)` on the Active Navigation HUD card.

---

## 9. Summary of Active Mountain Features

| Feature | Voice Command Examples | UI Trigger |
|---|---|---|
| **Squad Tracking** | *"Where is Renato?"* / *"Where is Kajti?"* / *"Where am I?"* | Quick Prompt chip / Text input |
| **Person Intercept Route** | *"How do I get to Renato?"* / *"Route to Kajti"* | Quick Prompt chip / Text input |
| **Nearest Station Route** | *"How do I get to a station?"* / *"Route to the station"* | Quick Prompt chip / Text input |
| **Station Route Navigation**| *"Route me to Panorama Hut avoiding black runs."* | Quick Prompt chip / Text input |
| **Squad Radio Comms** | *"Tell Renato and Kajti I'm taking the blue trail."* | Quick Prompt chip / Text input |
| **Mountain Telemetry** | *"Check conditions."* / *"How is the weather?"* | Quick Prompt chip / Telemetry Card |
| **Emergency SOS** | *"MAYDAY! I crashed off-piste near Avalanche Chute!"* | Quick Prompt chip / Text input |
| **Cancel SOS** | *"Cancel SOS."* / *"False alarm, I'm fine."* | [Dismiss Emergency Beacon] button |
| **Account Switching** | Select via profile modal | `[SKIER: Benedek ▾]` top bar button |
| **Weather Simulator** | Toggle Blizzard, Lift Closed, Ice on Black Runs | Simulator buttons above SVG map |

---

## 10. 3-State Toggle-to-Talk & AI Interrupt Cycle

### User Request
> *"úgy működjön a beszéd hogy megnyomom a gombot az betoggle-öl ezután megallgatja a mondandómat ha közben mégegyszer megnyomom hagyja abba a felvételt ezután válaszoljon majd toggleöljön ki, h a válasz közben ki toggle-ölöm akkor hagyja abba apofázást az ai"*

### State Machine Architecture
We refactored the voice engine into an explicit 3-state tactical radio machine:

```
           [ 1. IDLE ]
          /           \
 Click to Record    Click to Talk
        /               \
       v                 v
[ 2. RECORDING ]       (Idle)
       |
  Click to Send (or pause timeout)
       |
       v
  [ 3. APEX SPEAKING ]
   /               \
Natural Finish     Click to Silence AI
  /                   \
 v                     v
[ IDLE (Toggled Off) ] [ IDLE (Silenced) ]
```

1. **State 1 — IDLE (`TAP TO TALK`)**:
   - Mic is closed, zero battery/CPU waste, speech recognition is dormant.
   - Button displayed with dark alpine border.
   - Clicking transitions immediately to **State 2 (RECORDING)**.

2. **State 2 — RECORDING (`🔴 RECORDING… Speak now (Tap mic to send)`)**:
   - Mic stream active, Web Audio waveform visualizer pulses in real-time.
   - Continuous recognition accumulates all spoken sentences into `_sessionTranscript`.
   - Real-time live transcript displays in the status bar: `🎙️ "..." · Tap mic to send`.
   - **Clicking the button again**:
     - Immediately cuts off recording (`stopListening()`).
     - Submits the buffered transcript to `processInput()`.
     - Transitions to **State 3 (APEX SPEAKING)**.
   - **Silence Safety Fallback**: If the skier finishes talking and pauses for 3.8s without clicking, the system automatically dispatches the message hands-free.

3. **State 3 — APEX SPEAKING (`🔊 APEX SPEAKING… (Tap mic to silence)`)**:
   - Radio squelch burst plays ("Ksscht!"), cyan glow pulse triggers on HUD waveform & mic button.
   - English TTS voice speaks the tactical guidance.
   - **Interruption ("Hagyja abba a pofázást az AI")**:
     - If the user clicks the mic button while the AI is speaking:
     - `cancelSpeech()` immediately aborts `speechSynthesis.cancel()`, clears waveform animations, and resets status to *"AI silenced · Tap to talk"*.
     - System returns directly to **IDLE** state.
   - **Natural Completion**:
     - When the AI finishes its answer naturally:
     - The mic **remains closed** (does NOT auto-resume recognition).
     - System returns cleanly to **IDLE** state (*"toggleöljön ki"*).

---

## 11. Multi-Member Squad Inquiry & Isolated Telemetry Responses

### User Request
> *"és ne csak a renátóra lehessen rákérdezni ha meg rákérdezek valakire akkor csak az adott illetőtől mondjon infókat"*

### Problems Addressed
1. **Renato-Centric Queries**:
   - The intent classifier and route extractor only specifically looked for *Renato* in many places.
   - Simply saying a squad mate's name (e.g. *"Kajti"*, *"Benedek"*, *"Patrol"*, or Hungarian *"Hol van Kajti?"*, *"Kajti merre jár?"*) fell back to `unknown` or dumped the generic whole-team summary.
2. **Information Leak / Mixed-Up Details**:
   - When asking about a person, the system previously dumped general team messages or used `showSquadCard()` formatted as `"📻 Sent to: Renato & Kajti"`, confusing the skier with unrelated member info.
   - If `locateEntity()` fell through, it uttered: *"Squad update: Renato is at Panorama Hut, Kajti is on Red Run 4, and you are at Glacier Peak."*, giving info about everyone instead of strictly the requested individual.

### Implementation & Fixes
1. **Dynamic Multi-Member Entity Resolution (`mountain-data.js`)**:
   - Explicit isolated handlers for each skier:
     - **Kajti**: Announces only Kajti's descent on *Red Run 4 (2,000m)* towards *South Bowl Lift*.
     - **Renato**: Announces only Renato at *Panorama Hut (2,200m)* on the hütte deck.
     - **Benedek**: Announces only Benedek at *Glacier Peak (3,200m)* at the summit.
     - **Ski Patrol**: Announces only Ski Patrol #4 on rescue standby at *Eagle Mid-Station (2,400m)*.
     - **Active Rider (You / Myself / Hol vagyok)**: Announces only your GPS fix.
     - **Custom Registered Riders**: Dynamically resolved by name from `availableAccounts`.
   - **Zero-Pollution Fallback**: If a target is unknown, it no longer dumps the entire squad; it reports *"Target not found on radar"*. Full squad overview is only uttered when explicitly asking for *"the squad / everyone / team / csapat"*.

2. **Dedicated Skier Telemetry HUD Card (`app.js`)**:
   - Implemented `showSquadMemberCard(entity)`:
     - Replaces generic broadcast comms card with clean individual telemetry.
     - Renders name, avatar, color-coded status badge, exact sector, elevation, and radio link (`CH-04 · 100% Signal`).

3. **SVG Map Pinpointing**:
   - Scaled animation (`scale(2.4)`) and radial radar glow pulse targeting **only** the requested person's SVG dot on the mountain map.
   - Flashes only their station with their custom theme color.

4. **Bi-Lingual Intent Matching (`voice-engine.js`)**:
   - Recognizes direct name queries (*"Kajti"*, *"Renato"*, *"Benedek"*, *"Patrol"*), Hungarian inquiries (*"Kajti hol van?"*, *"Kajti merre jár?"*, *"Mi a helyzet Kajtival?"*, *"Hegyimentő"*), and English inquiries (*"Where is Kajti?"*, *"Status of Patrol"*, *"Tell me about Renato"*).
   - Route interceptor (`extractRouteArgs`) now supports intercept plotting for all squad members.
   - Added 1-click Quick Demo prompt chips for **Kajti**, **Renato**, and **Ski Patrol**.

---

## 12. Fuzzy Phonetic Name Matching & ASR Pronunciation Tolerance

### User Request
> *"csináld meg úgy hogy a magyar neveket vagy bármilyen nevet mivel nem lehet szépen kiejteni ezért hasonlítsa össze a bemeneten kapott neveket a benne a pályára felvett emberekkel és amelyikre a legjobban hajaz annak értelmezze"*

### Problem
Because speech recognition runs using an English acoustic model (`en-US`), non-English / Hungarian names are regularly transcribed with phonetic distortions:
- *"Kajti"* $\rightarrow$ *"Kaity"*, *"Kitey"*, *"Katie"*, *"Kyte"*, *"Kity"*, *"Cajti"*
- *"Renátó"* $\rightarrow$ *"Renault"*, *"Renado"*, *"Renate"*, *"Ranato"*
- *"Benedek"* $\rightarrow$ *"Benedict"*, *"Benedec"*, *"Benedick"*, *"Bende"*
- *"Patrol"* $\rightarrow$ *"Petrol"*, *"hegyimentő"*, *"mentők"*
- Custom registered skiers (e.g. *"Zoltán"* $\rightarrow$ *"Zolton"*, *"Soltan"*)

Previously, strict string regexes failed when these distortions occurred, causing the AI to report `unknown` or fail to identify the intended skier.

### Architecture & Solution
Implemented a **Fuzzy Phonetic String Similarity Engine** in `mountain-data.js` and wired it into `voice-engine.js`:

1. **Phonetic Normalization (`normalizeText()`)**:
   - Strips accents (`normalize('NFD')`), lowercases, removes non-alphanumeric noise, and standardizes spacing.

2. **Normalized Levenshtein Distance (`similarity()`)**:
   - Calculates dynamic edit distance between incoming tokens and registered skier names on a normalized scale ($0.0$ to $1.0$).
   - Gives substring containment boosts when high character overlaps occur.

3. **Alpine Crew Phonetic Alias Table (`KNOWN_PERSON_ALIASES`)**:
   - Pre-maps common English ASR transcriptions for active team members (*Kajti*, *Renato*, *Benedek*, *Ski Patrol*).

4. **Dynamic Slope Skier Resolution (`matchBestPerson(text)`)**:
   - Scans single words and 2-word sliding phrases from the user's transcript.
   - Compares them against all active riders in `availableAccounts`.
   - Resolves to the highest-scoring skier exceeding threshold ($0.62$).

5. **Universal Integration**:
   - **Entity Locating (`locateEntity()`)**: *"Where is Kaity?"* or *"Where is Renault?"* immediately resolves to the correct skier and displays their isolated HUD telemetry card.
   - **Route Planning (`extractRouteArgs()`)**: *"Route to Kaity"* or *"How do I get to Renado?"* locks the intercept path directly to that skier's current station.
   - **Squad Comms (`extractSquadArgs()`)**: *"Tell Kaity that I'm taking the blue trail"* sends the radio message strictly to Kajti.

---

## 13. Project Showcase & Documentation (`README.md`)

### Overview
Authored a complete [`README.md`](file:///home/benedek/SÍapp/README.md) document to showcase the prototype:
- **Project Vision**: Explaining why hands-free AI voice is critical for extreme alpine environments where smartphone touchscreens are inaccessible with heavy gloves.
- **HUD Architecture**: ASCII layout diagram illustrating the dual-panel split between the Alpine Map (60%) and Helmet Visor HUD (40%).
- **Feature Deep Dives**: Documenting the 3-state mic toggle, fuzzy phonetic matching, isolated telemetry cards, Dijkstra navigation, procedural Web Audio walkie-talkie squelch, and emergency SOS mode.
- **Quick Demo Guide**: Table of clickable and voice-driven test phrases for rapid verification.
- **Zero-Build Run Instructions**: Step-by-step instructions for launching with Python HTTP server or Live Server with zero external dependencies.





