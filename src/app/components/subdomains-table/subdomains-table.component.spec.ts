import { describe, expect, it } from 'vitest';

import { passesLiveness } from './subdomains-table.component';

describe('passesLiveness', () => {
  it('shows everything when unfiltered, answered or not', () => {
    for (const liveness of ['active', 'inactive', 'error', 'pending', undefined] as const) {
      expect(passesLiveness('all', liveness)).toBe(true);
    }
  });

  it('keeps only names with the requested answer', () => {
    expect(passesLiveness('active', 'active')).toBe(true);
    expect(passesLiveness('active', 'inactive')).toBe(false);
    expect(passesLiveness('inactive', 'inactive')).toBe(true);
    expect(passesLiveness('inactive', 'active')).toBe(false);
  });

  it('hides names without a definite answer once filtered', () => {
    for (const liveness of ['error', 'pending', undefined] as const) {
      expect(passesLiveness('active', liveness)).toBe(false);
      expect(passesLiveness('inactive', liveness)).toBe(false);
    }
  });
});
