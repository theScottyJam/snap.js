function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

describe('randomChoice()', () => {
  const TEST_REPETITIONS = 10;

  it('returns an element from the original array', () => {
    for (let i = 0; i < TEST_REPETITIONS; ++i) {
      const array = ['a', 'b', 'c', 'd', 'e'];
      expect(array).toContain(randomChoice(array));
    }
  });
});
