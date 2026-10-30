# 🏔️ APEX — Hands-Free Alpine & Ski Wingman

> **Hiya Voice AI Challenge — Working Prototype**  
> An ultra-fast, zero-build tactical alpine helmet HUD with real-time voice AI, interactive SVG mountain navigation, Dijkstra pathfinding, and simulated walkie-talkie radio comms.

[![Hiya Voice AI Challenge](https://img.shields.io/badge/Hiya-Voice%20AI%20Challenge-00e5ff?style=for-the-badge)](https://hiya.com)
[![Stack](https://img.shields.io/badge/Stack-Vanilla%20JS%20%7C%20HTML5%20SVG%20%7C%20Tailwind%20CDN-10b981?style=for-the-badge)](file:///home/benedek/SÍapp/)
[![Audio API](https://img.shields.io/badge/Audio-Web%20Speech%20API%20%2B%20Web%20Audio%20Synth-f59e0b?style=for-the-badge)](file:///home/benedek/SÍapp/js/voice/index.js)
[![Zero Build](<https://img.shields.io/badge/Build-Zero%20Dependencies%20(No%20npm)-6366f1?style=for-the-badge>)](file:///home/benedek/SÍapp/index.html)

---

## 🎯 Project Overview & Vision

Skiers and alpine snowboarders operate in sub-zero, high-speed environments wearing thick insulated gloves, helmets, and anti-glare goggles. Taking off gloves to fiddle with smartphone touchscreens on a snowy ridge or during a blizzard is dangerous, slow, and causes frozen hands.

**APEX** acts as a **hands-free alpine wingman** integrated directly into the rider's helmet audio system and visor display. Through concise tactical voice commands, riders can:

- Plot downhill routes avoiding black runs or icy sections.
- Track squad teammates' real-time mountain telemetry without taking their eyes off the slope.
- Send hands-free walkie-talkie squad messages with automated ETA calculations.
- Instantly trigger Emergency Mountain Rescue (SOS) with locked GPS coordinates if they crash off-piste.

---

## 🖥️ Screen Layout & HUD Architecture

APEX splits the screen into a tactical, dark alpine cockpit:

```
┌────────────────────────────────────────────────────────┬──────────────────────────────────────────┐
│  [LEFT PANEL — 60%]                                    │  [RIGHT PANEL — 40%]                     │
│  Alpine Sector Map & Live Simulator (Mount Apex 3200m) │  Helmet Visor HUD & Voice AI Agent       │
│                                                        │                                          │
│  • Live Interactive SVG Ski Resort Graph (8 Nodes)     │  • Real-Time Web Audio Waveform Bars     │
│  • Color-Coded Runs: Blue (Easy), Red (Mid), Black     │  • 3-State Tap-to-Talk / Interrupt Mic   │
│  • Dashed Gondolas & Chairlifts (Summit & South Bowl)  │  • Tactical Walkie-Talkie Radio Squelch  │
│  • Animated Live Squad Radar Dots (You & registered teammates) │  • Live Skier & AI Transcript Log │
│  • Glowing Neon Route Pulse (Dijkstra Traversal)       │  • Active Navigation HUD Card            │
│  • Interactive Alpine Weather Simulator:               │  • Squad Comms & Telemetry HUD Card      │
│    [Toggle Blizzard] [Close South Lift] [Ice on Black] │  • Mountain Telemetry Card (-8°C, Wind)  │
│                                                        │  • Emergency SOS Mode (HUD turns red)    │
└────────────────────────────────────────────────────────┴──────────────────────────────────────────┘
```

---

## ⚡ Key Features

### 1. 🎙️ 3-State Toggle-to-Talk & Instant AI Silencing

Designed specifically for alpine gloves and one-button helmet triggers:

- **Click 1 (Toggle ON)**: Microphone opens, real-time waveform visualizer activates, and partial speech streams live to the status bar (`🔴 RECORDING… Speak now`).
- **Click 2 while speaking (Finish & Send)**: Immediately stops recording, shuts the microphone, and submits the speech. The AI speaks its tactical answer in native English, and **automatically toggles OFF (returns to IDLE)** when finished to prevent audio feedback.
- **Click while AI is answering (Silence AI)**: Instantly interrupts and cancels speech playback (`speechSynthesis.cancel()`), silencing the wingman immediately.
- **Hands-Free Fallback**: If the skier stops talking and stays silent for 3.8s, the system automatically dispatches the message hands-free.

### 2. 🔤 Fuzzy Phonetic Name Matching (Hungarian & Non-English Tolerance)

Because speech recognition utilizes an English acoustic model (`en-US`), non-English and Hungarian names can be phonetically distorted.

APEX features an integrated **Levenshtein Distance & Phonetic Similarity Engine** (`MountainData.matchBestPerson`):

- Automatically scans incoming words and phrases against all active skiers on the slope.
- Resolves to the highest-scoring candidate above threshold ($0.62$).
- Works across **route intercept planning**, **squad comms messaging**, and **member location inquiries**!

### 3. 🎯 Isolated Squad Member Telemetry (Zero Information Leak)

When inquiring about a registered teammate (e.g. _"Where is [name]?"_ or _"Hol van [name]?"_):

- The AI responds **strictly with that person's location, altitude, and activity**. It never leaks or mixes in details about other teammates.
- On the SVG map, **only that person's radar dot** expands with a high-vis pulse (`scale(2.4)`) and their sector node flashes with their assigned color.
- The `SQUAD COMMS` HUD card displays their dedicated telemetry badge (Sector, Elevation, Activity Status, Transceiver Link: `CH-04 · 100% Signal`).

### 4. 🧭 Dijkstra Alpine Shortest-Path Navigation

- Calculates the optimal downhill route across the active resort based on run difficulty and live weather constraints.
- **Constraint Avoidance**: Can dynamically avoid black runs (`avoidBlack: true`) or icy black slopes (`avoidIce: true`).
- **Live Hazard Warnings**: Automatically warns the skier if a route relies on a closed lift or traverses a blizzard sector.
- **Squad Intercepts**: Plotting a route to a teammate (e.g. _"Route to [name]"_) dynamically resolves the teammate's current coordinates and computes an intercept course with estimated travel time.

### 5. 📻 Walkie-Talkie Radio Sound Synthesizer (Web Audio API)

- Zero external MP3 files needed!
- Procedurally synthesizes authentic radio squelch bursts (_"Ksscht!"_) using white noise buffers, bandpass filters (2000Hz, Q=0.8), square wave pops (1200Hz), and gain envelopes.

### 6. 🚨 Emergency Red Alert Mode (SOS / Mayday)

- Triggers on explicit distress keywords (_"MAYDAY"_, _"SOS"_, _"I crashed, twisted my knee"_, _"Need ski patrol"_).
- Entire HUD flashes into crimson red emergency beacon mode.
- Locks mountain GPS coordinates: `45.0921° N, 6.0694° E`.
- AI speaks calming first-aid instructions while alerting rescue services.
- Can be dismissed via voice (_"Cancel SOS"_, _"False alarm, I'm okay"_) or via the dedicated **[Dismiss Emergency Beacon]** HUD button.

### 7. 👤 Custom Profile Creator & Multi-Skier Ecosystem

- **Universal Custom Profile Creator**:
  - Click the active account in the top bar to open the **Squad Accounts & Profile Creator** modal.
  - **Customizable Attributes**:
    - **Call Sign / Name**: Any name.
    - **Role / Specialty**: (e.g. _Speed Rider_, _Freeride Scout_, _Alpine Medic_).
    - **Mountain Sector**: Choose from all 8 resort nodes from Summit to Base.
    - **Avatar**: Interactive emoji selection (🎿 Skier, 🏂 Boarder, ⛷️ Telemark, ⛑️ Medic, 🏔️ Scout, ⚡ Speed, 🦅 Eagle, 🛷 Sled).
    - **Radar Color**: Tactical palette (Neon Cyan, Radar Green, Amber Orange, Electric Purple, Rescue Red, Alpine Gold).
  - **Unified Action**:
    - `[PROFIL LÉTREHOZÁSA]`: Egyetlen tiszta gomb a profil regisztrálásához.
    - `[Azonnali bejelentkezés ezzel a profillal]`: Opcionális checkbox az azonnali belépéshez.
  - **Profile Deletion**: Könnyedén törölhetők az egyéni csapattagok a szemetes ikonnal.
  - **`localStorage` Persistence**: Minden létrehozott profil és bejelentkezési állapot perzisztens a böngésző újratöltésekor.
- **100% Universal Feature Compatibility**:
  - **Every created profile** receives dynamic SVG radar markers, pulse rings, and name tags.
  - **Voice Location**: _"Where is [Profile]?"_ / _"Hol van [Profile]?"_ immediately highlights them, pulses their radar dot, flashes their sector, and shows their telemetry card.
  - **Intercept Navigation**: _"Route to [Profile]"_ plots the Dijkstra shortest path to their location.
  - **Squad Overview**: Asking _"Where is everyone?"_ dynamically compiles all current profiles and elevations into an alpine radio sitrep.

### 8. 📻 Dedicated Radio Comms Tab & Dynamic Transceiver Logging

- **HUD Tabs Bar**: Toggle effortlessly between `[VISOR HUD]` (navigation, telemetry, SOS) and `[RADIO COMMS]` (encrypted squad transceiver).
- **Dynamic Channel Filter Pills**: The transceiver header generates interactive filter buttons for **every registered squad member** with real-time transmission count badges.
- **Per-Profile Channel Logging**: Direct transmissions and incoming replies are isolated to each skier's log.
- **Individual vs Broadcast Targeting**: Address squad members individually (_"Tell David..."_, _"Radio Alex..."_, _"Szólj Dávidnak..."_) or broadcast to the entire team (_"Tell everyone..."_, _"Broadcast..."_).
- **Zero Demo Clutter**: Transceiver starts clean with zero fake messages, logging only real user transmissions and contextual replies.
- **ASR Normalizer & Alpine Radio Syntax**: Normalizes voice into crisp tactical NATO/Alpine English ending with _"Over."_
- **Dynamic Automated Replies**: Address any created or demo profile, and after 2.5s that skier radios back with an authentic reply reflecting their actual sector, avatar, and role!
- **Replay Audio**: Every transmission card includes a `[REPLAY AUDIO]` button that plays procedural radio squelch and English TTS.

---

## 🚀 How to Run the Prototype

APEX requires **zero build tools, zero npm packages, and zero bundlers**. Everything runs directly in the browser!

### Option A: Python HTTP Server (Recommended)

Open a terminal in the project directory and run:

```bash
python3 -m http.server 8080
```

Then navigate to: **[http://localhost:8080](http://localhost:8080)**

### Option B: VS Code Live Server / Node Serve

- Right-click `index.html` in VS Code and choose **"Open with Live Server"**, or
- Run `npx serve .`

> [!TIP]
> **Recommended Browsers**: Use **Google Chrome** or **Microsoft Edge** for native, unrestricted access to the browser's Web Speech API (`webkitSpeechRecognition` and `speechSynthesis`).

---

## 🗣️ Quick Demo Commands & Prompts

You can test these commands either by speaking into your microphone (click the mic button), clicking the **Quick Demo Prompt chips**, or typing into the HUD text box:

| Goal                      | Spoken Command (English or Hungarian)                              | UI Trigger / Result                                                                                        |
| ------------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| **Track a Teammate**      | _"Where is [name]?"_ / _"Hol van [name]?"_                         | Pulses that registered teammate's map marker and shows their telemetry                                     |
| **Route to Teammate**     | _"How do I get to [name]?"_ / _"Route to [name]"_                  | Highlights the path; shows ETA & difficulty                                                                |
| **Safe Routing**          | _"Route me to Panorama Hut avoiding black runs."_                  | Dijkstra avoids expert slopes, guides via Blue Run 1 & 3                                                   |
| **Radio Ping / Dispatch** | _"Send a radio message to [name]"_ / _"Tell squad we meet at hut"_ | Tactical radio check or message dispatch; logs under the selected channel with an automatic teammate reply |
| **Mountain Telemetry**    | _"Check conditions."_ / _"How is the weather?"_                    | Reports peak blizzard, wind speed, and lift status                                                         |
| **Emergency SOS**         | _"MAYDAY! I crashed and need rescue!"_                             | Triggers crimson HUD mode, locks GPS, alerts rescue services                                               |
| **Cancel SOS**            | _"Cancel SOS."_ / _"False alarm, I'm fine."_                       | [Dismiss Emergency Beacon] button restores normal HUD                                                      |

---

## 📁 Repository Structure

```
SÍapp/
├── index.html                 # Small application shell and view loader
├── views/                     # Header, dialogs, map, and HUD markup partials
│   ├── top-bar.html
│   ├── modals.html
│   ├── main-shell.html
│   ├── map-panel.html
│   └── hud-panel.html
├── styles.css                 # CSS entry point importing component styles
├── css/                       # Base, cards, controls, map, alerts, HUD, radio, and profile styles
├── README.md                  # Project showcase and usage documentation
├── ai.md                      # Complete chronological development & iteration log
└── js/                        # Modular JavaScript Architecture (ES6 Modules)
    ├── main.js                # App entry point and startup orchestration
    ├── app/
    │   ├── bootstrap.js       # Loads HTML partials before starting the app
    │   ├── dom.js             # Shared DOM references and transient UI state
    │   ├── map-ui.js          # Map rendering, simulator controls, and HUD tabs
    │   ├── events.js          # UI event bindings and modal setup
    │   ├── route-handlers.js  # Route planning and route HUD updates
    │   ├── radio-handlers.js  # Squad radio message handling
    │   ├── safety-handlers.js # Conditions, SOS, and entity lookup handlers
    │   ├── profile-handlers.js # Squad profile creation and switching
    │   └── voice-wiring.js    # Connects voice intents to application handlers
    ├── data/
    │   ├── resort-graph.js    # Mountain nodes (huts, peaks, lifts) & trail edges
    │   ├── resort-loader.js   # Resort catalog, active terrain switching & startup restoration
    │   ├── resort-storage.js  # Custom resort persistence in localStorage
    │   ├── resort-topology.js # Topology validation and image-file helpers
    │   ├── resort-generators.js # Procedural single-/dual-peak terrain templates
    │   ├── resort-image-generator.js # Image Vision AI & offline image analysis
    │   ├── resort-ai-generator.js # Text-based AI generation with procedural fallback
    │   ├── resorts-db.js      # Unified database registry re-exporting modular resorts
    │   ├── resorts/           # 16+ dedicated real-world Alpine & Carpathian ski resorts
    │   │   ├── murau.js       # Murau — Kreischberg (Rosenkranzhöhe, Kreischbergsee, WM-Arena)
    │   │   ├── epleny.js      # Síaréna Vibe Park Eplény (Ámos-hegy, 4-üléses)
    │   │   ├── kekesteto.js   # Kékestető Déli & Északi Sípálya
    │   │   ├── jasna.js       # Jasná — Chopok Nízke Tatry
    │   │   └── ...            # Schladming, Hintertux, Zermatt, Kitzbühel, Cortina, stb.
    │   ├── accounts.js        # Skier profiles, squad state, localStorage persistence
    │   ├── fuzzy-matcher.js   # Levenshtein distance, Hungarian phonetics & declensions
    │   ├── telemetry.js       # Real-time weather, snow conditions & hazard reports
    │   └── index.js           # Unified MountainData module interface
    ├── algorithms/
    │   └── dijkstra.js        # Graph shortest path routing with avoid-black/ice filters
    ├── voice/
    │   ├── audio-fx.js        # Procedural radio squelch synthesis & Web Audio API
    │   ├── speech-rec.js      # Web Speech recognition, MediaRecorder audio capture & waveform visualizer
    │   ├── speech-tts.js      # Speech synthesis & AI vocal response (English voice normalization)
    │   ├── intent-parser.js   # NLU Intent classification & argument extraction
    │   ├── radio-formatter.js # Tactical radio phrasing & Hungarian grammar handling
    │   ├── gemini-client.js   # Gemini 2.0 Flash Multimodal Audio & function-calling
    │   ├── groq-client.js     # Groq Whisper Large v3 Turbo ultra-fast (150ms) speech recognition
    │   └── index.js           # Unified VoiceEngine module interface
    └── ui/
        ├── map-renderer.js    # SVG map rendering, ski runs & GPS radar blips
        ├── tactical-hud.js    # Turn-by-turn nav cards, telemetry & SOS emergency beacon
        ├── radio-feed.js      # Tactical radio log, channel filters & audio replay
        ├── profile-manager.js # Skier profile creation, switching modal & color selection
        └── resort-modal.js    # Real-world ski resort catalog, search & image AI importer
```

---

## 🛠️ Technology Stack

- **Frontend Core**: Vanilla HTML5, CSS3, Pure Modern JavaScript (ES6+ Modules)
- **Vector Graphics**: HTML5 SVG with animated glowing markers, gradients, and coordinate projection
- **Styling**: Tailwind CSS (via CDN) + custom tactical CSS design system
- **Icons**: Lucide Icons (via CDN)
- **Voice AI & Speech Recognition (3-Tier Engine)**:
  - ⚡ **Groq Whisper Large v3 Turbo**: Sub-250ms ultra-fast multilingual transcription via Groq LPUs (Free Tier)
  - ✨ **Google Gemini 2.0 Flash Multimodal Audio**: Direct raw audio comprehension & tactical function-calling (Free Tier)
  - 🛡️ **Browser Web Speech API**: Native offline speech-to-text fallback (`webkitSpeechRecognition`)
- **Speech Synthesis**: Browser SpeechSynthesis (`en-US` native voice normalization)
- **Audio Processing**: Web Audio API (`AudioContext`, `AnalyserNode`, `BiquadFilter`, white noise squelch generator) + `MediaRecorder`
- **Algorithms**: Dijkstra Single-Source Shortest Path, Levenshtein Distance String Similarity

---

_Built with ❤️ for the Hiya Voice AI Challenge._
