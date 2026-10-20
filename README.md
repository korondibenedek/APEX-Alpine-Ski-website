# 🏔️ APEX — Hands-Free Alpine & Ski Wingman
> **Hiya Voice AI Challenge — Working Prototype**  
> An ultra-fast, zero-build tactical alpine helmet HUD with real-time voice AI, interactive SVG mountain navigation, Dijkstra pathfinding, and simulated walkie-talkie radio comms.

[![Hiya Voice AI Challenge](https://img.shields.io/badge/Hiya-Voice%20AI%20Challenge-00e5ff?style=for-the-badge)](https://hiya.com)
[![Stack](https://img.shields.io/badge/Stack-Vanilla%20JS%20%7C%20HTML5%20SVG%20%7C%20Tailwind%20CDN-10b981?style=for-the-badge)](file:///home/benedek/SÍapp/)
[![Audio API](https://img.shields.io/badge/Audio-Web%20Speech%20API%20%2B%20Web%20Audio%20Synth-f59e0b?style=for-the-badge)](file:///home/benedek/SÍapp/js/voice/index.js)
[![Zero Build](https://img.shields.io/badge/Build-Zero%20Dependencies%20(No%20npm)-6366f1?style=for-the-badge)](file:///home/benedek/SÍapp/index.html)

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
│  • Animated Live Squad Radar Dots (You, Renato, Kajti) │  • Live Skier & AI Transcript Log        │
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
Because speech recognition utilizes an English acoustic model (`en-US`), non-English and Hungarian names are often phonetically distorted:
- *"Kajti"* is often transcribed as *"Kaity"*, *"Kitey"*, *"Katie"*, *"Kyte"*, or *"Kity"*.
- *"Renátó"* is transcribed as *"Renault"*, *"Renado"*, *"Renate"*, or *"Ranato"*.
- *"Benedek"* is transcribed as *"Benedict"*, *"Benedec"*, or *"Benedick"*.
- *"Ski Patrol"* is transcribed as *"Petrol"*, *"hegyimentő"*, or *"mentők"*.

APEX features an integrated **Levenshtein Distance & Phonetic Similarity Engine** (`MountainData.matchBestPerson`):
- Automatically scans incoming words and phrases against all active skiers on the slope.
- Resolves to the highest-scoring candidate above threshold ($0.62$).
- Works across **route intercept planning**, **squad comms messaging**, and **member location inquiries**!

### 3. 🎯 Isolated Squad Member Telemetry (Zero Information Leak)
When inquiring about a specific person (e.g. *"Where is Kajti?"* or *"Hol van Kajti?"*):
- The AI responds **strictly with that person's location, altitude, and activity**. It never leaks or mixes in details about other teammates.
- On the SVG map, **only that person's radar dot** expands with a high-vis pulse (`scale(2.4)`) and their sector node flashes with their assigned color.
- The `SQUAD COMMS` HUD card displays their dedicated telemetry badge (Sector, Elevation, Activity Status, Transceiver Link: `CH-04 · 100% Signal`).

### 4. 🧭 Dijkstra Alpine Shortest-Path Navigation
- Calculates the optimal downhill route across Mount Apex based on run difficulty and live weather constraints.
- **Constraint Avoidance**: Can dynamically avoid black runs (`avoidBlack: true`) or icy black slopes (`avoidIce: true`).
- **Live Hazard Warnings**: Automatically warns the skier if a route relies on a closed lift or traverses a blizzard sector.
- **Squad Intercepts**: Plotting a route to a teammate (e.g. *"Route to Kajti"*) dynamically resolves the teammate's current coordinates and computes an intercept course with estimated travel time.

### 5. 📻 Walkie-Talkie Radio Sound Synthesizer (Web Audio API)
- Zero external MP3 files needed!
- Procedurally synthesizes authentic radio squelch bursts (*"Ksscht!"*) using white noise buffers, bandpass filters (2000Hz, Q=0.8), square wave pops (1200Hz), and gain envelopes.

### 6. 🚨 Emergency Red Alert Mode (SOS / Mayday)
- Triggers on explicit distress keywords (*"MAYDAY"*, *"SOS"*, *"I crashed, twisted my knee"*, *"Need ski patrol"*).
- Entire HUD flashes into crimson red emergency beacon mode.
- Locks mountain GPS coordinates: `45.0921° N, 6.0694° E`.
- AI speaks calming first-aid instructions while alerting Ski Patrol #4 at Eagle Mid-Station.
- Can be dismissed via voice (*"Cancel SOS"*, *"False alarm, I'm okay"*) or via the dedicated **[Dismiss Emergency Beacon]** HUD button.

### 7. 👤 Custom Profile Creator & Multi-Skier Ecosystem
- **Universal Custom Profile Creator**:
  - Click `[SKIER: Benedek @ Glacier Peak ▾]` in the top bar to open the **Squad Accounts & Profile Creator** modal.
  - **Customizable Attributes**:
    - **Call Sign / Name**: Any name (e.g. *David*, *Alex*, *Zsófi*).
    - **Role / Specialty**: (e.g. *Speed Rider*, *Freeride Scout*, *Alpine Medic*).
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
  - **Voice Location**: *"Where is [Profile]?"* / *"Hol van [Profile]?"* immediately highlights them, pulses their radar dot, flashes their sector, and shows their telemetry card.
  - **Intercept Navigation**: *"Route to [Profile]"* plots the Dijkstra shortest path to their location.
  - **Squad Overview**: Asking *"Where is everyone?"* dynamically compiles all current profiles and elevations into an alpine radio sitrep.

### 8. 📻 Dedicated Radio Comms Tab & Dynamic Transceiver Logging
- **HUD Tabs Bar**: Toggle effortlessly between `[VISOR HUD]` (navigation, telemetry, SOS) and `[RADIO COMMS]` (encrypted squad transceiver).
- **Dynamic Channel Filter Pills**: The transceiver header generates interactive filter buttons for **every registered squad member** (`[📢 ALL SQUAD]`, `[⚡ David]`, `[🏂 Renato]`, `[⛷️ Kajti]`, etc.) with real-time transmission count badges.
- **Per-Profile Channel Logging**: Direct transmissions and incoming replies are isolated to each skier's log.
- **Individual vs Broadcast Targeting**: Address squad members individually (*"Tell David..."*, *"Radio Alex..."*, *"Szólj Dávidnak..."*) or broadcast to the entire team (*"Tell everyone..."*, *"Broadcast..."*).
- **Zero Demo Clutter**: Transceiver starts clean with zero fake messages, logging only real user transmissions and contextual replies.
- **ASR Normalizer & Alpine Radio Syntax**: Normalizes voice into crisp tactical NATO/Alpine English ending with *"Over."*
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

| Goal | Spoken Command (English or Hungarian) | UI Trigger / Result |
|---|---|---|
| **Track Kajti** | *"Where is Kajti?"* / *"Hol van Kajti?"* / *"Kajti"* | Pulses Kajti's purple dot; shows Kajti's telemetry card |
| **Track Renato** | *"Where is Renato?"* / *"Renato hol van?"* / *"Renato"* | Pulses Renato's orange dot; displays Panorama Hut deck status |
| **Track Patrol** | *"Where is Ski Patrol?"* / *"Hol van a hegyimentő?"* | Pulses Patrol red dot at Eagle Mid-Station |
| **Route to Teammate** | *"How do I get to Kajti?"* / *"Route to Renato"* | Highlights neon green path; shows ETA & difficulty |
| **Safe Routing** | *"Route me to Panorama Hut avoiding black runs."* | Dijkstra avoids expert slopes, guides via Blue Run 1 & 3 |
| **Radio Ping / Dispatch** | *"Send a radio message to Renato"* / *"Tell squad we meet at hut"* | Tactical radio check or message dispatch; logs under teammate profile with 2.5s auto-reply |
| **Mountain Telemetry** | *"Check conditions."* / *"How is the weather?"* | Reports peak blizzard, wind speed, and lift status |
| **Emergency SOS** | *"MAYDAY! I crashed off-piste near Avalanche Chute!"* | Triggers crimson HUD mode, locks GPS, alerts Ski Patrol |
| **Cancel SOS** | *"Cancel SOS."* / *"False alarm, I'm fine."* | [Dismiss Emergency Beacon] button restores normal HUD |

---

## 📁 Repository Structure

```
SÍapp/
├── index.html                 # Complete tactical layout (Dual panel: Map + HUD)
├── styles.css                 # Dark alpine HUD styling, neon route stroke, glowing radar dots
├── README.md                  # Project showcase and usage documentation
├── ai.md                      # Complete chronological development & iteration log
└── js/                        # Modular JavaScript Architecture (ES6 Modules)
    ├── main.js                # App entry point, bootstrap, event listeners & wiring
    ├── data/
    │   ├── resort-graph.js    # Mountain nodes (huts, peaks, lifts) & trail edges
    │   ├── resort-loader.js   # Real-world ski resort search, image Vision AI & offline CV
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

*Built with ❤️ for the Hiya Voice AI Challenge.*

