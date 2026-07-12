#!/usr/bin/env bash
# Cuts a release: bumps the version, commits, tags "v<version>", and with --push
# pushes branch + tag — which triggers .github/workflows/release.yml to build dist/,
# attach the packed tarball to a GitHub Release, and publish @lkmc/system7-ui to npm
# (when the NPM_TOKEN secret is set). release.yml hard-fails unless the tag matches
# the *committed* package.json version, so the bump (package.json + package-lock.json)
# and the tag must land together — this keeps them in step. Husky's pre-commit hook
# (npm run precommit:checks) runs on the bump commit, same as any other commit.
#
# Relation to the rest of the release tooling (this script replaces neither):
#   - .github/workflows/release.yml does the actual publishing — this script only
#     prepares the commit and pushes the tag that triggers it.
#   - scripts/publish-npm.sh is the *manual local* publish path (check + package +
#     `npm publish`, with --otp for 2FA). It does not bump, commit, tag, or push.
#     Use it only when CI can't publish (e.g. NPM_TOKEN not configured) — and run it
#     *after* this script, so the published version and the tag agree.
#
#   scripts/release.sh 1.3.0          # bump package.json + lockfile + README, commit, tag v1.3.0
#   scripts/release.sh 1.3.0 --push   # …also push the commit + tag (CI then publishes)
#   scripts/release.sh                # tag the current version as-is
#
# Usage: scripts/release.sh [X.Y.Z] [--push]
# Shared engine: https://github.com/L-K-M/release-tool (this stub only sets config).
set -euo pipefail

export RELEASE_APP_NAME="@lkmc/system7-ui"
export RELEASE_KIND="npm"
export RELEASE_CI_NOTE="CI (release.yml) will now verify the tag, build dist/, attach the tarball to the GitHub Release for <tag>, and publish @lkmc/system7-ui to npm (if NPM_TOKEN is set)."
export RELEASE_INVOKED_AS="scripts/release.sh"

BIN="${LKM_RELEASE_BIN:-lkm-release}"
command -v "$BIN" >/dev/null 2>&1 || {
  echo "error: lkm-release not found — clone https://github.com/L-K-M/release-tool and run ./install.sh" >&2
  exit 1
}
exec "$BIN" "$@"
