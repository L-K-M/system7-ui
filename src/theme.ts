export interface System7SystemColors {
  accentColor?: string | null;
  accentTextColor?: string | null;
  highlightColor?: string | null;
  highlightTextColor?: string | null;
  accent_color?: string | null;
  accent_text_color?: string | null;
  highlight_color?: string | null;
  highlight_text_color?: string | null;
}

export interface System7ColorVariables {
  '--system7-color-accent'?: string;
  '--system7-color-accent-text'?: string;
  '--system7-color-highlight'?: string;
  '--system7-color-highlight-text'?: string;
}

export interface System7WindowToneVariables {
  '--system7-color-focus-ring'?: string;
  '--system7-color-titlebar-edge-light'?: string;
  '--system7-color-titlebar-edge-dark'?: string;
  '--system7-color-titlebar-edge-verydark'?: string;
  '--system7-color-titlebar-button'?: string;
  '--system7-color-scrollbar-thumb'?: string;
  '--system7-color-scrollbar-thumb-line'?: string;
}

const HEX_COLOR_PATTERN = /^#[0-9a-fA-F]{6}$/;
const SHORT_HEX_COLOR_PATTERN = /^#[0-9a-fA-F]{3}$/;

function normalizeHexColor(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  let normalized = value.trim();

  if (SHORT_HEX_COLOR_PATTERN.test(normalized)) {
    const [r, g, b] = normalized.slice(1);
    normalized = `#${r}${r}${g}${g}${b}${b}`;
  }

  if (!HEX_COLOR_PATTERN.test(normalized)) {
    return null;
  }

  return normalized.toUpperCase();
}

function resolveColorValue(
  colors: System7SystemColors,
  camelKey: 'accentColor' | 'accentTextColor' | 'highlightColor' | 'highlightTextColor',
  snakeKey: 'accent_color' | 'accent_text_color' | 'highlight_color' | 'highlight_text_color'
): string | null {
  return normalizeHexColor(colors[camelKey] ?? colors[snakeKey] ?? null);
}

export function getSystem7ColorVariables(colors: System7SystemColors): System7ColorVariables {
  const accentColor = resolveColorValue(colors, 'accentColor', 'accent_color');
  const accentTextColor = resolveColorValue(colors, 'accentTextColor', 'accent_text_color');
  const highlightColor = resolveColorValue(colors, 'highlightColor', 'highlight_color');
  const highlightTextColor = resolveColorValue(
    colors,
    'highlightTextColor',
    'highlight_text_color'
  );

  return {
    ...(accentColor ? { '--system7-color-accent': accentColor } : {}),
    ...(accentTextColor ? { '--system7-color-accent-text': accentTextColor } : {}),
    ...(highlightColor ? { '--system7-color-highlight': highlightColor } : {}),
    ...(highlightTextColor ? { '--system7-color-highlight-text': highlightTextColor } : {})
  };
}

export function getSystem7ColorStyle(colors: System7SystemColors): string {
  const variables = getSystem7ColorVariables(colors);

  return Object.entries(variables)
    .map(([name, value]) => `${name}: ${value}`)
    .join('; ');
}

interface RgbColor {
  r: number;
  g: number;
  b: number;
}

function hexToRgb(value: string): RgbColor {
  return {
    r: parseInt(value.slice(1, 3), 16),
    g: parseInt(value.slice(3, 5), 16),
    b: parseInt(value.slice(5, 7), 16)
  };
}

function rgbToHex({ r, g, b }: RgbColor): string {
  return `#${[r, g, b]
    .map((channel) =>
      Math.max(0, Math.min(255, Math.round(channel)))
        .toString(16)
        .padStart(2, '0')
    )
    .join('')
    .toUpperCase()}`;
}

function mixHexColors(fromHex: string, toHex: string, ratio: number): string {
  const clampedRatio = Math.max(0, Math.min(1, ratio));
  const from = hexToRgb(fromHex);
  const to = hexToRgb(toHex);

  return rgbToHex({
    r: from.r + (to.r - from.r) * clampedRatio,
    g: from.g + (to.g - from.g) * clampedRatio,
    b: from.b + (to.b - from.b) * clampedRatio
  });
}

/**
 * Derives the window chrome tones (title bar rails, title bar buttons and
 * scrollbar detailing) from a single window accent color, like classic
 * System 7 colored windows. Returns an empty object when the accent color
 * is missing or not a valid hex color.
 *
 * The focus ring is included because the stylesheet derives
 * `--system7-color-focus-ring` from the accent at `:root`; re-declaring it
 * alongside a scoped accent override keeps the two in sync.
 */
export function getSystem7WindowToneVariables(
  accentColor: string | null | undefined
): System7WindowToneVariables {
  const normalized = normalizeHexColor(accentColor);

  if (!normalized) {
    return {};
  }

  return {
    '--system7-color-focus-ring': normalized,
    '--system7-color-titlebar-edge-light': mixHexColors(normalized, '#FFFFFF', 0.55),
    '--system7-color-titlebar-edge-dark': mixHexColors(normalized, '#000000', 0.25),
    '--system7-color-titlebar-edge-verydark': mixHexColors(normalized, '#000000', 0.42),
    '--system7-color-titlebar-button': mixHexColors(normalized, '#FFFFFF', 0.82),
    '--system7-color-scrollbar-thumb': mixHexColors(normalized, '#FFFFFF', 0.7),
    '--system7-color-scrollbar-thumb-line': mixHexColors(normalized, '#000000', 0.18)
  };
}

/**
 * Builds an inline `style` attribute value that applies the accent and
 * highlight colors plus the window tones derived from the accent color.
 * Intended for a window frame element (e.g. `.s7-root`) themed after the
 * host OS colors.
 */
export function getSystem7WindowStyle(colors: System7SystemColors): string {
  const accentColor = resolveColorValue(colors, 'accentColor', 'accent_color');
  const variables: Record<string, string> = {
    ...getSystem7ColorVariables(colors),
    ...getSystem7WindowToneVariables(accentColor)
  };

  return Object.entries(variables)
    .map(([name, value]) => `${name}: ${value}`)
    .join('; ');
}

export function applySystem7SystemColors(
  colors: System7SystemColors,
  target?: HTMLElement | null
): void {
  const variables = getSystem7ColorVariables(colors);
  const element = target ?? (typeof document === 'undefined' ? null : document.documentElement);

  if (!element) {
    return;
  }

  const variableNames = [
    '--system7-color-accent',
    '--system7-color-accent-text',
    '--system7-color-highlight',
    '--system7-color-highlight-text'
  ] as const;

  for (const name of variableNames) {
    const value = variables[name];
    if (value) {
      element.style.setProperty(name, value);
    } else {
      element.style.removeProperty(name);
    }
  }
}
