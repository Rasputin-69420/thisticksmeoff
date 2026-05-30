"""
process_county_data.py

Early experimental processor for the new 2026 county-level CDC files.

Features:
- Always generates a solid sample county-level Lyme 2023 structure with coords for immediate UI demo.
- If the real downloaded CSV is present, attempts to parse it with pandas (graceful fallback).
- Prepares the shape the frontend can consume for a real county heatmap layer.
- Future: Add Ixodes 2026 Excel support for multi-species presence.

Run from website-testnet root (after venv + pandas):
    python data-pipeline/scripts/process_county_data.py

Outputs go to data-pipeline/output/ and data/ for testing.
"""

import json
from pathlib import Path
from datetime import datetime

OUTPUT_DIR = Path("data-pipeline/output")
SITE_DATA_DIR = Path("data")
RAW_DIR = Path("data-pipeline/raw/lyme_ags_database")

# Expected filename after user downloads it
REAL_COUNTY_CSV = RAW_DIR / "LD_Case_Counts_by_County_2023_updated.csv"


def generate_sample_county_lyme_2023():
    """Always produces a good demo sample (with real-ish county centroids)."""
    print("Generating experimental/sample county Lyme 2023 data...")

    sample = {
        "metadata": {
            "source": "CDC LD_Case_Counts_by_County_2023_updated.csv (experimental placeholder)",
            "year": 2023,
            "generated": datetime.now().isoformat(),
            "note": "This is a tiny sample. Replace with real parsed data once the CSV is downloaded and the parser is complete.",
            "status": "placeholder"
        },
        "by_state": {
            "Massachusetts": {
                "total": 9715,
                "counties": [
                    {"name": "Barnstable County", "lat": 41.70, "lng": -70.30, "cases": 420},
                    {"name": "Middlesex County", "lat": 42.48, "lng": -71.39, "cases": 1850},
                    {"name": "Nantucket County", "lat": 41.27, "lng": -70.10, "cases": 95}
                ]
            },
            "New York": {
                "total": 22173,
                "counties": [
                    {"name": "Suffolk County", "lat": 40.85, "lng": -72.85, "cases": 2100},
                    {"name": "Westchester County", "lat": 41.12, "lng": -73.78, "cases": 980}
                ]
            },
            "Pennsylvania": {
                "total": 16671,
                "counties": [
                    {"name": "Chester County", "lat": 39.97, "lng": -75.75, "cases": 890}
                ]
            }
        },
        "schema_version": "0.1-experimental",
        "recommended_next": "Download the real 2023 county CSV and implement pandas parsing + normalization."
    }

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    SITE_DATA_DIR.mkdir(parents=True, exist_ok=True)

    out_path = OUTPUT_DIR / "county_lyme_2023_sample.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(sample, f, indent=2)
    print(f"  Wrote sample: {out_path}")

    site_copy = SITE_DATA_DIR / "county_lyme_2023_sample.json"
    with open(site_copy, "w", encoding="utf-8") as f:
        json.dump(sample, f, indent=2)
    print(f"  Copied to site data/: {site_copy}")

    return sample


def try_parse_real_county_csv():
    """
    If the real CDC county CSV has been downloaded, parse it and produce a full output.
    Otherwise, just use the sample.
    Expected columns (based on CDC file): typically include County, State, Cases_2023 or similar.
    """
    if not REAL_COUNTY_CSV.exists():
        print(f"Real county CSV not found at {REAL_COUNTY_CSV} — using sample only.")
        return None

    try:
        import pandas as pd
    except ImportError:
        print("pandas not available — cannot parse real CSV yet. Install via requirements.")
        return None

    print(f"Found real file! Parsing {REAL_COUNTY_CSV.name} ...")
    df = pd.read_csv(REAL_COUNTY_CSV)

    # Very defensive column detection (CDC files vary slightly)
    cols = [c.lower() for c in df.columns]
    county_col = next((c for c in df.columns if 'county' in c.lower()), df.columns[0])
    state_col = next((c for c in df.columns if 'state' in c.lower()), None)
    cases_col = next((c for c in df.columns if any(x in c.lower() for x in ['case', 'count', '2023'])), df.columns[-1])

    print(f"  Using columns → county: {county_col}, state: {state_col}, cases: {cases_col}")

    # Group into the structure the frontend expects
    result = {
        "metadata": {
            "source": str(REAL_COUNTY_CSV),
            "year": 2023,
            "generated": datetime.now().isoformat(),
            "note": "Parsed from real CDC county CSV",
            "status": "real-data"
        },
        "by_state": {},
        "schema_version": "0.2-real",
    }

    for _, row in df.iterrows():
        state = str(row[state_col]) if state_col else "Unknown"
        county = str(row[county_col])
        try:
            cases = int(float(row[cases_col]))
        except Exception:
            continue

        if state not in result["by_state"]:
            result["by_state"][state] = {"total": 0, "counties": []}

        result["by_state"][state]["total"] += cases
        result["by_state"][state]["counties"].append({
            "name": county,
            "cases": cases
            # lat/lng can be added later via a county lookup table or geocoding
        })

    # Write full real output
    real_out = OUTPUT_DIR / "county_lyme_2023_real.json"
    with open(real_out, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2)
    print(f"  Wrote REAL parsed data: {real_out} (states: {len(result['by_state'])})")

    # Also copy to site for testing
    real_site = SITE_DATA_DIR / "county_lyme_2023_real.json"
    with open(real_site, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2)
    print(f"  Copied real data to site: {real_site}")

    return result


def produce_state_totals_from_county_data(county_data: dict, label: str):
    """Take county-level data (sample or real) and emit clean state totals for use by build_data.py."""
    if not county_data or "by_state" not in county_data:
        return None

    state_totals = {}
    for state, payload in county_data["by_state"].items():
        # Use explicit total if present, else sum counties
        total = payload.get("total") or sum(c.get("cases", 0) for c in payload.get("counties", []))
        state_totals[state] = int(total)

    out = {
        "source": county_data.get("metadata", {}).get("source", "county-derived"),
        "year": 2023,
        "lyme_state_totals": state_totals,
        "note": f"Derived from {label} county data — use to improve/validate 2023 anchors in 3state_cases.json"
    }

    path = OUTPUT_DIR / f"lyme_2023_from_{label}.json"
    with open(path, "w", encoding="utf-8") as f:
        json.dump(out, f, indent=2)
    print(f"  Wrote state totals for build pipeline: {path}")
    return path


def main():
    print("=== County Data Processor (Experimental) ===")
    sample = generate_sample_county_lyme_2023()
    produce_state_totals_from_county_data(sample, "sample")

    real = try_parse_real_county_csv()
    if real:
        produce_state_totals_from_county_data(real, "real")

    print("\nDone.")
    print("County data is now being turned into state-level improvements for the red layer.")
    print("See lyme_2023_from_*.json files — these feed build_data.py for better national trends.")


if __name__ == "__main__":
    main()