/* ═══════════════════════════════════════════════════════════════════
   resorts/matraszentistvan.js — Mátraszentistván Sípark (Magyarország · Felső-Mátra)
   ═══════════════════════════════════════════════════════════════════ */

export const matraszentistvan = {
  "id": "matraszentistvan",
  "name": "Mátraszentistván Sípark",
  "country": "Magyarország · Felső-Mátra",
  "flag": "🇭🇺",
  "altitude": 821,
  "baseAltitude": 675,
  "description": "Magyarország leghangulatosabb családi síparkja 10 hóágyúzott pályával, panoráma 4-ülésessel és a Hóhatár hüttével.",
  "nodes": {
    "haromfaluCsucs": {
      "id": "haromfaluCsucs",
      "name": "Háromfalu Kilátó Csúcs (821m)",
      "altitude": 821,
      "x": 450,
      "y": 70,
      "icon": "⛰️"
    },
    "panoramaTerasz": {
      "id": "panoramaTerasz",
      "name": "Sípark Panoráma Terasz",
      "altitude": 810,
      "x": 300,
      "y": 130,
      "icon": "🔭"
    },
    "csucsHutKorbar": {
      "id": "csucsHutKorbar",
      "name": "Csúcs Hütte & Körbár",
      "altitude": 805,
      "x": 610,
      "y": 140,
      "icon": "☕"
    },
    "piros1Rajt": {
      "id": "piros1Rajt",
      "name": "1-es Piros Főpálya Rajt",
      "altitude": 800,
      "x": 430,
      "y": 210,
      "icon": "🚩"
    },
    "fekete4Letores": {
      "id": "fekete4Letores",
      "name": "4-es Fekete Buckapálya",
      "altitude": 770,
      "x": 220,
      "y": 280,
      "icon": "⚠️"
    },
    "csaladi3Felso": {
      "id": "csaladi3Felso",
      "name": "3-as Családi Kék Felső",
      "altitude": 760,
      "x": 640,
      "y": 290,
      "icon": "🌲"
    },
    "hohatarHut": {
      "id": "hohatarHut",
      "name": "Hóhatár Hütte & Középállomás",
      "altitude": 730,
      "x": 420,
      "y": 370,
      "icon": "🏠"
    },
    "snowparkMatra": {
      "id": "snowparkMatra",
      "name": "Funpark & Hócsúszda",
      "altitude": 720,
      "x": 620,
      "y": 450,
      "icon": "🏂"
    },
    "tanulopalyak": {
      "id": "tanulopalyak",
      "name": "Varázsszőnyeg Tanpályák",
      "altitude": 700,
      "x": 260,
      "y": 470,
      "icon": "🎿"
    },
    "panoramaliftAlso": {
      "id": "panoramaliftAlso",
      "name": "Panorámalift Völgyállomás",
      "altitude": 675,
      "x": 380,
      "y": 580,
      "icon": "🚡"
    },
    "siparkFoepulet": {
      "id": "siparkFoepulet",
      "name": "Sípark Főépület & Kölcsönző (675m)",
      "altitude": 675,
      "x": 510,
      "y": 620,
      "icon": "🏘️"
    }
  },
  "edges": [
    {
      "id": "ms1",
      "from": "haromfaluCsucs",
      "to": "panoramaTerasz",
      "name": "Kilátó Séta Kék",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          370,
          100
        ]
      ]
    },
    {
      "id": "ms2",
      "from": "haromfaluCsucs",
      "to": "csucsHutKorbar",
      "name": "Körbár Átcsúszó Kék",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          530,
          100
        ]
      ]
    },
    {
      "id": "ms3",
      "from": "haromfaluCsucs",
      "to": "piros1Rajt",
      "name": "1-es Pálya Indulás",
      "difficulty": "red",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          440,
          150
        ]
      ]
    },
    {
      "id": "ms4",
      "from": "panoramaTerasz",
      "to": "fekete4Letores",
      "name": "4-es Meredek Letörés Fekete",
      "difficulty": "black",
      "type": "run",
      "weight": 4,
      "waypoints": [
        [
          250,
          200
        ]
      ]
    },
    {
      "id": "ms5",
      "from": "csucsHutKorbar",
      "to": "csaladi3Felso",
      "name": "3-as Családi Pálya Felső",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          630,
          210
        ]
      ]
    },
    {
      "id": "ms6",
      "from": "piros1Rajt",
      "to": "hohatarHut",
      "name": "1-es Piros Közép",
      "difficulty": "red",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          420,
          290
        ]
      ]
    },
    {
      "id": "ms7",
      "from": "fekete4Letores",
      "to": "tanulopalyak",
      "name": "5-ös Összekötő Piros",
      "difficulty": "red",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          240,
          380
        ]
      ]
    },
    {
      "id": "ms8",
      "from": "csaladi3Felso",
      "to": "snowparkMatra",
      "name": "Funpark Bevezető Kék",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          640,
          370
        ]
      ]
    },
    {
      "id": "ms9",
      "from": "hohatarHut",
      "to": "panoramaliftAlso",
      "name": "1-es Alsó Szakasz Piros",
      "difficulty": "red",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          400,
          470
        ]
      ]
    },
    {
      "id": "ms10",
      "from": "tanulopalyak",
      "to": "panoramaliftAlso",
      "name": "Tanuló Kék Levezető",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          320,
          530
        ]
      ]
    },
    {
      "id": "ms11",
      "from": "snowparkMatra",
      "to": "siparkFoepulet",
      "name": "3-as Családi Alsó Kék",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          570,
          540
        ]
      ]
    },
    {
      "id": "ms12",
      "from": "panoramaliftAlso",
      "to": "siparkFoepulet",
      "name": "Bázis Sétány",
      "difficulty": "blue",
      "type": "run",
      "weight": 1,
      "waypoints": [
        [
          450,
          600
        ]
      ]
    },
    {
      "id": "msLift1",
      "from": "panoramaliftAlso",
      "to": "haromfaluCsucs",
      "name": "Panorámalift 4-üléses",
      "difficulty": "blue",
      "type": "lift",
      "weight": 2,
      "waypoints": [
        [
          420,
          320
        ]
      ]
    },
    {
      "id": "msLift2",
      "from": "siparkFoepulet",
      "to": "csucsHutKorbar",
      "name": "Csákányos Főfelvonó",
      "difficulty": "blue",
      "type": "lift",
      "weight": 2,
      "waypoints": [
        [
          570,
          370
        ]
      ]
    },
    {
      "id": "msLift3",
      "from": "panoramaliftAlso",
      "to": "tanulopalyak",
      "name": "Tanpálya Varázsszőnyeg",
      "difficulty": "blue",
      "type": "lift",
      "weight": 1,
      "waypoints": [
        [
          320,
          520
        ]
      ]
    }
  ]
};
