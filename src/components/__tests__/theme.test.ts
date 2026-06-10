import { describe, expect, it } from 'vitest';

import {
  applySystem7SystemColors,
  getSystem7ColorStyle,
  getSystem7ColorVariables,
  getSystem7WindowStyle,
  getSystem7WindowToneVariables
} from '../../theme';

describe('system color helpers', () => {
  it('maps snake_case system colors to CSS variables', () => {
    const variables = getSystem7ColorVariables({
      accent_color: '#3366cc',
      accent_text_color: '#ffffff',
      highlight_color: '#88aa00',
      highlight_text_color: '#000000'
    });

    expect(variables).toEqual({
      '--system7-color-accent': '#3366CC',
      '--system7-color-accent-text': '#FFFFFF',
      '--system7-color-highlight': '#88AA00',
      '--system7-color-highlight-text': '#000000'
    });
  });

  it('ignores invalid color values', () => {
    const variables = getSystem7ColorVariables({
      accentColor: '#12345',
      accentTextColor: 'red',
      highlightColor: '#001122'
    });

    expect(variables).toEqual({
      '--system7-color-highlight': '#001122'
    });
  });

  it('expands shorthand hex colors', () => {
    const variables = getSystem7ColorVariables({
      accentColor: '#fff',
      highlightColor: '#3a9'
    });

    expect(variables).toEqual({
      '--system7-color-accent': '#FFFFFF',
      '--system7-color-highlight': '#33AA99'
    });
  });

  it('builds inline style strings', () => {
    const style = getSystem7ColorStyle({
      accentColor: '#3366cc',
      highlightTextColor: '#f0f0f0'
    });

    expect(style).toContain('--system7-color-accent: #3366CC');
    expect(style).toContain('--system7-color-highlight-text: #F0F0F0');
  });

  it('derives window tones from the accent color', () => {
    const variables = getSystem7WindowToneVariables('#6688cc');

    expect(variables).toEqual({
      '--system7-color-focus-ring': '#6688CC',
      '--system7-color-titlebar-edge-light': '#BAC9E8',
      '--system7-color-titlebar-edge-dark': '#4D6699',
      '--system7-color-titlebar-edge-verydark': '#3B4F76',
      '--system7-color-titlebar-button': '#E3EAF6',
      '--system7-color-scrollbar-thumb': '#D1DBF0',
      '--system7-color-scrollbar-thumb-line': '#5470A7'
    });
  });

  it('normalizes shorthand accents and rejects invalid ones for window tones', () => {
    expect(getSystem7WindowToneVariables('#fff')['--system7-color-focus-ring']).toBe('#FFFFFF');
    expect(getSystem7WindowToneVariables('not-a-color')).toEqual({});
    expect(getSystem7WindowToneVariables(null)).toEqual({});
    expect(getSystem7WindowToneVariables(undefined)).toEqual({});
  });

  it('builds a window style with system colors and derived tones', () => {
    const style = getSystem7WindowStyle({
      accent_color: '#6688cc',
      accent_text_color: '#ffffff',
      highlight_color: '#88aa00',
      highlight_text_color: '#000000'
    });

    expect(style).toContain('--system7-color-accent: #6688CC');
    expect(style).toContain('--system7-color-highlight: #88AA00');
    expect(style).toContain('--system7-color-focus-ring: #6688CC');
    expect(style).toContain('--system7-color-titlebar-edge-light: #BAC9E8');
    expect(style).toContain('--system7-color-scrollbar-thumb: #D1DBF0');
  });

  it('omits window tones when no accent color is provided', () => {
    const style = getSystem7WindowStyle({
      highlight_color: '#88aa00'
    });

    expect(style).toBe('--system7-color-highlight: #88AA00');
  });

  it('applies and clears CSS variables on the target element', () => {
    const target = document.createElement('div');
    target.style.setProperty('--system7-color-accent', '#ABCDEF');
    target.style.setProperty('--system7-color-highlight', '#ABCDEF');

    applySystem7SystemColors(
      {
        accent_color: '#123456',
        highlight_text_color: '#ffffff'
      },
      target
    );

    expect(target.style.getPropertyValue('--system7-color-accent')).toBe('#123456');
    expect(target.style.getPropertyValue('--system7-color-highlight-text')).toBe('#FFFFFF');
    expect(target.style.getPropertyValue('--system7-color-accent-text')).toBe('');
    expect(target.style.getPropertyValue('--system7-color-highlight')).toBe('');
  });
});
