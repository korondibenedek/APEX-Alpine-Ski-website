/* ═══════════════════════════════════════════════════════════════════
   resorts/jasna.js — Jasná Nízke Tatry — Chopok (Szlovákia · Alacsony-Tátra)
   ═══════════════════════════════════════════════════════════════════ */

export const jasna = {
  "id": "jasna",
  "name": "Jasná Nízke Tatry — Chopok",
  "country": "Szlovákia · Alacsony-Tátra",
  "flag": "🇸🇰",
  "altitude": 2024,
  "baseAltitude": 943,
  "description": "Közép-Európa egyik legmodernebb síközpontja 50 km pályával, Funitel csúcsgondolával, freeride zónákkal és Észak-Déli összeköttetéssel.",
  "nodes": {
    "chopokCsucs": {
      "id": "chopokCsucs",
      "name": "Chopok Csúcs & Rotunda (2024m)",
      "altitude": 2024,
      "x": 470,
      "y": 60,
      "icon": "⛰️"
    },
    "dereseFreeride": {
      "id": "dereseFreeride",
      "name": "Zadné Dereše Freeride Zóna",
      "altitude": 2000,
      "x": 230,
      "y": 100,
      "icon": "⚠️"
    },
    "lukovaHegy": {
      "id": "lukovaHegy",
      "name": "Luková Panoráma & Étterem",
      "altitude": 1670,
      "x": 370,
      "y": 170,
      "icon": "🏠"
    },
    "kosodrevinaDel": {
      "id": "kosodrevinaDel",
      "name": "Kosodrevina Átszálló (Dél)",
      "altitude": 1492,
      "x": 700,
      "y": 190,
      "icon": "🚡"
    },
    "rovnaHola": {
      "id": "rovnaHola",
      "name": "Rovná Hoľa Állomás",
      "altitude": 1491,
      "x": 220,
      "y": 240,
      "icon": "🏔️"
    },
    "priehybaHub": {
      "id": "priehybaHub",
      "name": "Priehyba Főcsomópont",
      "altitude": 1342,
      "x": 410,
      "y": 300,
      "icon": "🚡"
    },
    "kolieskoMid": {
      "id": "kolieskoMid",
      "name": "Koliesko Középállomás",
      "altitude": 1200,
      "x": 550,
      "y": 340,
      "icon": "☕"
    },
    "otupneBrhliska": {
      "id": "otupneBrhliska",
      "name": "Otupné & Brhliská Kabin",
      "altitude": 1420,
      "x": 120,
      "y": 360,
      "icon": "🚡"
    },
    "krupovaDel": {
      "id": "krupovaDel",
      "name": "Krupová Déli Völgybázis",
      "altitude": 1080,
      "x": 760,
      "y": 390,
      "icon": "🏘️"
    },
    "bielaPut": {
      "id": "bielaPut",
      "name": "Biela Púť Családi Pálya",
      "altitude": 1117,
      "x": 310,
      "y": 450,
      "icon": "🎿"
    },
    "zahradkyBase": {
      "id": "zahradkyBase",
      "name": "Záhradky 6-üléses Bázis",
      "altitude": 1028,
      "x": 540,
      "y": 480,
      "icon": "🚡"
    },
    "grandHotel": {
      "id": "grandHotel",
      "name": "Grand Hotel Jasná Központ",
      "altitude": 1100,
      "x": 200,
      "y": 550,
      "icon": "🏨"
    },
    "luckyBase": {
      "id": "luckyBase",
      "name": "Lúčky Völgyállomás (943m)",
      "altitude": 943,
      "x": 460,
      "y": 620,
      "icon": "🏘️"
    },
    "crystalBar": {
      "id": "crystalBar",
      "name": "Crystal Bar & Terasz",
      "altitude": 1100,
      "x": 370,
      "y": 530,
      "icon": "🍸"
    }
  },
  "edges": [
    {
      "id": "js1",
      "from": "chopokCsucs",
      "to": "dereseFreeride",
      "name": "Dereše Gerinc Fekete",
      "difficulty": "black",
      "type": "run",
      "weight": 5,
      "waypoints": [
        [
          340,
          80
        ]
      ]
    },
    {
      "id": "js2",
      "from": "chopokCsucs",
      "to": "lukovaHegy",
      "name": "1-es Majstrovská Északi Fekete",
      "difficulty": "black",
      "type": "run",
      "weight": 5,
      "waypoints": [
        [
          420,
          110
        ]
      ]
    },
    {
      "id": "js3",
      "from": "chopokCsucs",
      "to": "kosodrevinaDel",
      "name": "33-as Déli Panoráma Piros",
      "difficulty": "red",
      "type": "run",
      "weight": 4,
      "waypoints": [
        [
          600,
          120
        ]
      ]
    },
    {
      "id": "js4",
      "from": "kosodrevinaDel",
      "to": "krupovaDel",
      "name": "31-es Déli Völgylesiklás Kék",
      "difficulty": "blue",
      "type": "run",
      "weight": 4,
      "waypoints": [
        [
          740,
          290
        ]
      ]
    },
    {
      "id": "js5",
      "from": "lukovaHegy",
      "to": "rovnaHola",
      "name": "Konský Grúň Átkötő Piros",
      "difficulty": "red",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          290,
          200
        ]
      ]
    },
    {
      "id": "js6",
      "from": "lukovaHegy",
      "to": "priehybaHub",
      "name": "2-es Májová Piros",
      "difficulty": "red",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          390,
          230
        ]
      ]
    },
    {
      "id": "js7",
      "from": "rovnaHola",
      "to": "zahradkyBase",
      "name": "11-es FIS Záhradky Piros",
      "difficulty": "red",
      "type": "run",
      "weight": 4,
      "waypoints": [
        [
          380,
          390
        ]
      ]
    },
    {
      "id": "js8",
      "from": "dereseFreeride",
      "to": "otupneBrhliska",
      "name": "Chopok Nyugat Freeride",
      "difficulty": "black",
      "type": "run",
      "weight": 6,
      "waypoints": [
        [
          160,
          220
        ]
      ]
    },
    {
      "id": "js9",
      "from": "priehybaHub",
      "to": "kolieskoMid",
      "name": "Priehyba Átcsúszó Kék",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          480,
          320
        ]
      ]
    },
    {
      "id": "js10",
      "from": "kolieskoMid",
      "to": "zahradkyBase",
      "name": "Turistická Záhradky Kék",
      "difficulty": "blue",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          550,
          410
        ]
      ]
    },
    {
      "id": "js11",
      "from": "otupneBrhliska",
      "to": "bielaPut",
      "name": "Grand Slalom Otupné Kék",
      "difficulty": "blue",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          220,
          410
        ]
      ]
    },
    {
      "id": "js12",
      "from": "bielaPut",
      "to": "grandHotel",
      "name": "Biela Púť Családi Kezdő",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          240,
          500
        ]
      ]
    },
    {
      "id": "js13",
      "from": "bielaPut",
      "to": "crystalBar",
      "name": "Après-Ski Promenade",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          340,
          490
        ]
      ]
    },
    {
      "id": "js14",
      "from": "zahradkyBase",
      "to": "luckyBase",
      "name": "Lúčky Kék Völgypálya",
      "difficulty": "blue",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          510,
          560
        ]
      ]
    },
    {
      "id": "jsLift1",
      "from": "priehybaHub",
      "to": "chopokCsucs",
      "name": "Funitel Chopok Csúcsgondola",
      "difficulty": "blue",
      "type": "lift",
      "weight": 2,
      "waypoints": [
        [
          440,
          180
        ]
      ]
    },
    {
      "id": "jsLift2",
      "from": "bielaPut",
      "to": "priehybaHub",
      "name": "Twinliner Sikló & Gondola",
      "difficulty": "blue",
      "type": "lift",
      "weight": 2,
      "waypoints": [
        [
          360,
          370
        ]
      ]
    },
    {
      "id": "jsLift3",
      "from": "zahradkyBase",
      "to": "rovnaHola",
      "name": "Záhradky 6-üléses Express",
      "difficulty": "blue",
      "type": "lift",
      "weight": 2,
      "waypoints": [
        [
          370,
          360
        ]
      ]
    },
    {
      "id": "jsLift4",
      "from": "luckyBase",
      "to": "priehybaHub",
      "name": "Lúčky 6-üléses Gyorslift",
      "difficulty": "blue",
      "type": "lift",
      "weight": 2,
      "waypoints": [
        [
          440,
          460
        ]
      ]
    },
    {
      "id": "jsLift5",
      "from": "krupovaDel",
      "to": "chopokCsucs",
      "name": "Krupová-Kosodrevina Gondola Dél",
      "difficulty": "blue",
      "type": "lift",
      "weight": 3,
      "waypoints": [
        [
          620,
          240
        ]
      ]
    }
  ]
};
