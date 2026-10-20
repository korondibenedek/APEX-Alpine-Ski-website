/* ═══════════════════════════════════════════════════════════════════
   resorts/kitzbuehel.js — Kitzbühel — Hahnenkamm (Ausztria · Tirol)
   ═══════════════════════════════════════════════════════════════════ */

export const kitzbuehel = {
  "id": "kitzbuehel",
  "name": "Kitzbühel — Hahnenkamm",
  "country": "Ausztria · Tirol",
  "flag": "🇦🇹",
  "altitude": 2000,
  "baseAltitude": 780,
  "description": "A világ leghíresebb és legveszélyesebb síversenye, a Streif otthona, 233 km sípályával a Hahnenkamm és Pengelstein csúcsok között.",
  "nodes": {
    "ehrenbachhohe": {
      "id": "ehrenbachhohe",
      "name": "Ehrenbachhöhe Csúcs (1805m)",
      "altitude": 1805,
      "x": 220,
      "y": 70,
      "icon": "⛰️"
    },
    "hahnenkammBerg": {
      "id": "hahnenkammBerg",
      "name": "Hahnenkamm Bergstation (1665m)",
      "altitude": 1665,
      "x": 450,
      "y": 75,
      "icon": "🚡"
    },
    "pengelsteinCsucs": {
      "id": "pengelsteinCsucs",
      "name": "Pengelstein Csúcs (1938m)",
      "altitude": 1938,
      "x": 700,
      "y": 65,
      "icon": "⛰️"
    },
    "mausefalle": {
      "id": "mausefalle",
      "name": "Mausefalle 85% Meredek",
      "altitude": 1600,
      "x": 390,
      "y": 160,
      "icon": "⚠️"
    },
    "hochbrunnHut": {
      "id": "hochbrunnHut",
      "name": "Hochbrunn Alm Hütte",
      "altitude": 1750,
      "x": 660,
      "y": 190,
      "icon": "🏠"
    },
    "steilhangKarussell": {
      "id": "steilhangKarussell",
      "name": "Steilhang & Karussell",
      "altitude": 1450,
      "x": 460,
      "y": 240,
      "icon": "⚡"
    },
    "seidlalmHut": {
      "id": "seidlalmHut",
      "name": "Seidlalm Legendás Hütte",
      "altitude": 1280,
      "x": 330,
      "y": 320,
      "icon": "☕"
    },
    "fleckalmKozep": {
      "id": "fleckalmKozep",
      "name": "Fleckalmbahn Mittelstation",
      "altitude": 1300,
      "x": 190,
      "y": 360,
      "icon": "🚡"
    },
    "hausbergkante": {
      "id": "hausbergkante",
      "name": "Hausbergkante Ugrató",
      "altitude": 1030,
      "x": 440,
      "y": 410,
      "icon": "⛷️"
    },
    "ganslernhang": {
      "id": "ganslernhang",
      "name": "Ganslernhang Világkupa Slalom",
      "altitude": 900,
      "x": 300,
      "y": 490,
      "icon": "🚩"
    },
    "streifZiel": {
      "id": "streifZiel",
      "name": "Streif Zielschuss & Cél",
      "altitude": 800,
      "x": 450,
      "y": 530,
      "icon": "🏁"
    },
    "kitzTalstation": {
      "id": "kitzTalstation",
      "name": "Kitzbühel Hahnenkammbahn (780m)",
      "altitude": 780,
      "x": 430,
      "y": 620,
      "icon": "🏘️"
    },
    "kirchbergBase": {
      "id": "kirchbergBase",
      "name": "Kirchberg Völgyállomás (800m)",
      "altitude": 800,
      "x": 180,
      "y": 615,
      "icon": "🏡"
    }
  },
  "edges": [
    {
      "id": "kb1",
      "from": "ehrenbachhohe",
      "to": "hahnenkammBerg",
      "name": "Hahnenkamm Kék Gerincút",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          330,
          75
        ]
      ]
    },
    {
      "id": "kb2",
      "from": "hahnenkammBerg",
      "to": "pengelsteinCsucs",
      "name": "3S Gondola Átcsatlakozás",
      "difficulty": "blue",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          570,
          70
        ]
      ]
    },
    {
      "id": "kb3",
      "from": "hahnenkammBerg",
      "to": "mausefalle",
      "name": "Streif Rajt & Mausefalle",
      "difficulty": "black",
      "type": "run",
      "weight": 5,
      "waypoints": [
        [
          420,
          120
        ]
      ]
    },
    {
      "id": "kb4",
      "from": "pengelsteinCsucs",
      "to": "hochbrunnHut",
      "name": "Pengelstein Carving Piros",
      "difficulty": "red",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          680,
          130
        ]
      ]
    },
    {
      "id": "kb5",
      "from": "mausefalle",
      "to": "steilhangKarussell",
      "name": "Steilhang Extrém Fekete",
      "difficulty": "black",
      "type": "run",
      "weight": 5,
      "waypoints": [
        [
          430,
          200
        ]
      ]
    },
    {
      "id": "kb6",
      "from": "ehrenbachhohe",
      "to": "fleckalmKozep",
      "name": "Fleckalm Családi Kék Felső",
      "difficulty": "blue",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          200,
          210
        ]
      ]
    },
    {
      "id": "kb7",
      "from": "steilhangKarussell",
      "to": "seidlalmHut",
      "name": "Brückenschuss Kék Átkötő",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          390,
          280
        ]
      ]
    },
    {
      "id": "kb8",
      "from": "hochbrunnHut",
      "to": "hausbergkante",
      "name": "Kitzbühel Panoráma Piros",
      "difficulty": "red",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          550,
          300
        ]
      ]
    },
    {
      "id": "kb9",
      "from": "seidlalmHut",
      "to": "hausbergkante",
      "name": "Seidlalm Traverse Piros",
      "difficulty": "red",
      "type": "run",
      "weight": 3,
      "waypoints": [
        [
          390,
          360
        ]
      ]
    },
    {
      "id": "kb10",
      "from": "hausbergkante",
      "to": "ganslernhang",
      "name": "Ganslern Műlesiklás Fekete",
      "difficulty": "black",
      "type": "run",
      "weight": 4,
      "waypoints": [
        [
          370,
          450
        ]
      ]
    },
    {
      "id": "kb11",
      "from": "hausbergkante",
      "to": "streifZiel",
      "name": "Hausbergkante Zielschuss Fekete",
      "difficulty": "black",
      "type": "run",
      "weight": 4,
      "waypoints": [
        [
          450,
          470
        ]
      ]
    },
    {
      "id": "kb12",
      "from": "fleckalmKozep",
      "to": "kirchbergBase",
      "name": "Fleckalm 7 km Völgypálya Kék",
      "difficulty": "blue",
      "type": "run",
      "weight": 4,
      "waypoints": [
        [
          185,
          490
        ]
      ]
    },
    {
      "id": "kb13",
      "from": "ganslernhang",
      "to": "kitzTalstation",
      "name": "Ganslern Levezető Kék",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          360,
          560
        ]
      ]
    },
    {
      "id": "kb14",
      "from": "streifZiel",
      "to": "kitzTalstation",
      "name": "Streif Cél Finis Kék",
      "difficulty": "blue",
      "type": "run",
      "weight": 2,
      "waypoints": [
        [
          440,
          575
        ]
      ]
    },
    {
      "id": "kbLift1",
      "from": "kitzTalstation",
      "to": "hahnenkammBerg",
      "name": "Hahnenkammbahn Gondola",
      "difficulty": "blue",
      "type": "lift",
      "weight": 2,
      "waypoints": [
        [
          440,
          350
        ]
      ]
    },
    {
      "id": "kbLift2",
      "from": "kirchbergBase",
      "to": "fleckalmKozep",
      "name": "Fleckalmbahn Gondola I",
      "difficulty": "blue",
      "type": "lift",
      "weight": 2,
      "waypoints": [
        [
          185,
          490
        ]
      ]
    },
    {
      "id": "kbLift3",
      "from": "fleckalmKozep",
      "to": "ehrenbachhohe",
      "name": "Fleckalmbahn Gondola II",
      "difficulty": "blue",
      "type": "lift",
      "weight": 2,
      "waypoints": [
        [
          200,
          210
        ]
      ]
    },
    {
      "id": "kbLift4",
      "from": "streifZiel",
      "to": "ganslernhang",
      "name": "Ganslern 4-üléses",
      "difficulty": "blue",
      "type": "lift",
      "weight": 1,
      "waypoints": [
        [
          380,
          510
        ]
      ]
    }
  ]
};
