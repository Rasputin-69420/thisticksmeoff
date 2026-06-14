# Red Layer: Human Tick-Borne Disease Cases (Lyme + Alpha-gal)

This README covers the data used for the red heatmap layer, which visualizes reported and estimated human cases of Lyme disease and Alpha-gal Syndrome.

## Purpose in the Visualization
The red layer represents the **lagging indicator** — where human disease has been recorded. It is intentionally shown alongside the purple layer (current tick habitat) to highlight the mismatch between where ticks are established and where human illness has been documented.

## Data Sources

### Lyme Disease (Human Cases)
- **Primary**: CDC National Notifiable Diseases Surveillance System (NNDSS)
- `lyme_2023_state_cases.csv` — Official 2023 state-level counts (used as anchor for recent years).
- `CDC_Lyme_County_Cases_2001-2023.csv` — County-level Lyme case counts with historical columns.
- `lyme_national_yearly_cases.csv` — National yearly totals 1996–2023.
- `lyme_ma_historical.csv` — Massachusetts-specific historical data with surveillance notes.
- `nantucket_lyme_cases_2000_2020.csv` — Granular historical data for Nantucket (historic epicenter).

Additional context from:
- CDC MMWR reports (including the 2022 case definition revision)
- Massachusetts DPH annual surveillance reports
- Johns Hopkins Lyme Tracker
- Peer-reviewed literature (e.g., Mead et al. 2024, Kugeler et al. 2021)

### Alpha-gal Syndrome (Human Cases)
- `alpha_gal_syndrome_suspected_cases.csv` — Yearly suspected cases 2017–2022 (primarily from Eurofins Viracor lab data via CDC MMWR 2023).
- Earlier aggregates (2010–2016) from CDC summaries.

## Current Data Structure Used in Visualization
- State-level yearly snapshots for 10 high-incidence states.
- Years modeled: 2010, 2014, 2018, 2021, 2023, 2024, 2025.

## May 2026 Data Additions (cdc_direct_downloads_2026)
New high-value direct downloads tracked:
- `LD_Case_Counts_by_County_2023_updated.csv` — Exact 2023 county Lyme numbers (ready for future county choropleth/heat layer).
- Full 2008–2023 state incidence CSV for trend validation.
- Multi-disease county Excel (2019–2022) covering Lyme + other TBDs.

These are now listed in the Sources modal under "CDC Direct Data Downloads (2025–2026 Updates)". Pipeline work to ingest the county CSV for a real county-level red layer is the next major step.
- The map shows **cumulative cases from 2010 onward**.
- Dot size in recent versions is driven by **growth since 2010** (current cumulative minus 2010 baseline), not raw totals.

## Major Limitations and Weaknesses

**Severe Underreporting**
- Reported Lyme cases significantly undercount true incidence. Multiple studies and CDC analyses suggest actual infections may be 10x or higher than reported numbers.
- Alpha-gal is not nationally notifiable in most states. Data is heavily skewed toward one commercial lab.

**Surveillance and Reporting Bias**
- Passive surveillance system (depends on healthcare providers reporting).
- Case definition changes (especially the 2022 revision) create artificial jumps in reported numbers that do not reflect true changes in incidence.
- Testing access, doctor awareness, and reporting practices vary dramatically by state and over time.
- Cases are recorded by patient residence, not location of tick exposure.

**Alpha-gal Specific Issues**
- Data represents lab-positive suspected cases, not necessarily clinically confirmed disease.
- One lab (Viracor) dominates the published national picture for many years.
- Geographic data reflects where testing occurred more than true incidence in some cases.

**Implications for Interpretation**
- The red layer is best viewed as a **lagging and imperfect signal** of where tick-borne disease burden has been documented.
- Absence of red dots does not mean absence of ticks or risk.
- Growth over time in the red layer is more meaningful than absolute numbers.

## Strengths of This Dataset
- Uses the best publicly structured sources available (CDC state and county data).
- Multi-decade coverage allows visualization of long-term trends and expansion.
- Transparent documentation of limitations (this file + original database summary).

## Files in This Folder Related to Human Cases
- `CDC_Lyme_County_Cases_2001-2023.csv`
- `lyme_2023_state_cases.csv` (and cleaned variants)
- `lyme_national_yearly_cases.csv` (and cleaned variant)
- `lyme_ma_historical.csv`
- `nantucket_lyme_cases_2000_2020.csv`
- `alpha_gal_syndrome_suspected_cases.csv`
- `lyme_ags_full_data.json` (combined internal format)

## Additional Recommended Public Sources
- Full CDC county-level historical CSVs (when available)
- State health department raw surveillance data (when released)
- Claims data studies (e.g., Kugeler et al. 2021 estimating true incidence)

---

**Note**: This data is useful for spotting broad patterns and relative changes but should not be treated as precise incidence or risk measurements. Actual infections greatly exceed reported numbers.