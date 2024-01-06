function keyBy(collection, iteratee = x => x) {
  const result = {};
  for (const value of collection) {
    const key = iteratee(value);
    result[key] = value;
  }
  return result;
}

describe('keyBy()', () => {
  it('will group array entries into an object, according to the keys returned by iteratee', () => {
    const array = [
      { 'dir': 'left', 'code': 97 },
      { 'dir': 'right', 'code': 100 }
    ];
     
    const result = keyBy(array, o => String.fromCharCode(o.code));

    expect(result).toEqual({
      a: { 'dir': 'left', 'code': 97 },
      d: { 'dir': 'right', 'code': 100 },
    });
  });

  it('will use the last-found value when a conflict occures', () => {
    const array = [3, 4, 5];

    const result = keyBy(array, n => n % 2 === 0 ? 'even' : 'odd');

    expect(result).toEqual({
      even: 4,
      odd: 5,
    });
  });
});
