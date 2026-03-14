import { describe, expect, it } from 'vitest';

import {
  applySystem7SystemColors,
  getSystem7ColorStyle,
  getSystem7ColorVariables
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

  it('builds inline style strings', () => {
    const style = getSystem7ColorStyle({
      accentColor: '#3366cc',
      highlightTextColor: '#f0f0f0'
    });

    expect(style).toContain('--system7-color-accent: #3366CC');
    expect(style).toContain('--system7-color-highlight-text: #F0F0F0');
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
