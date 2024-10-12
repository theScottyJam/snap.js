describe('zip()', () => {
  const range = (start, stop) =>
    Array.from({ length: stop - start }, (_, i) => i + start);

  it('zips up arrays', () => {
    const zipped = [...$.zip(range(0, 3), range(3, 6))];
    expect(zipped).toEqual([
      [0, 3],
      [1, 4],
      [2, 5],
    ]);
  });

  it('discards elements from longer arrays', () => {
    const zipped = [...$.zip(range(0, 3), range(3, 9))];
    expect(zipped).toEqual([
      [0, 3],
      [1, 4],
      [2, 5],
    ]);
  });

  it('zips up three arrays', () => {
    const zipped = [...$.zip([1, 4], [2, 5], [3, 6])];
    expect(zipped).toEqual([
      [1, 2, 3],
      [4, 5, 6],
    ]);
  });

  it('zips up a single arrays', () => {
    const zipped = [...$.zip([1, 2, 3])];
    expect(zipped).toEqual([[1], [2], [3]]);
  });

  it('zips up no arrays', () => {
    const zipped = [...$.zip()];
    expect(zipped).toEqual([]);
  });

  it('zips up empty arrays', () => {
    const zipped = [...$.zip([], [])];
    expect(zipped).toEqual([]);
  });
});
