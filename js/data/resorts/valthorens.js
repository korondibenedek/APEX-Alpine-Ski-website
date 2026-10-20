/* ═══════════════════════════════════════════════════════════════════
   resorts/valthorens.js — Val Thorens — 3 Vallées (Franciaország · Savoie)
   ═══════════════════════════════════════════════════════════════════ */

export const valthorens = {
  "id": "valthorens",
  "name": "Val Thorens — 3 Vallées",
  "country": "Franciaország · Savoie",
  "flag": "🇫🇷",
  "altitude": 3200,
  "baseAltitude": 1800,
  "description": "Európa legmagasabban fekvő síközpontja a 600 km-es Les 3 Vallées szívében, a 3200m-es Cime Caron csúccsal és a legendás La Folie Douce-szal.",
  "nodes": {
    "cimeCaron": {
      "id": "cimeCaron",
      "name": "Cime Caron Csúcs (3200m)",
      "altitude": 3200,
      "x": 220,
      "y": 55,
      "icon": "⛰️"
    },
    "pointeBouchet": {
      "id": "pointeBouchet",
      "name": "Pointe du Bouchet / Orelle (3230m)",
      "altitude": 3230,
      "x": 680,
      "y": 55,
      "icon": "⛰️"
    },
    "colDeLaChambre": {
      "id": "colDeLaChambre",
      "name": "Col de la Chambre (Méribel Átjáró 2850m)",
      "altitude": 2850,
      "x": 450,
      "y": 80,
      "icon": "🏔️"
    },
    "funitelThorens": {
      "id": "funitelThorens",
      "name": "Funitel Thorens Hegyállomás",
      "altitude": 3000,
      "x": 320,
      "y": 160,
      "icon": "🚡"
    },
    "grandFondFunitel": {
      "id": "grandFondFunitel",
      "name": "Grand Fond Funitel Hegyállomás",
      "altitude": 3000,
      "x": 590,
      "y": 160,
      "icon": "🚡"
    },
    "pecletFunitel": {
      "id": "pecletFunitel",
      "name": "Funitel Péclet Hegy (2950m)",
      "altitude": 2950,
      "x": 180,
      "y": 240,
      "icon": "🚡"
    },
    "laFolieDouce": {
      "id": "laFolieDouce",
      "name": "La Folie Douce & Plein Sud",
      "altitude": 2600,
      "x": 450,
      "y": 230,
      "icon": "🎉"
    },
    "chaletMarine": {
      "id": "chaletMarine",
      "name": "Chalet de la Marine Hütte",
      "altitude": 2500,
      "x": 630,
      "y": 280,
      "icon": "🏠"
    },
    "castorPollux": {
      "id": "castorPollux",
      "name": "Castor & Pollux Gyerekaréna",
      "altitude": 2350,
      "x": 300,
      "y": 360,
      "icon": "🎿"
    },
    "rondPoint": {
      "id": "rondPoint",
      "name": "Rond-Point des Pistes Csomópont",
      "altitude": 2300,
      "x": 450,
      "y": 390,
      "icon": "🚡"
    },
    "placeCaronCentre": {
      "id": "placeCaronCentre",
      "name": "Val Thorens Centre / Place Caron (2300m)",
      "altitude": 2300,
      "x": 450,
      "y": 490,
      "icon": "🏨"
    },
    "lesMenuiresPass": {
      "id": "lesMenuiresPass",
      "name": "Les Menuires Átjáró Sektor",
      "altitude": 1850,
      "x": 220,
      "y": 560,
      "icon": "🌲"
    },
    "planDeLeau": {
      "id": "planDeLeau",
      "name": "Plan de l'Eau Völgybázis (1800m)",
      "altitude": 1800,
      "x": 550,
      "y": 615,
      "icon": "🏘️"
    }
  },
  "edges": [
    {
      "id": "vt1",
      "from": "cimeCaron",
      "to": "funitelThorens",
      "name": "Combe de Caron Legendás Fekete",
      "difficulty": "black",
      "type": "run",
      "weight": 5,
      "waypoints": [
        [
          270,
          110
        ]
      ]
    },
    {
      "id": "vt2",
      "from": "cimeCaron",
      "to": "colDeLaChambre",
      "name": "Col Kék Panoráma",
      "difficulty": "blue",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          340,
          70
        ]
      ]
    },
    {
      "id": "vt3",
      "from": "pointeBouchet",
      "to": "grandFondFunitel",
      "name": "Orelle Maurienne Piros",
      "difficulty": "red",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          640,
          110
        ]
      ]
    },
    {
      "id": "vt4",
      "from": "colDeLaChambre",
      "to": "laFolieDouce",
      "name": "Plein Sud Carving Piros",
      "difficulty": "red",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          450,
          160
        ]
      ]
    },
    {
      "id": "vt5",
      "from": "pecletFunitel",
      "to": "castorPollux",
      "name": "Christine Piros Pálya",
      "difficulty": "red",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          240,
          300
        ]
      ]
    },
    {
      "id": "vt6",
      "from": "funitelThorens",
      "to": "laFolieDouce",
      "name": "Falaise Fekete Letörés",
      "difficulty": "black",
      "type": "run",
      "weight": 4,
      "waypoints": [
        [
          380,
          200
        ]
      ]
    },
    {
      "id": "vt7",
      "from": "grandFondFunitel",
      "to": "chaletMarine",
      "name": "Génépy Kék Autópálya",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          610,
          220
        ]
      ]
    },
    {
      "id": "vt8",
      "from": "laFolieDouce",
      "to": "rondPoint",
      "name": "Corniche Kék Családi",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          450,
          310
        ]
      ]
    },
    {
      "id": "vt9",
      "from": "chaletMarine",
      "to": "rondPoint",
      "name": "Dalles Kék Lejtő",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          540,
          340
        ]
      ]
    },
    {
      "id": "vt10",
      "from": "castorPollux",
      "to": "placeCaronCentre",
      "name": "Családi Kezdő Zóna",
      "difficulty": "blue",
      "type": "run",
      "weight": 1,
      "waypoints": [
        [
          370,
          430
        ]
      ]
    },
    {
      "id": "vt11",
      "from": "rondPoint",
      "to": "placeCaronCentre",
      "name": "Falu Központi Finis Kék",
      "difficulty": "blue",
      "type": "run",
      "weight": 1,
      "waypoints": [
        [
          450,
          440
        ]
      ]
    },
    {
      "id": "vt12",
      "from": "placeCaronCentre",
      "to": "lesMenuiresPass",
      "name": "Boulevard Cumin Kék",
      "difficulty": "blue",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          330,
          520
        ]
      ]
    },
    {
      "id": "vt13",
      "from": "placeCaronCentre",
      "to": "planDeLeau",
      "name": "Plan de l'Eau Erdei Piros",
      "difficulty": "red",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          500,
          550
        ]
      ]
    },
    {
      "id": "vtLift1",
      "from": "planDeLeau",
      "to": "cimeCaron",
      "name": "Téléphérique Cime Caron 150-fős",
      "difficulty": "blue",
      "type": "lift",
      "weight": 3,
      "waypoints": [
        [
          380,
          340
        ]
      ]
    },
    {
      "id": "vtLift2",
      "from": "placeCaronCentre",
      "to": "pecletFunitel",
      "name": "Funitel de Péclet",
      "difficulty": "blue",
      "type": "lift",
      "weight": 2,
      "waypoints": [
        [
          310,
          360
        ]
      ]
    },
    {
      "id": "vtLift3",
      "from": "rondPoint",
      "to": "colDeLaChambre",
      "name": "Plein Sud 6-üléses Express",
      "difficulty": "blue",
      "type": "lift",
      "weight": 2,
      "waypoints": [
        [
          450,
          230
        ]
      ]
    },
    {
      "id": "vtLift4",
      "from": "placeCaronCentre",
      "to": "grandFondFunitel",
      "name": "Funitel Grand Fond",
      "difficulty": "blue",
      "type": "lift",
      "weight": 2,
      "waypoints": [
        [
          520,
          320
        ]
      ]
    },
    {
      "id": "vtLift5",
      "from": "planDeLeau",
      "to": "pointeBouchet",
      "name": "Orelle Express Telekabin",
      "difficulty": "blue",
      "type": "lift",
      "weight": 3,
      "waypoints": [
        [
          620,
          340
        ]
      ]
    },
    {
      "id": "vtLift6",
      "from": "placeCaronCentre",
      "to": "castorPollux",
      "name": "Castor & Pollux Fedett Varázsszőnyegek",
      "difficulty": "blue",
      "type": "lift",
      "weight": 1,
      "waypoints": [
        [
          370,
          430
        ]
      ]
    }
  ]
};
