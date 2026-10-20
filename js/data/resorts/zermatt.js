/* ═══════════════════════════════════════════════════════════════════
   resorts/zermatt.js — Zermatt — Matterhorn Paradise (Svájc · Valais)
   ═══════════════════════════════════════════════════════════════════ */

export const zermatt = {
  "id": "zermatt",
  "name": "Zermatt — Matterhorn Paradise",
  "country": "Svájc · Valais",
  "flag": "🇨🇭",
  "altitude": 3883,
  "baseAltitude": 1620,
  "description": "Európa legmagasabb felvonóállomása a Klein Matterhorn alatt (3883m), 360 km pályával, a Matterhorn látványával és a Gornergrat fogaskerekűvel.",
  "nodes": {
    "kleinMatterhorn": {
      "id": "kleinMatterhorn",
      "name": "Klein Matterhorn Paradise (3883m)",
      "altitude": 3883,
      "x": 190,
      "y": 55,
      "icon": "⛰️"
    },
    "theodulpass": {
      "id": "theodulpass",
      "name": "Theodulpass Olasz Határ (3301m)",
      "altitude": 3301,
      "x": 340,
      "y": 130,
      "icon": "🏔️"
    },
    "plateauRosa": {
      "id": "plateauRosa",
      "name": "Plateau Rosa Gleccserpályák",
      "altitude": 3480,
      "x": 120,
      "y": 140,
      "icon": "❄️"
    },
    "trockenerSteg": {
      "id": "trockenerSteg",
      "name": "Trockener Steg Csomópont (2939m)",
      "altitude": 2939,
      "x": 230,
      "y": 210,
      "icon": "🚡"
    },
    "gornergratCsucs": {
      "id": "gornergratCsucs",
      "name": "Gornergrat Obszervatórium (3089m)",
      "altitude": 3089,
      "x": 510,
      "y": 75,
      "icon": "🗼"
    },
    "rothornCsucs": {
      "id": "rothornCsucs",
      "name": "Rothorn Csúcs (3103m)",
      "altitude": 3103,
      "x": 750,
      "y": 60,
      "icon": "⛰️"
    },
    "blauherd": {
      "id": "blauherd",
      "name": "Blauherd Átszálló (2571m)",
      "altitude": 2571,
      "x": 680,
      "y": 160,
      "icon": "🚡"
    },
    "schwarzseeHut": {
      "id": "schwarzseeHut",
      "name": "Schwarzsee Hütte a Fal Alatt",
      "altitude": 2583,
      "x": 170,
      "y": 310,
      "icon": "🏠"
    },
    "riffelberg": {
      "id": "riffelberg",
      "name": "Riffelberg Fogaskerekű Állomás",
      "altitude": 2582,
      "x": 440,
      "y": 220,
      "icon": "🚂"
    },
    "sunneggaParadies": {
      "id": "sunneggaParadies",
      "name": "Sunnegga Paradies Terasz",
      "altitude": 2288,
      "x": 650,
      "y": 270,
      "icon": "☀️"
    },
    "riffelalp": {
      "id": "riffelalp",
      "name": "Riffelalp Erdei Szakasz",
      "altitude": 2211,
      "x": 400,
      "y": 330,
      "icon": "🌲"
    },
    "findelnVillage": {
      "id": "findelnVillage",
      "name": "Findeln Alpesi Gourmet Falu",
      "altitude": 2050,
      "x": 560,
      "y": 370,
      "icon": "🛖"
    },
    "furiHub": {
      "id": "furiHub",
      "name": "Furi Főelágazás (1867m)",
      "altitude": 1867,
      "x": 270,
      "y": 440,
      "icon": "🚡"
    },
    "winkelmatten": {
      "id": "winkelmatten",
      "name": "Winkelmatten Kápolna",
      "altitude": 1670,
      "x": 370,
      "y": 530,
      "icon": "⛪"
    },
    "zermattDorf": {
      "id": "zermattDorf",
      "name": "Zermatt Dorf Talstation (1620m)",
      "altitude": 1620,
      "x": 480,
      "y": 620,
      "icon": "🏘️"
    }
  },
  "edges": [
    {
      "id": "zm1",
      "from": "kleinMatterhorn",
      "to": "plateauRosa",
      "name": "Matterhorn Glacier Ride Kék",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          150,
          95
        ]
      ]
    },
    {
      "id": "zm2",
      "from": "kleinMatterhorn",
      "to": "theodulpass",
      "name": "Theodul Gleccser Piros",
      "difficulty": "red",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          270,
          90
        ]
      ]
    },
    {
      "id": "zm3",
      "from": "plateauRosa",
      "to": "trockenerSteg",
      "name": "Gleccserautópálya Kék",
      "difficulty": "blue",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          180,
          180
        ]
      ]
    },
    {
      "id": "zm4",
      "from": "theodulpass",
      "to": "trockenerSteg",
      "name": "Sandiger Boden Piros",
      "difficulty": "red",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          290,
          170
        ]
      ]
    },
    {
      "id": "zm5",
      "from": "trockenerSteg",
      "to": "schwarzseeHut",
      "name": "Matterhorn Meredek Fekete",
      "difficulty": "black",
      "type": "run",
      "weight": 4,
      "waypoints": [
        [
          200,
          260
        ]
      ]
    },
    {
      "id": "zm6",
      "from": "trockenerSteg",
      "to": "furiHub",
      "name": "Stafelalp Erdei Kék",
      "difficulty": "blue",
      "type": "run",
      "weight": 4,
      "waypoints": [
        [
          250,
          330
        ]
      ]
    },
    {
      "id": "zm7",
      "from": "gornergratCsucs",
      "to": "riffelberg",
      "name": "Rotenboden Széles Kék",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          470,
          150
        ]
      ]
    },
    {
      "id": "zm8",
      "from": "rothornCsucs",
      "to": "blauherd",
      "name": "Rothorn Meredek Fekete",
      "difficulty": "black",
      "type": "run",
      "weight": 4,
      "waypoints": [
        [
          720,
          110
        ]
      ]
    },
    {
      "id": "zm9",
      "from": "blauherd",
      "to": "sunneggaParadies",
      "name": "Marmot Kék Családi",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          660,
          210
        ]
      ]
    },
    {
      "id": "zm10",
      "from": "riffelberg",
      "to": "riffelalp",
      "name": "Gornergrat Erdei Piros",
      "difficulty": "red",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          420,
          280
        ]
      ]
    },
    {
      "id": "zm11",
      "from": "sunneggaParadies",
      "to": "findelnVillage",
      "name": "Findeln Gourmet Kék",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          600,
          320
        ]
      ]
    },
    {
      "id": "zm12",
      "from": "schwarzseeHut",
      "to": "furiHub",
      "name": "Aroleid Piros Levezető",
      "difficulty": "red",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          220,
          380
        ]
      ]
    },
    {
      "id": "zm13",
      "from": "riffelalp",
      "to": "furiHub",
      "name": "Riffelalp Összekötő Kék",
      "difficulty": "blue",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          330,
          390
        ]
      ]
    },
    {
      "id": "zm14",
      "from": "findelnVillage",
      "to": "winkelmatten",
      "name": "Findeln Alsó Erdei Kék",
      "difficulty": "blue",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          460,
          450
        ]
      ]
    },
    {
      "id": "zm15",
      "from": "furiHub",
      "to": "winkelmatten",
      "name": "Furi-Zermatt Kék Sétány",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          320,
          490
        ]
      ]
    },
    {
      "id": "zm16",
      "from": "winkelmatten",
      "to": "zermattDorf",
      "name": "Zermatt Dorf Finis",
      "difficulty": "blue",
      "type": "run",
      "weight": 1,
      "waypoints": [
        [
          430,
          580
        ]
      ]
    },
    {
      "id": "zmLift1",
      "from": "zermattDorf",
      "to": "furiHub",
      "name": "Matterhorn Express Gondola I",
      "difficulty": "blue",
      "type": "lift",
      "weight": 2,
      "waypoints": [
        [
          370,
          530
        ]
      ]
    },
    {
      "id": "zmLift2",
      "from": "furiHub",
      "to": "trockenerSteg",
      "name": "Matterhorn Express Gondola II",
      "difficulty": "blue",
      "type": "lift",
      "weight": 2,
      "waypoints": [
        [
          250,
          320
        ]
      ]
    },
    {
      "id": "zmLift3",
      "from": "trockenerSteg",
      "to": "kleinMatterhorn",
      "name": "Matterhorn Glacier Ride 3S",
      "difficulty": "blue",
      "type": "lift",
      "weight": 2,
      "waypoints": [
        [
          210,
          130
        ]
      ]
    },
    {
      "id": "zmLift4",
      "from": "zermattDorf",
      "to": "gornergratCsucs",
      "name": "Gornergrat Bahn Fogaskerekű",
      "difficulty": "blue",
      "type": "lift",
      "weight": 4,
      "waypoints": [
        [
          490,
          350
        ]
      ]
    },
    {
      "id": "zmLift5",
      "from": "zermattDorf",
      "to": "sunneggaParadies",
      "name": "Sunnegga Express Földalatti Sikló",
      "difficulty": "blue",
      "type": "lift",
      "weight": 2,
      "waypoints": [
        [
          570,
          440
        ]
      ]
    },
    {
      "id": "zmLift6",
      "from": "sunneggaParadies",
      "to": "rothornCsucs",
      "name": "Rothorn Teleferik",
      "difficulty": "blue",
      "type": "lift",
      "weight": 2,
      "waypoints": [
        [
          700,
          170
        ]
      ]
    }
  ]
};
