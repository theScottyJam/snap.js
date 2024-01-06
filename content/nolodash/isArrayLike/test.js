function isArrayLike(value) {
  return (
    typeof value !== 'function' &&
    Number.isInteger(value?.length) &&
    value.length >= 0
  );
}

describe('isArrayLike()', () => {
  it('considers an array to be array-like', () => {
    expect(isArrayLike([2, 3])).toBe(true);
  });

  it('considers a string to be array-like', () => {
    expect(isArrayLike('23')).toBe(true);
  });

  it('considers an arguments object to be array-like', () => {
    (function () {
      expect(isArrayLike(arguments)).toBe(true);
    })();
  });

  it('does not consider a function to be array-like', () => {
    expect(isArrayLike(function () {})).toBe(false);
  });

  it('considers a value missing a length property to not be array-like', () => {
    expect(isArrayLike({})).toBe(false);
  });

  it('considers a value with a positive integer length to be array-like', () => {
    expect(isArrayLike({ length: 2 })).toBe(true);
  });

  it('considers a value with the length 0 to be array-like', () => {
    expect(isArrayLike({ length: 0 })).toBe(true);
  });

  it('considers a value with a string length to not be array-like', () => {
    expect(isArrayLike({ length: '2' })).toBe(false);
  });

  it('considers a value with a length of Infinity to not be array-like', () => {
    expect(isArrayLike({ length: Infinity })).toBe(false);
  });

  it('considers a value with a length of NaN to not be array-like', () => {
    expect(isArrayLike({ length: NaN })).toBe(false);
  });

  it('considers a value with a float length to not be array-like', () => {
    expect(isArrayLike({ length: 2.3 })).toBe(false);
  });

  it('considers a value with a really large length to not be array-like (as those are represented as floats)', () => {
    expect(isArrayLike({ length: 2e999 })).toBe(false);
  });
});
