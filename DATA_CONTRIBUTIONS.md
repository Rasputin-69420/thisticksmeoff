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
| 2026-05-30 | CDC Direct Downloads batch (8 sources) | County Lyme CSV 2023, State trends 2008-2023, All-TBD county Excel 2019-22, Ixodes County Table 2026 Excel, Lone Star hub, MMWR AGS, Tick Hub, WONDER | All US (county for several) | Metadata integrated into sources UI + additional_sources.json. Provenance JSON saved. | High-value actionable files. County Lyme 2023 CSV + Ixodes 2026 Excel are top priorities for next pipeline county-level heatmap work. Full list now in cdc_direct_downloads_2026 section of lyme_ags_sources.json. |
| 2026-05-30 | Expanded sources batch (11 sources) | 2025 Lone Star (Missouri focus), 2016-2019 TBD Excel, Missouri AGS official + Story Map, NEON abundance + pathogens | Continental US + strong Missouri + ecological sites | Metadata integrated (lyme_ags_sources.json + additional_sources.json). New provenance: cdc_direct_downloads_2026-05-expanded.json. | Excellent for purple layer (Lone Star 2025 + NEON density). Missouri data to counter regional noise. Processed via new ingest workflow. |
| 2026-05-30 | Arkansas-specific sources batch | Arkansas DH Tickborne Dashboard (ArcGIS county data), Arkansas AGS surveillance study (5,167 cases), Official ADH Alpha-gal page | Arkansas (strong county-level 2021–2025) | 3 new unique sources added to lyme_ags_sources.json + additional_sources.json (Lone Star 2025 URL was duplicate of prior batch). | Outstanding county-level multi-disease + AGS granularity for Arkansas. The ArcGIS dashboard is particularly valuable for future state-specific features. |
| 2026-05-30 | Missouri expanded batch | Missouri DHSS Tickborne main page + Show-Me Ticks citizen science study (3,811 ticks, 89% Lone Star) | Missouri (county + abundance data) | 2 new sources added (3 were duplicates from prior Missouri batch). | Strong official Missouri surveillance hub + excellent citizen-science abundance data for purple layer. |
| 2026-05-30 | West Coast batch (CA/OR/WA) | Ixodes pacificus pathogen table, California Story Map, Oregon dashboard, Washington submission dashboard + rare AGS case | Western US (CA/OR/WA focus) | 5 new sources added (1 duplicate filtered: Ixodes pacificus county table). New provenance created. | Excellent for Western blacklegged tick (I. pacificus) data, regional risk differences, and pathogen tables. California Story Map is particularly strong. |
| 2026-05-30 | Infection case data batch | Arkansas AGS mandatory numbers (304/2613/3781), California 2024 Lyme report (96 cases) | US (strong MO/AR + low West Coast contrast) | 2 high-value new entries added (most items already present from prior dumps). Pipeline guidance noted. | Concrete yearly AGS progression in Arkansas and confirmation of very low CA incidence. Reinforces red layer regional story. |
| 2026-05-30 | Disease burden batch | CDC Tick Bite ER Tracker, military AGS seroprevalence (AR 39%, OK 35%, MO 29%), AGS healthcare utilization (>50% anaphylaxis) | National + strong South/Midwest | 3 high-value new sources added (most others redundant). New provenance created. | Excellent real-time burden proxy (ER visits) + seroprevalence + healthcare cost data. Directly supports red layer and "South is not empty" narrative. |
| 2026-05-30 | Texas/Oklahoma/Missouri burden batch | Missouri 2026 ER surge (39→137 per 100k), OK SB 1644 mandatory AGS reporting + 70k-140k estimate, Texas DSHS low Lyme/high expected AGS | TX/OK/MO 2020-2026 | 3 new sources added (CDC Tick Bite Tracker, MO AGS, military seroprevalence already present). New provenance created. | Fresh 2026 ER data + legal mandate in OK + hard Texas infection counts. Strong for red layer burden in South/Midwest and 'Lyme vs AGS' regional story. |
| 2026-05-30 | Texas infection data batch | Texas DSHS detailed zoonotic table (Ehrlichiosis/RMSF numbers), Texas 2026 AGS growing incidence health alert | Texas 2020–2026 | 2 new sources added (MMWR and military seroprevalence were redundant). New provenance created. | Excellent for broadening red layer to Ehrlichia/RMSF and for Texas-specific purple blob popup notes. |
| 2026-05 (internal) | Springer et al. (2014) - Spatial distribution of counties with Amblyomma americanum records | Historical tick distribution (county-level, 1898–2012) | Continental US (1,300+ counties) | Added to database (documentation + summaries) | Best public historical county-level Lone Star tick data. Compiled decadal "established/reported" classifications. Full raw table in paper supplement. See lone_star_tick_historical_springer_2014.md. Not yet integrated into visualization (per instructions). |

---

**Goal:** Build the best public, non-alarmist visualization of tick habitat expansion using human disease data as the leading indicator.