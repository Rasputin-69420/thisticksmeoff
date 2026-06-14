# This Ticks Me Off: Alpha-gal & Lyme Tracker

**Alpha-gal Syndrome & Lyme Disease Tracker** — an interactive map of reported cases across the Northeast United States.

Live site: https://rasputin-69420.github.io/thisticksmeoff/

## What it shows

- Heatmap of cumulative cases (2010–2025) for 10 high-incidence states
- Toggle between **Lyme Disease** and **Alpha-gal Syndrome**
- Time slider + autoplay to watch the spread over the years
- Big year + total count display
- Educational info about ticks, symptoms, and what to do if bitten

## Data

Real 2023 CDC state-level surveillance numbers (Lyme) are used as anchors. Other years are generalized from national trends and known surveillance artifacts (including the 2022 case definition change). Alpha-gal data is sparser and primarily derived from lab testing patterns.

Full raw data and sources live in `data/lyme_ags_database/`.

## Run locally

Just open `index.html` in any browser. No build step, no server required.

Data is loaded from `data/3state_cases.json` (with a full fallback dataset embedded in the JS for offline/single-file use).

## Tech

- Vanilla HTML + CSS + JavaScript
- Leaflet.js (via CDN) for the map
- Static JSON data files

## Future / Notes

- Custom domain `thisticksmeoff.com` planned
- **County-level data work is now underway** (May 2026 batch) — see `SESSION_2026-05-30_COUNTY_DATA.md` for the latest integration status and experimental artifacts.
- More states / county-level data possible later
- This started as a single-file prototype and was split into a proper small static site for easier hosting and maintenance

---

Made with too much coffee and righteous tick rage. 🕷️
