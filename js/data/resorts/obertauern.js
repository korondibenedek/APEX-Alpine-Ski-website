/* ═══════════════════════════════════════════════════════════════════
   resorts/obertauern.js — Obertauern (Ausztria · Salzburg)
   ═══════════════════════════════════════════════════════════════════ */

export const obertauern = {
  "id": "obertauern",
  "name": "Obertauern",
  "country": "Ausztria · Salzburg",
  "flag": "🇦🇹",
  "altitude": 2313,
  "baseAltitude": 1630,
  "description": "Salzburg hóbiztos síközpontja 100 km pályával, a Tauernrunde körkörös síhintával és Ausztria legmeredekebb lejtőjével, a Gamsleiten 2-vel.",
  "nodes": {
    "gamsleiten2Csucs": {
      "id": "gamsleiten2Csucs",
      "name": "Gamsleiten 2 Extrém Csúcs (2313m)",
      "altitude": 2313,
      "x": 200,
      "y": 60,
      "icon": "⚡"
    },
    "zehnerkarspitze": {
      "id": "zehnerkarspitze",
      "name": "Zehnerkarspitze (2192m)",
      "altitude": 2192,
      "x": 460,
      "y": 60,
      "icon": "⛰️"
    },
    "seekareck": {
      "id": "seekareck",
      "name": "Seekareck Csúcs (2217m)",
      "altitude": 2217,
      "x": 720,
      "y": 65,
      "icon": "⛰️"
    },
    "plattenkarHegy": {
      "id": "plattenkarHegy",
      "name": "Plattenkar Hegyállomás",
      "altitude": 2100,
      "x": 340,
      "y": 160,
      "icon": "🚡"
    },
    "seekarspitz": {
      "id": "seekarspitz",
      "name": "Seekarspitz Állomás",
      "altitude": 2050,
      "x": 620,
      "y": 170,
      "icon": "🚡"
    },
    "grunwaldkopf": {
      "id": "grunwaldkopf",
      "name": "Grünwaldkopf Panoráma",
      "altitude": 1970,
      "x": 190,
      "y": 280,
      "icon": "🏔️"
    },
    "hochalmHut": {
      "id": "hochalmHut",
      "name": "Hochalm Hütte",
      "altitude": 1900,
      "x": 460,
      "y": 260,
      "icon": "🏠"
    },
    "kringsalm": {
      "id": "kringsalm",
      "name": "Kringsalm Átszállópont",
      "altitude": 1850,
      "x": 640,
      "y": 310,
      "icon": "☕"
    },
    "edelweissHegy": {
      "id": "edelweissHegy",
      "name": "Edelweissbahn Hegyállomás",
      "altitude": 1810,
      "x": 310,
      "y": 390,
      "icon": "🚡"
    },
    "kirchbuhel": {
      "id": "kirchbuhel",
      "name": "Kirchbühellift Családi Pálya",
      "altitude": 1780,
      "x": 570,
      "y": 420,
      "icon": "🎿"
    },
    "passhoheCentrum": {
      "id": "passhoheCentrum",
      "name": "Obertauern Passhöhe Centrum (1740m)",
      "altitude": 1740,
      "x": 450,
      "y": 520,
      "icon": "🏨"
    },
    "zehnerkarTal": {
      "id": "zehnerkarTal",
      "name": "Zehnerkar Talstation",
      "altitude": 1680,
      "x": 260,
      "y": 615,
      "icon": "🚡"
    },
    "schaidbergBase": {
      "id": "schaidbergBase",
      "name": "Schaidberg Völgyállomás (1630m)",
      "altitude": 1630,
      "x": 680,
      "y": 615,
      "icon": "🏘️"
    }
  },
  "edges": [
    {
      "id": "ob1",
      "from": "gamsleiten2Csucs",
      "to": "plattenkarHegy",
      "name": "Gamsleiten 2 Ausztria Legmeredekebb Fekete",
      "difficulty": "black",
      "type": "run",
      "weight": 6,
      "waypoints": [
        [
          270,
          110
        ]
      ]
    },
    {
      "id": "ob2",
      "from": "zehnerkarspitze",
      "to": "plattenkarHegy",
      "name": "Zehnerkar Carving Piros",
      "difficulty": "red",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          400,
          110
        ]
      ]
    },
    {
      "id": "ob3",
      "from": "zehnerkarspitze",
      "to": "seekarspitz",
      "name": "Tauernrunde Piros Átcsatlakozás",
      "difficulty": "red",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          540,
          110
        ]
      ]
    },
    {
      "id": "ob4",
      "from": "seekareck",
      "to": "seekarspitz",
      "name": "Seekareck Széles Kék",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          670,
          120
        ]
      ]
    },
    {
      "id": "ob5",
      "from": "plattenkarHegy",
      "to": "grunwaldkopf",
      "name": "Grünwald Kék Pálya",
      "difficulty": "blue",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          260,
          220
        ]
      ]
    },
    {
      "id": "ob6",
      "from": "plattenkarHegy",
      "to": "hochalmHut",
      "name": "Plattenkar Főpálya Piros",
      "difficulty": "red",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          400,
          210
        ]
      ]
    },
    {
      "id": "ob7",
      "from": "seekarspitz",
      "to": "kringsalm",
      "name": "Kringsalm Kék Lejtő",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          630,
          240
        ]
      ]
    },
    {
      "id": "ob8",
      "from": "grunwaldkopf",
      "to": "edelweissHegy",
      "name": "Edelweiss Átkötő Kék",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          250,
          340
        ]
      ]
    },
    {
      "id": "ob9",
      "from": "hochalmHut",
      "to": "kirchbuhel",
      "name": "Családi Napos Lejtő Kék",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          520,
          340
        ]
      ]
    },
    {
      "id": "ob10",
      "from": "kringsalm",
      "to": "kirchbuhel",
      "name": "Krings Meredek Piros",
      "difficulty": "red",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          600,
          370
        ]
      ]
    },
    {
      "id": "ob11",
      "from": "edelweissHegy",
      "to": "passhoheCentrum",
      "name": "Éjszakai Kivilágított Kék",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          380,
          460
        ]
      ]
    },
    {
      "id": "ob12",
      "from": "kirchbuhel",
      "to": "passhoheCentrum",
      "name": "Falu Központi Finis Kék",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          510,
          470
        ]
      ]
    },
    {
      "id": "ob13",
      "from": "grunwaldkopf",
      "to": "zehnerkarTal",
      "name": "Zehnerkar Völgylesiklás Piros",
      "difficulty": "red",
      "type": "run",
      "weight": 4,
      "waypoints": [
        [
          220,
          450
        ]
      ]
    },
    {
      "id": "ob14",
      "from": "kringsalm",
      "to": "schaidbergBase",
      "name": "Schaidberg Völgypálya Kék",
      "difficulty": "blue",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          660,
          460
        ]
      ]
    },
    {
      "id": "obLift1",
      "from": "passhoheCentrum",
      "to": "zehnerkarspitze",
      "name": "Zehnerkarbahn Gondola",
      "difficulty": "blue",
      "type": "lift",
      "weight": 2,
      "waypoints": [
        [
          450,
          290
        ]
      ]
    },
    {
      "id": "obLift2",
      "from": "plattenkarHegy",
      "to": "gamsleiten2Csucs",
      "name": "Gamsleiten 2 Történelmi Duplaszékes",
      "difficulty": "blue",
      "type": "lift",
      "weight": 2,
      "waypoints": [
        [
          270,
          110
        ]
      ]
    },
    {
      "id": "obLift3",
      "from": "passhoheCentrum",
      "to": "edelweissHegy",
      "name": "Edelweissbahn 4-üléses",
      "difficulty": "blue",
      "type": "lift",
      "weight": 2,
      "waypoints": [
        [
          380,
          460
        ]
      ]
    },
    {
      "id": "obLift4",
      "from": "schaidbergBase",
      "to": "seekareck",
      "name": "Schaidberg 6-üléses Express",
      "difficulty": "blue",
      "type": "lift",
      "weight": 2,
      "waypoints": [
        [
          700,
          340
        ]
      ]
    }
  ]
};
