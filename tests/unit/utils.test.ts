import { describe, it, expect } from 'vitest';

// Simple utility function to test
function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount);
}

describe('Utility Functions', () => {
  it('formats currency correctly', () => {
    expect(formatCurrency(1000)).toBe('$1,000.00');
    expect(formatCurrency(1000, 'EUR')).toBe('€1,000.00');
  });
  
  it('handles decimal values', () => {
    expect(formatCurrency(1000.5)).toBe('$1,000.50');
    expect(formatCurrency(1000.55)).toBe('$1,000.55');
  });
  
  it('handles negative values', () => {
    expect(formatCurrency(-1000)).toBe('-$1,000.00');
  });
});