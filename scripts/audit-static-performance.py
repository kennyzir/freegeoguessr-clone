#!/usr/bin/env python3
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "out"


def main():
    errors = []
    warnings = []
    if not OUT.exists():
        print("ERROR: out/ does not exist. Run npm run build first.")
        return 1

    js_files = list((OUT / "_next/static").glob("**/*.js"))
    total_js = sum(path.stat().st_size for path in js_files)
    for path in js_files:
        if path.stat().st_size > 350_000:
            warnings.append(f"large JS chunk: {path.relative_to(OUT)} ({path.stat().st_size // 1024} KiB)")
    if total_js > 1_500_000:
        warnings.append(f"total static JS exceeds 1.5 MB: {total_js // 1024} KiB")

    game_pages = list((OUT / "games").glob("*.html")) if (OUT / "games").exists() else []
    for path in game_pages:
        text = path.read_text(errors="ignore")
        if path.stat().st_size > 300_000:
            warnings.append(f"large game HTML: {path.relative_to(OUT)} ({path.stat().st_size // 1024} KiB)")
        if "<iframe" in text and 'loading="lazy"' not in text:
            warnings.append(f"eager iframe in static HTML: {path.relative_to(OUT)}")
        for tag in re.findall(r"<img\b[^>]*>", text):
            if "alt=" not in tag:
                errors.append(f"image without alt text: {path.relative_to(OUT)}")
            if not ("width=" in tag and "height=" in tag) and "data-nimg=\"fill\"" not in tag:
                warnings.append(f"image may lack stable dimensions: {path.relative_to(OUT)}")
                break

    print(f"Static JS: {total_js // 1024} KiB across {len(js_files)} files")
    print(f"Game pages checked: {len(game_pages)}")
    print(f"Errors: {len(errors)}")
    print(f"Warnings: {len(warnings)}")
    for item in errors:
        print(f"ERROR: {item}")
    for item in warnings:
        print(f"WARN: {item}")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
