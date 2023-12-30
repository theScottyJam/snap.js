function isLength(value) {
  return Number.isInteger(value) && value >= 0;
}

describe('isLength()', () => {
  it('returns true on positive integers', () => {
    expect(isLength(2)).toBe(true);
  });

  it('returns true on the number 0', () => {
    expect(isLength(0)).toBe(true);
  });

  it('returns false on strings', () => {
    expect(isLength('2')).toBe(false);
  });

  it('returns false with Infinity', () => {
    expect(isLength(Infinity)).toBe(false);
  });

  it('returns false with NaN', () => {
    expect(isLength(NaN)).toBe(false);
  });

  it('returns false with floats', () => {
    expect(isLength(2.3)).toBe(false);
  });

  it('returns false with large numbers (as those are represented as floats)', () => {
    expect(isLength(2e999)).toBe(false);
  });
});
