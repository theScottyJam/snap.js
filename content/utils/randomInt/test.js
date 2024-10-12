describe('randomInt()', () => {
  const TEST_REPETITIONS = 50;

  it('returns a number within the bounds', () => {
    for (let i = 0; i < TEST_REPETITIONS; ++i) {
      const result = $.randomInt(5, 10);
      expect(result).toBeGreaterThanOrEqual(5);
      expect(result).toBeLessThan(10);
    }
  });

  it('returns a whole number', () => {
    for (let i = 0; i < TEST_REPETITIONS; ++i) {
      const result = $.randomInt(5, 10);
      expect(Math.round(result)).toBe(result);
    }
  });
});
