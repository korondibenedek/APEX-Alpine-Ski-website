/* ═══════════════════════════════════════════════════════════════════
   resorts/schladming.js — Schladming — Planai (Ausztria · Stájerország)
   ═══════════════════════════════════════════════════════════════════ */

export const schladming = {
  "id": "schladming",
  "name": "Schladming — Planai",
  "country": "Ausztria · Stájerország",
  "flag": "🇦🇹",
  "altitude": 1900,
  "baseAltitude": 745,
  "description": "A legendás Nightrace műlesiklás otthona a 4-Hegy síhintában, 123 km összefüggő pályával és a modern Planet Planai völgyközponttal.",
  "nodes": {
    "planaiCsucs": {
      "id": "planaiCsucs",
      "name": "Planai Csúcs (1900m)",
      "altitude": 1900,
      "x": 450,
      "y": 65,
      "icon": "⛰️"
    },
    "schladmingerHut": {
      "id": "schladmingerHut",
      "name": "Schladminger Hütte",
      "altitude": 1828,
      "x": 290,
      "y": 130,
      "icon": "🏠"
    },
    "marchenwiese": {
      "id": "marchenwiese",
      "name": "Märchenwiese Családi Pálya",
      "altitude": 1780,
      "x": 620,
      "y": 140,
      "icon": "🎿"
    },
    "larchkogelHegy": {
      "id": "larchkogelHegy",
      "name": "Lärchkogel 8-üléses Hegy",
      "altitude": 1750,
      "x": 190,
      "y": 220,
      "icon": "🚡"
    },
    "weitmoosLift": {
      "id": "weitmoosLift",
      "name": "Weitmooslift Hegyállomás",
      "altitude": 1680,
      "x": 730,
      "y": 230,
      "icon": "🚡"
    },
    "burgstallalm": {
      "id": "burgstallalm",
      "name": "Burgstallalm Hütte",
      "altitude": 1580,
      "x": 330,
      "y": 270,
      "icon": "☕"
    },
    "fastenberg": {
      "id": "fastenberg",
      "name": "Fastenberg & Planaihof",
      "altitude": 1350,
      "x": 550,
      "y": 310,
      "icon": "🏨"
    },
    "mittelstationGondel": {
      "id": "mittelstationGondel",
      "name": "Mittelstation Gondel",
      "altitude": 1350,
      "x": 430,
      "y": 380,
      "icon": "🚡"
    },
    "kessleralm": {
      "id": "kessleralm",
      "name": "Kessleralm Erdei Szakasz",
      "altitude": 1400,
      "x": 230,
      "y": 410,
      "icon": "🌲"
    },
    "charlyKahr": {
      "id": "charlyKahr",
      "name": "Charly Kahr Törzshely",
      "altitude": 820,
      "x": 630,
      "y": 490,
      "icon": "🍺"
    },
    "zielhangNightrace": {
      "id": "zielhangNightrace",
      "name": "Zielhang Világkupa Lejtő",
      "altitude": 790,
      "x": 370,
      "y": 530,
      "icon": "🏁"
    },
    "planetPlanai": {
      "id": "planetPlanai",
      "name": "Planet Planai Völgybázis (745m)",
      "altitude": 745,
      "x": 460,
      "y": 620,
      "icon": "🏘️"
    }
  },
  "edges": [
    {
      "id": "sc1",
      "from": "planaiCsucs",
      "to": "schladmingerHut",
      "name": "Csúcspanoráma Lejtő Kék",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          360,
          95
        ]
      ]
    },
    {
      "id": "sc2",
      "from": "planaiCsucs",
      "to": "marchenwiese",
      "name": "Märchenwiese Kék Sétány",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          540,
          100
        ]
      ]
    },
    {
      "id": "sc3",
      "from": "schladmingerHut",
      "to": "larchkogelHegy",
      "name": "Lärchkogel Átcsúszó Piros",
      "difficulty": "red",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          240,
          170
        ]
      ]
    },
    {
      "id": "sc4",
      "from": "marchenwiese",
      "to": "weitmoosLift",
      "name": "Weitmoos Családi Pálya Kék",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          680,
          180
        ]
      ]
    },
    {
      "id": "sc5",
      "from": "schladmingerHut",
      "to": "burgstallalm",
      "name": "3-as Főpálya Felső Piros",
      "difficulty": "red",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          310,
          200
        ]
      ]
    },
    {
      "id": "sc6",
      "from": "larchkogelHegy",
      "to": "kessleralm",
      "name": "Kessleralm Meredek Fekete",
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
      "id": "sc7",
      "from": "burgstallalm",
      "to": "mittelstationGondel",
      "name": "Burgstall Carving Piros",
      "difficulty": "red",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          380,
          320
        ]
      ]
    },
    {
      "id": "sc8",
      "from": "marchenwiese",
      "to": "fastenberg",
      "name": "Fastenberg Családi Kék",
      "difficulty": "blue",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          580,
          220
        ]
      ]
    },
    {
      "id": "sc9",
      "from": "fastenberg",
      "to": "mittelstationGondel",
      "name": "Panoráma Összekötő Kék",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          490,
          340
        ]
      ]
    },
    {
      "id": "sc10",
      "from": "kessleralm",
      "to": "zielhangNightrace",
      "name": "FIS Világkupa Felső Piros",
      "difficulty": "red",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          300,
          470
        ]
      ]
    },
    {
      "id": "sc11",
      "from": "mittelstationGondel",
      "to": "zielhangNightrace",
      "name": "1-es Főpálya Alsó Piros",
      "difficulty": "red",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          400,
          450
        ]
      ]
    },
    {
      "id": "sc12",
      "from": "fastenberg",
      "to": "charlyKahr",
      "name": "Charly Kahr Erdei Kék",
      "difficulty": "blue",
      "type": "run",
      "weight": 4,
      "waypoints": [
        [
          590,
          400
        ]
      ]
    },
    {
      "id": "sc13",
      "from": "zielhangNightrace",
      "to": "planetPlanai",
      "name": "Nightrace Híres Céllejtő Fekete",
      "difficulty": "black",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          410,
          580
        ]
      ]
    },
    {
      "id": "sc14",
      "from": "charlyKahr",
      "to": "planetPlanai",
      "name": "Après-Ski Finis Kék",
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
      "id": "scLift1",
      "from": "planetPlanai",
      "to": "mittelstationGondel",
      "name": "Planai Gondola I",
      "difficulty": "blue",
      "type": "lift",
      "weight": 2,
      "waypoints": [
        [
          440,
          500
        ]
      ]
    },
    {
      "id": "scLift2",
      "from": "mittelstationGondel",
      "to": "planaiCsucs",
      "name": "Planai Gondola II",
      "difficulty": "blue",
      "type": "lift",
      "weight": 2,
      "waypoints": [
        [
          440,
          220
        ]
      ]
    },
    {
      "id": "scLift3",
      "from": "kessleralm",
      "to": "larchkogelHegy",
      "name": "Lärchkogel 8-üléses Express",
      "difficulty": "blue",
      "type": "lift",
      "weight": 2,
      "waypoints": [
        [
          210,
          310
        ]
      ]
    }
  ]
};
