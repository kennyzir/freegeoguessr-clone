#!/usr/bin/env python3
import json
import sys
from collections import Counter
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
GAMES_PATH = ROOT / "src/data/games.json"

REQUIRED_GAME_FIELDS = [
    "slug",
    "name",
    "h1",
    "meta_description",
    "embedUrl",
    "screenshotUrl",
    "rating",
    "plays",
    "categories",
    "tags",
    "seoContent",
]

REQUIRED_SEO_FIELDS = [
    "overview",
    "gameplay",
    "controls",
    "howToPlay",
    "features",
    "faq",
    "tipsAndTricks",
    "whyPlayHere",
]

GENERIC_PHRASES = [
    "is a fun and engaging online game",
    "Getting started with",
    "Dive into the action and see how far you can go",
]


def is_url(value):
    parsed = urlparse(value)
    return parsed.scheme in {"http", "https"} and bool(parsed.netloc)


def main():
    games = json.loads(GAMES_PATH.read_text())
    errors = []
    warnings = []

    slugs = [game.get("slug", "") for game in games]
    for slug, count in Counter(slugs).items():
        if count > 1:
            errors.append(f"duplicate slug: {slug}")

    for index, game in enumerate(games):
        slug = game.get("slug") or f"row-{index}"

        for field in REQUIRED_GAME_FIELDS:
            if field not in game or game[field] in ("", [], None):
                errors.append(f"{slug}: missing {field}")

        if game.get("embedUrl") and not is_url(game["embedUrl"]):
            errors.append(f"{slug}: embedUrl is not an absolute URL")

        if game.get("screenshotUrl") and not is_url(game["screenshotUrl"]):
            errors.append(f"{slug}: screenshotUrl is not an absolute URL")

        if len(game.get("categories", [])) < 1:
            errors.append(f"{slug}: at least 1 category is required")

        if len(game.get("tags", [])) < 3:
            warnings.append(f"{slug}: fewer than 3 tags")

        seo = game.get("seoContent", {})
        for field in REQUIRED_SEO_FIELDS:
            if field not in seo or seo[field] in ("", [], None):
                errors.append(f"{slug}: missing seoContent.{field}")

        if len(seo.get("faq", [])) < 4:
            errors.append(f"{slug}: fewer than 4 FAQ items")

        if len(seo.get("tipsAndTricks", [])) < 4:
            warnings.append(f"{slug}: fewer than 4 tips")

        for key in ("overview", "gameplay", "howToPlay"):
            text = seo.get(key, "")
            if len(text) < 120:
                warnings.append(f"{slug}: seoContent.{key} is short")
            for phrase in GENERIC_PHRASES:
                if phrase in text:
                    warnings.append(f"{slug}: seoContent.{key} contains generic phrase: {phrase}")

    print(f"Games audited: {len(games)}")
    print(f"Errors: {len(errors)}")
    print(f"Warnings: {len(warnings)}")

    for item in errors:
        print(f"ERROR: {item}")
    for item in warnings[:80]:
        print(f"WARN: {item}")
    if len(warnings) > 80:
        print(f"WARN: ... {len(warnings) - 80} more warnings omitted")

    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
