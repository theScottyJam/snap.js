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

describe('before()', () => {
  it('returns the last result after n calls', () => {
    const fn = before(4, x => x ** 2);

    expect(fn(1)).toEqual(1);
    expect(fn(2)).toEqual(4);
    expect(fn(3)).toEqual(9);
    expect(fn(4)).toEqual(9);
    expect(fn(5)).toEqual(9);
  });

  it('preserves the "this" argument', () => {
    let self;
    const fn = before(3, function () {
      self = this;
    });

    const myThis = { x: 2 };
    fn.call(myThis);

    expect(self).toEqual(myThis);
  });
});
