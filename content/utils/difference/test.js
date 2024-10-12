describe('difference()', () => {
  it('calculates the difference of two arrays', () => {
    expect($.difference(['a', 'b', 'c'], ['c', 'd'])).toEqual(['a', 'b']);
  });

  it('returns an empty array when all elements are removed', () => {
    expect($.difference(['x'], ['x', 'y'])).toEqual([]);
  });

  it('returns an empty array when input arrays are empty', () => {
    expect($.difference([], [])).toEqual([]);
  });
});
