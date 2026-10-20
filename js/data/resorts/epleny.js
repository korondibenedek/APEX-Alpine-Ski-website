/* ═══════════════════════════════════════════════════════════════════
   resorts/epleny.js — Eplény Síaréna Vibe Park (Magyarország · Bakony)
   ═══════════════════════════════════════════════════════════════════ */

export const epleny = {
  "id": "epleny",
  "name": "Eplény Síaréna Vibe Park",
  "country": "Magyarország · Bakony",
  "flag": "🇭🇺",
  "altitude": 509,
  "baseAltitude": 330,
  "description": "Magyarország legnépszerűbb és legfejlettebb síterepe az Ámos-hegyen, 4-üléses felvonóval, világítással és 8 km hóágyúzott pályarendszerrel.",
  "nodes": {
    "amosCsucs": {
      "id": "amosCsucs",
      "name": "Ámos-hegyi Csúcs (509m)",
      "altitude": 509,
      "x": 450,
      "y": 65,
      "icon": "⛰️"
    },
    "amosKilato": {
      "id": "amosKilato",
      "name": "Ámos Kilátó & Panoráma",
      "altitude": 498,
      "x": 280,
      "y": 120,
      "icon": "🔭"
    },
    "negyulesesHegy": {
      "id": "negyulesesHegy",
      "name": "4-üléses Hegyállomás",
      "altitude": 485,
      "x": 440,
      "y": 160,
      "icon": "🚡"
    },
    "holleAnyoHut": {
      "id": "holleAnyoHut",
      "name": "Holle Anyó Hütte",
      "altitude": 440,
      "x": 620,
      "y": 180,
      "icon": "☕"
    },
    "palya1Felső": {
      "id": "palya1Felső",
      "name": "1-es Főpálya Rajt",
      "altitude": 470,
      "x": 370,
      "y": 230,
      "icon": "⛷️"
    },
    "fekete2Letores": {
      "id": "fekete2Letores",
      "name": "2-es Fekete Letörés",
      "altitude": 450,
      "x": 220,
      "y": 240,
      "icon": "⚠️"
    },
    "bLiftHegy": {
      "id": "bLiftHegy",
      "name": "2-üléses Hegyállomás",
      "altitude": 460,
      "x": 510,
      "y": 250,
      "icon": "🚡"
    },
    "tanpalyaIndito": {
      "id": "tanpalyaIndito",
      "name": "T1 Tanpálya Indító",
      "altitude": 390,
      "x": 230,
      "y": 380,
      "icon": "🎿"
    },
    "snowparkEpleny": {
      "id": "snowparkEpleny",
      "name": "Nitro Freestyle Park",
      "altitude": 380,
      "x": 360,
      "y": 390,
      "icon": "🏂"
    },
    "malomvolgyFelso": {
      "id": "malomvolgyFelso",
      "name": "Malomvölgy Felső Átkötő",
      "altitude": 410,
      "x": 670,
      "y": 330,
      "icon": "🌲"
    },
    "malomvolgyBase": {
      "id": "malomvolgyBase",
      "name": "Malomvölgy Csákányos Alj",
      "altitude": 350,
      "x": 680,
      "y": 480,
      "icon": "🚡"
    },
    "kemencesTerasz": {
      "id": "kemencesTerasz",
      "name": "Kemencés Büfé & Terasz",
      "altitude": 340,
      "x": 340,
      "y": 530,
      "icon": "🍕"
    },
    "siarenaBase": {
      "id": "siarenaBase",
      "name": "Síaréna Fő Völgybázis (330m)",
      "altitude": 330,
      "x": 480,
      "y": 620,
      "icon": "🏘️"
    }
  },
  "edges": [
    {
      "id": "ep1",
      "from": "amosCsucs",
      "to": "amosKilato",
      "name": "Kilátó Sétaútvonal",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          360,
          90
        ]
      ]
    },
    {
      "id": "ep2",
      "from": "amosCsucs",
      "to": "negyulesesHegy",
      "name": "Csúcs Gerinc Kék",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          450,
          110
        ]
      ]
    },
    {
      "id": "ep3",
      "from": "negyulesesHegy",
      "to": "holleAnyoHut",
      "name": "Hütte Átcsúszó",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          530,
          170
        ]
      ]
    },
    {
      "id": "ep4",
      "from": "amosKilato",
      "to": "fekete2Letores",
      "name": "2-es Fekete Síugrató szakasz",
      "difficulty": "black",
      "type": "run",
      "weight": 5,
      "waypoints": [
        [
          240,
          180
        ]
      ]
    },
    {
      "id": "ep5",
      "from": "negyulesesHegy",
      "to": "palya1Felső",
      "name": "1-es Panoráma Felső",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          400,
          195
        ]
      ]
    },
    {
      "id": "ep6",
      "from": "palya1Felső",
      "to": "bLiftHegy",
      "name": "1/A Piros Meredek",
      "difficulty": "red",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          440,
          240
        ]
      ]
    },
    {
      "id": "ep7",
      "from": "fekete2Letores",
      "to": "tanpalyaIndito",
      "name": "2-es Fekete Kanyar",
      "difficulty": "black",
      "type": "run",
      "weight": 4,
      "waypoints": [
        [
          210,
          310
        ]
      ]
    },
    {
      "id": "ep8",
      "from": "palya1Felső",
      "to": "snowparkEpleny",
      "name": "1-es Középső Szakasz",
      "difficulty": "blue",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          360,
          310
        ]
      ]
    },
    {
      "id": "ep9",
      "from": "holleAnyoHut",
      "to": "malomvolgyFelso",
      "name": "Malomvölgyi 5-ös Kék Felső",
      "difficulty": "blue",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          650,
          250
        ]
      ]
    },
    {
      "id": "ep10",
      "from": "malomvolgyFelso",
      "to": "malomvolgyBase",
      "name": "5-ös Pálya Alsó Erdei Ív",
      "difficulty": "blue",
      "type": "run",
      "weight": 4,
      "waypoints": [
        [
          690,
          410
        ]
      ]
    },
    {
      "id": "ep11",
      "from": "tanpalyaIndito",
      "to": "kemencesTerasz",
      "name": "T1 Családi Tanulópálya",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          280,
          460
        ]
      ]
    },
    {
      "id": "ep12",
      "from": "snowparkEpleny",
      "to": "kemencesTerasz",
      "name": "Park Levezető Piros",
      "difficulty": "red",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          350,
          460
        ]
      ]
    },
    {
      "id": "ep13",
      "from": "kemencesTerasz",
      "to": "siarenaBase",
      "name": "1-es Alsó Főpálya Vég",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          410,
          580
        ]
      ]
    },
    {
      "id": "ep14",
      "from": "malomvolgyBase",
      "to": "siarenaBase",
      "name": "Malomvölgyi Összekötő Kék",
      "difficulty": "blue",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          590,
          560
        ]
      ]
    },
    {
      "id": "epLift1",
      "from": "siarenaBase",
      "to": "negyulesesHegy",
      "name": "Ámos Panoráma 4-üléses",
      "difficulty": "blue",
      "type": "lift",
      "weight": 2,
      "waypoints": [
        [
          470,
          390
        ]
      ]
    },
    {
      "id": "epLift2",
      "from": "kemencesTerasz",
      "to": "bLiftHegy",
      "name": "Kétüléses Felvonó B",
      "difficulty": "blue",
      "type": "lift",
      "weight": 2,
      "waypoints": [
        [
          420,
          390
        ]
      ]
    },
    {
      "id": "epLift3",
      "from": "malomvolgyBase",
      "to": "holleAnyoHut",
      "name": "Malomvölgyi Csákányos",
      "difficulty": "blue",
      "type": "lift",
      "weight": 2,
      "waypoints": [
        [
          660,
          330
        ]
      ]
    },
    {
      "id": "epLift4",
      "from": "siarenaBase",
      "to": "tanpalyaIndito",
      "name": "Varázsszőnyeg Tanulólift",
      "difficulty": "blue",
      "type": "lift",
      "weight": 1,
      "waypoints": [
        [
          360,
          500
        ]
      ]
    }
  ]
};
