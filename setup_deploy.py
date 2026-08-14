#!/usr/bin/env python3
"""Create or update a Cloudflare Pages project for this static site."""

import argparse
import json
import os
import sys
import urllib.error
import urllib.request
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


def request_json(url: str, token: str, method: str, payload: dict) -> dict:
    request = urllib.request.Request(
        url,
        data=json.dumps(payload).encode(),
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
        method=method,
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        return json.loads(response.read())


def main() -> int:
    load_env(ROOT / ".env.local")
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--project", default=os.getenv("CLOUDFLARE_PAGES_PROJECT"))
    parser.add_argument("--branch", default=os.getenv("CLOUDFLARE_PAGES_BRANCH", "main"))
    args = parser.parse_args()

    token = os.getenv("CLOUDFLARE_API_TOKEN")
    account_id = os.getenv("CLOUDFLARE_ACCOUNT_ID")
    missing = [name for name, value in {
        "CLOUDFLARE_PAGES_PROJECT": args.project,
        "CLOUDFLARE_API_TOKEN": token,
        "CLOUDFLARE_ACCOUNT_ID": account_id,
    }.items() if not value]
    if missing:
        print(f"Missing required settings: {', '.join(missing)}", file=sys.stderr)
        return 2

    base_url = f"https://api.cloudflare.com/client/v4/accounts/{account_id}/pages/projects"
    build_config = {
        "build_config": {
            "build_command": "npm run build",
            "destination_dir": "out",
            "root_dir": "",
        }
    }
    try:
        result = request_json(
            base_url,
            token,
            "POST",
            {"name": args.project, "production_branch": args.branch, **build_config},
        )
        action = "created"
    except urllib.error.HTTPError as error:
        if error.code not in {400, 409}:
            raise
        result = request_json(f"{base_url}/{args.project}", token, "PATCH", build_config)
        action = "updated"

    if not result.get("success"):
        print(json.dumps(result.get("errors", result), indent=2), file=sys.stderr)
        return 1
    print(f"Cloudflare Pages project {args.project} {action} successfully.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
