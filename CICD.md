# CI/CD

This repository uses two GitHub Actions workflows. `ci.yml` validates every push and
pull request (type-check, lint, format, tests). `release.yml` runs when a version tag is
pushed: it verifies the tag matches `package.json`, builds the package, publishes a
GitHub Release with the packed tarball, and (when an `NPM_TOKEN` secret is configured)
publishes `@lkmc/system7-ui` to npm.

## Workflows

| Workflow                                       | Trigger                       | Purpose                                                                                                              |
| ---------------------------------------------- | ----------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| [`ci.yml`](.github/workflows/ci.yml)           | `push`, `pull_request`        | Quality gate: type-check, lint, format check, unit tests.                                                            |
| [`release.yml`](.github/workflows/release.yml) | `push` of a tag matching `v*` | Verify tag/version, build `dist/`, create a GitHub Release with the tarball, publish to npm (if `NPM_TOKEN` is set). |

## Continuous integration (`ci.yml`)

Runs on `ubuntu-latest` with Node 20 (npm cache enabled) on every push and pull request:

1. **Checkout** – `actions/checkout@v4`.
2. **Setup Node** – Node 20 with `cache: npm` for faster installs.
3. **Install dependencies** – `npm ci` (clean, lockfile-exact install).
4. **Type check** – `npm run check` (`svelte-kit sync` + `svelte-check`).
5. **Lint** – `npm run lint` (ESLint).
6. **Format check** – `npm run format:check` (Prettier, non-mutating).
7. **Test** – `npm run test` (Vitest, `vitest run`).

The goal is to keep `main` green: nothing merges unless the component library type-checks,
lints clean, is formatted, and passes its unit tests.

### Running locally

```bash
npm ci              # install exactly what CI installs
npm run check       # type-check (svelte-check)
npm run lint        # eslint
npm run format:check # prettier --check (use `npm run format` to fix)
npm run test        # vitest run
```

## Releases (`release.yml`)

Releases are cut by pushing a Git tag whose version matches `package.json`. Bump the
`version` field in `package.json` first (currently `0.2.1`), commit it, then tag and push:

```
git tag v1.2.3
git push origin v1.2.3
```

The workflow then:

1. Checks out and sets up Node 20 with `registry-url: https://registry.npmjs.org`, then `npm ci`.
2. **Verifies the tag matches the version** – strips the leading `v` from the tag and
   compares it to `package.json`'s `version`. If they differ (e.g. tag `v1.2.3` but
   `package.json` says `1.2.2`) the job fails with a clear `::error::` message, so a
   mistagged release never gets published.
3. Builds the package with `npm run package` (`svelte-package --input src --output dist`
   - `publint`), producing `dist/`. This is the same build `prepublishOnly` runs.
4. Runs `npm pack` to create the `lkmc-system7-ui-<version>.tgz` tarball.
5. Creates a **GitHub Release** for the tag via `softprops/action-gh-release@v2` with
   `generate_release_notes: true`, attaching the `*.tgz` tarball. Requires
   `permissions: contents: write` (declared at workflow level).
6. **Publishes to npm** with `npm publish --access public`
   (`publishConfig.access` is `public`), authenticating via
   `NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}`. This step is **guarded**: it only runs when
   `NPM_TOKEN` is set. When the token is absent the workflow still succeeds (build + GitHub
   Release) and prints a `::warning::` that publishing was skipped. This mirrors the manual
   `scripts/publish-npm.sh` flow (`npm run package` then `npm publish --access public`),
   minus the interactive OTP prompt.

### Artifacts and where they are published

- **Tarball** (`lkmc-system7-ui-<version>.tgz`) – attached to the GitHub Release for the tag.
- **npm package** – published as [`@lkmc/system7-ui`](https://www.npmjs.com/package/@lkmc/system7-ui)
  on the public npm registry, but only when `NPM_TOKEN` is configured.

## Secrets

| Secret      | Required? | Used by       | Purpose                                                                                                                              |
| ----------- | --------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `NPM_TOKEN` | Optional  | `release.yml` | npm automation token for `npm publish`. If unset, publishing is skipped (with a warning) and the rest of the release still succeeds. |

`ci.yml` and the build + GitHub Release steps of `release.yml` need **no secrets** —
they run on the workflow's built-in `GITHUB_TOKEN`. Only npm publishing is gated on the
optional `NPM_TOKEN`. Add it under **Settings → Secrets and variables → Actions** to enable
automatic npm releases.
