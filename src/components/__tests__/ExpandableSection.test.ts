import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';

import ExpandableSection from '../ExpandableSection.svelte';

describe('ExpandableSection', () => {
  it('renders a disclosure triangle and label', () => {
    render(ExpandableSection, {
      props: { label: 'Files' }
    });

    expect(screen.getByRole('button', { name: 'Files' })).toBeTruthy();
    expect(screen.getByText('Files')).toBeTruthy();
  });

  it('toggles expanded state on click', async () => {
    const handleToggle = vi.fn();

    render(ExpandableSection, {
      props: { label: 'Details', onchange: handleToggle }
    });

    await fireEvent.click(screen.getByRole('button', { name: 'Details' }));

    expect(handleToggle).toHaveBeenCalledTimes(1);
    expect(handleToggle).toHaveBeenCalledWith(true);
  });

  it('does not toggle when disabled', async () => {
    const handleToggle = vi.fn();

    render(ExpandableSection, {
      props: { label: 'Disabled', disabled: true, onchange: handleToggle }
    });

    await fireEvent.click(screen.getByRole('button', { name: 'Disabled' }));

    expect(handleToggle).not.toHaveBeenCalled();
  });

  it('renders content container when expanded', () => {
    const { container } = render(ExpandableSection, {
      props: { expanded: true, label: 'Content' }
    });

    expect(container.querySelector('.content')).toBeTruthy();
  });

  it('aria-expanded reflects current state', () => {
    render(ExpandableSection, {
      props: { expanded: true, label: 'Active' }
    });

    const button = screen.getByRole('button', { name: 'Active' });
    expect(button.getAttribute('aria-expanded')).toBe('true');
  });
});
