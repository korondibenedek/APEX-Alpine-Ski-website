# APEX Development Log

APEX is a browser-based alpine skiing demo with an interactive resort map, route planning, squad profiles, radio messaging, voice controls, and optional Gemini/Groq integrations.

**Stack:** Vanilla JavaScript ES modules, HTML/SVG, CSS, Web Speech/Web Audio APIs
**Run locally:** Serve the repository over HTTP (for example, `python3 -m http.server 8000`) and open it in a browser.

## Current Structure

- `index.html`, `views/`, `css/` — page shell, HTML partials, and component styles.
- `js/app/` — application startup, UI wiring, profile, route, radio, and safety handlers.
- `js/data/` — resort graphs, resort presets, profile persistence, matching, and telemetry.
- `js/algorithms/` — route-finding.
- `js/ui/` — map, HUD, radio feed, profile, and resort interfaces.
- `js/voice/` — speech recognition and synthesis, intent parsing, radio formatting, and optional AI clients.

## Development History

### Prototype and voice controls

- Built the tactical map, HUD, telemetry, SOS mode, route planning, and browser-based speech controls.
- Improved English text-to-speech voice selection, continuous speech recognition, and handling of microphone/speaker feedback.
- Added graceful text and local-intent fallbacks when browser speech recognition or cloud services are unavailable.
- Tuned conditions and SOS intents to avoid common false matches and repeated voice triggers.

### Profiles, location, and routing

- Added persistent skier profiles, account switching, squad map markers, and custom profile creation.
- Made person lookup and route-to-teammate behavior use the current profiles and resort graph.
- Added accent-insensitive and fuzzy matching for names and locations, including Hungarian input.
- Fixed invalid profile positions after resort changes and guarded map rendering against missing or out-of-bounds coordinates.
- Made downhill runs directional: routes follow each run's `from → to` direction; lifts follow their configured uphill direction.

### Radio and optional AI

- Added a dedicated radio feed with per-profile channels, unread indicators, message formatting, and simulated teammate replies.
- Removed profile-specific scripted radio messages and built recipient parsing and replies from registered profiles.
- Added optional Gemini audio/tool-calling and Groq transcription. API keys are entered in the settings UI and stored in browser `localStorage`.
- Updated the Gemini model fallback and added generated and offline resort-topology workflows.

### Resort data and project organization

- Added multiple resort presets and separated their topology into modules under `js/data/resorts/`.
- Added resort switching, generated terrain, image-based terrain import, and custom-resort persistence.
- Split the original large HTML, CSS, and JavaScript files into `views/`, `css/`, and focused `js/` modules.
- Removed obsolete root-level bridge files after confirming the application imports the modular implementation.

## Recent Fixes

### 2026-10-20 — Profile-independent demo

- Replaced seeded named accounts with a generic Operator fallback and removed it when a real profile logs in.
- Made prompts, voice context, radio-recipient matching, and automatic replies derive from current profiles and resort data.
- Updated README examples and removed remaining seeded profile names from runtime code and views.
- Checked JavaScript syntax and `git diff --check`; browser-tested custom profile locate, route, and radio flows.

### 2026-10-20 — Closed South Lift routing

- The closure control previously checked an obsolete lift ID (`l2`); the actual edge is `lift2`.
- Tagged the controlled lift with `simControl: "liftClosed"` and used that metadata in route filtering and map rendering.
- Failed route planning now clears the previous route highlight and navigation card.
- Verified that an uphill route exists when the lift is open, is unavailable when closed, and returns after reopening.

### 2026-10-20 — API key persistence feedback

- Made Gemini and Groq key storage errors visible instead of silently swallowing them.
- The settings UI now explains that browser storage is scoped to the site origin: different hostnames or ports have separate keys.
- Verified saving and restoring test keys after reload, then removed the test keys.

## Validation Notes

- JavaScript modules are checked with `node --check`; patches are checked with `git diff --check`.
- Browser checks cover profile-driven prompts and messaging, route direction and lift closures, and API-key reload persistence.
