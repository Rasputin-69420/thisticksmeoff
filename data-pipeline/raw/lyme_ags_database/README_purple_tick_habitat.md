# Purple Layer: Verified Tick Population / Lone Star Tick Habitat Density

This README covers the data used for the purple density "blob" layer, which visualizes the current known geographic distribution and intensity of Lone Star tick (*Amblyomma americanum*) populations.

## Purpose in the Visualization
The purple layer represents the **leading/predictive indicator** — where the primary vector for Alpha-gal Syndrome (and other diseases) is currently established. It is shown alongside the red human disease layer to highlight areas where ticks are present but human cases have not yet been widely reported.

## Primary Data Sources

### 1. CDC Lone Star Tick Surveillance (2025)
- **File**: `2025_lone_star_tick_established_counties.xlsx`
- County-level classification of *Amblyomma americanum* as "Established" or not, using CDC criteria (≥6 ticks of one life stage or multiple life stages collected in a 12-month period).
- Covers the continental United States as of 2025 surveillance data.
- This is the main source for the current purple density visualization.

### 2. Springer et al. (2014) Historical Compilation
- Paper: "Spatial distribution of counties in the continental United States with records of occurrence of *Amblyomma americanum*"
- Time period: 1898–2012
- Compiled 18,121 collection records from literature and major databases (USNTC, NVSL, VectorMap).
- Counties classified as "established" or "reported" using criteria similar (but not identical) to modern CDC methods.
- Includes decadal and cumulative maps.
- **See**: `lone_star_tick_historical_springer_2014.md` and `Springer_2014_A_americanum_county_distribution.pdf` for full details.

## Value of This Data

**Strengths**:
- Direct measurement of the vector (the tick itself) rather than relying solely on human disease as a proxy.
- The 2025 CDC file provides the most current official county-level "established" status using consistent modern surveillance criteria.
- The Springer compilation provides the best publicly available historical county-level perspective on Lone Star tick distribution over more than a century.
- "Established" status is a meaningful threshold indicating successful reproduction and colonization, not just occasional reports.
- County-level resolution allows for meaningful density-style visualizations (the current purple blob).

**Use for Tracking Habitat Spread**:
- The combination of historical (Springer) and current (CDC 2025) data offers the strongest publicly available signal of how the Lone Star tick's range has changed over time.
- This is significantly more direct than using human Alpha-gal cases alone as a proxy for tick expansion.

## Weaknesses and Limitations

**Major Limitations of the 2025 CDC Data**:
- Single-year snapshot (2025). No built-in time series.
- Surveillance effort is uneven across the country. Areas with more sampling appear to have more established populations.
- "Established" status, once assigned, generally remains in subsequent updates (conservative but can mask local population changes).
- Does not measure tick abundance or density — only presence at the defined threshold.

**Major Limitations of the Springer Historical Data**:
- Convenience sampling (not systematic surveillance). Many records are byproducts of studies targeting other ticks or hosts.
- The paper itself notes that maps may reflect collection effort more than true distribution in some areas.
- "Established" status is permanent once assigned in their classification scheme for the purpose of the cumulative maps.
- Data ends in 2012. There is a gap between 2012 and the 2025 CDC snapshot.
- Full raw per-county historical table exists only in the paper's supplement and is not yet fully parsed into a clean machine-readable time-series format for this project.

**General Limitations**:
- No county-level abundance or density estimates — only binary-ish "established" classifications.
- Merging historical and modern datasets requires judgment because collection methods and criteria have evolved.
- The purple layer currently represents **known habitat as of the latest available data**, not a perfect real-time or perfectly historical picture.

## Current Status in the Visualization (as of latest version)

- The purple layer is a **static density field** based primarily on the 2025 CDC established counties.
- It is intentionally **not** tied to the year slider because the underlying data is not a clean time series.
- Historical context from the Springer paper is documented here.

## Springer et al. (2014) Data Integration Status

The following structured files derived from the Springer paper have been added to this database:

- `lone_star_tick_historical_springer_2014.md` — Full assessment of value and limitations
- `lone_star_tick_springer_records_by_decade.csv` — Summary of collection records by decade
- `lone_star_tick_established_by_decade.csv` — Estimated number of established counties by decade (derived from paper)

These files provide the foundation for eventually adding a time dimension to the purple blob (e.g., showing habitat expansion from the 1950s through 2012, then connecting to the 2025 CDC snapshot). Full county-level per-decade "established" status would require processing the paper's supplementary table.

## Recommendations for Future Use

- The Springer data is the best available public resource for adding a time dimension. Priority should be given to extracting/parsing the supplement table to create a county-level "established by decade" dataset.
- Once processed, this can enable animated or slider-driven versions of the purple blob showing expansion over time.
- Future CDC surveillance releases should be monitored for updated snapshots to keep the "current" layer fresh.

## Files in This Folder Related to Tick Habitat

- `2025_lone_star_tick_established_counties.xlsx` (primary current source)
- `Springer_2014_A_americanum_county_distribution.pdf`
- `lone_star_tick_historical_springer_2014.md` (detailed assessment of historical data)
- `lone_star_tick_springer_records_by_decade.csv` (summary table)
- `lone_star_tick_established_by_decade.csv` (structured starting point for time-dynamic purple layer)

---

**Note to users**: The purple layer is one of the better publicly available representations of current Lone Star tick habitat, but it is still an imperfect proxy. Absence of purple does not guarantee absence of ticks, and presence does not guarantee high risk. It is best used alongside the red human disease layer to understand both current habitat and documented impact.