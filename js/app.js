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
  "Massachusetts": [42.41, -71.38],
  "Connecticut": [41.60, -72.74],
  "Pennsylvania": [40.99, -77.73],
  "New York": [42.95, -75.50],
  "New Jersey": [40.25, -74.65],
  "Maine": [45.30, -69.10],
  "New Hampshire": [43.45, -71.60],
  "Vermont": [44.05, -72.70],
  "Rhode Island": [41.68, -71.55],
  "West Virginia": [38.92, -80.50]
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

let currentDisease = "alpha";
let currentYear = 2025;
let map = L.map('map').setView([42.2, -74.5], 5.3); // Wider Northeast view for expanded regional data (ME to WV + NY/NJ)
let markers = [];
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

  const cumulativeData = getCumulativeData(currentYear);
  const diseaseName = currentDisease === 'lyme' ? 'Lyme Disease' : 'Alpha-gal Syndrome';

  for (let state in cumulativeData) {
    if (stateCoords[state]) {
      const value = cumulativeData[state];
      const color = getHeatColor(value);
      const radius = Math.max(10, Math.min(22, Math.sqrt(value) / 3)); // responsive radius

      const circle = L.circleMarker(stateCoords[state], {
        radius: radius,
        fillColor: color,
        color: "#444",
        weight: 1.5,
        fillOpacity: 0.9
      }).addTo(map);

      // Popup on click/tap (works great on both desktop and mobile)
      const popupHtml = `
        <strong>${currentYear} • ${diseaseName}</strong><br>
        <strong>${state}</strong>: ${value.toLocaleString()} cases<br>
        <small>(cumulative since 2010)</small>
      `;
      circle.bindPopup(popupHtml, {
        closeButton: true,
        offset: [0, -4]
      });

      // Nice hover tooltip on desktop (no action needed on phone)
      circle.bindTooltip(`${value.toLocaleString()}`, {
        permanent: false,
        direction: 'top',
        offset: [0, -8],
        opacity: 0.9
      });

      markers.push(circle);
    }
  }
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
      <strong>Regional case data (expanded):</strong> 10 high-incidence states (NY, PA, MA, NJ, CT, WV, ME, RI, NH, VT) using real 2023 CDC state counts (lyme_2023_state_cases.csv) as anchors. Historical years generalized from national trends + known surveillance artifacts (2022 case definition change, MA reporting changes). See README in <code>data/lyme_ags_database/</code> for full notes and limitations.
    </div>`;
  }

  body.innerHTML = html;
}

function hideModal() {
  document.getElementById('modal').style.display = 'none';
}

// ==================== CUTE "CLICK THE TICK" MENU (floating lower-right) ====================

function toggleTickMenu(e) {
  if (e) e.stopPropagation();
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

    const diseaseName = currentDisease === 'alpha' ? 'Alpha-Gal' : 'Lyme Disease';
    if (diseaseEl) diseaseEl.textContent = diseaseName;

    // Sum all states for the current cumulative year + disease
    const cumulative = getCumulativeData(currentYear);
    const total = Object.values(cumulative).reduce((sum, val) => sum + val, 0);
    if (totalEl) totalEl.textContent = total.toLocaleString();
  }

  // Initial sync for the big year box
  updateYearDisplay();

  // Slider
  slider.oninput = () => {
    currentYear = parseInt(slider.value);
    updateYearDisplay();
    updateHeatmap();
  };

  // Disease toggle
  document.querySelectorAll('input[name="disease"]').forEach(radio => {
    radio.onchange = () => {
      currentDisease = radio.value;
      updateHeatmap();
      // year doesn't change on disease switch, but keep in sync just in case
      updateYearDisplay();
    };
  });

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
