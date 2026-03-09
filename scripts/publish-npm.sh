#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

OTP="${NPM_OTP:-}"

usage() {
  cat <<'EOF'
Usage: ./scripts/publish-npm.sh [--otp 123456] [--skip-check] [--skip-package]

Options:
  --otp <code>      One-time password for npm 2FA publish
  --skip-check      Skip "npm run check"
  --skip-package    Skip "npm run package"
EOF
}

RUN_CHECK=1
RUN_PACKAGE=1

while [[ $# -gt 0 ]]; do
  case "$1" in
    --otp)
      if [[ $# -lt 2 ]]; then
        echo "Missing value for --otp"
        usage
        exit 1
      fi
      OTP="$2"
      shift 2
      ;;
    --skip-check)
      RUN_CHECK=0
      shift
      ;;
    --skip-package)
      RUN_PACKAGE=0
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      usage
      exit 1
      ;;
  esac
done

echo "Publishing @lkmc/system7-ui from $ROOT_DIR"
npm pkg get name version

if [[ "$RUN_CHECK" -eq 1 ]]; then
  npm run check
fi

if [[ "$RUN_PACKAGE" -eq 1 ]]; then
  npm run package
fi

if [[ -n "$OTP" ]]; then
  npm publish --access public --otp "$OTP"
else
  npm publish --access public
fi

echo "Publish complete."
