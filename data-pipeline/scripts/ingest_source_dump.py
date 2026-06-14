#!/usr/bin/env python3
"""
ingest_source_dump.py

Data dump mode intake tool for This Ticks Me Off.

Usage:
    python data-pipeline/scripts/ingest_source_dump.py path/to/your_dump.json

What it does:
- Loads your raw dump (the JSON with "data_sources" array you keep sending).
- Deduplicates against the master sources in:
    - data/lyme_ags_database/lyme_ags_sources.json  (the live Sources modal)
    - data/additional_sources.json                 (recommended sources)
- Filters out anything with a matching URL (primary key) or very similar title.
- Outputs:
    - Suggested new entries formatted for both master files.
    - Appends a summary row to DATA_CONTRIBUTIONS.md
    - Saves a cleaned timestamped copy to data-pipeline/raw/dumps/
- Does NOT auto-merge (you review first). Use --apply to auto-merge after review.

This keeps the data set clean while you dump.
"""

import json
import sys
import re
from pathlib import Path
from datetime import datetime
from difflib import SequenceMatcher

ROOT = Path(__file__).parent.parent.parent  # website-testnet root
DUMPS_DIR = ROOT / "data-pipeline" / "raw" / "dumps"
LYME_SOURCES = ROOT / "data" / "lyme_ags_database" / "lyme_ags_sources.json"
ADDITIONAL_SOURCES = ROOT / "data" / "additional_sources.json"
CONTRIBUTIONS = ROOT / "DATA_CONTRIBUTIONS.md"

DUMPS_DIR.mkdir(parents=True, exist_ok=True)


def normalize_url(url: str) -> str:
    """Strip protocol, www, trailing slashes, query params for better deduping."""
    url = url.lower().strip()
    url = re.sub(r'^https?://', '', url)
    url = re.sub(r'^www\.', '', url)
    url = url.rstrip('/')
    url = url.split('?')[0]
    return url


def similar(a: str, b: str, threshold: float = 0.85) -> bool:
    return SequenceMatcher(None, a.lower(), b.lower()).ratio() > threshold


def load_existing_urls_and_titles():
    urls = set()
    titles = []

    # lyme_ags_sources.json
    if LYME_SOURCES.exists():
        data = json.loads(LYME_SOURCES.read_text(encoding="utf-8"))
        for section in data.values():
            if isinstance(section, list):
                for item in section:
                    if isinstance(item, dict):
                        u = item.get("url") or item.get("free_pdf")
                        if u:
                            urls.add(normalize_url(u))
                        if item.get("title"):
                            titles.append(item["title"])

    # additional_sources.json
    if ADDITIONAL_SOURCES.exists():
        data = json.loads(ADDITIONAL_SOURCES.read_text(encoding="utf-8"))
        for item in data.get("additional_recommended_sources", []):
            if isinstance(item, dict):
                u = item.get("url")
                if u:
                    urls.add(normalize_url(u))
                if item.get("title"):
                    titles.append(item["title"])

    return urls, titles


def filter_new_sources(dump_data: dict, existing_urls: set, existing_titles: list):
    """Return only the sources that are genuinely new."""
    incoming = dump_data.get("data_sources", [])
    new_ones = []
    duplicates = []

    for src in incoming:
        url = src.get("url", "")
        title = src.get("name", src.get("title", ""))

        norm_url = normalize_url(url) if url else ""

        is_dup = False
        if norm_url and norm_url in existing_urls:
            is_dup = True
        else:
            for t in existing_titles:
                if similar(title, t):
                    is_dup = True
                    break

        if is_dup:
            duplicates.append(title or url)
        else:
            new_ones.append(src)

    return new_ones, duplicates


def format_for_lyme_ags_sources(sources: list) -> list:
    """Convert dump format to the style used in lyme_ags_sources.json"""
    formatted = []
    for s in sources:
        entry = {
            "title": s.get("name") or s.get("title", "Untitled"),
            "url": s.get("url", ""),
            "description": s.get("description", ""),
            "category": s.get("category", "General"),
            "type": s.get("type", "Unknown"),
            "accessed": "2026-05",
            "priority": "High" if "High" in str(s.get("notes", "")) or "priority" not in s else "Medium"
        }
        if s.get("coverage"):
            entry["coverage"] = s["coverage"]
        if s.get("notes"):
            entry["notes"] = s["notes"]
        formatted.append(entry)
    return formatted


def format_for_additional_sources(sources: list) -> list:
    formatted = []
    for i, s in enumerate(sources):
        entry = {
            "id": f"dump_{datetime.now().strftime('%Y%m%d')}_{i:02d}",
            "category": s.get("category", "General"),
            "title": s.get("name") or s.get("title", "Untitled"),
            "authors": "Various (CDC / state / NEON)",
            "year": 2025,
            "url": s.get("url", ""),
            "description": s.get("description", ""),
            "recommended_for": s.get("notes", "Review for red/purple layer or context"),
            "data_format": s.get("type", "Unknown"),
            "priority": "High"
        }
        formatted.append(entry)
    return formatted


def append_to_contributions_log(new_sources: list, dump_name: str):
    if not CONTRIBUTIONS.exists():
        return "Could not find DATA_CONTRIBUTIONS.md"

    today = datetime.now().strftime("%Y-%m-%d")
    summary = ", ".join([s.get("name", s.get("title", ""))[:40] for s in new_sources[:5]])
    if len(new_sources) > 5:
        summary += f" + {len(new_sources)-5} more"

    row = f"| {today} | {dump_name} | {len(new_sources)} sources | Various | Metadata only (review) | {summary} |\n"

    content = CONTRIBUTIONS.read_text(encoding="utf-8")
    if row.strip() in content:
        return "Row already present"

    # Insert before the final --- or at the end of the table
    if "| 2026-05 (internal)" in content:
        content = content.replace(
            "| 2026-05 (internal) | Springer",
            row + "| 2026-05 (internal) | Springer"
        )
    else:
        # Fallback: append before the Goal line
        content = content.replace(
            "**Goal:**",
            row + "\n**Goal:**"
        )

    CONTRIBUTIONS.write_text(content, encoding="utf-8")
    return "Appended to Incoming Data Log"


def main():
    if len(sys.argv) < 2:
        print("Usage: python data-pipeline/scripts/ingest_source_dump.py <path-to-dump.json> [--apply]")
        sys.exit(1)

    dump_path = Path(sys.argv[1])
    apply = "--apply" in sys.argv

    if not dump_path.exists():
        print(f"File not found: {dump_path}")
        sys.exit(1)

    raw_dump = json.loads(dump_path.read_text(encoding="utf-8"))
    print(f"Loaded dump with {len(raw_dump.get('data_sources', []))} sources")

    existing_urls, existing_titles = load_existing_urls_and_titles()
    print(f"Found {len(existing_urls)} existing URLs across masters")

    new_sources, dups = filter_new_sources(raw_dump, existing_urls, existing_titles)

    print(f"\nNew unique sources: {len(new_sources)}")
    print(f"Duplicates filtered: {len(dups)}")
    if dups:
        print("  (first few):", dups[:3])

    if not new_sources:
        print("Nothing new to add. Exiting.")
        return

    # Save cleaned version
    timestamp = datetime.now().strftime("%Y%m%d_%H%M")
    clean_name = f"dump_{timestamp}_{dump_path.stem}.json"
    clean_path = DUMPS_DIR / clean_name
    clean_path.write_text(json.dumps({
        "original_file": str(dump_path),
        "imported_at": datetime.now().isoformat(),
        "new_sources": new_sources,
        "duplicates_skipped": dups
    }, indent=2), encoding="utf-8")
    print(f"\nSaved cleaned dump to: {clean_path}")

    # Prepare formatted output
    for_lyme = format_for_lyme_ags_sources(new_sources)
    for_additional = format_for_additional_sources(new_sources)

    print("\n=== Suggested addition for lyme_ags_sources.json (cdc_direct_downloads_2026) ===")
    print(json.dumps(for_lyme, indent=2)[:1500], "... (truncated)")

    print("\n=== Suggested addition for additional_sources.json ===")
    print(json.dumps(for_additional, indent=2)[:1200], "...")

    log_result = append_to_contributions_log(new_sources, dump_path.name)
    print(f"\n{log_result}")

    if apply:
        print("\n--apply not fully implemented yet (safety). Manually paste the formatted blocks for now.")
    else:
        print("\nReview the output above. When ready, I can merge with --apply or you paste the blocks.")


if __name__ == "__main__":
    main()