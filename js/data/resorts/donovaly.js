/* ═══════════════════════════════════════════════════════════════════
   resorts/donovaly.js — Park Snow Donovaly (Szlovákia · Alacsony-Tátra / Fátra)
   ═══════════════════════════════════════════════════════════════════ */

export const donovaly = {
  "id": "donovaly",
  "name": "Park Snow Donovaly",
  "country": "Szlovákia · Alacsony-Tátra / Fátra",
  "flag": "🇸🇰",
  "altitude": 1402,
  "baseAltitude": 910,
  "description": "Közép-Európa második legnagyobb gyermek síparkja (Funpark Patty Ski) és a Zvolen csúcs modern Telemix felvonója.",
  "nodes": {
    "zvolenCsucs": {
      "id": "zvolenCsucs",
      "name": "Zvolen Hegycsúcs (1402m)",
      "altitude": 1402,
      "x": 350,
      "y": 65,
      "icon": "⛰️"
    },
    "telemixHegy": {
      "id": "telemixHegy",
      "name": "Telemix Hegyállomás (1390m)",
      "altitude": 1390,
      "x": 240,
      "y": 130,
      "icon": "🚡"
    },
    "novaHolaMeredek": {
      "id": "novaHolaMeredek",
      "name": "Nová Hoľa Meredek Fekete",
      "altitude": 1350,
      "x": 420,
      "y": 180,
      "icon": "⚠️"
    },
    "ridikylHut": {
      "id": "ridikylHut",
      "name": "Ridikyl Hütte & Kanyar",
      "altitude": 1200,
      "x": 300,
      "y": 280,
      "icon": "🏠"
    },
    "zahradisteCsucs": {
      "id": "zahradisteCsucs",
      "name": "Záhradište Csúcs (1050m)",
      "altitude": 1050,
      "x": 670,
      "y": 220,
      "icon": "🏔️"
    },
    "novaHolaBase": {
      "id": "novaHolaBase",
      "name": "Nová Hoľa Völgyállomás (960m)",
      "altitude": 960,
      "x": 260,
      "y": 440,
      "icon": "🚡"
    },
    "zahradisteHegy": {
      "id": "zahradisteHegy",
      "name": "Záhradište 4-üléses Hegy",
      "altitude": 1020,
      "x": 740,
      "y": 320,
      "icon": "🚡"
    },
    "pattyFunpark": {
      "id": "pattyFunpark",
      "name": "Patty Ski Gyermek Funpark",
      "altitude": 950,
      "x": 580,
      "y": 410,
      "icon": "🎿"
    },
    "bulyKrčma": {
      "id": "bulyKrčma",
      "name": "Buly Stara Krčma",
      "altitude": 930,
      "x": 720,
      "y": 480,
      "icon": "🍺"
    },
    "donovalyCentrum": {
      "id": "donovalyCentrum",
      "name": "Donovaly Híd & Centrum (960m)",
      "altitude": 960,
      "x": 440,
      "y": 530,
      "icon": "🌉"
    },
    "misutyBase": {
      "id": "misutyBase",
      "name": "Mišúty Völgybázis (910m)",
      "altitude": 910,
      "x": 460,
      "y": 620,
      "icon": "🏘️"
    }
  },
  "edges": [
    {
      "id": "dn1",
      "from": "zvolenCsucs",
      "to": "telemixHegy",
      "name": "Csúcs Panoráma Kék",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          290,
          95
        ]
      ]
    },
    {
      "id": "dn2",
      "from": "zvolenCsucs",
      "to": "novaHolaMeredek",
      "name": "Nová Hoľa Felső Letörés Fekete",
      "difficulty": "black",
      "type": "run",
      "weight": 4,
      "waypoints": [
        [
          390,
          120
        ]
      ]
    },
    {
      "id": "dn3",
      "from": "telemixHegy",
      "to": "ridikylHut",
      "name": "Nová Hoľa Főpálya Piros",
      "difficulty": "red",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          270,
          200
        ]
      ]
    },
    {
      "id": "dn4",
      "from": "novaHolaMeredek",
      "to": "ridikylHut",
      "name": "Versenylejtő Piros",
      "difficulty": "red",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          360,
          230
        ]
      ]
    },
    {
      "id": "dn5",
      "from": "ridikylHut",
      "to": "novaHolaBase",
      "name": "Nová Hoľa Alsó Piros",
      "difficulty": "red",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          270,
          360
        ]
      ]
    },
    {
      "id": "dn6",
      "from": "zahradisteCsucs",
      "to": "zahradisteHegy",
      "name": "Záhradište Felső Kék",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          710,
          270
        ]
      ]
    },
    {
      "id": "dn7",
      "from": "zahradisteHegy",
      "to": "pattyFunpark",
      "name": "Családi Kezdő Lejtő Kék",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          660,
          360
        ]
      ]
    },
    {
      "id": "dn8",
      "from": "pattyFunpark",
      "to": "bulyKrčma",
      "name": "Funpark Gyerekpálya Kék",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          650,
          450
        ]
      ]
    },
    {
      "id": "dn9",
      "from": "novaHolaBase",
      "to": "donovalyCentrum",
      "name": "Centrum Átcsúszó Kék",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          350,
          480
        ]
      ]
    },
    {
      "id": "dn10",
      "from": "pattyFunpark",
      "to": "donovalyCentrum",
      "name": "Családi Átkötő Kék",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          510,
          470
        ]
      ]
    },
    {
      "id": "dn11",
      "from": "bulyKrčma",
      "to": "misutyBase",
      "name": "Mišúty Levezető Kék",
      "difficulty": "blue",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          600,
          560
        ]
      ]
    },
    {
      "id": "dn12",
      "from": "donovalyCentrum",
      "to": "misutyBase",
      "name": "Völgyfalu Finis",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          450,
          580
        ]
      ]
    },
    {
      "id": "dnLift1",
      "from": "novaHolaBase",
      "to": "telemixHegy",
      "name": "Telemix Nová Hoľa (6-székes + kabin)",
      "difficulty": "blue",
      "type": "lift",
      "weight": 2,
      "waypoints": [
        [
          250,
          280
        ]
      ]
    },
    {
      "id": "dnLift2",
      "from": "donovalyCentrum",
      "to": "zahradisteCsucs",
      "name": "Záhradište 4-üléses",
      "difficulty": "blue",
      "type": "lift",
      "weight": 2,
      "waypoints": [
        [
          550,
          380
        ]
      ]
    },
    {
      "id": "dnLift3",
      "from": "pattyFunpark",
      "to": "zahradisteHegy",
      "name": "Patty Ski Gyereklift",
      "difficulty": "blue",
      "type": "lift",
      "weight": 1,
      "waypoints": [
        [
          660,
          370
        ]
      ]
    }
  ]
};
