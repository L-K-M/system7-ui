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
