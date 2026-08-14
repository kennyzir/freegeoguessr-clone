#!/usr/bin/env python3
import re
import sys
import json
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "out"
GAMES = json.loads((ROOT / "src/data/games.json").read_text())


def read(path):
    return path.read_text(errors="ignore")


def html_files():
    return [
        path
        for path in OUT.glob("**/*.html")
        if path.name not in {"404.html", "_not-found.html"} and "_not-found" not in path.parts
    ]


def rel(path):
    return str(path.relative_to(ROOT))


def main():
    errors = []
    warnings = []
    rows = []

    if not OUT.exists():
        errors.append("out/ does not exist. Run npm run build first.")
    else:
        for path in html_files():
            text = read(path)
            title = re.search(r"<title>(.*?)</title>", text)
            desc = re.search(r'<meta name="description" content="([^"]*)"', text)
            canonical = re.search(r'<link rel="canonical" href="([^"]*)"', text)

            if not title:
                errors.append(f"{rel(path)}: missing title")
            if not desc:
                errors.append(f"{rel(path)}: missing meta description")
            if not canonical:
                errors.append(f"{rel(path)}: missing canonical")

            if title and desc:
                rows.append((path, title.group(1), desc.group(1)))

            if "/games/" in str(path) and path.suffix == ".html":
                if "VideoGame" not in text:
                    errors.append(f"{rel(path)}: game page missing VideoGame JSON-LD")
                if "FAQPage" not in text:
                    warnings.append(f"{rel(path)}: game page missing FAQPage JSON-LD")
                if 'id="gameplay"' not in text:
                    errors.append(f"{rel(path)}: game page missing visible gameplay section")

            if "/c/" in str(path) and path.suffix == ".html" and "FAQPage" not in text:
                errors.append(f"{rel(path)}: category page missing FAQPage JSON-LD")

        title_counts = Counter(title for _, title, _ in rows)
        for title, count in title_counts.items():
            if count > 1:
                errors.append(f"duplicate title ({count} pages): {title}")

        desc_counts = Counter(desc for _, _, desc in rows)
        for desc, count in desc_counts.items():
            if count > 1:
                errors.append(f"duplicate description ({count} pages): {desc}")

        sitemap = OUT / "sitemap.xml"
        if not sitemap.exists():
            errors.append("out/sitemap.xml missing")
        else:
            sitemap_text = read(sitemap)
            categories = sorted({category for game in GAMES for category in game.get("categories", [])})
            primary_slug = next((game["slug"] for game in GAMES if game.get("featured")), GAMES[0]["slug"])
            required_paths = ["/games", "/popular", "/new", f"/games/{primary_slug}"]
            if categories:
                required_paths.append(f"/c/{categories[0]}")
            for required in required_paths:
                if required not in sitemap_text:
                    errors.append(f"sitemap missing {required}")
            if "/tag/" not in sitemap_text:
                warnings.append("sitemap has no tag URLs")

            for path, _, _ in rows:
                if "/tag/" not in str(path):
                    continue
                page_text = read(path)
                if 'name="robots" content="noindex, follow"' not in page_text:
                    continue
                tag_slug = path.stem
                if re.search(rf"<loc>[^<]*/tag/{re.escape(tag_slug)}</loc>", sitemap_text):
                    errors.append(f"sitemap includes noindex tag: {tag_slug}")

        robots = OUT / "robots.txt"
        if not robots.exists():
            errors.append("out/robots.txt missing")

        manifest = OUT / "manifest.json"
        if manifest.exists() and "favicon.svg" in read(manifest):
            errors.append("manifest references missing favicon.svg")

    print(f"HTML pages audited: {len(rows)}")
    print(f"Errors: {len(errors)}")
    print(f"Warnings: {len(warnings)}")

    for item in errors:
        print(f"ERROR: {item}")
    for item in warnings:
        print(f"WARN: {item}")

    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
