# @lkmc/system7-ui

Reusable System 7 visual components for Svelte/Tauri apps.

![Preview of components](./screenshot.png)

## Install

```bash
npm install @lkmc/system7-ui
```

For local development before publishing:

```json
{
  "dependencies": {
    "@lkmc/system7-ui": "file:../../system7-ui/lkmc-system7-ui-0.1.0.tgz"
  }
}
```

## Usage

Import the shared stylesheet once in your root layout:

```ts
import '@lkmc/system7-ui/styles.css';
```

Import components from the package root:

```svelte
<script lang="ts">
  import { Button, TitleBar } from '@lkmc/system7-ui';
</script>
```

## Exports

- `BalloonHelp`
- `Button`
- `Checkbox`
- `ConfirmDialog`
- `CopyIcon`
- `DownloadIcon`
- `Dropdown`
- `EditIcon`
- `ErrorBanner`
- `ModalDialog`
- `MovableDialog`
- `Notification`
- `Radio`
- `TitleBar`
- `TrashIcon`

## BalloonHelp

`BalloonHelp` wraps any element and shows hover help text.

```svelte
<script lang="ts">
  import { BalloonHelp, Button } from '@lkmc/system7-ui';

  const helpMessage = [
    '**Scan profile tips**',
    '',
    '- Quick: common ports',
    '- Deep: larger scan range',
    '- Use `Auto refresh` for live updates'
  ].join('\n');
</script>

<BalloonHelp markdown message={helpMessage} position="bottom" delay={600}>
  <Button>Hover for help</Button>
</BalloonHelp>
```

Props:

- `message` (`string`): Balloon text content.
- `position` (`'top' | 'bottom'`, default `bottom`): Preferred side of the anchor element.
- `delay` (`number`, default `1000`): Hover delay in milliseconds before showing.
- `markdown` (`boolean`, default `false`): Renders `message` as Markdown (raw HTML input is disabled).

Behavior notes:

- Automatically repositions to stay within the viewport bounds.
- Constrains width/height and wraps long text to avoid screen overflow.

## Demo project

A local demo app is included in `demo/` to preview all components.

```bash
npm run demo:install
npm run demo:dev
```

Build the demo:

```bash
npm run demo:build
```

## License note

The Unlicense in this repository applies to the code authored in this package.

Bundled fonts in `src/assets/fonts` are third-party assets and are not re-licensed by this repository. They keep their original licenses and terms.

## Packaging and publish

```bash
npm install
npm run package
npm login --scope=@lkmc --registry=https://registry.npmjs.org/
npm publish --access public
```

Or use the helper script:

```bash
npm run publish:npm
```

With 2FA OTP:

```bash
npm run publish:npm -- --otp 123456
```

If your npm account enforces 2FA for publish, include an OTP:

```bash
npm publish --access public --otp=123456
```

Or use a granular access token with publish permission and 2FA bypass enabled.

## Publishing updates

For each new release:

```bash
# choose one
npm version patch
# npm version minor
# npm version major

npm run publish:npm
# or, with 2FA
# npm run publish:npm -- --otp 123456
```

The publish script runs `npm run check` and `npm run package` before publishing.

Optional flags:

```bash
# only if you already ran checks/package yourself
npm run publish:npm -- --skip-check --skip-package
```

This creates a git commit + tag for the version bump. Push both after publishing:

```bash
git push
git push --tags
```

Then update consuming apps to the new package version:

```bash
npm install @lkmc/system7-ui@^<new-version>
```

For a local package archive (without publishing):

```bash
npm pack
```

This creates `lkmc-system7-ui-<version>.tgz` that consumers can install.
