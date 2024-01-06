function countBy(array, iteratee = x => x) {
  const result = {};
  for (const value of array) {
    const changedValue = iteratee(value);
    result[changedValue] ??= 0;
    result[changedValue]++;
  }
  return result;
}

describe('countBy()', () => {
  it('can can count values in the array via the provided iteratee', () => {
    const result = countBy([6.1, 4.2, 6.3], Math.floor);
    expect(result).toEqual({ 4: 1, 6: 2 });
  });

  it('can use its default parameter', () => {
    const result = countBy(['A', 'B', 'A']);
    expect(result).toEqual({ A: 2, B: 1 });
  });

  it('returns an empty object when given an empty array', () => {
    const result = countBy([]);
    expect(result).toEqual({});
  });
});
