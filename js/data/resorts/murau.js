/* ═══════════════════════════════════════════════════════════════════
   resorts/murau.js — Murau — Kreischberg (Ausztria · Stájerország · Murau)
   ═══════════════════════════════════════════════════════════════════ */

export const murau = {
  "id": "murau",
  "name": "Murau — Kreischberg",
  "country": "Ausztria · Stájerország · Murau",
  "flag": "🇦🇹",
  "altitude": 2118,
  "baseAltitude": 868,
  "description": "A hivatalos panorámatérkép alapján: Rosenkranzhöhe (2.118m), Kreischberg & Eagle (1.997m), Kreischbergsee (1.800m), WM-Arena és 10er Gondelbahn.",
  "nodes": {
    "rosenkranzHohe": {
      "id": "rosenkranzHohe",
      "name": "Rosenkranzhöhe Csúcs (2.118m)",
      "altitude": 2118,
      "x": 220,
      "y": 55,
      "icon": "⛰️"
    },
    "kreischbergPeak": {
      "id": "kreischbergPeak",
      "name": "Kreischberg (1.997m) & Eagle",
      "altitude": 1997,
      "x": 640,
      "y": 75,
      "icon": "🦅"
    },
    "kreischbergsee": {
      "id": "kreischbergsee",
      "name": "Kreischbergsee (1.800m) & Sunshine",
      "altitude": 1800,
      "x": 460,
      "y": 200,
      "icon": "💧"
    },
    "schluckspecht": {
      "id": "schluckspecht",
      "name": "Schluckspecht / Rosenkranzbahn Alj",
      "altitude": 1500,
      "x": 140,
      "y": 340,
      "icon": "🛖"
    },
    "rieglerhuette": {
      "id": "rieglerhuette",
      "name": "Rieglerhütte & Alm",
      "altitude": 1650,
      "x": 360,
      "y": 330,
      "icon": "🏠"
    },
    "snowpark": {
      "id": "snowpark",
      "name": "Snowpark Kreischberg & Big Air",
      "altitude": 1850,
      "x": 760,
      "y": 200,
      "icon": "🏂"
    },
    "kreischbergwirt": {
      "id": "kreischbergwirt",
      "name": "Kreischbergwirt & Skischule",
      "altitude": 1770,
      "x": 600,
      "y": 350,
      "icon": "☕"
    },
    "sixpackTal": {
      "id": "sixpackTal",
      "name": "Sixpack 6er Sesselbahn Alj",
      "altitude": 1600,
      "x": 700,
      "y": 360,
      "icon": "🚡"
    },
    "hohenloipe": {
      "id": "hohenloipe",
      "name": "Höhenloipe (2.5 km) & Panoráma",
      "altitude": 1650,
      "x": 820,
      "y": 360,
      "icon": "🎿"
    },
    "dinowald": {
      "id": "dinowald",
      "name": "Dinowald & Kreischi Geisterbahn",
      "altitude": 1500,
      "x": 440,
      "y": 400,
      "icon": "🦕"
    },
    "mittelstation": {
      "id": "mittelstation",
      "name": "Mittelstation Grillboden (1.200m)",
      "altitude": 1200,
      "x": 470,
      "y": 480,
      "icon": "🚡"
    },
    "wmArena": {
      "id": "wmArena",
      "name": "WM Arena & Permanente Rennstrecke",
      "altitude": 950,
      "x": 270,
      "y": 560,
      "icon": "🏁"
    },
    "talstation": {
      "id": "talstation",
      "name": "Kreischberg Talstation (868m)",
      "altitude": 868,
      "x": 370,
      "y": 620,
      "icon": "🏘️"
    },
    "stLorenzen": {
      "id": "stLorenzen",
      "name": "St. Lorenzen ob Murau / Bahnhof",
      "altitude": 860,
      "x": 170,
      "y": 625,
      "icon": "🏡"
    }
  },
  "edges": [
    {
      "id": "liftA",
      "from": "talstation",
      "to": "mittelstation",
      "name": "10er Gondelbahn 1. Sektion (A)",
      "difficulty": "blue",
      "type": "lift",
      "weight": 2,
      "waypoints": [
        [
          420,
          550
        ]
      ]
    },
    {
      "id": "liftB",
      "from": "mittelstation",
      "to": "kreischbergPeak",
      "name": "10er Gondelbahn 2. Sektion (B)",
      "difficulty": "blue",
      "type": "lift",
      "weight": 2,
      "waypoints": [
        [
          550,
          270
        ]
      ]
    },
    {
      "id": "liftK",
      "from": "schluckspecht",
      "to": "rosenkranzHohe",
      "name": "8er Sesselbahn Rosenkranz (K)",
      "difficulty": "blue",
      "type": "lift",
      "weight": 2,
      "waypoints": [
        [
          180,
          200
        ]
      ]
    },
    {
      "id": "liftL",
      "from": "sixpackTal",
      "to": "kreischbergPeak",
      "name": "Sixpack 6er-Sesselbahn (L)",
      "difficulty": "blue",
      "type": "lift",
      "weight": 2,
      "waypoints": [
        [
          670,
          210
        ]
      ]
    },
    {
      "id": "liftH",
      "from": "kreischbergsee",
      "to": "kreischbergPeak",
      "name": "Sunshine I+II Schlepplifte (H+I)",
      "difficulty": "blue",
      "type": "lift",
      "weight": 2,
      "waypoints": [
        [
          550,
          140
        ]
      ]
    },
    {
      "id": "liftM",
      "from": "rieglerhuette",
      "to": "rosenkranzHohe",
      "name": "10er Gondelbahn Riegleralm (M)",
      "difficulty": "blue",
      "type": "lift",
      "weight": 2,
      "waypoints": [
        [
          290,
          190
        ]
      ]
    },
    {
      "id": "liftC",
      "from": "wmArena",
      "to": "mittelstation",
      "name": "4er Sesselbahn Schopfart (C)",
      "difficulty": "blue",
      "type": "lift",
      "weight": 2,
      "waypoints": [
        [
          370,
          520
        ]
      ]
    },
    {
      "id": "liftG",
      "from": "kreischbergwirt",
      "to": "snowpark",
      "name": "Kreischi Übungslift & Magic Carpet",
      "difficulty": "blue",
      "type": "lift",
      "weight": 1,
      "waypoints": [
        [
          680,
          280
        ]
      ]
    },
    {
      "id": "p6",
      "from": "rosenkranzHohe",
      "to": "kreischbergsee",
      "name": "6-os Kék Csúcsgerinc Lejtő",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          340,
          110
        ],
        [
          400,
          150
        ]
      ]
    },
    {
      "id": "p7",
      "from": "rosenkranzHohe",
      "to": "rieglerhuette",
      "name": "7/7a Piros Rosenkranz Carving",
      "difficulty": "red",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          280,
          180
        ],
        [
          320,
          260
        ]
      ]
    },
    {
      "id": "p8",
      "from": "rosenkranzHohe",
      "to": "rieglerhuette",
      "name": "8-as Fekete Meredek Fal",
      "difficulty": "black",
      "type": "run",
      "weight": 5,
      "waypoints": [
        [
          310,
          120
        ],
        [
          350,
          220
        ]
      ]
    },
    {
      "id": "p10",
      "from": "rosenkranzHohe",
      "to": "schluckspecht",
      "name": "10/10a Piros Nyugati Pálya",
      "difficulty": "red",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          80,
          140
        ],
        [
          100,
          250
        ]
      ]
    },
    {
      "id": "p11",
      "from": "rosenkranzHohe",
      "to": "schluckspecht",
      "name": "11-es Fekete Rosenkranz Letörés",
      "difficulty": "black",
      "type": "run",
      "weight": 5,
      "waypoints": [
        [
          170,
          160
        ],
        [
          150,
          250
        ]
      ]
    },
    {
      "id": "p9",
      "from": "schluckspecht",
      "to": "rieglerhuette",
      "name": "9-es Piros Összekötő Pálya",
      "difficulty": "red",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          240,
          360
        ],
        [
          300,
          350
        ]
      ]
    },
    {
      "id": "p18",
      "from": "kreischbergPeak",
      "to": "kreischbergsee",
      "name": "18-as Piros Kreischbergsee Lejtő",
      "difficulty": "red",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          560,
          130
        ],
        [
          510,
          170
        ]
      ]
    },
    {
      "id": "p19",
      "from": "kreischbergsee",
      "to": "rieglerhuette",
      "name": "19-es Kék Tóparti Családi Pálya",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          420,
          260
        ],
        [
          390,
          300
        ]
      ]
    },
    {
      "id": "p12",
      "from": "rieglerhuette",
      "to": "dinowald",
      "name": "12/12a Piros Riegleralm Pálya",
      "difficulty": "red",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          400,
          370
        ]
      ]
    },
    {
      "id": "p13",
      "from": "rieglerhuette",
      "to": "mittelstation",
      "name": "13-as Kék Erdei Völgyút",
      "difficulty": "blue",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          370,
          420
        ],
        [
          410,
          460
        ]
      ]
    },
    {
      "id": "pDino",
      "from": "dinowald",
      "to": "mittelstation",
      "name": "Dino Kék Családi Ösvény",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          460,
          440
        ]
      ]
    },
    {
      "id": "p14",
      "from": "kreischbergPeak",
      "to": "kreischbergwirt",
      "name": "14-es Kék Eagle Panoráma Pálya",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          620,
          190
        ],
        [
          610,
          270
        ]
      ]
    },
    {
      "id": "p3",
      "from": "kreischbergPeak",
      "to": "snowpark",
      "name": "3-as Kék Snowpark Bevezető",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          700,
          130
        ]
      ]
    },
    {
      "id": "p15",
      "from": "kreischbergPeak",
      "to": "sixpackTal",
      "name": "15-ös Piros Sixpack Főpálya",
      "difficulty": "red",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          670,
          220
        ],
        [
          690,
          290
        ]
      ]
    },
    {
      "id": "p17",
      "from": "snowpark",
      "to": "sixpackTal",
      "name": "17/17a Piros Freestyle Slopestyle",
      "difficulty": "red",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          730,
          280
        ]
      ]
    },
    {
      "id": "p16",
      "from": "snowpark",
      "to": "hohenloipe",
      "name": "16-os Fekete Sziklafal Flank",
      "difficulty": "black",
      "type": "run",
      "weight": 4,
      "waypoints": [
        [
          810,
          270
        ]
      ]
    },
    {
      "id": "pSixpackExit",
      "from": "sixpackTal",
      "to": "kreischbergwirt",
      "name": "Sixpack Átcsúszó Kék",
      "difficulty": "blue",
      "type": "run",
      "weight": 1,
      "waypoints": [
        [
          650,
          360
        ]
      ]
    },
    {
      "id": "p2",
      "from": "kreischbergwirt",
      "to": "mittelstation",
      "name": "2/2a Kék Családi Főlejtő",
      "difficulty": "blue",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          550,
          420
        ]
      ]
    },
    {
      "id": "p1",
      "from": "mittelstation",
      "to": "wmArena",
      "name": "1-es Fekete FIS Világkupa Pálya",
      "difficulty": "black",
      "type": "run",
      "weight": 4,
      "waypoints": [
        [
          410,
          510
        ],
        [
          340,
          530
        ]
      ]
    },
    {
      "id": "p1a",
      "from": "mittelstation",
      "to": "wmArena",
      "name": "1a/1b Piros Völgylesiklás",
      "difficulty": "red",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          450,
          540
        ],
        [
          350,
          560
        ]
      ]
    },
    {
      "id": "p1c",
      "from": "wmArena",
      "to": "talstation",
      "name": "1c Kék Célterület & Befutó",
      "difficulty": "blue",
      "type": "run",
      "weight": 1,
      "waypoints": [
        [
          320,
          595
        ]
      ]
    },
    {
      "id": "pVolgy",
      "from": "wmArena",
      "to": "stLorenzen",
      "name": "St. Lorenzen Après-Ski Sétány",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          220,
          595
        ]
      ]
    }
  ]
};
