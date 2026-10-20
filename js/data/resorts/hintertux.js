/* ═══════════════════════════════════════════════════════════════════
   resorts/hintertux.js — Hintertuxer Gletscher (Ausztria · Tirol · Zillertal)
   ═══════════════════════════════════════════════════════════════════ */

export const hintertux = {
  "id": "hintertux",
  "name": "Hintertuxer Gletscher",
  "country": "Ausztria · Tirol · Zillertal",
  "flag": "🇦🇹",
  "altitude": 3250,
  "baseAltitude": 1500,
  "description": "Ausztria egyetlen 365 napos egész évben síelhető gleccsere 3250 méteren, a Gletscherbus 3 felvonóval és a híres Spannagel barlanggal.",
  "nodes": {
    "gefroreneWand": {
      "id": "gefroreneWand",
      "name": "Gefrorene Wand Csúcs (3250m)",
      "altitude": 3250,
      "x": 450,
      "y": 55,
      "icon": "⛰️"
    },
    "gletscherbus3Hegy": {
      "id": "gletscherbus3Hegy",
      "name": "Gletscherbus 3 Hegyállomás",
      "altitude": 3250,
      "x": 310,
      "y": 90,
      "icon": "🚡"
    },
    "olpererLiftek": {
      "id": "olpererLiftek",
      "name": "Olperer Csákányos Gleccserpályák",
      "altitude": 3160,
      "x": 640,
      "y": 110,
      "icon": "🎿"
    },
    "betterparkTux": {
      "id": "betterparkTux",
      "name": "Betterpark Hintertux Pro Snowpark",
      "altitude": 3050,
      "x": 550,
      "y": 200,
      "icon": "🏂"
    },
    "tuxerJoch": {
      "id": "tuxerJoch",
      "name": "Tuxer Joch 4-üléses Hegy",
      "altitude": 2460,
      "x": 190,
      "y": 220,
      "icon": "🏔️"
    },
    "fernerhausKozpont": {
      "id": "fernerhausKozpont",
      "name": "Tuxer Fernerhaus Központ (2660m)",
      "altitude": 2660,
      "x": 440,
      "y": 270,
      "icon": "🏠"
    },
    "spannagelhaus": {
      "id": "spannagelhaus",
      "name": "Spannagelhaus & Természetes Jégpalota",
      "altitude": 2530,
      "x": 330,
      "y": 350,
      "icon": "🛖"
    },
    "kasererLiftek": {
      "id": "kasererLiftek",
      "name": "Kaserer Gleccserpályák Piros",
      "altitude": 2300,
      "x": 620,
      "y": 360,
      "icon": "⛷️"
    },
    "sommerbergalm": {
      "id": "sommerbergalm",
      "name": "Sommerbergalm Átszálló (2100m)",
      "altitude": 2100,
      "x": 450,
      "y": 420,
      "icon": "🚡"
    },
    "schwarzePfanne": {
      "id": "schwarzePfanne",
      "name": "Schwarze Pfanne Erdei Völgyút",
      "altitude": 1750,
      "x": 360,
      "y": 520,
      "icon": "🌲"
    },
    "hintertuxBase": {
      "id": "hintertuxBase",
      "name": "Hintertux Völgyállomás (1500m)",
      "altitude": 1500,
      "x": 450,
      "y": 620,
      "icon": "🏘️"
    }
  },
  "edges": [
    {
      "id": "ht1",
      "from": "gefroreneWand",
      "to": "gletscherbus3Hegy",
      "name": "Gleccser Csúcs Séta Kék",
      "difficulty": "blue",
      "type": "run",
      "weight": 1,
      "waypoints": [
        [
          380,
          70
        ]
      ]
    },
    {
      "id": "ht2",
      "from": "gefroreneWand",
      "to": "olpererLiftek",
      "name": "Gleccserfennsík Kék Pálya",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          550,
          80
        ]
      ]
    },
    {
      "id": "ht3",
      "from": "olpererLiftek",
      "to": "betterparkTux",
      "name": "Park Bevezető Kék",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          600,
          150
        ]
      ]
    },
    {
      "id": "ht4",
      "from": "gletscherbus3Hegy",
      "to": "fernerhausKozpont",
      "name": "4-es Gleccserlesiklás Piros",
      "difficulty": "red",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          370,
          180
        ]
      ]
    },
    {
      "id": "ht5",
      "from": "betterparkTux",
      "to": "fernerhausKozpont",
      "name": "Freestyle Exit Kék",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          490,
          240
        ]
      ]
    },
    {
      "id": "ht6",
      "from": "fernerhausKozpont",
      "to": "spannagelhaus",
      "name": "Spannagel Kanyar Piros",
      "difficulty": "red",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          380,
          310
        ]
      ]
    },
    {
      "id": "ht7",
      "from": "tuxerJoch",
      "to": "sommerbergalm",
      "name": "Tuxer Joch Kék Carving",
      "difficulty": "blue",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          320,
          320
        ]
      ]
    },
    {
      "id": "ht8",
      "from": "spannagelhaus",
      "to": "sommerbergalm",
      "name": "2-es Szakasz Piros",
      "difficulty": "red",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          390,
          390
        ]
      ]
    },
    {
      "id": "ht9",
      "from": "fernerhausKozpont",
      "to": "kasererLiftek",
      "name": "Kaserer Carving Pályák Piros",
      "difficulty": "red",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          530,
          320
        ]
      ]
    },
    {
      "id": "ht10",
      "from": "kasererLiftek",
      "to": "sommerbergalm",
      "name": "Kaserer Alsó Átkötő Kék",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          540,
          390
        ]
      ]
    },
    {
      "id": "ht11",
      "from": "sommerbergalm",
      "to": "schwarzePfanne",
      "name": "1-es Fekete Völgylesiklás Felső",
      "difficulty": "black",
      "type": "run",
      "weight": 4,
      "waypoints": [
        [
          400,
          470
        ]
      ]
    },
    {
      "id": "ht12",
      "from": "schwarzePfanne",
      "to": "hintertuxBase",
      "name": "Schwarze Pfanne Erdei Finis Kék",
      "difficulty": "blue",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          400,
          570
        ]
      ]
    },
    {
      "id": "htLift1",
      "from": "hintertuxBase",
      "to": "sommerbergalm",
      "name": "Gletscherbus 1 Gondola",
      "difficulty": "blue",
      "type": "lift",
      "weight": 2,
      "waypoints": [
        [
          450,
          520
        ]
      ]
    },
    {
      "id": "htLift2",
      "from": "sommerbergalm",
      "to": "fernerhausKozpont",
      "name": "Gletscherbus 2 Főgondola",
      "difficulty": "blue",
      "type": "lift",
      "weight": 2,
      "waypoints": [
        [
          450,
          340
        ]
      ]
    },
    {
      "id": "htLift3",
      "from": "fernerhausKozpont",
      "to": "gletscherbus3Hegy",
      "name": "Gletscherbus 3 Csúcs 3S Bahn",
      "difficulty": "blue",
      "type": "lift",
      "weight": 2,
      "waypoints": [
        [
          370,
          180
        ]
      ]
    },
    {
      "id": "htLift4",
      "from": "sommerbergalm",
      "to": "tuxerJoch",
      "name": "Tuxer Joch 4-üléses",
      "difficulty": "blue",
      "type": "lift",
      "weight": 2,
      "waypoints": [
        [
          320,
          320
        ]
      ]
    }
  ]
};
