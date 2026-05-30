"""
validation.py - Basic validation rules for the processed data layer.

This will be expanded significantly.
"""

from typing import Dict, List, Any


def validate_state_yearly_data(data: Dict[str, Any]) -> List[str]:
    """
    Validate the structure and content of state-yearly case data.
    Returns a list of error messages (empty list = valid).
    """
    errors = []
    
    required_diseases = ["lyme", "alpha"]
    supported_states = {
        "Massachusetts", "Connecticut", "Pennsylvania", "New York", "New Jersey",
        "Maine", "New Hampshire", "Vermont", "Rhode Island", "West Virginia"
    }
    
    for disease in required_diseases:
        if disease not in data:
            errors.append(f"Missing required disease key: {disease}")
            continue
            
        years = data[disease]
        for year_str, states in years.items():
            try:
                year = int(year_str)
                if year < 1990 or year > 2030:
                    errors.append(f"Suspicious year for {disease}: {year}")
            except ValueError:
                errors.append(f"Invalid year key: {year_str}")
                continue
                
            for state, count in states.items():
                if state not in supported_states:
                    errors.append(f"Unsupported state for {disease} {year_str}: {state}")
                if not isinstance(count, (int, float)) or count < 0:
                    errors.append(f"Invalid count for {disease} {year_str} {state}: {count}")
    
    return errors


def validate_purple_data(data: Dict[str, Any]) -> List[str]:
    """Basic validation for purple established counts data."""
    errors = []
    supported_states = {
        "Massachusetts", "Connecticut", "Pennsylvania", "New York", "New Jersey",
        "Maine", "New Hampshire", "Vermont", "Rhode Island", "West Virginia",
        "Texas", "Kentucky", "Arkansas", "Virginia", "Oklahoma", "Illinois",
        "Missouri", "Georgia", "Mississippi", "Indiana", "Florida",
        "North Carolina", "Tennessee", "Alabama", "Maryland", "Delaware",
        "South Carolina", "Ohio", "Kansas", "Louisiana"
    }

    if "current_established_counts" not in data:
        errors.append("Missing 'current_established_counts' key in purple data")
        return errors
        
    counts = data["current_established_counts"]
    if not isinstance(counts, dict):
        errors.append("'current_established_counts' must be a dictionary")
        return errors
        
    for state, count in counts.items():
        if state not in supported_states:
            errors.append(f"Unsupported state in purple data: {state}")
        if not isinstance(count, (int, float)) or count < 0:
            errors.append(f"Invalid count for state {state}: {count}")
        if count > 200:  # Rough sanity check for county counts
            errors.append(f"Unusually high county count for {state}: {count}")
    
    return errors


def validate_county_lyme_data(data: dict) -> list[str]:
    """
    Basic validator for the emerging county-level Lyme structure.
    (Very early — will be expanded once real CSVs are parsed.)
    """
    errors = []
    if not isinstance(data, dict):
        errors.append("County Lyme data must be a dict")
        return errors

    if "by_state" not in data:
        errors.append("Missing 'by_state' key in county Lyme data")
        return errors

    for state, payload in data.get("by_state", {}).items():
        if not isinstance(payload, dict):
            errors.append(f"Bad payload for state {state}")
            continue
        if "total" in payload and (not isinstance(payload["total"], (int, float)) or payload["total"] < 0):
            errors.append(f"Invalid total for {state}")
        for c in payload.get("counties_sample", []):
            if not isinstance(c, dict) or "cases" not in c:
                errors.append(f"Bad county sample entry in {state}")
            elif not isinstance(c.get("cases"), (int, float)) or c["cases"] < 0:
                errors.append(f"Invalid case count in sample for {state}")
    return errors


if __name__ == "__main__":
    print("Validation module loaded. Ready for integration into build script.")
    print("New: validate_county_lyme_data() stub available for experimental county work.")
