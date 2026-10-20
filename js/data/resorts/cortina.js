/* ═══════════════════════════════════════════════════════════════════
   resorts/cortina.js — Cortina d’Ampezzo — Dolomiti (Olaszország · Dolomitok)
   ═══════════════════════════════════════════════════════════════════ */

export const cortina = {
  "id": "cortina",
  "name": "Cortina d’Ampezzo — Dolomiti",
  "country": "Olaszország · Dolomitok",
  "flag": "🇮🇹",
  "altitude": 2930,
  "baseAltitude": 1224,
  "description": "A 2026-os Téli Olimpia ikonikus dolomit helyszíne a Tofana sziklafalai alatt, a híres Olimpia delle Tofane világkupa lesiklással.",
  "nodes": {
    "tofanaCsucs": {
      "id": "tofanaCsucs",
      "name": "Tofana di Mezzo Csúcs (2930m)",
      "altitude": 2930,
      "x": 450,
      "y": 55,
      "icon": "⛰️"
    },
    "raVallesHegy": {
      "id": "raVallesHegy",
      "name": "Ra Valles Hegyállomás (2475m)",
      "altitude": 2475,
      "x": 320,
      "y": 130,
      "icon": "🚡"
    },
    "rifugioPomedes": {
      "id": "rifugioPomedes",
      "name": "Rifugio Pomedes Sziklahütte",
      "altitude": 2303,
      "x": 620,
      "y": 140,
      "icon": "🏠"
    },
    "canaloneLetores": {
      "id": "canaloneLetores",
      "name": "Canalone Letörés Fekete",
      "altitude": 1850,
      "x": 240,
      "y": 220,
      "icon": "⚠️"
    },
    "rifugioDucaAosta": {
      "id": "rifugioDucaAosta",
      "name": "Rifugio Duca d’Aosta",
      "altitude": 2098,
      "x": 530,
      "y": 230,
      "icon": "🏠"
    },
    "olimpiaRajt": {
      "id": "olimpiaRajt",
      "name": "Olimpia delle Tofane Rajt",
      "altitude": 2100,
      "x": 390,
      "y": 240,
      "icon": "⛷️"
    },
    "cacciatoriHut": {
      "id": "cacciatoriHut",
      "name": "Cacciatori Panoráma Hütte",
      "altitude": 2100,
      "x": 690,
      "y": 260,
      "icon": "☕"
    },
    "tofanaSchuss": {
      "id": "tofanaSchuss",
      "name": "Tofanaschuss Sziklahasadék",
      "altitude": 1700,
      "x": 360,
      "y": 340,
      "icon": "⚡"
    },
    "rumerloStratofana": {
      "id": "rumerloStratofana",
      "name": "Rumerlo / Stratofana Célterület",
      "altitude": 1560,
      "x": 460,
      "y": 420,
      "icon": "🏁"
    },
    "socrepesCsaladi": {
      "id": "socrepesCsaladi",
      "name": "Socrepes Családi Pályák",
      "altitude": 1400,
      "x": 630,
      "y": 470,
      "icon": "🎿"
    },
    "roncatoAlso": {
      "id": "roncatoAlso",
      "name": "Roncato Erdei Kanyar",
      "altitude": 1300,
      "x": 330,
      "y": 510,
      "icon": "🌲"
    },
    "frecciaTalstation": {
      "id": "frecciaTalstation",
      "name": "Freccia nel Cielo Talstation (1224m)",
      "altitude": 1224,
      "x": 470,
      "y": 620,
      "icon": "🏘️"
    }
  },
  "edges": [
    {
      "id": "co1",
      "from": "tofanaCsucs",
      "to": "raVallesHegy",
      "name": "Forcella Rossa Fekete Szakasz",
      "difficulty": "black",
      "type": "run",
      "weight": 5,
      "waypoints": [
        [
          380,
          90
        ]
      ]
    },
    {
      "id": "co2",
      "from": "raVallesHegy",
      "to": "canaloneLetores",
      "name": "Canalone Felső Ív Piros",
      "difficulty": "red",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          270,
          180
        ]
      ]
    },
    {
      "id": "co3",
      "from": "rifugioPomedes",
      "to": "olimpiaRajt",
      "name": "Pomedes Schuss Piros",
      "difficulty": "red",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          510,
          190
        ]
      ]
    },
    {
      "id": "co4",
      "from": "rifugioPomedes",
      "to": "cacciatoriHut",
      "name": "Panoráma Kék Dolomit Lejtő",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          660,
          200
        ]
      ]
    },
    {
      "id": "co5",
      "from": "olimpiaRajt",
      "to": "tofanaSchuss",
      "name": "Olimpiai Sziklahasadék Fekete",
      "difficulty": "black",
      "type": "run",
      "weight": 4,
      "waypoints": [
        [
          370,
          290
        ]
      ]
    },
    {
      "id": "co6",
      "from": "canaloneLetores",
      "to": "tofanaSchuss",
      "name": "Labirinti Fekete Összekötő",
      "difficulty": "black",
      "type": "run",
      "weight": 4,
      "waypoints": [
        [
          300,
          290
        ]
      ]
    },
    {
      "id": "co7",
      "from": "rifugioDucaAosta",
      "to": "tofanaSchuss",
      "name": "Duca d’Aosta Carving Piros",
      "difficulty": "red",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          450,
          290
        ]
      ]
    },
    {
      "id": "co8",
      "from": "tofanaSchuss",
      "to": "rumerloStratofana",
      "name": "Olimpiai Finis Piros",
      "difficulty": "red",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          410,
          380
        ]
      ]
    },
    {
      "id": "co9",
      "from": "cacciatoriHut",
      "to": "socrepesCsaladi",
      "name": "Socrepes Felső Kék",
      "difficulty": "blue",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          670,
          370
        ]
      ]
    },
    {
      "id": "co10",
      "from": "rumerloStratofana",
      "to": "roncatoAlso",
      "name": "Roncato Erdei Kék",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          390,
          470
        ]
      ]
    },
    {
      "id": "co11",
      "from": "rumerloStratofana",
      "to": "socrepesCsaladi",
      "name": "Socrepes Átcsúszó Kék",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          550,
          440
        ]
      ]
    },
    {
      "id": "co12",
      "from": "roncatoAlso",
      "to": "frecciaTalstation",
      "name": "Cortina Völgyfinis Kék",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          400,
          570
        ]
      ]
    },
    {
      "id": "co13",
      "from": "socrepesCsaladi",
      "to": "frecciaTalstation",
      "name": "Családi Völgybefutó Kék",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          550,
          560
        ]
      ]
    },
    {
      "id": "coLift1",
      "from": "frecciaTalstation",
      "to": "raVallesHegy",
      "name": "Freccia nel Cielo Gondola I+II",
      "difficulty": "blue",
      "type": "lift",
      "weight": 3,
      "waypoints": [
        [
          400,
          370
        ]
      ]
    },
    {
      "id": "coLift2",
      "from": "raVallesHegy",
      "to": "tofanaCsucs",
      "name": "Freccia nel Cielo III Csúcskabin",
      "difficulty": "blue",
      "type": "lift",
      "weight": 2,
      "waypoints": [
        [
          380,
          90
        ]
      ]
    },
    {
      "id": "coLift3",
      "from": "rumerloStratofana",
      "to": "rifugioDucaAosta",
      "name": "Duca d’Aosta 4-üléses",
      "difficulty": "blue",
      "type": "lift",
      "weight": 2,
      "waypoints": [
        [
          490,
          320
        ]
      ]
    },
    {
      "id": "coLift4",
      "from": "rifugioDucaAosta",
      "to": "rifugioPomedes",
      "name": "Pomedes 2-üléses Felvonó",
      "difficulty": "blue",
      "type": "lift",
      "weight": 2,
      "waypoints": [
        [
          580,
          180
        ]
      ]
    }
  ]
};
