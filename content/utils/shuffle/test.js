describe('shuffle()', () => {
  const TEST_REPETITIONS = 10;

  it('returns an array with entries that are all in the original array', () => {
    for (let i = 0; i < TEST_REPETITIONS; ++i) {
      const originalArray = ['a', 'b', 'c', 'd', 'e'];
      const result = $.shuffle(originalArray);
      for (const entry of result) {
        expect(originalArray).toContain(entry);
      }
    }
  });

  it('returns an array where all entries of the original array are found in the returned one', () => {
    for (let i = 0; i < TEST_REPETITIONS; ++i) {
      const originalArray = ['a', 'b', 'c', 'd', 'e'];
      const result = $.shuffle(originalArray);
      for (const entry of originalArray) {
        expect(result).toContain(entry);
      }
    }
  });
});
