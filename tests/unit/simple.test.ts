import { describe, it, expect } from 'vitest';

describe('Simple test suite', () => {
  it('should pass a basic assertion', () => {
    expect(1 + 1).toBe(2);
  });

  it('should handle string operations', () => {
    const greeting = 'Hello';
    const name = 'World';
    expect(`${greeting} ${name}`).toBe('Hello World');
  });

  it('should work with arrays', () => {
    const array = [1, 2, 3];
    expect(array).toHaveLength(3);
    expect(array).toContain(2);
  });
});