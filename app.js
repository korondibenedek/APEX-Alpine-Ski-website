/* ═══════════════════════════════════════════════════════════════════
   app.js — Modular Architecture Bridge
   ═══════════════════════════════════════════════════════════════════
   This monolithic file has been refactored into clean, focused modules:
     - js/main.js               -> Application bootstrap, wiring, events
     - js/ui/map-renderer.js    -> SVG Alpine map, ski runs & GPS radar
     - js/ui/tactical-hud.js    -> Nav cards, telemetry & SOS flasher
     - js/ui/radio-feed.js      -> Tactical radio log & channel filter pills
     - js/ui/profile-manager.js -> Skier accounts & profile modal
   ═══════════════════════════════════════════════════════════════════ */

import './js/main.js';
