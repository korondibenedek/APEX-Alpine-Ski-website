/* ═══════════════════════════════════════════════════════════════════
   resorts/nassfeld.js — Nassfeld — Hermagor (Ausztria · Karintia)
   ═══════════════════════════════════════════════════════════════════ */

export const nassfeld = {
  "id": "nassfeld",
  "name": "Nassfeld — Hermagor",
  "country": "Ausztria · Karintia",
  "flag": "🇦🇹",
  "altitude": 2002,
  "baseAltitude": 610,
  "description": "Karintia legnagyobb síparadicsoma 110 km pályával, a 7.6 km hosszú Carnia völgylesiklással és a Millennium-Express felvonóval.",
  "nodes": {
    "gartnerkofel": {
      "id": "gartnerkofel",
      "name": "Gartnerkofel Csúcs (2002m)",
      "altitude": 2002,
      "x": 230,
      "y": 70,
      "icon": "⛰️"
    },
    "madritsche": {
      "id": "madritsche",
      "name": "Madritsche Főcsúcs (1919m)",
      "altitude": 1919,
      "x": 480,
      "y": 65,
      "icon": "⛰️"
    },
    "troghohe": {
      "id": "troghohe",
      "name": "Troghöhe Sziklafal (2020m)",
      "altitude": 2020,
      "x": 720,
      "y": 80,
      "icon": "🏔️"
    },
    "rudnigsattel": {
      "id": "rudnigsattel",
      "name": "Rudnigsattel Átjáró",
      "altitude": 1945,
      "x": 630,
      "y": 180,
      "icon": "⛷️"
    },
    "kofelAlm": {
      "id": "kofelAlm",
      "name": "Kofel Alm & Berghex",
      "altitude": 1600,
      "x": 370,
      "y": 190,
      "icon": "🏠"
    },
    "tressdorferAlm": {
      "id": "tressdorferAlm",
      "name": "Tressdorfer Alm Közép",
      "altitude": 1590,
      "x": 210,
      "y": 310,
      "icon": "🚡"
    },
    "sonnenalpe": {
      "id": "sonnenalpe",
      "name": "Sonnenalpe Nassfeld Hágó",
      "altitude": 1513,
      "x": 510,
      "y": 290,
      "icon": "🏨"
    },
    "boboMiniklub": {
      "id": "boboMiniklub",
      "name": "Bobo Miniklub Gyerekbirodalom",
      "altitude": 1500,
      "x": 680,
      "y": 360,
      "icon": "🎿"
    },
    "gmanberg": {
      "id": "gmanberg",
      "name": "Gmanberg Átszállóállomás",
      "altitude": 1020,
      "x": 360,
      "y": 440,
      "icon": "🚡"
    },
    "carniaFelso": {
      "id": "carniaFelso",
      "name": "Carnia 7.6 km Felső Szakasz",
      "altitude": 1100,
      "x": 550,
      "y": 460,
      "icon": "🌲"
    },
    "carniaAlso": {
      "id": "carniaAlso",
      "name": "Carnia Alsó Kanyarulat",
      "altitude": 800,
      "x": 420,
      "y": 540,
      "icon": "🎿"
    },
    "tropolachBase": {
      "id": "tropolachBase",
      "name": "Tröpolach Millennium Talstation (610m)",
      "altitude": 610,
      "x": 460,
      "y": 620,
      "icon": "🏘️"
    }
  },
  "edges": [
    {
      "id": "nf1",
      "from": "gartnerkofel",
      "to": "kofelAlm",
      "name": "Gartnerkofel Carving Piros",
      "difficulty": "red",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          300,
          130
        ]
      ]
    },
    {
      "id": "nf2",
      "from": "madritsche",
      "to": "kofelAlm",
      "name": "Madritsche Panoráma Kék",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          420,
          130
        ]
      ]
    },
    {
      "id": "nf3",
      "from": "troghohe",
      "to": "rudnigsattel",
      "name": "Troghöhe Meredek Fekete",
      "difficulty": "black",
      "type": "run",
      "weight": 5,
      "waypoints": [
        [
          670,
          130
        ]
      ]
    },
    {
      "id": "nf4",
      "from": "rudnigsattel",
      "to": "sonnenalpe",
      "name": "Rudnig Kék Síútvonal",
      "difficulty": "blue",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          570,
          240
        ]
      ]
    },
    {
      "id": "nf5",
      "from": "kofelAlm",
      "to": "tressdorferAlm",
      "name": "Tressdorf Levezető Piros",
      "difficulty": "red",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          290,
          250
        ]
      ]
    },
    {
      "id": "nf6",
      "from": "kofelAlm",
      "to": "sonnenalpe",
      "name": "Hágó Átkötő Kék",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          440,
          240
        ]
      ]
    },
    {
      "id": "nf7",
      "from": "sonnenalpe",
      "to": "boboMiniklub",
      "name": "Gyerek Tanpálya Kék",
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
      "id": "nf8",
      "from": "tressdorferAlm",
      "to": "gmanberg",
      "name": "Erdei Romantika Kék",
      "difficulty": "blue",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          280,
          370
        ]
      ]
    },
    {
      "id": "nf9",
      "from": "sonnenalpe",
      "to": "carniaFelso",
      "name": "Carnia Felső Rajt Piros",
      "difficulty": "red",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          530,
          375
        ]
      ]
    },
    {
      "id": "nf10",
      "from": "gmanberg",
      "to": "carniaAlso",
      "name": "Gmanberg Átvezető Kék",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          390,
          490
        ]
      ]
    },
    {
      "id": "nf11",
      "from": "carniaFelso",
      "to": "carniaAlso",
      "name": "Carnia Meredek Közép Piros",
      "difficulty": "red",
      "type": "run",
      "weight": 4,
      "waypoints": [
        [
          480,
          500
        ]
      ]
    },
    {
      "id": "nf12",
      "from": "carniaAlso",
      "to": "tropolachBase",
      "name": "Carnia Világított Völgyfinis Kék",
      "difficulty": "blue",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          440,
          580
        ]
      ]
    },
    {
      "id": "nfLift1",
      "from": "tropolachBase",
      "to": "gmanberg",
      "name": "Millennium-Express Sektor 1",
      "difficulty": "blue",
      "type": "lift",
      "weight": 2,
      "waypoints": [
        [
          410,
          530
        ]
      ]
    },
    {
      "id": "nfLift2",
      "from": "gmanberg",
      "to": "tressdorferAlm",
      "name": "Millennium-Express Sektor 2",
      "difficulty": "blue",
      "type": "lift",
      "weight": 2,
      "waypoints": [
        [
          280,
          370
        ]
      ]
    },
    {
      "id": "nfLift3",
      "from": "tressdorferAlm",
      "to": "madritsche",
      "name": "Millennium-Express Sektor 3",
      "difficulty": "blue",
      "type": "lift",
      "weight": 2,
      "waypoints": [
        [
          350,
          190
        ]
      ]
    },
    {
      "id": "nfLift4",
      "from": "sonnenalpe",
      "to": "gartnerkofel",
      "name": "Gartnerkofel 4-üléses",
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
      "id": "nfLift5",
      "from": "sonnenalpe",
      "to": "troghohe",
      "name": "Troghöhe 6-üléses Express",
      "difficulty": "blue",
      "type": "lift",
      "weight": 2,
      "waypoints": [
        [
          620,
          190
        ]
      ]
    }
  ]
};
