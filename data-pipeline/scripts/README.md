# Data Pipeline Scripts

This folder contains scripts used to process raw data into formats usable by the website.

## Current Scripts

- `build_data.py` — Main build script (state-level red data + purple tick data generation + validation)
- `validation.py` — Reusable validation rules for red (Lyme/Alpha) and purple data
- `process_county_data.py` — Handles county CSVs → produces state totals that feed the red layer
- `ingest_source_dump.py` — **Data dump mode tool**. When the user pastes big lists of sources, this dedupes them against the master files and prepares clean additions.

## How to Run (Windows — Recommended Steps)

1. **Install Python 3.10+** (if not already installed)
   - Official: https://www.python.org/downloads/
   - During install, **check "Add python.exe to PATH"**

2. **Open PowerShell or Command Prompt** in the `website-testnet` folder (right-click folder → Open in Terminal)

3. **Create & activate a virtual environment** (highly recommended):
   ```powershell
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1     # PowerShell
   # or: .\.venv\Scripts\activate.bat   # Command Prompt
   ```

4. **Install dependencies**:
   ```powershell
   pip install -r data-pipeline/requirements.txt
   ```

5. **Run the pipeline** (from the `website-testnet` root):
   ```powershell
   python data-pipeline/scripts/build_data.py
   ```

The script will:
- Build `data/3state_cases.json` (red Lyme + Alpha-gal layer)
- Generate `data/purple_data.json` from the raw purple source
- Run validation on both
- Write outputs to `data-pipeline/output/`

## New in 2026-05: County-Level Data Sources

The pipeline is now aware of the high-value direct downloads added to `cdc_direct_downloads_2026`:
- 2023 county Lyme CSV
- 2019–2022 multi-TBD county Excel
- 2026 Ixodes County Table Excel (blacklegged ticks)

These are **not yet fully ingested** (see PROGRESS.md). Next steps are to add dedicated parsers for county heatmaps.

## Development Notes

- Paths are relative to `website-testnet` root.
- Raw data lives in `data-pipeline/raw/`.
- Generated artifacts the site consumes live in `data/`.
- Validation is now imported safely with fallback.
- After editing validation rules or build logic, re-run and check the console output for errors.

## Troubleshooting

- "Python was not found" → Use the official installer and enable PATH, or run `py` instead of `python`.
- Missing pandas/openpyxl → Make sure your venv is activated and requirements are installed.
- Validation errors → Fix data issues in raw files or relax rules in `validation.py` (document why).

Run this script whenever you update raw CSVs/Excels in the `raw/` folder.

### Data Dump Mode Workflow (new)

When the user keeps sending big lists of sources:

1. Save the raw JSON they pasted as `data-pipeline/raw/dumps/dump_YYYYMMDD_HHMMSS_name.json`
2. Run:
   ```powershell
   python data-pipeline/scripts/ingest_source_dump.py data-pipeline/raw/dumps/dump_....json
   ```
3. The script will:
   - Filter duplicates (by URL + fuzzy title)
   - Show only the new stuff
   - Give you formatted blocks ready to paste into `lyme_ags_sources.json` and `additional_sources.json`
   - Auto-add a row to the Incoming Data Log in `DATA_CONTRIBUTIONS.md`

This is now the official way to handle ongoing data dumps without creating a mess.
