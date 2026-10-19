# 🏔️ APEX — Hands-Free Alpine & Ski Wingman
> **Hiya Voice AI Challenge — Working Prototype**  
> An ultra-fast, zero-build tactical alpine helmet HUD with real-time voice AI, interactive SVG mountain navigation, Dijkstra pathfinding, and simulated walkie-talkie radio comms.

[![Hiya Voice AI Challenge](https://img.shields.io/badge/Hiya-Voice%20AI%20Challenge-00e5ff?style=for-the-badge)](https://hiya.com)
[![Stack](https://img.shields.io/badge/Stack-Vanilla%20JS%20%7C%20HTML5%20SVG%20%7C%20Tailwind%20CDN-10b981?style=for-the-badge)](file:///home/benedek/SÍapp/)
[![Audio API](https://img.shields.io/badge/Audio-Web%20Speech%20API%20%2B%20Web%20Audio%20Synth-f59e0b?style=for-the-badge)](file:///home/benedek/SÍapp/voice-engine.js)
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

### 7. 👤 Multi-Skier Profile Switching
- Click `[SKIER: Benedek @ Glacier Peak ▾]` in the top bar to switch perspectives between:
  - **Benedek** (Glacier Peak, 3,200m)
  - **Renato** (Panorama Hut, 2,200m)
  - **Kajti** (Red Run 4, 2,000m)
  - **Ski Patrol #4** (Eagle Mid-Station, 2,400m)
  - **Custom Skier**: Register any custom call sign and starting sector!
- All radar dots, route origins, and telemetry cards synchronize dynamically to the active skier.

### 8. 📻 Dedicated Radio Comms Tab & Per-Profile Channel Logging
- **HUD Tabs Bar**: Toggle effortlessly between `[VISOR HUD]` (navigation, telemetry, SOS) and `[RADIO COMMS]` (encrypted squad transceiver).
- **Per-Profile Channel Logging**: Radio messages are tracked per recipient and sender (`Renato`, `Kajti`, `Ski Patrol`, or `All Squad`).
- **Channel Filter Pills**: Interactive buttons in the header (`[📢 ALL SQUAD]`, `[🏂 Renato]`, `[⛷️ Kajti]`, `[⛑️ Ski Patrol]`) with live count badges filter the transceiver log to specific squad members.
- **Individual vs Broadcast Targeting**: Address squad members individually (*"Tell Renato..."*, *"Radio Kajti..."*) or broadcast to the entire team (*"Tell everyone..."*, *"Broadcast..."*).
- **Zero Demo Clutter**: Transceiver starts with a clean slate, logging only authentic operator transmissions and responses.
- **ASR Normalizer & Alpine Radio Syntax**: Jumbled speech transcripts are automatically normalized into crisp, tactical NATO/Alpine English radio protocol ending with *"Over."*
- **Two-Way Interactivity**: Transmitting a squad message triggers an automatic, realistic reply from the addressed recipient 2.5 seconds later.
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
| **Radio Ping** | *"Tell Renato and Kajti I'm at the hut in 15 minutes."* | Synthesizes radio burst; updates Squad Comms card |
| **Mountain Telemetry** | *"Check conditions."* / *"How is the weather?"* | Reports peak blizzard, wind speed, and lift status |
| **Emergency SOS** | *"MAYDAY! I crashed off-piste near Avalanche Chute!"* | Triggers crimson HUD mode, locks GPS, alerts Ski Patrol |
| **Cancel SOS** | *"Cancel SOS."* / *"False alarm, I'm fine."* | [Dismiss Emergency Beacon] button restores normal HUD |

---

## 📁 Repository Structure

```
SÍapp/
├── index.html         # Complete tactical layout (Dual panel: Map + HUD)
├── styles.css         # Dark alpine HUD styling, neon route stroke, glowing radar dots
├── mountain-data.js   # Mountain resort graph, Dijkstra pathfinding, fuzzy name matcher
├── voice-engine.js    # Web Speech API, procedural radio squelch synth, 3-state mic toggle
├── app.js             # UI coordinator, SVG rendering, simulator buttons, HUD state manager
├── README.md          # Project showcase and usage documentation
└── ai.md              # Complete chronological development & iteration log
```

---

## 🛠️ Technology Stack

- **Frontend Core**: Vanilla HTML5, CSS3, Pure Modern JavaScript (ES6+ Modules)
- **Vector Graphics**: HTML5 SVG with animated glowing markers, gradients, and coordinate projection
- **Styling**: Tailwind CSS (via CDN) + custom tactical CSS design system
- **Icons**: Lucide Icons (via CDN)
- **Speech Recognition**: Browser Web Speech API (`webkitSpeechRecognition`)
- **Speech Synthesis**: Browser SpeechSynthesis (`en-US` native voice normalization)
- **Audio Processing**: Web Audio API (`AudioContext`, `AnalyserNode`, `BiquadFilter`, white noise buffer oscillator)
- **Algorithms**: Dijkstra Single-Source Shortest Path, Levenshtein Distance String Similarity
- **Optional LLM Integration**: Built-in support for Gemini 2.0 Flash function-calling API

---

*Built with ❤️ for the Hiya Voice AI Challenge.*

