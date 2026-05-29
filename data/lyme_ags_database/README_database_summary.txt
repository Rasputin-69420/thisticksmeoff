Lyme Disease and Alpha-Gal Syndrome (AGS) Compiled Database - US Focus, Emphasis on New England/Appalachian (e.g. MA, WV, Nantucket)

Sources: Primarily CDC (NNDSS surveillance data, MMWR reports, county CSVs), Massachusetts DPH, Johns Hopkins Lyme Tracker references, peer-reviewed (e.g. MMWR 2023 on AGS, various MMWR on Lyme), secondary like tickcheck.com for Nantucket granular. Data as of ~2025-2026 publications. Note: Reported cases undercount true incidence significantly (est. 10x or more for Lyme; AGS not notifiable).

KEY TOTALS:
- Lyme reported cases: ~844,000+ from 1982-2022 (per literature); +89,468 in 2023 = ~933k+ cumulative reported. Actual new diagnoses/treatments est. ~476,000 per year recently (CDC claims data analysis); cumulative affected in millions including chronic.
- AGS: >110,000 suspected cases identified 2010-2022 via lab testing (one major lab); est. up to 450,000 people affected nationwide. Positivity ~30% among tested. Rising trend until 2022.

GEOGRAPHICAL SPREAD & FOCUS AREAS:
- Lyme: Endemic core Northeast (NY, PA, CT, MA, NJ, ME, NH, VT, RI), Upper Midwest (WI, MN). Expanding: high in WV (3,242 cases 2023, notable for Appalachian), PA/NY highest volume. Since 1995, significant westward/southward expansion per CDC maps (county dot maps show spread). ~90% cases from 15 high-incidence jurisdictions historically. County-level data available (e.g. 2023 CDC CSV with 2001-2023 per county; 1,000s of counties affected cumulatively).
- Nantucket, MA: Historic epicenter ("Nantucket fever"); 723 confirmed cases 2000-2020 (avg ~34/yr); 15% lifetime prevalence (2001 study). High tick infection rates. Recent MA reports combine with Dukes (low absolute due to pop ~14k).
- MA overall: High incidence state (3rd or so nationally); 2023: 9,715 cases (~139/100k est.); recent years ~8-9k under new criteria. Cape Cod/Barnstable, Berkshire high rates. Surveillance changes (intensive follow-up abandoned ~2016-2021 causing drop; new lab criteria 2022+ rebound).
- Appalachian e.g. WV: Emerging/high 2023 (top 5 states); part of expanding range.
- AGS: Primarily southern/midwestern/mid-Atlantic (lone star tick Amblyomma americanum range: AR, OK, MO, KY, VA, etc. high); some NE spillover (e.g. Suffolk NY high absolute). Not Lyme (blacklegged tick).

DATA FILES IN THIS DATABASE (singular compiled resource):
1. lyme_national_yearly_cases.csv : US total reported cases 1996-2023 + notes on pre-1996/cumulative/actual estimates.
2. lyme_2023_state_cases.csv : Full state/locality breakdown for most recent year (top: NY 22k, PA 16.7k, MA 9.7k, WI 6.3k, WV 3.2k).
3. lyme_ma_historical.csv : MA statewide 2015-2026 YTD with surveillance notes (pre-2015 ~4k+, dip, rebound ~9k).
4. nantucket_lyme_cases_2000_2020.csv : Granular county-level historical for epicenter.
5. alpha_gal_syndrome_suspected_cases.csv : Yearly positives 2017-2022 + totals, demo/geo summary, estimates.

ADDITIONAL RESOURCES (user should download for full granularity):
- CDC Lyme county 2023 (and historical columns): https://www.cdc.gov/lyme/media/files/2025/02/LD_Case_Counts_by_County_2023_updated.csv (has 2001-2023 per county!)
- CDC state/year tables and maps: https://www.cdc.gov/lyme/data-research/facts-stats/surveillance-data-1.html and case-map.html (dot maps 1995/2010/2023 showing spread).
- MA DPH annual reports: https://www.mass.gov/lists/tick-borne-disease-surveillance-summaries-and-data (county possible in full DOCX).
- Johns Hopkins Lyme Tracker: https://www.hopkinslymetracker.org/ (interactive county maps, data explorer, download).
- AGS MMWR: https://www.cdc.gov/mmwr/volumes/72/wr/mm7230a2.htm (county-level suspected rates map 2017-2022).
- CDC WONDER NNDSS for custom queries.

LIMITATIONS & NOTES:
- Lyme reporting: Passive surveillance; changes in case defs (2022 revision increased counts ~1.7x); underreporting high (esp. early/mild); residence not exposure site; COVID impacted 2020-21.
- AGS: Lab-based suspected only (no national surveillance pre some states); one lab dominant; clinical confirmation lacking in data; expanding with tick range (climate/deer factors).
- Granular (zip/county over time): Partial; best for recent Lyme county (CDC file), AGS county rates in MMWR, MA limited. No full zip historical public.
- Focus areas prioritized: New England (MA detailed + Nantucket), Appalachian (WV highlighted in 2023 data).

VISUALIZATIONS & MAPS:
- CDC provides excellent time-point maps (1995: limited NE; 2010: broader; 2023: widespread NE/Midwest + emerging elsewhere) - one dot/county/case. Downloadable.
- For cumulative growth: See national yearly CSV (steady rise with jumps post-changes); geographical: expansion from CT/MA/NY core outward.
- Suggested: Use CDC county CSV + GIS software (QGIS/ArcGIS) or JHU explorer for custom cumulative/animated maps. Python (pandas here) for analysis.
- Example plots generated if possible (see artifacts for any PNGs).

This singular database aggregates max publicly extractable data from searches/browses. For full raw, download linked CSVs. Actual infections >> reported. Prevention key: tick checks, repellents, especially in endemic/expanding areas like New England, WV, etc.

Compiled May 2026 by Grok/xAI analysis of CDC, state, JHU sources.