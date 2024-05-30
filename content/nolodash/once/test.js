function once(func) {
  let cachedResult;
  let hasCachedResult = false;
  return function (...args) {
    if (hasCachedResult) {
      return cachedResult;
    }

    hasCachedResult = true;
    cachedResult = func.call(this, ...args);
    return cachedResult;
  };
}
function before(n, func) {
  let lastResult;
  return function (...args) {
    n--;
    if (n <= 0) {
      return lastResult;
    }

    lastResult = func.call(this, ...args);
    return lastResult;
  };
}

describe('once()', () => {
  it('returns the last result after one calls', () => {
    const fn = once(x => x ** 2);

    expect(fn(2)).toEqual(4);
    // Regardless of what is passed in, we always get the first answer back
    expect(fn(3)).toEqual(4);
    expect(fn(4)).toEqual(4);
    expect(fn(5)).toEqual(4);
  });

  it('preserves the "this" argument', () => {
    let self;
    const fn = once(function () {
      self = this;
    });

    const myThis = { x: 2 };
    fn.call(myThis);

    expect(self).toEqual(myThis);
  });
});
