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
const FALLBACK_DATA = {
  "lyme": {
    "2010": { "Massachusetts": 6500, "Connecticut": 4200, "Pennsylvania": 3100, "New York": 9200, "New Jersey": 2800, "Maine": 1100, "New Hampshire": 650, "Vermont": 550, "Rhode Island": 1050, "West Virginia": 850 },
    "2014": { "Massachusetts": 7200, "Connecticut": 4800, "Pennsylvania": 3900, "New York": 10500, "New Jersey": 3400, "Maine": 1400, "New Hampshire": 800, "Vermont": 720, "Rhode Island": 1300, "West Virginia": 1100 },
    "2018": { "Massachusetts": 8100, "Connecticut": 5500, "Pennsylvania": 4800, "New York": 13200, "New Jersey": 4200, "Maine": 1800, "New Hampshire": 950, "Vermont": 880, "Rhode Island": 1600, "West Virginia": 1500 },
    "2021": { "Massachusetts": 8900, "Connecticut": 6100, "Pennsylvania": 5700, "New York": 15800, "New Jersey": 5100, "Maine": 2200, "New Hampshire": 1150, "Vermont": 1050, "Rhode Island": 2000, "West Virginia": 1900 },
    "2023": { "Massachusetts": 9715, "Connecticut": 3239, "Pennsylvania": 16671, "New York": 22173, "New Jersey": 7224, "Maine": 2942, "New Hampshire": 1573, "Vermont": 1445, "Rhode Island": 2852, "West Virginia": 3242 },
    "2024": { "Massachusetts": 8840, "Connecticut": 3400, "Pennsylvania": 17200, "New York": 22500, "New Jersey": 7400, "Maine": 3100, "New Hampshire": 1650, "Vermont": 1500, "Rhode Island": 2900, "West Virginia": 3400 },
    "2025": { "Massachusetts": 8619, "Connecticut": 3600, "Pennsylvania": 17800, "New York": 22800, "New Jersey": 7600, "Maine": 3200, "New Hampshire": 1700, "Vermont": 1550, "Rhode Island": 2950, "West Virginia": 3550 }
  },
  "alpha": {
    "2010": { "Massachusetts": 120, "Connecticut": 80, "Pennsylvania": 60, "New York": 90, "New Jersey": 50, "Maine": 15, "New Hampshire": 12, "Vermont": 10, "Rhode Island": 18, "West Virginia": 25 },
    "2014": { "Massachusetts": 280, "Connecticut": 190, "Pennsylvania": 140, "New York": 220, "New Jersey": 120, "Maine": 35, "New Hampshire": 28, "Vermont": 22, "Rhode Island": 40, "West Virginia": 55 },
    "2018": { "Massachusetts": 520, "Connecticut": 380, "Pennsylvania": 290, "New York": 480, "New Jersey": 260, "Maine": 70, "New Hampshire": 55, "Vermont": 45, "Rhode Island": 85, "West Virginia": 110 },
    "2021": { "Massachusetts": 890, "Connecticut": 650, "Pennsylvania": 510, "New York": 820, "New Jersey": 450, "Maine": 110, "New Hampshire": 85, "Vermont": 70, "Rhode Island": 140, "West Virginia": 180 },
    "2023": { "Massachusetts": 1450, "Connecticut": 1100, "Pennsylvania": 920, "New York": 1350, "New Jersey": 780, "Maine": 160, "New Hampshire": 120, "Vermont": 95, "Rhode Island": 210, "West Virginia": 260 },
    "2024": { "Massachusetts": 1890, "Connecticut": 1450, "Pennsylvania": 1280, "New York": 1720, "New Jersey": 980, "Maine": 190, "New Hampshire": 145, "Vermont": 115, "Rhode Island": 260, "West Virginia": 310 },
    "2025": { "Massachusetts": 2100, "Connecticut": 1680, "Pennsylvania": 1520, "New York": 1900, "New Jersey": 1100, "Maine": 210, "New Hampshire": 160, "Vermont": 125, "Rhode Island": 290, "West Virginia": 340 }
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
  "Louisiana": [31.00, -92.00]
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

// Verified Lone Star tick population (2025 snapshot)
// Values = % of counties in the state with established populations
// Expanded beyond original human case region for predictive value.
// Source: CDC Lone Star Tick Surveillance data (2025)
const loneStarPresence = {
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

let currentDisease = "alpha";
let currentYear = 2025;
let map = L.map('map').setView([42.2, -74.5], 5.3); // Wider Northeast view for expanded regional data (ME to WV + NY/NJ)
let markers = [];                    // human case circles (red)
let isPlaying = false;
let playInterval = null;

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

  // Respect the "Show Cases" toggle (much more reliable on mobile than clicking radios)
  const showCasesToggle = document.getElementById('showCasesToggle');
  if (!showCasesToggle || !showCasesToggle.checked || !currentDisease) {
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
      if (currentYear === 2010) {
        // At t0 (2010), show small baseline dots
        radius = 7;
      } else {
        // Size dots based on growth since 2010 (final - initial)
        radius = Math.max(8, Math.min(26, Math.sqrt(growth) / 2.8));
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

function updateTickPopulationLayer() {
  console.log('[Tick Density] updateTickPopulationLayer() called');

  // Remove previous heatmap if it exists
  if (purpleHeatLayer) {
    map.removeLayer(purpleHeatLayer);
    purpleHeatLayer = null;
  }

  const toggle = document.getElementById('tickPopulationToggle');
  if (!toggle || !toggle.checked) {
    console.log('[Tick Density] Toggle is off or not found');
    return;
  }

  // Build points for the heatmap: [lat, lng, intensity]
  // Using established county counts per state + jitter to create a natural density blob
  const heatPoints = [];

  // Approximate intensity weights based on established county counts (2025 CDC data)
  const establishedCounts = {
    "Texas": 118, "Kentucky": 86, "Arkansas": 73, "Virginia": 70, "Oklahoma": 69,
    "Illinois": 68, "Missouri": 63, "Georgia": 60, "Mississippi": 58, "Indiana": 49,
    "Florida": 48, "North Carolina": 48, "Tennessee": 45, "Alabama": 42,
    "Pennsylvania": 8, "New Jersey": 14, "New York": 19, "West Virginia": 13,
    "Maryland": 18, "Delaware": 2, "South Carolina": 25, "Ohio": 19,
    "Connecticut": 5, "Massachusetts": 3, "Rhode Island": 2,
    "Kansas": 32, "Louisiana": 19
  };

  // Use existing stateCoords where available, with added jitter for blob effect
  Object.keys(establishedCounts).forEach(state => {
    const count = establishedCounts[state];
    if (!stateCoords[state] || count < 1) return;

    const [baseLat, baseLng] = stateCoords[state];
    const intensity = Math.min(1.0, count / 80); // Normalize intensity

    // Create multiple points with jitter to simulate density blob
    const numPoints = Math.max(5, Math.floor(count / 5));
    for (let i = 0; i < numPoints; i++) {
      const latJitter = (Math.random() - 0.5) * 2.1;
      const lngJitter = (Math.random() - 0.5) * 2.5;
      // Even stronger intensity for more pronounced blobs
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
  purpleHeatLayer = L.heatLayer(heatPoints, {
    radius: 48,
    blur: 11,
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

  // Mobile Safari fix: force map to recalculate size after adding canvas layer
  setTimeout(() => {
    if (map) map.invalidateSize();
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
    html = `<h3>Data Sources</h3>
    <div style="font-size: 15px; line-height: 1.45;">
      <strong>Primary sources (from lyme_ags_sources.json):</strong><br><br>
      <strong>CDC Lyme:</strong> NNDSS surveillance data, case maps, MMWR reports (2022 revision).<br>
      <strong>CDC Alpha-gal:</strong> MMWR 2023 (Eurofins Viracor lab data 2017-2022), national estimates.<br>
      <strong>Massachusetts DPH:</strong> Annual tick-borne disease surveillance reports (2015–2026 YTD).<br>
      <strong>Johns Hopkins Lyme Tracker:</strong> County-level interactive maps and data explorer.<br>
      <strong>Other:</strong> Nantucket historical studies, literature (e.g. Phillips 2001, Mead 2024), ArcGIS county maps.<br><br>

      <strong>Verified Tick Population (Purple Density Layer):</strong><br>
      <strong>CDC Lone Star Tick Surveillance (2025):</strong> County-level data on established populations of <em>Amblyomma americanum</em> (Lone Star tick). Used to generate the purple density "blob" showing current tick habitat intensity and spread (1,139+ counties with established populations). File archived as <code>2025_lone_star_tick_established_counties.xlsx</code>.<br><br>

      <strong>Regional case data (expanded):</strong> 10 high-incidence states (NY, PA, MA, NJ, CT, WV, ME, RI, NH, VT) using real 2023 CDC state counts (lyme_2023_state_cases.csv) as anchors. Historical years generalized from national trends + known surveillance artifacts (2022 case definition change, MA reporting changes). See README in <code>data/lyme_ags_database/</code> for full notes and limitations.
    </div>`;
  }

  body.innerHTML = html;
}

function hideModal() {
  document.getElementById('modal').style.display = 'none';
}

function updateRedLegendText() {
  const legendText = document.getElementById('redLegendText');
  if (!legendText) return;

  const showCasesToggle = document.getElementById('showCasesToggle');
  const casesVisible = showCasesToggle && showCasesToggle.checked && currentDisease;

  if (!casesVisible) {
    legendText.textContent = 'Cases (off)';
    return;
  }

  if (currentDisease === 'lyme') {
    legendText.textContent = 'Cases of Lyme';
  } else {
    legendText.textContent = 'Cases of Alpha-gal';
  }
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
loadData().then(() => {
  // Initial render
  updateHeatmap();
  updateTickPopulationLayer();

  // Controls
  const slider = document.getElementById('yearSlider');
  const yearLabel = document.getElementById('yearLabel');
  const playBtn = document.getElementById('playBtn');

  // ==================== BIG YEAR DISPLAY (near tick) ====================
  const yearBig = document.getElementById('year-big');

  function updateYearDisplay() {
    const yearEl = document.querySelector('#year-big .y-year');
    const diseaseEl = document.querySelector('#year-big .y-disease');
    const totalEl = document.querySelector('#year-big .y-total');

    if (yearEl) yearEl.textContent = currentYear;

    const showCasesToggleEl = document.getElementById('showCasesToggle');
    const casesVisible = showCasesToggleEl && showCasesToggleEl.checked && currentDisease;

    const diseaseToggleContainer = document.querySelector('.disease-toggle');
    if (diseaseToggleContainer) {
      diseaseToggleContainer.classList.toggle('red-off', !casesVisible);
    }

    if (!casesVisible) {
      // Red human case layer is turned off
      if (diseaseEl) diseaseEl.textContent = 'Tick Data Only';
      if (totalEl) totalEl.textContent = '—';
    } else {
      const diseaseName = currentDisease === 'alpha' ? 'Alpha-Gal' : 'Lyme Disease';
      if (diseaseEl) diseaseEl.textContent = diseaseName;

      // Sum all states for the current cumulative year + disease
      const cumulative = getCumulativeData(currentYear);
      const total = Object.values(cumulative).reduce((sum, val) => sum + val, 0);
      if (totalEl) totalEl.textContent = total.toLocaleString();
    }
  }

  // Initial sync for the big year box
  updateYearDisplay();
  updateRedLegendText();

  // Slider
  slider.oninput = () => {
    currentYear = parseInt(slider.value);
    updateYearDisplay();
    updateHeatmap();
    updateTickPopulationLayer();
  };

  // Reliable "Show Cases" toggle (works well on iOS)
  const showCasesToggle = document.getElementById('showCasesToggle');
  if (showCasesToggle) {
    showCasesToggle.onchange = () => {
      updateHeatmap();
      updateTickPopulationLayer();
      updateYearDisplay();
      updateRedLegendText();
    };
  }

  // Disease type selector (Lyme vs Alpha-gal) - only matters when Show Cases is on
  document.querySelectorAll('input[name="disease"]').forEach(radio => {
    radio.onchange = () => {
      if (radio.checked) {
        currentDisease = radio.value;
        updateHeatmap();
        updateTickPopulationLayer();
        updateYearDisplay();
        updateRedLegendText();
      }
    };
  });

  // Verified Tick Population overlay toggle (purple, independent of disease)
  const tickToggle = document.getElementById('tickPopulationToggle');
  if (tickToggle) {
    tickToggle.onchange = () => {
      updateTickPopulationLayer();
      updateRedLegendText();
      // Extra mobile safety
      setTimeout(() => { if (map) map.invalidateSize(); }, 100);
    };
  }

  // Play / Pause
  playBtn.onclick = function() {
    if (!isPlaying) {
      isPlaying = true;
      this.innerHTML = '⏸ Pause';
      playInterval = setInterval(() => {
        currentYear++;
        if (currentYear > 2025) currentYear = 2010;
        updateYearDisplay();
        updateHeatmap();
        updateTickPopulationLayer();
      }, 800);
    } else {
      isPlaying = false;
      this.innerHTML = '▶ Play';
      clearInterval(playInterval);
    }
  };

  // Debug note
  console.log('%c[This Tics Me Off] Big year display added (fixed at 75% left, 40px font, matches tick label).', 'color:#0f0');
});
