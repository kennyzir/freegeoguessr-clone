#!/usr/bin/env python3
"""Deploy the static export to Cloudflare Pages using project-local settings."""

import argparse
import os
import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parent


def load_env(path: Path) -> None:
    if not path.exists():
        return
    for raw_line in path.read_text().splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


def main() -> int:
    load_env(ROOT / ".env.local")
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--project", default=os.getenv("CLOUDFLARE_PAGES_PROJECT"))
    parser.add_argument("--branch", default=os.getenv("CLOUDFLARE_PAGES_BRANCH", "main"))
    parser.add_argument("--output", default=os.getenv("CLOUDFLARE_PAGES_OUTPUT", "out"))
    parser.add_argument("--skip-build", action="store_true")
    args = parser.parse_args()

    project = args.project or os.getenv("CLOUDFLARE_PAGES_PROJECT")
    token = os.getenv("CLOUDFLARE_API_TOKEN")
    account_id = os.getenv("CLOUDFLARE_ACCOUNT_ID")

    missing = [name for name, value in {
        "CLOUDFLARE_PAGES_PROJECT": project,
        "CLOUDFLARE_API_TOKEN": token,
        "CLOUDFLARE_ACCOUNT_ID": account_id,
    }.items() if not value]
    if missing:
        print(f"Missing required settings: {', '.join(missing)}", file=sys.stderr)
        return 2

    output_dir = (ROOT / args.output).resolve()
    if not args.skip_build:
        subprocess.run(["npm", "run", "build"], cwd=ROOT, check=True)
    if not output_dir.is_dir():
        print(f"Static output directory does not exist: {output_dir}", file=sys.stderr)
        return 2

    command = [
        "npx", "wrangler", "pages", "deploy", str(output_dir),
        "--project-name", project,
        "--branch", args.branch,
        "--commit-dirty=true",
    ]
    subprocess.run(command, cwd=ROOT, check=True, env=os.environ.copy())
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
