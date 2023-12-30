function isArrayLikeObject(value) {
  return isArrayLike(value) && isObject(value);
}

function isArrayLike(value) {
  return (
    typeof value !== 'function' &&
    Number.isInteger(value?.length) &&
    value.length >= 0
  );
}

function isObject(value) {
  return value === Object(value);
}

describe('isArrayLikeObject()', () => {
  it('considers an array to be an array-like object', () => {
    expect(isArrayLikeObject([2, 3])).toBe(true);
  });

  it('does not considers a string to be an array-like object', () => {
    expect(isArrayLikeObject('23')).toBe(false);
  });

  it('considers an arguments object to be an array-like object', () => {
    (function() {
      expect(isArrayLikeObject(arguments)).toBe(true);
    })();
  });

  it('does not consider a function to be an array-like object', () => {
    expect(isArrayLikeObject(function() {})).toBe(false);
  });

  it('considers a value missing a length property to not be an array-like object', () => {
    expect(isArrayLikeObject({})).toBe(false);
  });

  it('considers a value with a positive integer length to be an array-like object', () => {
    expect(isArrayLikeObject({ length: 2 })).toBe(true);
  });

  it('considers a value with the length 0 to be an array-like object', () => {
    expect(isArrayLikeObject({ length: 0 })).toBe(true);
  });

  it('considers a value with a string length to not be an array-like object', () => {
    expect(isArrayLikeObject({ length: '2' })).toBe(false);
  });

  it('considers a value with a length of Infinity to not be an array-like object', () => {
    expect(isArrayLikeObject({ length: Infinity })).toBe(false);
  });

  it('considers a value with a length of NaN to not be an array-like object', () => {
    expect(isArrayLikeObject({ length: NaN })).toBe(false);
  });

  it('considers a value with a float length to not be an array-like object', () => {
    expect(isArrayLikeObject({ length: 2.3 })).toBe(false);
  });

  it('considers a value with a really large length to not be an array-like object (as those are represented as floats)', () => {
    expect(isArrayLikeObject({ length: 2e999 })).toBe(false);
  });
});
