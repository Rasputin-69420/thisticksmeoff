"""
Improved build_data.py - Data Pipeline for This Ticks Me Off (Testnet)

This version is more data-driven:
- Loads real 2023 state-level Lyme data from CSV
- Loads Alpha-gal data from its CSV where available
- Historical years still use estimates (moved to external JSON for maintainability)
- Outputs the exact 3state_cases.json format the site expects

Run from website-testnet root:
    python data-pipeline/scripts/build_data.py
"""

import json
from pathlib import Path
import pandas as pd
from datetime import datetime

# Robust import for validation helpers (same directory)
try:
    from validation import (
        validate_state_yearly_data,
        validate_purple_data,
        validate_county_lyme_data,
    )
except ImportError as e:
    print(f"Warning: Could not import validation functions ({e}). Validation will be skipped.")
    def validate_state_yearly_data(data):
        return ["Validation module not importable"]
    def validate_purple_data(data):
        return ["Validation module not importable"]
    def validate_county_lyme_data(data):
        return []

# Paths (relative to website-testnet root)
RAW_DIR = Path("data-pipeline/raw/lyme_ags_database")
OUTPUT_DIR = Path("data-pipeline/output")
SITE_DATA_DIR = Path("data")

SUPPORTED_STATES = [
    "Massachusetts", "Connecticut", "Pennsylvania", "New York", "New Jersey",
    "Maine", "New Hampshire", "Vermont", "Rhode Island", "West Virginia"
]

MODELED_YEARS = [2010, 2014, 2018, 2021, 2023, 2024, 2025]


def load_lyme_2023_data():
    """Load real 2023 state-level Lyme data."""
    path = RAW_DIR / "lyme_2023_state_cases.csv"
    if not path.exists():
        raise FileNotFoundError(f"Missing file: {path}")
    
    df = pd.read_csv(path)
    df.columns = ["state", "cases"]
    df = df[df["state"].isin(SUPPORTED_STATES)]
    return df.set_index("state")["cases"].to_dict()


def load_alpha_gal_data():
    """Load Alpha-gal data from CSV."""
    path = RAW_DIR / "alpha_gal_syndrome_suspected_cases.csv"
    if not path.exists():
        return {}
    
    df = pd.read_csv(path)
    # Expected columns: Year, Positive_Tests_Suspected_AGS, Notes
    
    data = {}
    for _, row in df.iterrows():
        year_str = str(row["Year"]).strip()
        if year_str.startswith("2017") or year_str.startswith("2018") or year_str.startswith("2019") or \
           year_str.startswith("2020") or year_str.startswith("2021") or year_str.startswith("2022"):
            try:
                year = int(year_str[:4])
                cases = int(row["Positive_Tests_Suspected_AGS"])
                data[year] = cases
            except (ValueError, TypeError):
                pass
    return data


def load_historical_estimates():
    """
    Load historical estimates from external JSON.
    This keeps estimates out of the Python code for easier maintenance.
    """
    path = RAW_DIR / "historical_estimates.json"
    if path.exists():
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    
    # Fallback to previous estimates if no external file yet
    print("Warning: historical_estimates.json not found. Using built-in fallback estimates.")
    return {
        "lyme": {
            "2010": {"Massachusetts": 6500, "Connecticut": 4200, "Pennsylvania": 3100, "New York": 9200, "New Jersey": 2800, "Maine": 1100, "New Hampshire": 650, "Vermont": 550, "Rhode Island": 1050, "West Virginia": 850},
            "2014": {"Massachusetts": 7200, "Connecticut": 4800, "Pennsylvania": 3900, "New York": 10500, "New Jersey": 3400, "Maine": 1400, "New Hampshire": 800, "Vermont": 720, "Rhode Island": 1300, "West Virginia": 1100},
            "2018": {"Massachusetts": 8100, "Connecticut": 5500, "Pennsylvania": 4800, "New York": 13200, "New Jersey": 4200, "Maine": 1800, "New Hampshire": 950, "Vermont": 880, "Rhode Island": 1600, "West Virginia": 1500},
            "2021": {"Massachusetts": 8900, "Connecticut": 6100, "Pennsylvania": 5700, "New York": 15800, "New Jersey": 5100, "Maine": 2200, "New Hampshire": 1150, "Vermont": 1050, "Rhode Island": 2000, "West Virginia": 1900}
        },
        "alpha": {
            "2010": {"Massachusetts": 120, "Connecticut": 80, "Pennsylvania": 60, "New York": 90, "New Jersey": 50, "Maine": 15, "New Hampshire": 12, "Vermont": 10, "Rhode Island": 18, "West Virginia": 25},
            "2014": {"Massachusetts": 280, "Connecticut": 190, "Pennsylvania": 140, "New York": 220, "New Jersey": 120, "Maine": 35, "New Hampshire": 28, "Vermont": 22, "Rhode Island": 40, "West Virginia": 55},
            "2018": {"Massachusetts": 520, "Connecticut": 380, "Pennsylvania": 290, "New York": 480, "New Jersey": 260, "Maine": 70, "New Hampshire": 55, "Vermont": 45, "Rhode Island": 85, "West Virginia": 110},
            "2021": {"Massachusetts": 890, "Connecticut": 650, "Pennsylvania": 510, "New York": 820, "New Jersey": 450, "Maine": 110, "New Hampshire": 85, "Vermont": 70, "Rhode Island": 140, "West Virginia": 180}
        }
    }


def build_3state_cases_json():
    print("Loading raw data files...")
    
    lyme_2023 = load_lyme_2023_data()
    alpha_recent = load_alpha_gal_data()
    historical = load_historical_estimates()
    
    data = {"lyme": {}, "alpha": {}}
    
    # Lyme data
    lyme = historical.get("lyme", {})
    lyme["2023"] = lyme_2023
    
    # Simple projection for 2024/2025 (will be replaced with better logic later)
    for state in SUPPORTED_STATES:
        base = lyme["2023"].get(state, 0)
        lyme["2024"] = lyme.get("2024", {})
        lyme["2025"] = lyme.get("2025", {})
        lyme["2024"][state] = int(base * 1.02)
        lyme["2025"][state] = int(base * 1.03)
    
    data["lyme"] = lyme
    
    # Alpha-gal data
    alpha = historical.get("alpha", {})
    
    # Override with real recent data where available
    for year, cases in alpha_recent.items():
        # Distribute national number roughly across our 10 states (very rough for now)
        # In a better version we'd have state-level AGS data
        if year in [2017, 2018, 2019, 2020, 2021, 2022]:
            # Use previous distribution ratios as approximation
            total_previous = sum(alpha.get(2021, {}).values()) or 1
            for state in SUPPORTED_STATES:
                prev = alpha.get(2021, {}).get(state, 0)
                ratio = prev / total_previous if total_previous > 0 else 0.1
                alpha.setdefault(year, {})[state] = int(cases * ratio)
    
    # Simple projections
    for state in SUPPORTED_STATES:
        base = alpha.get(2022, {}).get(state, alpha.get(2021, {}).get(state, 100))
        alpha.setdefault(2023, {})[state] = int(base * 0.85)  # observed drop
        alpha.setdefault(2024, {})[state] = int(base * 0.9)
        alpha.setdefault(2025, {})[state] = int(base * 0.95)
    
    data["alpha"] = alpha
    
    return data


def load_county_derived_2023_totals():
    """
    If county data has been processed, load the derived state totals for 2023 Lyme.
    This lets real county-level CDC data improve the accuracy of our state anchors
    instead of displaying raw county dots.
    """
    candidates = [
        OUTPUT_DIR / "lyme_2023_from_real.json",
        OUTPUT_DIR / "lyme_2023_from_sample.json",
    ]
    for p in candidates:
        if p.exists():
            try:
                with open(p, "r", encoding="utf-8") as f:
                    data = json.load(f)
                totals = data.get("lyme_state_totals", {})
                if totals:
                    print(f"  Using county-derived 2023 Lyme totals from {p.name}")
                    return totals
            except Exception as e:
                print(f"  Could not load {p.name}: {e}")
    return {}


def main():
    print("=== Building This Ticks Me Off Data (Improved Pipeline) ===")
    print(f"Started: {datetime.now().isoformat()}")
    
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    SITE_DATA_DIR.mkdir(parents=True, exist_ok=True)
    
    output_data = build_3state_cases_json()

    # === New: Use county-derived data to improve 2023 state totals (national trends goal) ===
    county_2023 = load_county_derived_2023_totals()
    if county_2023:
        lyme_dict = output_data.setdefault("lyme", {})
        lyme_2023 = lyme_dict.setdefault("2023", {})
        for state, cases in county_2023.items():
            if state in SUPPORTED_STATES:
                old = lyme_2023.get(state)
                lyme_2023[state] = cases
                if old is not None and old != cases:
                    print(f"    Updated 2023 Lyme for {state}: {old} → {cases} (from county data)")
        # Re-copy to the site file after adjustment
        site_path = SITE_DATA_DIR / "3state_cases.json"
        with open(site_path, "w", encoding="utf-8") as f:
            json.dump(output_data, f, indent=2)
        print(f"  3state_cases.json refreshed with county-improved 2023 numbers")
    
    output_path = OUTPUT_DIR / "3state_cases.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(output_data, f, indent=2)
    print(f"  Generated: {output_path}")
    
    # Copy to site data folder for testing
    site_path = SITE_DATA_DIR / "3state_cases.json"
    with open(site_path, "w", encoding="utf-8") as f:
        json.dump(output_data, f, indent=2)
    print(f"  Copied to site: {site_path}")
    
    print("\nBuild complete for red (Lyme/Alpha) data.")

    # === Generate Purple Data first (so validation can see the outputs) ===
    print("\nGenerating purple tick data (from pipeline/raw/purple/)...")
    purple_raw_path = RAW_DIR.parent / "purple" / "established_counts.json"
    purple_errors = []
    red_errors = []

    if purple_raw_path.exists():
        with open(purple_raw_path, "r", encoding="utf-8") as f:
            purple_data = json.load(f)
        
        # Full structured version (for future use)
        purple_output = OUTPUT_DIR / "purple_established_counts.json"
        with open(purple_output, "w", encoding="utf-8") as f:
            json.dump(purple_data, f, indent=2)
        print(f"  Generated full: {purple_output}")

        # Simplified dict format that the current website JS expects
        if "current_established_counts" in purple_data:
            simple_purple = {
                "established_counts": purple_data["current_established_counts"],
                "metadata": {
                    "last_updated": purple_data.get("metadata", {}).get("last_updated", "unknown"),
                    "source": "Generated by build_data.py"
                }
            }
            simple_output = OUTPUT_DIR / "purple_simple.json"
            with open(simple_output, "w", encoding="utf-8") as f:
                json.dump(simple_purple, f, indent=2)
            print(f"  Generated simple (for site): {simple_output}")

            # Also copy to the site's data folder for easy loading in testnet
            site_purple = SITE_DATA_DIR / "purple_data.json"
            with open(site_purple, "w", encoding="utf-8") as f:
                json.dump(simple_purple, f, indent=2)
            print(f"  Copied to site data/: {site_purple}")
    else:
        print(f"  Warning: {purple_raw_path} not found. Skipping purple data generation.")
        purple_data = None

    # Now run validation on what we actually produced
    print("\n--- Running validation ---")
    red_errors = validate_state_yearly_data(output_data)
    if red_errors:
        print("\nRed data validation issues:")
        for e in red_errors:
            print(f"  - {e}")
    else:
        print("Red data: OK")

    if purple_data:
        # Validate the in-memory version we just read (more reliable than disk timing)
        purple_errors = validate_purple_data(purple_data)
        if purple_errors:
            print("\nPurple data validation issues:")
            for e in purple_errors:
                print(f"  - {e}")
        else:
            print("Purple data: OK")
    else:
        print("Purple data: Skipped (no source file)")

    if not red_errors and not purple_errors:
        print("\nAll validations passed.")

    # Experimental county data (new May 2026)
    county_sample_path = OUTPUT_DIR / "county_lyme_2023_sample.json"
    if county_sample_path.exists():
        try:
            with open(county_sample_path, "r", encoding="utf-8") as f:
                county_sample = json.load(f)
            county_errors = validate_county_lyme_data(county_sample) if 'validate_county_lyme_data' in dir() else []
            if county_errors:
                print("\nExperimental county Lyme validation issues:")
                for e in county_errors:
                    print(f"  - {e}")
            else:
                print("Experimental county Lyme sample: OK (placeholder)")
        except Exception as ex:
            print(f"Could not validate county sample: {ex}")

    print("\n=== Pipeline run complete ===")


if __name__ == "__main__":
    main()
