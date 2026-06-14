// ============================================
// This Tics Me Off — Alpha-gal & Lyme Tracker
// Main application logic (extracted from index.html)
// ============================================

// ==================== DATA (loaded externally with fallback) ====================
let yearlyData = {};

// Full data kept here as fallback for the single-file bundle / offline use
// Expanded regional dataset (10 high-incidence Northeast + Appalachian states).
// 2023 Lyme values = real CDC state surveillance (lyme_2023_state_cases.csv).
// Other years = generalized/estimated from trends + known surveillance artifacts
// (e.g. 2022 case definition change caused large jumps in reported counts in many states).
// Alpha-gal remains generalized (state-yearly data is sparse; primarily national lab data).
// May 2026: New direct county CSV "LD_Case_Counts_by_County_2023_updated.csv" + multi-TBD Excel now in sources.
// Future work: Pipeline processing of county files → switch red layer from state points to real county heat/choropleth.
const FALLBACK_DATA = {
  "lyme": {
    "2010": { "Massachusetts": 6500, "Connecticut": 4200, "Pennsylvania": 3100, "New York": 9200, "New Jersey": 2800, "Maine": 1100, "New Hampshire": 650, "Vermont": 550, "Rhode Island": 1050, "West Virginia": 850, "Maryland": 1200, "Virginia": 800, "Delaware": 150, "Ohio": 600, "Michigan": 400, "Wisconsin": 900, "Minnesota": 50, "California": 20, "Oregon": 10, "Washington": 8, "Colorado": 5, "Arizona": 3, "New Mexico": 2, "Idaho": 2, "Montana": 2, "North Dakota": 1, "South Dakota": 1, "Wyoming": 1, "Utah": 2, "Nevada": 2 },
    "2014": { "Massachusetts": 7200, "Connecticut": 4800, "Pennsylvania": 3900, "New York": 10500, "New Jersey": 3400, "Maine": 1400, "New Hampshire": 800, "Vermont": 720, "Rhode Island": 1300, "West Virginia": 1100, "Maryland": 1600, "Virginia": 1100, "Delaware": 220, "Ohio": 850, "Michigan": 650, "Wisconsin": 1800, "Minnesota": 120, "California": 35, "Oregon": 18, "Washington": 15, "Colorado": 10, "Arizona": 5, "New Mexico": 4, "Idaho": 4, "Montana": 4, "North Dakota": 2, "South Dakota": 2, "Wyoming": 2, "Utah": 4, "Nevada": 3 },
    "2018": { "Massachusetts": 8100, "Connecticut": 5500, "Pennsylvania": 4800, "New York": 13200, "New Jersey": 4200, "Maine": 1800, "New Hampshire": 950, "Vermont": 880, "Rhode Island": 1600, "West Virginia": 1500, "Maryland": 2000, "Virginia": 1400, "Delaware": 280, "Ohio": 1100, "Michigan": 900, "Wisconsin": 3200, "Minnesota": 450, "California": 55, "Oregon": 30, "Washington": 22, "Colorado": 15, "Arizona": 8, "New Mexico": 6, "Idaho": 6, "Montana": 6, "North Dakota": 3, "South Dakota": 3, "Wyoming": 2, "Utah": 7, "Nevada": 5 },
    "2021": { "Massachusetts": 8900, "Connecticut": 6100, "Pennsylvania": 5700, "New York": 15800, "New Jersey": 5100, "Maine": 2200, "New Hampshire": 1150, "Vermont": 1050, "Rhode Island": 2000, "West Virginia": 1900, "Maryland": 2200, "Virginia": 1600, "Delaware": 320, "Ohio": 1250, "Michigan": 1050, "Wisconsin": 4800, "Minnesota": 1200, "California": 75, "Oregon": 42, "Washington": 28, "Colorado": 20, "Arizona": 11, "New Mexico": 8, "Idaho": 8, "Montana": 8, "North Dakota": 5, "South Dakota": 4, "Wyoming": 2, "Utah": 10, "Nevada": 8 },
    "2023": { "Massachusetts": 9715, "Connecticut": 3239, "Pennsylvania": 16671, "New York": 22173, "New Jersey": 7224, "Maine": 2942, "New Hampshire": 1573, "Vermont": 1445, "Rhode Island": 2852, "West Virginia": 3242, "Maryland": 2470, "Virginia": 1747, "Delaware": 349, "Ohio": 1307, "Michigan": 1152, "Wisconsin": 6283, "Minnesota": 2938, "California": 109, "Oregon": 61, "Washington": 25, "Colorado": 32, "Arizona": 16, "New Mexico": 11, "Idaho": 11, "Montana": 11, "North Dakota": 15, "South Dakota": 7, "Wyoming": 2, "Utah": 16, "Nevada": 14 },
    "2024": { "Massachusetts": 9100, "Connecticut": 3550, "Pennsylvania": 17800, "New York": 23200, "New Jersey": 7650, "Maine": 3250, "New Hampshire": 1720, "Vermont": 1580, "Rhode Island": 3020, "West Virginia": 3550, "Maryland": 2680, "Virginia": 1890, "Delaware": 375, "Ohio": 1420, "Michigan": 1260, "Wisconsin": 6850, "Minnesota": 3280, "California": 128, "Oregon": 72, "Washington": 30, "Colorado": 38, "Arizona": 19, "New Mexico": 13, "Idaho": 13, "Montana": 13, "North Dakota": 17, "South Dakota": 9, "Wyoming": 2, "Utah": 19, "Nevada": 16 },
    "2025": { "Massachusetts": 9450, "Connecticut": 3720, "Pennsylvania": 18500, "New York": 23900, "New Jersey": 7950, "Maine": 3380, "New Hampshire": 1790, "Vermont": 1650, "Rhode Island": 3140, "West Virginia": 3720, "Maryland": 2820, "Virginia": 1980, "Delaware": 395, "Ohio": 1490, "Michigan": 1320, "Wisconsin": 7150, "Minnesota": 3450, "California": 135, "Oregon": 76, "Washington": 32, "Colorado": 42, "Arizona": 21, "New Mexico": 14, "Idaho": 14, "Montana": 14, "North Dakota": 18, "South Dakota": 10, "Wyoming": 2, "Utah": 20, "Nevada": 17 }
  },
  "alpha": {
    "2010": { "Massachusetts": 120, "Connecticut": 80, "Pennsylvania": 60, "New York": 90, "New Jersey": 50, "Maine": 15, "New Hampshire": 12, "Vermont": 10, "Rhode Island": 18, "West Virginia": 25, "Maryland": 30, "Virginia": 18, "Delaware": 8, "Ohio": 12, "Michigan": 6, "Wisconsin": 5 },
    "2014": { "Massachusetts": 280, "Connecticut": 190, "Pennsylvania": 140, "New York": 220, "New Jersey": 120, "Maine": 35, "New Hampshire": 28, "Vermont": 22, "Rhode Island": 40, "West Virginia": 55, "Maryland": 80, "Virginia": 45, "Delaware": 22, "Ohio": 35, "Michigan": 18, "Wisconsin": 15 },
    "2018": { "Massachusetts": 520, "Connecticut": 380, "Pennsylvania": 290, "New York": 480, "New Jersey": 260, "Maine": 70, "New Hampshire": 55, "Vermont": 45, "Rhode Island": 85, "West Virginia": 110, "Maryland": 180, "Virginia": 95, "Delaware": 55, "Ohio": 85, "Michigan": 45, "Wisconsin": 35 },
    "2021": { "Massachusetts": 890, "Connecticut": 650, "Pennsylvania": 510, "New York": 820, "New Jersey": 450, "Maine": 110, "New Hampshire": 85, "Vermont": 70, "Rhode Island": 140, "West Virginia": 180, "Maryland": 350, "Virginia": 180, "Delaware": 95, "Ohio": 160, "Michigan": 85, "Wisconsin": 65 },
    "2023": { "Massachusetts": 1450, "Connecticut": 1100, "Pennsylvania": 920, "New York": 1350, "New Jersey": 780, "Maine": 160, "New Hampshire": 120, "Vermont": 95, "Rhode Island": 210, "West Virginia": 260, "Maryland": 520, "Virginia": 280, "Delaware": 140, "Ohio": 240, "Michigan": 130, "Wisconsin": 95 },
    "2024": { "Massachusetts": 1890, "Connecticut": 1450, "Pennsylvania": 1280, "New York": 1720, "New Jersey": 980, "Maine": 190, "New Hampshire": 145, "Vermont": 115, "Rhode Island": 260, "West Virginia": 310, "Maryland": 580, "Virginia": 310, "Delaware": 155, "Ohio": 270, "Michigan": 145, "Wisconsin": 105 },
    "2025": { "Massachusetts": 2100, "Connecticut": 1680, "Pennsylvania": 1520, "New York": 1900, "New Jersey": 1100, "Maine": 210, "New Hampshire": 160, "Vermont": 125, "Rhode Island": 290, "West Virginia": 340, "Maryland": 620, "Virginia": 330, "Delaware": 165, "Ohio": 290, "Michigan": 155, "Wisconsin": 115 }
  }
};

async function loadData() {
  try {
    const res = await fetch('data/3state_cases.json');
    if (res.ok) {
      yearlyData = await res.json();
      console.log('%c[This Tics Me Off] Loaded external data from data/3state_cases.json', 'color:#0f0');
      return;
    }
  } catch (e) {
    // fetch will fail when opening the single HTML file directly (file://) or if the file is missing
  }

  // Fallback for single-file bundle / direct file open / offline
  yearlyData = FALLBACK_DATA;
  console.log('%c[This Tics Me Off] Using embedded fallback data (single-file mode)', 'color:#ff0');
}

const stateCoords = {
  // Original 10 states
  "Massachusetts": [42.41, -71.38],
  "Connecticut": [41.60, -72.74],
  "Pennsylvania": [40.99, -77.73],
  "New York": [42.95, -75.50],
  "New Jersey": [40.25, -74.65],
  "Maine": [45.30, -69.10],
  "New Hampshire": [43.45, -71.60],
  "Vermont": [44.05, -72.70],
  "Rhode Island": [41.68, -71.55],
  "West Virginia": [38.92, -80.50],

  // Expanded states for Verified Tick Population (purple) - predictive habitat
  "Maryland": [39.05, -76.80],
  "Delaware": [39.00, -75.50],
  "Virginia": [37.50, -78.50],
  "Kentucky": [37.80, -85.00],
  "Tennessee": [35.80, -86.00],
  "North Carolina": [35.50, -79.50],
  "South Carolina": [34.00, -81.00],
  "Ohio": [40.30, -82.80],
  "Indiana": [39.80, -86.20],
  "Illinois": [40.00, -89.00],
  "Missouri": [38.50, -92.50],
  "Arkansas": [34.80, -92.20],
  "Oklahoma": [35.50, -97.50],
  "Alabama": [32.80, -86.80],
  "Georgia": [32.80, -83.50],
  // Additional high-density states for the purple blob
  "Texas": [31.00, -99.00],
  "Mississippi": [32.50, -89.50],
  "Florida": [28.00, -82.00],
  "Kansas": [38.50, -98.00],
  "Louisiana": [31.00, -92.00],

  // Newly added for red dot expansion (Lyme/Alpha-gal) and purple blob
  "Michigan": [44.31, -85.60],
  "Wisconsin": [44.50, -89.50],
  "Iowa": [42.03, -93.58],
  "Minnesota": [46.73, -94.69],
  "Nebraska": [41.49, -99.90],

  // Further expansion using available 2023+ state surveillance data
  "California": [36.78, -119.42],
  "Oregon": [44.0, -120.5],
  "Washington": [47.4, -121.5],
  "Colorado": [39.0, -105.5],
  "Arizona": [34.0, -111.5],
  "New Mexico": [34.5, -106.0],
  "Idaho": [44.0, -114.5],
  "Montana": [47.0, -110.0],
  "North Dakota": [47.5, -100.5],
  "South Dakota": [44.5, -100.0],
  "Wyoming": [43.0, -107.5],
  "Utah": [39.5, -111.5],
  "Nevada": [39.0, -117.0]
};

const stateSize = {
  "Massachusetts": 13,
  "Connecticut": 10,
  "Pennsylvania": 15,
  "New York": 16,
  "New Jersey": 12,
  "Maine": 9,
  "New Hampshire": 8,
  "Vermont": 7,
  "Rhode Island": 6,
  "West Virginia": 10
};

// Verified Lone Star tick population data
// 2025 snapshot from CDC + historical context from Springer et al. (2014)

// Base 2025 values = % of counties in the state with established populations
// Source: CDC Lone Star Tick Surveillance data (2025)
const loneStarPresence2025 = {
  // Original 10 states (human data region)
  "Pennsylvania": 52,
  "New Jersey": 67,
  "New York": 27,
  "West Virginia": 41,
  "Connecticut": 14,
  "Massachusetts": 7,
  "Rhode Island": 40,
  "Maine": 3,
  "New Hampshire": 4,
  "Vermont": 2,

  // Expanded states (strong Lone Star presence - predictive of future disease risk)
  "Maryland": 75,
  "Delaware": 67,
  "Virginia": 52,
  "Kentucky": 72,
  "Tennessee": 47,
  "North Carolina": 48,
  "South Carolina": 54,
  "Ohio": 53,
  "Indiana": 53,
  "Illinois": 67,
  "Missouri": 55,
  "Arkansas": 97,
  "Oklahoma": 90,
  "Alabama": 63,
  "Georgia": 38
};

// Simple historical scaling for the purple layer based on Springer et al. (2014) patterns + updated with 2025 CDC Lone Star surveillance and Eisen 2016 Ixodes data (see additional_sources.json).
// This gives a rough "how established was the tick by this year" multiplier.
// Values are conservative estimates of relative presence compared to 2025.
function getPurpleHistoricalFactor(year) {
  if (year >= 2025) return 1.0;
  if (year >= 2010) return 0.85;   // Strong expansion by 2010s
  if (year >= 2000) return 0.65;
  if (year >= 1990) return 0.45;
  if (year >= 1980) return 0.30;
  if (year >= 1970) return 0.20;
  if (year >= 1960) return 0.12;
  if (year >= 1950) return 0.08;
  return 0.05; // Pre-1950: very limited established populations outside core South
}

let selectedDisease = "alpha";   // which disease's number is shown in the text box
let currentDisease = "alpha";    // which disease's red dots are currently drawn on the map (can be null)
let currentYear = 2010;
// More centered continental US view at t0 (2010)
let initialCenter = [39.0, -98.0];
let initialZoom = 4.0;

// Slightly wider view on mobile for continental US
if (window.innerWidth < 768) {
  initialCenter = [39.5, -98.0];
  initialZoom = 3.6;
}

let map = L.map('map').setView(initialCenter, initialZoom);
let markers = [];                    // human case circles (red)
let isPlaying = false;
let playInterval = null;

let isDraggingBox = false;           // for the draggable year/case info box

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// Heat map color scale: white (low) → bright red (high)
function getHeatColor(d) {
  if (d > 1600) return '#cc0000';   // very bright red
  if (d > 1100) return '#e60000';
  if (d > 700)  return '#ff1a1a';
  if (d > 400)  return '#ff4d4d';
  if (d > 200)  return '#ff8080';
  if (d > 80)   return '#ffb3b3';
  return '#ffe6e6';                 // near white / very light pink
}

// Purple color scale for verified tick population (light → deep purple)
function getPurpleColor(pct) {
  if (pct > 50) return '#5b21b6';   // deep purple
  if (pct > 35) return '#7c3aed';
  if (pct > 20) return '#a78bfa';
  if (pct > 8)  return '#c4b5fd';
  return '#e0d4ff';                 // very light lavender
}

function getCumulativeData(year) {
  const years = Object.keys(yearlyData[currentDisease]).map(Number).sort((a,b) => a-b);
  const cumulative = {};

  for (let y of years) {
    if (y > year) break;
    const yearData = yearlyData[currentDisease][y];
    for (let state in yearData) {
      if (!cumulative[state]) cumulative[state] = 0;
      cumulative[state] += yearData[state];
    }
  }
  return cumulative;
}

function updateHeatmap() {
  markers.forEach(m => map.removeLayer(m));
  markers = [];

  // If red layer is turned off (no disease selected), don't draw human case circles
  if (!currentDisease) {
    return;
  }

  const cumulativeData = getCumulativeData(currentYear);
  const diseaseName = currentDisease === 'lyme' ? 'Lyme Disease' : 'Alpha-gal Syndrome';

  // Get 2010 baseline for growth calculation (makes dots show spread rather than just total burden)
  const baseline2010 = getCumulativeData(2010);

  for (let state in cumulativeData) {
    if (stateCoords[state]) {
      const value = cumulativeData[state];
      const baseline = baseline2010[state] || 0;
      const growth = Math.max(0, value - baseline);

      const color = getHeatColor(value);

      let radius;
      const isMobile = window.innerWidth < 768;
      const sizeMultiplier = isMobile ? 0.7 : 1;

      if (currentYear === 2010) {
        // At t0 (2010), show small baseline dots
        radius = isMobile ? 5 : 7;
      } else {
        // Size dots based on growth since 2010 (final - initial)
        radius = Math.max(6, Math.min(22, Math.sqrt(growth) / 2.8 * sizeMultiplier));
      }

      const circle = L.circleMarker(stateCoords[state], {
        radius: radius,
        fillColor: color,
        color: "#444",
        weight: 1.5,
        fillOpacity: 0.9
      }).addTo(map);

      // Popup on click/tap
      let popupHtml;
      if (currentYear === 2010) {
        popupHtml = `
          <strong>2010 Baseline • ${diseaseName}</strong><br>
          <strong>${state}</strong>: ${value.toLocaleString()} cases<br>
          <small>(starting point - small dots represent initial presence)</small>
        `;
      } else {
        popupHtml = `
          <strong>${currentYear} • ${diseaseName}</strong><br>
          <strong>${state}</strong>: ${value.toLocaleString()} cumulative cases<br>
          <small>Growth since 2010: +${growth.toLocaleString()} cases</small>
        `;
      }
      circle.bindPopup(popupHtml, {
        closeButton: true,
        offset: [0, -4]
      });

      // Tooltip shows the growth value for better "spread" storytelling
      const tooltipValue = currentYear === 2010 ? value : growth;
      circle.bindTooltip(`${tooltipValue.toLocaleString()}`, {
        permanent: false,
        direction: 'top',
        offset: [0, -8],
        opacity: 0.9
      });

      markers.push(circle);
    }
  }
}

// Update the purple "Verified Tick Population" layer as a density "blob" / heatmap
let purpleHeatLayer = null;
let purpleEstablishedData = null;

// Loads purple data from generated file if available, otherwise uses embedded fallback.
// This makes the purple layer fully independent of the red disease toggles.
async function loadPurpleData() {
  if (purpleEstablishedData) return purpleEstablishedData;

  try {
    const res = await fetch('data/purple_data.json');
    if (res.ok) {
      const data = await res.json();
      purpleEstablishedData = data.established_counts || data.current_established_counts || {};
      console.log('%c[Pipeline] Loaded generated purple data (expanded 2025 version with new states)', 'color:#0f0');
      return purpleEstablishedData;
    }
  } catch (e) {
    // silent fallback
  }

  // Embedded fallback (updated 2025 data + expansion states from CDC 2025 surveillance and additional_sources.json)
  // See data/additional_sources.json and data-pipeline/raw/purple/ for source details and future Ixodes expansion.
  // May 2026 update: Direct CDC Ixodes County Table (2026 Excel) and Lone Star surveillance now tracked in cdc_direct_downloads_2026.
  // Long-term TODO: Parse these Excels in the pipeline → generate county-level heat / presence points for a true Ixodes + Lone Star density layer (replacing current state-aggregated purple blob).
  console.log('%c[Testnet] Using 2025/2026 updated purple data (major Lone Star expansion + Western I. pacificus)', 'color:#0af');
  purpleEstablishedData = {
    "Texas": 240, "Kentucky": 115, "Arkansas": 74, "Virginia": 95, "Oklahoma": 75,
    "Illinois": 95, "Missouri": 112, "Georgia": 155, "Mississippi": 80, "Indiana": 90,
    "Florida": 65, "North Carolina": 95, "Tennessee": 90, "Alabama": 65,
    "Pennsylvania": 45, "New Jersey": 20, "New York": 30, "West Virginia": 50,
    "Maryland": 22, "Delaware": 3, "South Carolina": 42, "Ohio": 80,
    "Connecticut": 8, "Massachusetts": 8, "Rhode Island": 4,
    "Kansas": 95, "Louisiana": 60,
    "Michigan": 70, "Wisconsin": 45, "Iowa": 70, "Minnesota": 25, "Nebraska": 60,
    "California": 35, "Oregon": 18, "Washington": 12
  };
  return purpleEstablishedData;
}

async function updateTickPopulationLayer() {
  console.log('[Tick Density] updateTickPopulationLayer() called');

  // Remove previous heatmap if it exists
  if (purpleHeatLayer) {
    map.removeLayer(purpleHeatLayer);
    purpleHeatLayer = null;
  }

  const establishedCounts = await loadPurpleData();

  // Build points for the heatmap: [lat, lng, intensity]
  // Using established county counts per state + jitter to create a natural density blob
  const heatPoints = [];

  // Use existing stateCoords where available, with added jitter for blob effect
  Object.keys(establishedCounts).forEach(state => {
    const count = establishedCounts[state];
    if (!stateCoords[state] || count < 1) return;

    const [baseLat, baseLng] = stateCoords[state];
    const baseIntensity = Math.min(1.0, count / 70);  // Slightly higher intensity in testnet for visibility of expansion

    // Apply historical factor from Springer data for time-aware purple layer
    const historicalFactor = getPurpleHistoricalFactor(currentYear);
    const intensity = baseIntensity * historicalFactor;

    // Create multiple points with jitter to simulate density blob
    // Boosted for testnet to make 2025 data expansion more visible
    const numPoints = Math.max(8, Math.floor(count / 3.5));
    for (let i = 0; i < numPoints; i++) {
      const latJitter = (Math.random() - 0.5) * 2.1;
      const lngJitter = (Math.random() - 0.5) * 2.5;
      heatPoints.push([
        baseLat + latJitter,
        baseLng + lngJitter,
        Math.min(1.0, intensity * 2.1 + Math.random() * 0.4)
      ]);
    }
  });

  if (heatPoints.length === 0) {
    console.warn('[Tick Density] No heat points generated. Check establishedCounts and stateCoords keys.');
    return;
  }

  console.log(`[Tick Density] Creating purple heatmap with ${heatPoints.length} points`);

  // Create purple-themed heatmap - very pronounced and blob-like
  const isMobile = window.innerWidth < 768;

  // Reduce radius + blur for earlier years so the purple blob visibly contracts (user request)
  // Size scale gives clear visual expansion from 2010 (contracted) → 2025 (full extent)
  const sizeScale = (currentYear >= 2025) ? 1.0 :
                    (currentYear >= 2022) ? 0.90 :
                    (currentYear >= 2018) ? 0.78 :
                    (currentYear >= 2014) ? 0.68 :
                    0.58;  // 2010 — noticeably smaller/tighter blobs
  const baseR = isMobile ? 32 : 48;
  const baseB = isMobile ? 9 : 11;
  const radius = Math.max(isMobile ? 14 : 18, Math.round(baseR * sizeScale));
  const blur = Math.max(isMobile ? 5 : 6, Math.round(baseB * sizeScale));

  purpleHeatLayer = L.heatLayer(heatPoints, {
    radius: radius,
    blur: blur,
    maxZoom: 10,
    max: 1.0,
    gradient: {
      0.0: '#c084fc',   // vivid purple
      0.3: '#a855f7',
      0.6: '#9333ea',
      0.85: '#7e22ce',
      1.0: '#581c87'    // deep, rich purple
    }
  }).addTo(map);

  // Force the heat canvas to actually paint, especially when it's the only layer
  setTimeout(() => {
    if (map) {
      map.invalidateSize();
      map.fire('moveend');
    }
  }, 50);
}

function showModal(type) {
  const modal = document.getElementById('modal');
  const body = document.getElementById('modal-body');
  modal.style.display = 'flex';

  let html = '';

  if (type === 'ticks') {
    html = `<h3>Tick Species</h3>
    <p><strong>Lyme disease spreaders:</strong> Blacklegged tick (Ixodes scapularis) and Western blacklegged tick (Ixodes pacificus).</p>
    <p><strong>Alpha-gal spreaders:</strong> Lone Star tick (Amblyomma americanum) is the primary vector in the United States.</p>
    <p>Other ticks like the American dog tick and Rocky Mountain wood tick do not typically transmit these diseases.</p>`;
  }

  if (type === 'bitten') {
    html = `<h3>What To Do If Bitten</h3>
    <ul>
      <li>Remove the tick as soon as possible using fine-tipped tweezers. Grasp close to the skin and pull upward steadily.</li>
      <li>Do not twist or jerk the tick.</li>
      <li>After removal, clean the area with alcohol or soap and water.</li>
      <li>Save the tick in a bag or container for identification if possible.</li>
      <li>Monitor for symptoms for at least 30 days.</li>
      <li>Seek medical attention if you develop a rash, fever, fatigue, or other unusual symptoms.</li>
    </ul>`;
  }

  if (type === 'alphagal') {
    html = `<h3>What is Alpha-gal Syndrome?</h3>
    <p>Alpha-gal syndrome is a serious, potentially life-threatening allergic reaction to a sugar molecule called galactose-alpha-1,3-galactose (alpha-gal) found in most mammals.</p>
    <p>It is primarily triggered by the bite of the Lone Star tick. After the bite, some people develop an allergy to red meat (beef, pork, lamb) and sometimes dairy or other mammal products.</p>
    <p>Symptoms usually appear 3–6 hours after eating mammal meat and can include hives, swelling, stomach pain, vomiting, and in severe cases, anaphylaxis.</p>
    <p>There is currently no cure. Avoidance of mammal products is the main treatment.</p>`;
  }

  if (type === 'lyme') {
    html = `<h3>What is Lyme Disease?</h3>
    <p>Lyme disease is a bacterial infection caused by Borrelia burgdorferi and Borrelia mayonii. It is transmitted to humans through the bite of infected blacklegged ticks.</p>
    <p>Early symptoms include fever, headache, fatigue, and a characteristic skin rash called erythema migrans (bull’s-eye rash).</p>
    <p>If left untreated, the infection can spread to joints, the heart, and the nervous system.</p>
    <p>Lyme disease is most common in the Northeast, Mid-Atlantic, and Upper Midwest regions of the United States.</p>
    <p>Early treatment with antibiotics is usually effective. Prevention focuses on avoiding tick bites.</p>`;
  }

  if (type === 'sources') {
    html = `<h3>Data Sources & Documentation</h3>
    <div style="font-size: 15px; line-height: 1.5;">
      <p><strong>Primary Data Sources</strong> (click any title to visit the original source):</p>
      <div id="sources-list">Loading sources...</div>

      <hr style="margin: 20px 0; border-color: #444;">

      <p><strong>Full Documentation & Methodology</strong> (click to read on this site):</p>
      <ul style="margin: 8px 0 0 20px; padding: 0;">
        <li><a href="#" onclick="showReadme('red'); return false;">README: Human Cases (Red Layer)</a> — How the case data was assembled, strengths, and major limitations (underreporting, surveillance artifacts, etc.)</li>
        <li><a href="#" onclick="showReadme('purple'); return false;">README: Tick Habitat / Purple Density Layer</a> — CDC + Springer et al. (2014) data for the Lone Star tick blob, strengths, limitations, and why it's the best available leading indicator.</li>
      </ul>

      <p style="margin-top: 16px; font-size: 13px; color: #aaa;">
        All data is drawn from the sources listed in <code>data/lyme_ags_database/lyme_ags_sources.json</code> and the files in that folder. We prioritize primary government surveillance data and peer-reviewed work.
      </p>
      <p style="margin-top: 8px; font-size: 12px; color: #9ca3af;">
        <strong>New (May 2026):</strong> County-level datasets now tracked (see "CDC Direct Data Downloads" section below). 
        Experimental county artifacts available at <code>data/county_lyme_2023_sample.json</code>. Full county heatmaps coming soon.
      </p>
    </div>`;
  }

  body.innerHTML = html;

  // After rendering, load dynamic sources if this is the sources modal
  if (type === 'sources') {
    loadSourcesList();
  }
}

async function loadSourcesList() {
  const container = document.getElementById('sources-list');
  if (!container) return;

  try {
    const res = await fetch('data/lyme_ags_database/lyme_ags_sources.json');
    if (!res.ok) throw new Error('Failed to load sources');

    const data = await res.json();
    let html = '';

    const sections = [
      { key: 'primary_cdc_lyme', title: 'CDC Lyme Disease Data' },
      { key: 'cdc_alpha_gal', title: 'CDC Alpha-gal Syndrome Data' },
      { key: 'massachusetts_dph', title: 'Massachusetts DPH Surveillance' },
      { key: 'johns_hopkins', title: 'Johns Hopkins Lyme Tracker' },
      { key: 'nantucket_and_local', title: 'Nantucket & Local Studies' },
      { key: 'literature_and_other', title: 'Literature & Other Sources' },
      { key: 'historical_tick_distribution', title: 'Historical Tick Distribution (Springer et al. 2014)' },
      { key: 'expanded_surveillance_2015_2025', title: 'Expanded Surveillance (2015–2025)' },
      { key: 'new_recommended_sources_for_expansion', title: 'New Recommended Sources for Data Expansion' },
      { key: 'cdc_direct_downloads_2026', title: 'CDC Direct Data Downloads (2025–2026 Updates)' }
    ];

    sections.forEach(section => {
      const items = data[section.key];
      if (!items || items.length === 0) return;

      html += `<div style="margin-bottom: 14px;"><strong>${section.title}</strong><ul style="margin: 4px 0 0 16px; padding: 0;">`;

      items.forEach(item => {
        const url = item.url || item.free_pdf;
        if (url) {
          html += `<li><a href="${url}" target="_blank" rel="noopener">${item.title}</a>`;
          if (item.description) html += ` — ${item.description}`;
          if (item.year) html += ` (${item.year})`;
          html += `</li>`;
        } else if (item.title) {
          html += `<li>${item.title}${item.description ? ' — ' + item.description : ''}</li>`;
        }
      });

      html += `</ul></div>`;
    });

    // Handle any web_search notes if present
    if (data.web_search_and_browse_sources) {
      html += `<div style="margin-top: 8px;"><strong>Additional Web Sources</strong><ul style="margin: 4px 0 0 16px; padding: 0; font-size: 13px;">`;
      data.web_search_and_browse_sources.forEach(item => {
        html += `<li>${item}</li>`;
      });
      html += `</ul></div>`;
    }

    container.innerHTML = html;
  } catch (err) {
    container.innerHTML = `See <a href="data/lyme_ags_database/lyme_ags_sources.json" target="_blank">lyme_ags_sources.json</a> for the full list of sources.`;
  }
}

function hideModal() {
  document.getElementById('modal').style.display = 'none';
}

async function showReadme(type) {
  const body = document.getElementById('modal-body');
  if (!body) return;

  let title = '';
  let path = '';

  if (type === 'red') {
    title = 'Human Cases Data (Red Layer)';
    path = 'data/lyme_ags_database/README_red_human_cases.md';
  } else if (type === 'purple') {
    title = 'Tick Habitat Data (Purple Density Layer)';
    path = 'data/lyme_ags_database/README_purple_tick_habitat.md';
  } else {
    body.innerHTML = '<p>Unknown documentation.</p>';
    return;
  }

  body.innerHTML = `<h3>${title}</h3><p style="color:#888;">Loading full documentation...</p>`;

  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error('File not found');
    const md = await res.text();

    const html = mdToHtml(md);

    body.innerHTML = `
      <h3>${title}</h3>
      <div style="max-height: 65vh; overflow-y: auto; padding-right: 8px; font-size: 14.5px; line-height: 1.55;">
        ${html}
      </div>
      <p style="margin-top: 16px; font-size: 12px;">
        <a href="#" onclick="showModal('sources'); return false;">← Back to Sources & Documentation</a>
        &nbsp;|&nbsp;
        <a href="${path}" target="_blank">View raw Markdown on GitHub</a>
      </p>
    `;
  } catch (e) {
    body.innerHTML = `
      <h3>${title}</h3>
      <p>Could not load the documentation file.</p>
      <p><a href="${path}" target="_blank">Click here to open the raw file</a></p>
      <p><a href="#" onclick="showModal('sources'); return false;">Back to sources</a></p>
    `;
  }
}

// Very lightweight Markdown → HTML converter (supports the needs of our READMEs)
function mdToHtml(md) {
  let html = md
    // Escape basic HTML
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Headings
  html = html.replace(/^### (.*$)/gim, '<h4>$1</h4>');
  html = html.replace(/^## (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^# (.*$)/gim, '<h2>$1</h2>');

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Italic
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Unordered lists
  html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, match => `<ul>${match}</ul>`);

  // Links [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

  // Paragraphs (simple)
  html = html.replace(/\n\n/g, '</p><p>');
  html = '<p>' + html + '</p>';

  // Clean up empty paragraphs and fix lists
  html = html.replace(/<p><\/p>/g, '');
  html = html.replace(/<\/ul>\s*<p>/g, '</ul>');
  html = html.replace(/<\/p>\s*<ul>/g, '<ul>');

  return html;
}

function updateRedLegendText() {
  const legendText = document.getElementById('redLegendText');
  if (!legendText) return;

  const diseaseToShow = selectedDisease || currentDisease;

  if (!diseaseToShow) {
    legendText.textContent = 'Cases (off)';
    return;
  }

  if (diseaseToShow === 'lyme') {
    legendText.textContent = 'Cases of Lyme';
  } else {
    legendText.textContent = 'Cases of Alpha-gal';
  }
}

// ==================== DRAGGABLE YEAR / CASE INFO BOX ====================
// Lets users move the info panel anywhere on screen (especially useful on iPhone).
// Position is remembered in localStorage.

function initDraggableYearBox(box) {
  // Restore previously saved position (if any)
  const savedLeft = localStorage.getItem('yearBoxLeft');
  const savedTop = localStorage.getItem('yearBoxTop');

  if (savedLeft !== null && savedTop !== null) {
    box.style.position = 'fixed';
    box.style.left = parseInt(savedLeft, 10) + 'px';
    box.style.top = parseInt(savedTop, 10) + 'px';
    box.style.right = 'auto';
    box.style.transform = 'none';
    box.dataset.customPosition = 'true';
    addResetButton(box);
  }

  let dragStartX = 0;
  let dragStartY = 0;
  let boxStartLeft = 0;
  let boxStartTop = 0;

  function onPointerDown(e) {
    // Only primary button / touch
    if (e.button != null && e.button !== 0) return;

    isDraggingBox = true;
    box.classList.add('dragging');

    // Prevent the map from panning while we drag the box (critical on mobile)
    if (map && map.dragging) map.dragging.disable();

    const rect = box.getBoundingClientRect();
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    boxStartLeft = rect.left;
    boxStartTop = rect.top;

    // Switch to fixed positioning so the user can place it anywhere (including over header)
    if (box.style.position !== 'fixed') {
      box.style.position = 'fixed';
      box.style.left = rect.left + 'px';
      box.style.top = rect.top + 'px';
      box.style.right = 'auto';
      box.style.transform = 'none';
    }

    box.dataset.customPosition = 'true';

    document.addEventListener('pointermove', onPointerMove, { passive: false });
    document.addEventListener('pointerup', onPointerUp, { once: true });
    document.addEventListener('pointercancel', onPointerUp, { once: true });
  }

  function onPointerMove(e) {
    if (!isDraggingBox) return;

    const dx = e.clientX - dragStartX;
    const dy = e.clientY - dragStartY;

    let newLeft = boxStartLeft + dx;
    let newTop = boxStartTop + dy;

    // Clamp to viewport so the box can't be dragged completely off-screen
    const boxW = box.offsetWidth;
    const boxH = box.offsetHeight;
    newLeft = Math.max(4, Math.min(newLeft, window.innerWidth - boxW - 4));
    newTop = Math.max(4, Math.min(newTop, window.innerHeight - boxH - 4));

    box.style.left = newLeft + 'px';
    box.style.top = newTop + 'px';
  }

  function onPointerUp() {
    isDraggingBox = false;
    box.classList.remove('dragging');

    // Re-enable normal map panning
    if (map && map.dragging) map.dragging.enable();

    // Persist the new position
    localStorage.setItem('yearBoxLeft', parseInt(box.style.left, 10));
    localStorage.setItem('yearBoxTop', parseInt(box.style.top, 10));

    document.removeEventListener('pointermove', onPointerMove);

    // Make sure a reset button exists now that it's in a custom spot
    addResetButton(box);
  }

  box.addEventListener('pointerdown', onPointerDown);

  // Nice title hint for desktop users
  box.title = 'Drag to reposition • Position is remembered';
}

function addResetButton(box) {
  // Only add once
  if (box.querySelector('.yearbox-reset')) return;

  const reset = document.createElement('div');
  reset.className = 'yearbox-reset';
  reset.textContent = '↺';
  reset.title = 'Reset box to default position';
  reset.style.cssText = `
    position: absolute;
    top: 2px;
    right: 4px;
    font-size: 13px;
    line-height: 1;
    color: #888;
    cursor: pointer;
    padding: 1px 4px;
    user-select: none;
    opacity: 0.7;
  `;

  reset.addEventListener('pointerdown', (e) => {
    e.stopPropagation(); // don't start a drag
  });

  reset.addEventListener('click', (e) => {
    e.stopPropagation();

    // Clear saved position
    localStorage.removeItem('yearBoxLeft');
    localStorage.removeItem('yearBoxTop');

    // Reset styles to the original CSS-driven left-side default
    box.style.position = '';
    box.style.left = '';
    box.style.top = '';
    box.style.right = '';
    box.style.transform = '';
    box.dataset.customPosition = '';

    // Remove the reset button
    reset.remove();

    // Force re-apply the normal CSS rules by triggering a tiny reflow
    box.style.display = 'none';
    void box.offsetHeight;
    box.style.display = '';
  });

  box.appendChild(reset);
}

// ==================== CUTE "CLICK THE TICK" MENU (floating lower-right) ====================

function toggleTickMenu(e) {
  if (e) e.stopPropagation();

  // Make the legs do the silly wiggle dance on tap (especially important for iPhone)
  const tickIcon = document.querySelector('.tick-icon');
  if (tickIcon) {
    tickIcon.classList.add('tapped');
    setTimeout(() => {
      tickIcon.classList.remove('tapped');
    }, 480);
  }

  const menu = document.getElementById('tickMenu');
  const isOpen = menu.style.display === 'block';
  menu.style.display = isOpen ? 'none' : 'block';
}

function selectTickTopic(type, e) {
  if (e) e.stopPropagation();
  document.getElementById('tickMenu').style.display = 'none';
  showModal(type);
}

// Close the tick menu when clicking outside of it
document.addEventListener('click', (e) => {
  const container = document.getElementById('tickContainer');
  const menu = document.getElementById('tickMenu');
  if (menu && menu.style.display === 'block' && container && !container.contains(e.target)) {
    menu.style.display = 'none';
  }
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const menu = document.getElementById('tickMenu');
    if (menu) menu.style.display = 'none';
  }
});

// ==================== INITIALIZATION & CONTROLS ====================

// Load external data (or use fallback), then initialize everything
loadData().then(async () => {
  // Initial render
  updateHeatmap();
  await updateTickPopulationLayer();  // always active, driven by year

  if (map) map.invalidateSize();


  // Controls
  const slider = document.getElementById('yearSlider');
  const yearLabel = document.getElementById('yearLabel');
  const playBtn = document.getElementById('playBtn');

  // ==================== BIG YEAR DISPLAY (near tick) ====================
  const yearBig = document.getElementById('year-big');

  // Make the info box draggable so users can put it anywhere (great on iPhone)
  if (yearBig) {
    initDraggableYearBox(yearBig);
  }

  function updateYearDisplay() {
    const yearEl = document.querySelector('#year-big .y-year');
    const totalEl = document.querySelector('#year-big .y-total');

    if (yearEl) yearEl.textContent = currentYear;

    const diseaseToggleContainer = document.querySelector('.disease-toggle');
    if (diseaseToggleContainer) {
      diseaseToggleContainer.classList.toggle('red-off', !currentDisease);
    }

    // Show the cumulative case number for the selected disease
    const diseaseForBox = selectedDisease || currentDisease;
    if (diseaseForBox) {
      const cumulative = getCumulativeData(currentYear);
      const total = Object.values(cumulative).reduce((sum, val) => sum + val, 0);

      const numberEl = totalEl ? totalEl.querySelector('.y-total-number') : null;
      const labelEl = totalEl ? totalEl.querySelector('.y-total-label') : null;

      if (numberEl) numberEl.textContent = total.toLocaleString();
      if (labelEl) labelEl.textContent = 'cases';
    } else {
      const numberEl = totalEl ? totalEl.querySelector('.y-total-number') : null;
      const labelEl = totalEl ? totalEl.querySelector('.y-total-label') : null;
      if (numberEl) numberEl.textContent = '—';
      if (labelEl) labelEl.textContent = '';
    }
  }

  // Year + red only. Purple blob is driven separately (see play/slider below).
  function setCurrentYear(year) {
    currentYear = year;

    if (slider) slider.value = currentYear;
    if (yearLabel) yearLabel.textContent = currentYear;

    updateYearDisplay();
    updateHeatmap();
  }

  // Note: Purple (tick density) is now always active and driven exclusively
  // by year changes via direct calls to updateTickPopulationLayer().


  // Initial sync
  setCurrentYear(currentYear);

  updateRedLegendText();

  // Slider
  slider.oninput = () => {
    const newYear = parseInt(slider.value);
    setCurrentYear(newYear);

    // Extra map wake-up when only purple is active
    if (map && !currentDisease) map.invalidateSize();

    // Purple blob is driven ONLY by the year — completely independent of disease toggles.
    updateTickPopulationLayer(); // async, fire-and-forget is fine
  };

  // Disease selector using custom buttons - robust on iOS Safari
  let isTouchHandling = false;

  document.querySelectorAll('.disease-option').forEach(option => {
    const value = option.dataset.value;

    const toggleDisease = (e) => {
      if (isTouchHandling && e.type === 'click') return;

      if (selectedDisease === value) {
        // Tapped the already selected pill → toggle only the red dots (keep the number in the box)
        if (currentDisease === value) {
          currentDisease = null;
          option.classList.remove('active');
        } else {
          currentDisease = value;
          option.classList.add('active');
        }
      } else {
        // Switched to the other disease
        selectedDisease = value;
        currentDisease = value;
        document.querySelectorAll('.disease-option').forEach(o => o.classList.remove('active'));
        option.classList.add('active');
      }

      updateHeatmap();
      updateYearDisplay();
      updateRedLegendText();
      // Purple blob has ZERO connection to disease toggles.
      // It is driven exclusively by year changes (slider + play).
    };

    option.addEventListener('click', toggleDisease);

    option.addEventListener('touchend', (e) => {
      isTouchHandling = true;
      toggleDisease(e);
      setTimeout(() => { isTouchHandling = false; }, 350);
    }, { passive: true });
  });

  // Set initial active state
  const initialAlpha = document.querySelector('.disease-option[data-value="alpha"]');
  if (initialAlpha) initialAlpha.classList.add('active');
  selectedDisease = 'alpha';
  currentDisease = 'alpha';

  // Tick Density layer is now always visible and updates with the year slider/play (no toggle)

  // Play / Pause
  playBtn.onclick = function() {
    if (!isPlaying) {
      isPlaying = true;
      this.innerHTML = '⏸';
      playInterval = setInterval(() => {
        let nextYear = currentYear + 1;
        if (nextYear > 2025) nextYear = 2010;
        setCurrentYear(nextYear);

        // Extra map wake-up when only purple is active (helps heat canvas repaint)
        if (map && !currentDisease) map.invalidateSize();

        // Purple blob is driven ONLY by the year — completely independent of disease toggles.
        updateTickPopulationLayer(); // async, non-blocking
      }, 800);
    } else {
      isPlaying = false;
      this.innerHTML = '▶';
      clearInterval(playInterval);
    }
  };

  // Debug note
  console.log('%c[This Tics Me Off] Big year display added (fixed at 75% left, 40px font, matches tick label).', 'color:#0f0');
});
