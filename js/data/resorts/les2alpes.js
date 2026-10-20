/* ═══════════════════════════════════════════════════════════════════
   resorts/les2alpes.js — Les 2 Alpes (Franciaország · Isère Gleccser)
   ═══════════════════════════════════════════════════════════════════ */

export const les2alpes = {
  "id": "les2alpes",
  "name": "Les 2 Alpes",
  "country": "Franciaország · Isère Gleccser",
  "flag": "🇫🇷",
  "altitude": 3600,
  "baseAltitude": 1300,
  "description": "Európa legnagyobb síelhető gleccsere 3600m-en, 200 km pályával, világhírű Freestyle arénával és 2300 méteres szintkülönbséggel.",
  "nodes": {
    "domeLauze": {
      "id": "domeLauze",
      "name": "Dôme de la Lauze / Glacier 3600",
      "altitude": 3568,
      "x": 460,
      "y": 55,
      "icon": "⛰️"
    },
    "glacierMontDeLans": {
      "id": "glacierMontDeLans",
      "name": "Glacier du Mont-de-Lans",
      "altitude": 3200,
      "x": 300,
      "y": 120,
      "icon": "❄️"
    },
    "funiculaireDome": {
      "id": "funiculaireDome",
      "name": "Funiculaire Dôme Hegyállomás",
      "altitude": 3400,
      "x": 620,
      "y": 130,
      "icon": "🚡"
    },
    "touraSnowpark": {
      "id": "touraSnowpark",
      "name": "Signal & Toura Snowpark 2600",
      "altitude": 2600,
      "x": 220,
      "y": 220,
      "icon": "🏂"
    },
    "laFeeVallee": {
      "id": "laFeeVallee",
      "name": "La Fée Vadregényes Völgykatlan",
      "altitude": 2200,
      "x": 680,
      "y": 240,
      "icon": "🏔️"
    },
    "bellecombes": {
      "id": "bellecombes",
      "name": "Bellecombes Átvezető Sektor",
      "altitude": 2400,
      "x": 420,
      "y": 250,
      "icon": "⛷️"
    },
    "diableGerinc": {
      "id": "diableGerinc",
      "name": "Diable Meredek Fekete Letörés",
      "altitude": 2400,
      "x": 180,
      "y": 340,
      "icon": "⚠️"
    },
    "cretesPanorama": {
      "id": "cretesPanorama",
      "name": "Crêtes Panoráma Hütte",
      "altitude": 2100,
      "x": 520,
      "y": 330,
      "icon": "🏠"
    },
    "jandriExpressKozep": {
      "id": "jandriExpressKozep",
      "name": "Jandri Express Középállomás",
      "altitude": 1650,
      "x": 380,
      "y": 420,
      "icon": "🚡"
    },
    "village1800": {
      "id": "village1800",
      "name": "Les 2 Alpes Village 1800",
      "altitude": 1800,
      "x": 620,
      "y": 460,
      "icon": "🏘️"
    },
    "stationCentre1650": {
      "id": "stationCentre1650",
      "name": "Station Centre 1650 Főfalu",
      "altitude": 1650,
      "x": 380,
      "y": 540,
      "icon": "🏨"
    },
    "montDeLansBase": {
      "id": "montDeLansBase",
      "name": "Mont-de-Lans Völgyfalu (1300m)",
      "altitude": 1300,
      "x": 460,
      "y": 625,
      "icon": "🏘️"
    }
  },
  "edges": [
    {
      "id": "l2a1",
      "from": "domeLauze",
      "to": "glacierMontDeLans",
      "name": "Glacier Főlejtő Kék",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          380,
          90
        ]
      ]
    },
    {
      "id": "l2a2",
      "from": "domeLauze",
      "to": "funiculaireDome",
      "name": "Dôme Panoráma Kék",
      "difficulty": "blue",
      "type": "run",
      "weight": 1,
      "waypoints": [
        [
          540,
          90
        ]
      ]
    },
    {
      "id": "l2a3",
      "from": "glacierMontDeLans",
      "to": "touraSnowpark",
      "name": "Signal Kék Lejtő",
      "difficulty": "blue",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          260,
          170
        ]
      ]
    },
    {
      "id": "l2a4",
      "from": "glacierMontDeLans",
      "to": "bellecombes",
      "name": "Jandri 4 Széles Kék",
      "difficulty": "blue",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          360,
          190
        ]
      ]
    },
    {
      "id": "l2a5",
      "from": "funiculaireDome",
      "to": "laFeeVallee",
      "name": "La Fée Extrém Fekete Katlan",
      "difficulty": "black",
      "type": "run",
      "weight": 5,
      "waypoints": [
        [
          650,
          180
        ]
      ]
    },
    {
      "id": "l2a6",
      "from": "touraSnowpark",
      "to": "diableGerinc",
      "name": "Toura Freeride Piros",
      "difficulty": "red",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          200,
          280
        ]
      ]
    },
    {
      "id": "l2a7",
      "from": "bellecombes",
      "to": "cretesPanorama",
      "name": "Bellecombes Családi Kék",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          470,
          290
        ]
      ]
    },
    {
      "id": "l2a8",
      "from": "laFeeVallee",
      "to": "cretesPanorama",
      "name": "Fée Levezető Piros",
      "difficulty": "red",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          600,
          280
        ]
      ]
    },
    {
      "id": "l2a9",
      "from": "diableGerinc",
      "to": "jandriExpressKozep",
      "name": "Diable Meredek Fekete",
      "difficulty": "black",
      "type": "run",
      "weight": 4,
      "waypoints": [
        [
          280,
          380
        ]
      ]
    },
    {
      "id": "l2a10",
      "from": "cretesPanorama",
      "to": "village1800",
      "name": "Village 1800 Kék Sétaút",
      "difficulty": "blue",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          570,
          400
        ]
      ]
    },
    {
      "id": "l2a11",
      "from": "cretesPanorama",
      "to": "jandriExpressKozep",
      "name": "Demoiselles Zöld Kezdő Pálya",
      "difficulty": "blue",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          450,
          380
        ]
      ]
    },
    {
      "id": "l2a12",
      "from": "jandriExpressKozep",
      "to": "stationCentre1650",
      "name": "Jandri 1 Falu Lejtő Kék",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          380,
          480
        ]
      ]
    },
    {
      "id": "l2a13",
      "from": "village1800",
      "to": "stationCentre1650",
      "name": "Village Összekötő Kék",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          500,
          500
        ]
      ]
    },
    {
      "id": "l2a14",
      "from": "stationCentre1650",
      "to": "montDeLansBase",
      "name": "Mont-de-Lans Völgylesiklás Piros",
      "difficulty": "red",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          420,
          580
        ]
      ]
    },
    {
      "id": "l2aLift1",
      "from": "stationCentre1650",
      "to": "jandriExpressKozep",
      "name": "Jandri Express I Főkabin",
      "difficulty": "blue",
      "type": "lift",
      "weight": 2,
      "waypoints": [
        [
          380,
          480
        ]
      ]
    },
    {
      "id": "l2aLift2",
      "from": "jandriExpressKozep",
      "to": "domeLauze",
      "name": "Jandri Express II 3S Gleccsergondola",
      "difficulty": "blue",
      "type": "lift",
      "weight": 3,
      "waypoints": [
        [
          420,
          240
        ]
      ]
    },
    {
      "id": "l2aLift3",
      "from": "montDeLansBase",
      "to": "village1800",
      "name": "Mont-de-Lans Székesfelvonó",
      "difficulty": "blue",
      "type": "lift",
      "weight": 2,
      "waypoints": [
        [
          540,
          540
        ]
      ]
    }
  ]
};
