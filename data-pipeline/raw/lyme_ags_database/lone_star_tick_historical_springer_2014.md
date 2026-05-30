# Lone Star Tick (Amblyomma americanum) Historical County-Level Data

## Source
Springer YP, Eisen L, Beati L, James AM, Eisen RJ. Spatial distribution of counties in the continental United States with records of occurrence of Amblyomma americanum (Ixodida: Ixodidae). J Med Entomol. 2014 Mar;51(2):342-51.

Paper: https://academic.oup.com/jme/article/51/2/342/882013
Free PDF (CDC Stacks): https://stacks.cdc.gov/view/cdc/36293/cdc_36293_DS1.pdf
PMC: https://pmc.ncbi.nlm.nih.gov/articles/PMC4623429/

## Key Details from the Paper
- Compiled 18,121 usable collection records from 1898 to 2012.
- Records from published literature + three major databases (USNTC, NVSL, VectorMap).
- Counties classified as:
  - **Established**: ≥6 ticks or ≥2 life stages collected in a county during a specific time period.
  - **Reported**: <6 ticks of a single life stage or number not specified.
- Classification done per collection year where possible, then aggregated to decadal and cumulative scales.
- Once a county was classified as established in a given decade, it retained "established" status in all subsequent decades (conservative assumption).
- Data covers 1,300 counties across 39 states + DC.

## Summary Statistics (from paper)

### Counties with Established Populations (as of ~2012 cumulative)
- 653 counties classified as established.
- Heavily concentrated in:
  - Southeast (38% of established counties)
  - South-Central (31%)
  - Also present in Midwest (15%) and along the eastern seaboard (12% in Lower Northeast + Mid-Atlantic).

### Spatiotemporal Patterns
- Strong increase in records after the 1940s.
- Marked northward expansion visible in later decades (1990s–2000s), especially in the Upper Midwest and Lower Northeast.
- Literature records show relatively even spatiotemporal coverage compared to some database sources.

## Limitations (directly from paper and analysis)
- Convenience sampling, not systematic surveillance → distribution maps may reflect collection effort more than true abundance in some areas.
- "Established" status is conservative and permanent once assigned in their scheme.
- No county-level abundance/density data, only presence + basic establishment criteria.
- The full per-county, per-year (or per-decade) classification table is in "Supp Table 1 (online only)" associated with the paper.

## Recommended Use for This Project
- Provides the best publicly available historical county-level baseline for Lone Star tick distribution up to 2012.
- Can be used to create a time-dynamic version of the purple "Verified Tick Population" layer (e.g., showing expansion from the 1950s–2010s).
- Complements the 2025 CDC surveillance file (which uses similar but not identical "established" criteria and brings the data forward to 2025).
- For maximum accuracy, the raw Supp Table 1 from the paper should be processed into a machine-readable format (county FIPS + decade + status).

## Files in This Database Related to This Source
- Springer_2014_A_americanum_county_distribution.pdf (author manuscript)

## Next Steps (for when ready)
- Locate and parse Supp Table 1 from the paper (available via journal supplemental materials on BioOne, Oxford, or PMC).
- Create a clean CSV: County, State, FIPS, Decade, Status (Established/ Reported), Source_Notes.
- Merge with the 2025 CDC file to create a longitudinal dataset.

Compiled for the This Tics Me Off project database.
