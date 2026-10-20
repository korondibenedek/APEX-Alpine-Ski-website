/* ═══════════════════════════════════════════════════════════════════
   resorts/mount-apex.js — Mount Apex (Alpine Sector Alpha)
   ═══════════════════════════════════════════════════════════════════ */

export const mountApex = {
  "id": "mountApex",
  "name": "Mount Apex",
  "country": "Alpine Sector Alpha",
  "flag": "🏔️",
  "altitude": 3200,
  "baseAltitude": 1500,
  "description": "Bővített alpesi taktikai teszthegység 14 állomással, extrém gleccserszakadékokkal, hófennsíkokkal és völgylesiklásokkal.",
  "nodes": {
    "glacierPeak": {
      "id": "glacierPeak",
      "name": "Glacier Peak",
      "altitude": 3200,
      "x": 450,
      "y": 60,
      "icon": "⛰️"
    },
    "skylineRidge": {
      "id": "skylineRidge",
      "name": "Skyline Ridge",
      "altitude": 3050,
      "x": 240,
      "y": 90,
      "icon": "🏔️"
    },
    "stormHorn": {
      "id": "stormHorn",
      "name": "Storm Horn Peak",
      "altitude": 3100,
      "x": 680,
      "y": 80,
      "icon": "⚡"
    },
    "ridgeDrop": {
      "id": "ridgeDrop",
      "name": "Ridge Drop",
      "altitude": 2950,
      "x": 160,
      "y": 180,
      "icon": "🏔️"
    },
    "glacierBowl": {
      "id": "glacierBowl",
      "name": "Glacier High Bowl",
      "altitude": 2850,
      "x": 370,
      "y": 180,
      "icon": "❄️"
    },
    "avalancheChute": {
      "id": "avalancheChute",
      "name": "Avalanche Chute",
      "altitude": 2600,
      "x": 580,
      "y": 190,
      "icon": "⚠️"
    },
    "corniceDrop": {
      "id": "corniceDrop",
      "name": "Cornice Drop",
      "altitude": 2650,
      "x": 760,
      "y": 210,
      "icon": "⛷️"
    },
    "eagleMid": {
      "id": "eagleMid",
      "name": "Eagle Mid-Station",
      "altitude": 2400,
      "x": 340,
      "y": 320,
      "icon": "🦅"
    },
    "panoramaHut": {
      "id": "panoramaHut",
      "name": "Panorama Hut",
      "altitude": 2200,
      "x": 540,
      "y": 330,
      "icon": "🏠"
    },
    "snowparkApex": {
      "id": "snowparkApex",
      "name": "Apex Pro Snowpark",
      "altitude": 2100,
      "x": 720,
      "y": 370,
      "icon": "🏂"
    },
    "pineForest": {
      "id": "pineForest",
      "name": "Pine Forest Crossroads",
      "altitude": 1950,
      "x": 210,
      "y": 420,
      "icon": "🌲"
    },
    "southBowlLift": {
      "id": "southBowlLift",
      "name": "South Bowl Lift",
      "altitude": 1800,
      "x": 610,
      "y": 480,
      "icon": "🚡"
    },
    "canyonPass": {
      "id": "canyonPass",
      "name": "Canyon Pass Gateway",
      "altitude": 1680,
      "x": 260,
      "y": 530,
      "icon": "🧗"
    },
    "mainValleyBase": {
      "id": "mainValleyBase",
      "name": "Main Valley Base",
      "altitude": 1500,
      "x": 450,
      "y": 620,
      "icon": "🏘️"
    }
  },
  "edges": [
    {
      "id": "e1",
      "from": "glacierPeak",
      "to": "skylineRidge",
      "name": "Skyline Traverse",
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
      "id": "e2",
      "from": "glacierPeak",
      "to": "stormHorn",
      "name": "East Ridge Ridge",
      "difficulty": "red",
      "type": "run",
      "weight": 4,
      "waypoints": [
        [
          570,
          68
        ]
      ]
    },
    {
      "id": "e3",
      "from": "glacierPeak",
      "to": "glacierBowl",
      "name": "Summit Powder Bowl",
      "difficulty": "red",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          410,
          120
        ]
      ]
    },
    {
      "id": "e4",
      "from": "skylineRidge",
      "to": "ridgeDrop",
      "name": "West Ridge Drop",
      "difficulty": "black",
      "type": "run",
      "weight": 5,
      "waypoints": [
        [
          190,
          130
        ]
      ]
    },
    {
      "id": "e5",
      "from": "ridgeDrop",
      "to": "pineForest",
      "name": "Freeride Forest Chute",
      "difficulty": "black",
      "type": "run",
      "weight": 6,
      "waypoints": [
        [
          170,
          300
        ]
      ]
    },
    {
      "id": "e6",
      "from": "glacierBowl",
      "to": "eagleMid",
      "name": "Blue Glacier Cruiser",
      "difficulty": "blue",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          350,
          250
        ]
      ]
    },
    {
      "id": "e7",
      "from": "stormHorn",
      "to": "avalancheChute",
      "name": "Storm Face Drop",
      "difficulty": "black",
      "type": "run",
      "weight": 6,
      "waypoints": [
        [
          640,
          130
        ]
      ]
    },
    {
      "id": "e8",
      "from": "stormHorn",
      "to": "corniceDrop",
      "name": "High Cornice Line",
      "difficulty": "black",
      "type": "run",
      "weight": 7,
      "waypoints": [
        [
          730,
          140
        ]
      ]
    },
    {
      "id": "e9",
      "from": "avalancheChute",
      "to": "panoramaHut",
      "name": "Avalanche Gully",
      "difficulty": "red",
      "type": "run",
      "weight": 4,
      "waypoints": [
        [
          560,
          260
        ]
      ]
    },
    {
      "id": "e10",
      "from": "corniceDrop",
      "to": "snowparkApex",
      "name": "Park Entry Run",
      "difficulty": "red",
      "type": "run",
      "weight": 4,
      "waypoints": [
        [
          750,
          290
        ]
      ]
    },
    {
      "id": "e11",
      "from": "eagleMid",
      "to": "panoramaHut",
      "name": "Alpine Panorama Highway",
      "difficulty": "blue",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          440,
          320
        ]
      ]
    },
    {
      "id": "e12",
      "from": "eagleMid",
      "to": "pineForest",
      "name": "Pine Needle Cut",
      "difficulty": "red",
      "type": "run",
      "weight": 4,
      "waypoints": [
        [
          270,
          370
        ]
      ]
    },
    {
      "id": "e13",
      "from": "panoramaHut",
      "to": "southBowlLift",
      "name": "South Bowl Cruiser",
      "difficulty": "red",
      "type": "run",
      "weight": 4,
      "waypoints": [
        [
          580,
          410
        ]
      ]
    },
    {
      "id": "e14",
      "from": "snowparkApex",
      "to": "southBowlLift",
      "name": "Freestyle Exit",
      "difficulty": "blue",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          670,
          430
        ]
      ]
    },
    {
      "id": "e15",
      "from": "pineForest",
      "to": "canyonPass",
      "name": "Canyon Run West",
      "difficulty": "blue",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          230,
          480
        ]
      ]
    },
    {
      "id": "e16",
      "from": "canyonPass",
      "to": "mainValleyBase",
      "name": "Valley Home Run A",
      "difficulty": "blue",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          350,
          580
        ]
      ]
    },
    {
      "id": "e17",
      "from": "southBowlLift",
      "to": "mainValleyBase",
      "name": "Valley Home Run B",
      "difficulty": "blue",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          530,
          560
        ]
      ]
    },
    {
      "id": "lift1",
      "from": "mainValleyBase",
      "to": "eagleMid",
      "name": "Summit Express Gondola",
      "difficulty": "blue",
      "type": "lift",
      "weight": 2,
      "waypoints": [
        [
          400,
          470
        ]
      ]
    },
    {
      "id": "lift2",
      "from": "southBowlLift",
      "to": "glacierPeak",
      "name": "Apex Glacier 3S Bahn",
      "simControl": "liftClosed",
      "difficulty": "blue",
      "type": "lift",
      "weight": 3,
      "waypoints": [
        [
          530,
          270
        ]
      ]
    },
    {
      "id": "lift3",
      "from": "canyonPass",
      "to": "skylineRidge",
      "name": "Skyline 6-Chair",
      "difficulty": "blue",
      "type": "lift",
      "weight": 2,
      "waypoints": [
        [
          230,
          310
        ]
      ]
    }
  ]
};
