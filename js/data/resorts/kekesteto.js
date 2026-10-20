/* ═══════════════════════════════════════════════════════════════════
   resorts/kekesteto.js — Kékestető Sícentrum (Magyarország · Mátra)
   ═══════════════════════════════════════════════════════════════════ */

export const kekesteto = {
  "id": "kekesteto",
  "name": "Kékestető Sícentrum",
  "country": "Magyarország · Mátra",
  "flag": "🇭🇺",
  "altitude": 1014,
  "baseAltitude": 710,
  "description": "Magyarország legmagasabb pontja az 1.8 km hosszú legendás Déli Sípályával, meredek Északi lejtővel és csúcskilátással.",
  "nodes": {
    "kekesCsucs": {
      "id": "kekesCsucs",
      "name": "Kékestető Csúcs (1014m)",
      "altitude": 1014,
      "x": 450,
      "y": 65,
      "icon": "🗼"
    },
    "tevetorony": {
      "id": "tevetorony",
      "name": "Tévétorony Kilátó",
      "altitude": 1005,
      "x": 290,
      "y": 120,
      "icon": "📡"
    },
    "korbarHut": {
      "id": "korbarHut",
      "name": "Körbár & Csúcshütte",
      "altitude": 980,
      "x": 620,
      "y": 130,
      "icon": "☕"
    },
    "eszakiMeredek": {
      "id": "eszakiMeredek",
      "name": "Északi Meredek Fekete",
      "altitude": 920,
      "x": 220,
      "y": 220,
      "icon": "⚠️"
    },
    "deliFelso": {
      "id": "deliFelso",
      "name": "Déli Pálya Felső Rajt",
      "altitude": 940,
      "x": 510,
      "y": 220,
      "icon": "⛷️"
    },
    "eszakiVolgy": {
      "id": "eszakiVolgy",
      "name": "Északi Sífelvonó Alj",
      "altitude": 780,
      "x": 180,
      "y": 380,
      "icon": "🚡"
    },
    "veronikaRet": {
      "id": "veronikaRet",
      "name": "Veronika-rét Csomópont",
      "altitude": 860,
      "x": 390,
      "y": 340,
      "icon": "🌲"
    },
    "erdeiAtkoto": {
      "id": "erdeiAtkoto",
      "name": "Erdei Romantikus Átkötő",
      "altitude": 830,
      "x": 600,
      "y": 350,
      "icon": "🎿"
    },
    "matraBerc": {
      "id": "matraBerc",
      "name": "Mátra Bérc Pihenő & Büfé",
      "altitude": 780,
      "x": 630,
      "y": 480,
      "icon": "🏠"
    },
    "deliAlso": {
      "id": "deliAlso",
      "name": "Déli Pálya Alsó S-Kanyar",
      "altitude": 750,
      "x": 360,
      "y": 500,
      "icon": "🌲"
    },
    "matrahazaBase": {
      "id": "matrahazaBase",
      "name": "Mátraháza Völgybázis (710m)",
      "altitude": 710,
      "x": 470,
      "y": 620,
      "icon": "🏘️"
    }
  },
  "edges": [
    {
      "id": "kk1",
      "from": "kekesCsucs",
      "to": "tevetorony",
      "name": "Csúcs Panoráma Séta",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          370,
          90
        ]
      ]
    },
    {
      "id": "kk2",
      "from": "kekesCsucs",
      "to": "korbarHut",
      "name": "Csúcs Körbár Átcsúszó",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          540,
          95
        ]
      ]
    },
    {
      "id": "kk3",
      "from": "tevetorony",
      "to": "eszakiMeredek",
      "name": "Északi Pálya Felső Letörés",
      "difficulty": "black",
      "type": "run",
      "weight": 5,
      "waypoints": [
        [
          240,
          170
        ]
      ]
    },
    {
      "id": "kk4",
      "from": "eszakiMeredek",
      "to": "eszakiVolgy",
      "name": "Északi Meredek Slalom",
      "difficulty": "black",
      "type": "run",
      "weight": 6,
      "waypoints": [
        [
          190,
          300
        ]
      ]
    },
    {
      "id": "kk5",
      "from": "korbarHut",
      "to": "deliFelso",
      "name": "Déli 1-es Felső Csúszás",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          570,
          180
        ]
      ]
    },
    {
      "id": "kk6",
      "from": "deliFelso",
      "to": "veronikaRet",
      "name": "Déli Pálya Közép Veronika-rétig",
      "difficulty": "blue",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          450,
          280
        ]
      ]
    },
    {
      "id": "kk7",
      "from": "deliFelso",
      "to": "erdeiAtkoto",
      "name": "Mátra Erdei Piros Átvezető",
      "difficulty": "red",
      "type": "run",
      "weight": 4,
      "waypoints": [
        [
          560,
          290
        ]
      ]
    },
    {
      "id": "kk8",
      "from": "veronikaRet",
      "to": "deliAlso",
      "name": "Déli 1-es Erdős Alsó Szakasz",
      "difficulty": "blue",
      "type": "run",
      "weight": 4,
      "waypoints": [
        [
          370,
          420
        ]
      ]
    },
    {
      "id": "kk9",
      "from": "erdeiAtkoto",
      "to": "matraBerc",
      "name": "Bérc Átkötő Kék",
      "difficulty": "blue",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          620,
          420
        ]
      ]
    },
    {
      "id": "kk10",
      "from": "matraBerc",
      "to": "matrahazaBase",
      "name": "Bérc Levezető Mátraházára",
      "difficulty": "blue",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          560,
          560
        ]
      ]
    },
    {
      "id": "kk11",
      "from": "deliAlso",
      "to": "matrahazaBase",
      "name": "Déli Pálya Finis (1.8 km vége)",
      "difficulty": "blue",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          410,
          570
        ]
      ]
    },
    {
      "id": "kk12",
      "from": "eszakiVolgy",
      "to": "veronikaRet",
      "name": "Északi Összekötő Út",
      "difficulty": "blue",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          280,
          360
        ]
      ]
    },
    {
      "id": "kkLift1",
      "from": "eszakiVolgy",
      "to": "kekesCsucs",
      "name": "Északi Tányéros Felvonó",
      "difficulty": "blue",
      "type": "lift",
      "weight": 2,
      "waypoints": [
        [
          310,
          220
        ]
      ]
    },
    {
      "id": "kkLift2",
      "from": "veronikaRet",
      "to": "kekesCsucs",
      "name": "Kékes Csúcsfelvonó",
      "difficulty": "blue",
      "type": "lift",
      "weight": 2,
      "waypoints": [
        [
          420,
          200
        ]
      ]
    },
    {
      "id": "kkLift3",
      "from": "matrahazaBase",
      "to": "veronikaRet",
      "name": "Kékes Síbusz Express",
      "difficulty": "blue",
      "type": "lift",
      "weight": 3,
      "waypoints": [
        [
          430,
          480
        ]
      ]
    }
  ]
};
