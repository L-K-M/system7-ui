import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';

import ProgressBar from '../ProgressBar.svelte';

describe('ProgressBar', () => {
  it('renders aria attributes and width from value/max', () => {
    render(ProgressBar, {
      props: {
        value: 30,
        max: 120,
        height: 12,
        title: 'Download progress',
        ariaLabel: 'Download progress'
      }
    });

    const progressBar = screen.getByRole('progressbar') as HTMLDivElement;
    const fill = progressBar.querySelector('.fill') as HTMLDivElement;

    expect(progressBar.getAttribute('aria-valuemin')).toBe('0');
    expect(progressBar.getAttribute('aria-valuemax')).toBe('120');
    expect(progressBar.getAttribute('aria-valuenow')).toBe('30');
    expect(progressBar.getAttribute('aria-label')).toBe('Download progress');
    expect(progressBar.getAttribute('title')).toBe('Download progress');
    expect(progressBar.style.height).toBe('12px');
    expect(fill.style.width).toBe('25%');
  });

  it('clamps values and normalizes non-positive max', () => {
    render(ProgressBar, {
      props: {
        value: 999,
        max: 0
      }
    });

    const progressBar = screen.getByRole('progressbar') as HTMLDivElement;
    const fill = progressBar.querySelector('.fill') as HTMLDivElement;

    expect(progressBar.getAttribute('aria-valuemax')).toBe('1');
    expect(progressBar.getAttribute('aria-valuenow')).toBe('1');
    expect(fill.style.width).toBe('100%');
  });

  it('prevents negative values from rendering below zero', () => {
    render(ProgressBar, {
      props: {
        value: -5,
        max: 10
      }
    });

    const progressBar = screen.getByRole('progressbar') as HTMLDivElement;
    const fill = progressBar.querySelector('.fill') as HTMLDivElement;

    expect(progressBar.getAttribute('aria-valuenow')).toBe('0');
    expect(fill.style.width).toBe('0%');
  });

  it('omits aria-valuenow and fills the track when indeterminate', () => {
    render(ProgressBar, {
      props: {
        indeterminate: true,
        value: 42
      }
    });

    const progressBar = screen.getByRole('progressbar') as HTMLDivElement;
    const fill = progressBar.querySelector('.fill') as HTMLDivElement;

    expect(progressBar.hasAttribute('aria-valuenow')).toBe(false);
    expect(fill.classList.contains('indeterminate')).toBe(true);
    expect(fill.style.width).toBe('');
  });

  it('reports aria-valuenow again when indeterminate is turned off', async () => {
    const { rerender } = render(ProgressBar, {
      props: {
        indeterminate: true,
        value: 42
      }
    });

    await rerender({ indeterminate: false, value: 42 });

    const progressBar = screen.getByRole('progressbar') as HTMLDivElement;
    const fill = progressBar.querySelector('.fill') as HTMLDivElement;

    expect(progressBar.getAttribute('aria-valuenow')).toBe('42');
    expect(fill.style.width).toBe('42%');
  });
});
