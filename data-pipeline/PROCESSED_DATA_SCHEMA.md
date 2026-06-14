# Processed Data Layer Schema

## Overview
This document defines the canonical schema for the **processed** data layer. All new data should eventually flow through this structure before being used to generate the files consumed by the website.

## Core Principles
- One row = one state + one year + one disease
- All values are **reported** (not estimated) when possible
- Every row must have source attribution
- The schema must support future expansion (new states, county-level data, etc.)

## Schema: state_yearly_cases

| Column                  | Type     | Required | Description                                                                 | Example          |
|-------------------------|----------|----------|-----------------------------------------------------------------------------|------------------|
| disease                 | string   | Yes      | Either "lyme" or "alpha"                                                    | "lyme"           |
| year                    | integer  | Yes      | Year of the data                                                            | 2023             |
| state                   | string   | Yes      | Full state name (use consistent naming)                                     | "Massachusetts"  |
| cases_reported          | integer  | Yes      | Officially reported cases for that state-year                               | 9715             |
| source_id               | string   | Yes      | Reference to entry in sources.json or raw file name                         | "cdc_lyme_2023"  |
| notes                   | string   | No       | Any important caveats for this specific data point                          | "Post-2022 case definition change" |
| is_estimated            | boolean  | Yes      | Whether this number is an estimate rather than official reported count     | false            |
| population              | integer  | No       | State population that year (for rate calculations later)                    | 6984723          |

## Schema: sources

| Column          | Type    | Required | Description                                      |
|-----------------|---------|----------|--------------------------------------------------|
| source_id       | string  | Yes      | Unique identifier                                |
| title           | string  | Yes      | Human readable name                              |
| url             | string  | Yes      | Primary URL                                      |
| accessed_date   | date    | Yes      | When we accessed/downloaded this data            |
| data_type       | string  | Yes      | "state_yearly", "county", "lab", "paper" etc.    |
| notes           | string  | No       | Any important context                            |

## Current Scope (v1)
- States: MA, CT, PA, NY, NJ, ME, NH, VT, RI, WV (the original 10)
- Years: 2010, 2014, 2018, 2021, 2023, 2024, 2025
- Diseases: lyme, alpha

## Future Expansion (to be supported)
- Add new states
- Add county-level data (separate table: county_yearly_cases)
- Better historical data for Alpha-gal
- Integration of purple tick data into the same pipeline

## Validation Rules (to be implemented in build script)
- No negative case counts
- No duplicate (disease, year, state) rows
- All states use consistent naming
- Years are between 1990 and current year + 1
- Source IDs must exist in sources.json

## Output Artifacts
The pipeline will generate:
- data/3state_cases.json (current production format)
- Future: county-level JSON when we expand
- Possibly a combined processed_state_yearly.json for easier analysis
