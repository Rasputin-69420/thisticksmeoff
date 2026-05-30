# Data Contributions & Deduplication Log

This project tracks the spread of tick-borne disease (Lyme + Alpha-gal) as a **proxy for expanding tick habitat** over time.

## Current Data Model (as of 2026)

**Structure:**
- State-level yearly snapshots for 10 high-incidence states (MA, CT, PA, NY, NJ, ME, NH, VT, RI, WV)
- Years currently modeled: 2010, 2014, 2018, 2021, 2023, 2024, 2025
- The map always shows **cumulative cases from 2010 → selected year**
- Separate `lyme` and `alpha` datasets

**Key files:**
- `data/3state_cases.json` → The file actually loaded by the website
- `data/lyme_ags_database/` → Raw/source material and documentation

**Important notes on current data:**
- 2023 Lyme numbers come from real CDC state surveillance
- Most other years are estimated/generalized based on trends + known surveillance artifacts (especially the 2022 case definition change)
- Alpha-gal data is much sparser and mostly lab-derived

## Deduplication Rules (when adding new data)

1. **Never double-count** the same case numbers in the same state + year.
2. Prefer **official reported surveillance** (CDC, state DPH) over estimates when both exist.
3. For years we already have, only update if the new source is clearly more accurate/official.
4. Document every new source added (with link + access date).
5. If new data is county-level or more granular, note it — we may want to expand the map later.

## Process for New Data

When new links/sources are provided:

1. Review the source
2. Extract relevant yearly state-level numbers (Lyme and/or Alpha-gal)
3. Cross-reference against existing `3state_cases.json` and the database folder
4. If truly new → integrate into the data structure
5. Update `lyme_ags_sources.json` + this log
6. Test the map

---

## Incoming Data Log

*(New entries will be added here as you send links)*

| Date Received | Source | Type | States/Years | Status | Notes |
|---------------|--------|------|--------------|--------|-------|
| 2026-05 (internal) | Springer et al. (2014) - Spatial distribution of counties with Amblyomma americanum records | Historical tick distribution (county-level, 1898–2012) | Continental US (1,300+ counties) | Added to database (documentation + summaries) | Best public historical county-level Lone Star tick data. Compiled decadal "established/reported" classifications. Full raw table in paper supplement. See lone_star_tick_historical_springer_2014.md. Not yet integrated into visualization (per instructions). |

---

**Goal:** Build the best public, non-alarmist visualization of tick habitat expansion using human disease data as the leading indicator.