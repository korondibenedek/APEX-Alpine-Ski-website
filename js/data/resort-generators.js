/* Procedural terrain templates used when no real topology is available. */

export function buildDualPeakResort({ id, name, country, slug, hasLake, previewUrl }) {
  return {
    id,
    name: name || 'Kétcsúcsú Alpesi Síterep',
    country: country || 'Ausztria · Alpesi Régió',
    flag: '🏔️',
    altitude: 2118,
    baseAltitude: 868,
    description: `Képfelismeréssel generált kétcsúcsú síterep: ${name} (2118m), központi gerinc, tóparti állomás, 12 állomásos hálózat.`,
    sourceImage: true,
    sourceMode: 'offline-cv',
    imagePreview: previewUrl || null,
    nodes: {
      peakWest: {
        id: 'peakWest',
        name: `${name} Nyugati Panoráma Csúcs (2118m)`,
        altitude: 2118,
        x: 230, y: 70,
        icon: '⛰️'
      },
      peakEast: {
        id: 'peakEast',
        name: `${name} Keleti Csúcs & Kilátó (1997m)`,
        altitude: 1997,
        x: 680, y: 85,
        icon: '🦅'
      },
      ridgeCol: {
        id: 'ridgeCol',
        name: 'Központi Gerincnyereg (1890m)',
        altitude: 1890,
        x: 440, y: 145,
        icon: '⚡'
      },
      lakeStation: {
        id: 'lakeStation',
        name: hasLake ? `${name} Tóparti Állomás & Hütte (1800m)` : 'Alpesi Panoráma Hütte (1800m)',
        altitude: 1800,
        x: 490, y: 220,
        icon: hasLake ? '💧' : '🏠'
      },
      westBowl: {
        id: 'westBowl',
        name: 'Nyugati Mélyhó Katlan (1780m)',
        altitude: 1780,
        x: 190, y: 250,
        icon: '❄️'
      },
      eastBowl: {
        id: 'eastBowl',
        name: 'Keleti Sziklafal Rajt (1720m)',
        altitude: 1720,
        x: 740, y: 230,
        icon: '⚠️'
      },
      midHub: {
        id: 'midHub',
        name: `${name} Középállomás & Park (1600m)`,
        altitude: 1600,
        x: 430, y: 340,
        icon: '🚡'
      },
      snowpark: {
        id: 'snowpark',
        name: `${name} Freestyle Snowpark`,
        altitude: 1540,
        x: 670, y: 350,
        icon: '🏂'
      },
      westForest: {
        id: 'westForest',
        name: 'Fenyves Erdei Kanyarulat (1350m)',
        altitude: 1350,
        x: 240, y: 440,
        icon: '🌲'
      },
      sunPlateau: {
        id: 'sunPlateau',
        name: 'Napos Családi Fennsík (1420m)',
        altitude: 1420,
        x: 570, y: 450,
        icon: '🎿'
      },
      valleyWest: {
        id: 'valleyWest',
        name: `${name} Nyugati Völgyállomás (960m)`,
        altitude: 960,
        x: 280, y: 590,
        icon: '🏘️'
      },
      valleyMain: {
        id: 'valleyMain',
        name: `${name} Fő Völgybázis & Parkoló (868m)`,
        altitude: 868,
        x: 520, y: 620,
        icon: '🏘️'
      }
    },
    edges: [
      { id: `${slug}_e1`, from: 'peakWest', to: 'ridgeCol', name: 'Nyugati Gerinc Kék', difficulty: 'blue', type: 'run', weight: 2, waypoints: [[330, 100]] },
      { id: `${slug}_e2`, from: 'peakEast', to: 'ridgeCol', name: 'Keleti Gerincút Piros', difficulty: 'red', type: 'run', weight: 3, waypoints: [[560, 110]] },
      { id: `${slug}_e3`, from: 'peakWest', to: 'westBowl', name: 'Nyugati Fal Fekete', difficulty: 'black', type: 'run', weight: 5, waypoints: [[200, 160]] },
      { id: `${slug}_e4`, from: 'peakEast', to: 'eastBowl', name: 'Keleti Sziklafal Fekete', difficulty: 'black', type: 'run', weight: 5, waypoints: [[720, 160]] },
      { id: `${slug}_e5`, from: 'ridgeCol', to: 'lakeStation', name: 'Tóparti Átcsúszó Kék', difficulty: 'blue', type: 'run', weight: 2, waypoints: [[460, 180]] },
      { id: `${slug}_e6`, from: 'westBowl', to: 'midHub', name: 'Katlan Levezető Piros', difficulty: 'red', type: 'run', weight: 3, waypoints: [[310, 290]] },
      { id: `${slug}_e7`, from: 'lakeStation', to: 'midHub', name: 'Tóparti Családi Kék', difficulty: 'blue', type: 'run', weight: 2, waypoints: [[460, 280]] },
      { id: `${slug}_e8`, from: 'lakeStation', to: 'snowpark', name: 'Park Bevezető Piros', difficulty: 'red', type: 'run', weight: 3, waypoints: [[580, 290]] },
      { id: `${slug}_e9`, from: 'eastBowl', to: 'snowpark', name: 'Keleti Speed Chute', difficulty: 'black', type: 'run', weight: 4, waypoints: [[710, 290]] },
      { id: `${slug}_e10`, from: 'midHub', to: 'westForest', name: 'Erdei Kanyarulat Kék', difficulty: 'blue', type: 'run', weight: 2, waypoints: [[330, 390]] },
      { id: `${slug}_e11`, from: 'midHub', to: 'sunPlateau', name: 'Panoráma Autópálya Kék', difficulty: 'blue', type: 'run', weight: 2, waypoints: [[500, 400]] },
      { id: `${slug}_e12`, from: 'snowpark', to: 'sunPlateau', name: 'Park Levezető Kék', difficulty: 'blue', type: 'run', weight: 2, waypoints: [[620, 400]] },
      { id: `${slug}_e13`, from: 'westForest', to: 'valleyWest', name: 'Nyugati Erdei Völgylesiklás', difficulty: 'blue', type: 'run', weight: 3, waypoints: [[260, 520]] },
      { id: `${slug}_e14`, from: 'sunPlateau', to: 'valleyMain', name: 'Fő Völgypálya Kék', difficulty: 'blue', type: 'run', weight: 3, waypoints: [[540, 540]] },
      { id: `${slug}_e15`, from: 'valleyWest', to: 'valleyMain', name: 'Völgy Összekötő Sétány', difficulty: 'blue', type: 'run', weight: 1, waypoints: [[400, 600]] },
      // Lifts
      { id: `${slug}_lift1`, from: 'valleyMain', to: 'midHub', name: '10-es Fő Gondola (I+II)', difficulty: 'blue', type: 'lift', weight: 2, waypoints: [[470, 480]] },
      { id: `${slug}_lift2`, from: 'midHub', to: 'peakWest', name: 'Panoráma 6-üléses Express', difficulty: 'blue', type: 'lift', weight: 2, waypoints: [[330, 200]] },
      { id: `${slug}_lift3`, from: 'midHub', to: 'peakEast', name: 'Keleti Csúcsfelvonó', difficulty: 'blue', type: 'lift', weight: 2, waypoints: [[550, 210]] },
      { id: `${slug}_lift4`, from: 'valleyWest', to: 'westBowl', name: 'Nyugati 4-üléses Völgyexpress', difficulty: 'blue', type: 'lift', weight: 3, waypoints: [[230, 420]] },
      { id: `${slug}_lift5`, from: 'sunPlateau', to: 'lakeStation', name: 'Tóparti 4-üléses', difficulty: 'blue', type: 'lift', weight: 2, waypoints: [[530, 330]] }
    ]
  };
}

export function buildSinglePeakResort({ id, name, country, slug, hasLake, previewUrl }) {
  return {
    id,
    name: name || 'Alpesi Csúcs Síterep',
    country: country || 'Ausztria · Alpesi Régió',
    flag: '🏔️',
    altitude: 2750,
    baseAltitude: 1050,
    description: `Képfelismeréssel generált alpesi sípályarendszer: ${name} (2750m), körpanorámás gerincek, hütték és 12 állomásos felvonóhálózat.`,
    sourceImage: true,
    sourceMode: 'offline-cv',
    imagePreview: previewUrl || null,
    nodes: {
      summit: {
        id: 'summit',
        name: `${name} Főcsúcs (2750m)`,
        altitude: 2750,
        x: 450, y: 65,
        icon: '⛰️'
      },
      northRidge: {
        id: 'northRidge',
        name: 'Északi Gerinc (2580m)',
        altitude: 2580,
        x: 230, y: 110,
        icon: '🏔️'
      },
      eastHorn: {
        id: 'eastHorn',
        name: 'Keleti Kilátó Csúcs (2620m)',
        altitude: 2620,
        x: 690, y: 100,
        icon: '⚡'
      },
      powderBowl: {
        id: 'powderBowl',
        name: 'Gleccser Mélyhó Katlan',
        altitude: 2420,
        x: 370, y: 190,
        icon: '❄️'
      },
      steepCouloir: {
        id: 'steepCouloir',
        name: 'Sziklahasadék Fekete Rajt',
        altitude: 2350,
        x: 180, y: 240,
        icon: '⚠️'
      },
      panoramaHut: {
        id: 'panoramaHut',
        name: hasLake ? `${name} Tóparti Hütte & Kilátó` : 'Panoráma Alpesi Hütte (2150m)',
        altitude: 2150,
        x: 580, y: 220,
        icon: hasLake ? '💧' : '🏠'
      },
      midStation: {
        id: 'midStation',
        name: `${name} Középállomás (1900m)`,
        altitude: 1900,
        x: 430, y: 320,
        icon: '🚡'
      },
      snowpark: {
        id: 'snowpark',
        name: `${name} Freestyle Park`,
        altitude: 1820,
        x: 670, y: 340,
        icon: '🏂'
      },
      forestCross: {
        id: 'forestCross',
        name: 'Fenyves Erdei Elágazás',
        altitude: 1600,
        x: 240, y: 430,
        icon: '🌲'
      },
      sunnyPlateau: {
        id: 'sunnyPlateau',
        name: 'Napos Fennsík & Tanpálya',
        altitude: 1520,
        x: 540, y: 450,
        icon: '🎿'
      },
      southValley: {
        id: 'southValley',
        name: 'Déli Völgyállomás (1180m)',
        altitude: 1180,
        x: 280, y: 580,
        icon: '🏘️'
      },
      mainBase: {
        id: 'mainBase',
        name: `${name} Fő Völgybázis (1050m)`,
        altitude: 1050,
        x: 490, y: 620,
        icon: '🏘️'
      }
    },
    edges: [
      { id: `${slug}_e1`, from: 'summit', to: 'northRidge', name: 'Gerincút Kék', difficulty: 'blue', type: 'run', weight: 2, waypoints: [[340, 85]] },
      { id: `${slug}_e2`, from: 'summit', to: 'eastHorn', name: 'Keleti Panoráma Piros', difficulty: 'red', type: 'run', weight: 3, waypoints: [[570, 80]] },
      { id: `${slug}_e3`, from: 'summit', to: 'powderBowl', name: 'Csúcs Mélyhó Piros', difficulty: 'red', type: 'run', weight: 3, waypoints: [[410, 130]] },
      { id: `${slug}_e4`, from: 'northRidge', to: 'steepCouloir', name: 'Északi Fal Meredek Fekete', difficulty: 'black', type: 'run', weight: 5, waypoints: [[200, 170]] },
      { id: `${slug}_e5`, from: 'powderBowl', to: 'midStation', name: 'Katlan Levezető Kék', difficulty: 'blue', type: 'run', weight: 2, waypoints: [[400, 260]] },
      { id: `${slug}_e6`, from: 'eastHorn', to: 'panoramaHut', name: 'Napos Szakasz Piros', difficulty: 'red', type: 'run', weight: 3, waypoints: [[640, 160]] },
      { id: `${slug}_e7`, from: 'panoramaHut', to: 'midStation', name: 'Hütte Átcsúszó Kék', difficulty: 'blue', type: 'run', weight: 2, waypoints: [[500, 270]] },
      { id: `${slug}_e8`, from: 'panoramaHut', to: 'snowpark', name: 'Park Bevezető Kék', difficulty: 'blue', type: 'run', weight: 2, waypoints: [[630, 280]] },
      { id: `${slug}_e9`, from: 'steepCouloir', to: 'forestCross', name: 'Erdei Fekete Chute', difficulty: 'black', type: 'run', weight: 5, waypoints: [[210, 340]] },
      { id: `${slug}_e10`, from: 'midStation', to: 'forestCross', name: 'Nyugati Átkötő Piros', difficulty: 'red', type: 'run', weight: 3, waypoints: [[330, 380]] },
      { id: `${slug}_e11`, from: 'midStation', to: 'sunnyPlateau', name: 'Családi Kék Autópálya', difficulty: 'blue', type: 'run', weight: 2, waypoints: [[490, 390]] },
      { id: `${slug}_e12`, from: 'snowpark', to: 'sunnyPlateau', name: 'Park Levezető Kék', difficulty: 'blue', type: 'run', weight: 2, waypoints: [[610, 400]] },
      { id: `${slug}_e13`, from: 'forestCross', to: 'southValley', name: 'Déli Erdei Pálya Kék', difficulty: 'blue', type: 'run', weight: 3, waypoints: [[260, 510]] },
      { id: `${slug}_e14`, from: 'sunnyPlateau', to: 'mainBase', name: 'Fő Völgylesiklás Kék', difficulty: 'blue', type: 'run', weight: 3, waypoints: [[510, 540]] },
      { id: `${slug}_e15`, from: 'southValley', to: 'mainBase', name: 'Völgy Összekötő Sétány', difficulty: 'blue', type: 'run', weight: 1, waypoints: [[380, 600]] },
      // Lifts
      { id: `${slug}_lift1`, from: 'mainBase', to: 'midStation', name: `${name} 10-es Főkabin`, difficulty: 'blue', type: 'lift', weight: 2, waypoints: [[460, 470]] },
      { id: `${slug}_lift2`, from: 'midStation', to: 'summit', name: `${name} Csúcsgondola`, difficulty: 'blue', type: 'lift', weight: 2, waypoints: [[440, 190]] },
      { id: `${slug}_lift3`, from: 'southValley', to: 'northRidge', name: 'Északi 6-üléses Express', difficulty: 'blue', type: 'lift', weight: 3, waypoints: [[240, 350]] },
      { id: `${slug}_lift4`, from: 'sunnyPlateau', to: 'eastHorn', name: 'Napfény 4-üléses', difficulty: 'blue', type: 'lift', weight: 2, waypoints: [[620, 270]] }
    ]
  };
}

export function generateProceduralResort(resortName) {
  const cleanName = (resortName || 'Custom Alpine').trim();
  const slug = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'alpine';
  const id = 'proc_' + slug;

  return buildSinglePeakResort({
    id,
    name: cleanName.charAt(0).toUpperCase() + cleanName.slice(1),
    country: 'Alpesi Síterep',
    slug,
    hasLake: false,
    previewUrl: null
  });
}

// ─────────────────────────────────────────────────────────────────
// 8. Active Resort Switcher & Startup Initializer
// ─────────────────────────────────────────────────────────────────
