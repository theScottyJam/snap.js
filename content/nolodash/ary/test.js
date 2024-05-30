function ary(func, n) {
  return function (...args) {
    // Using .call() may be overkill.
    // You could just do `return func(...args.slice(0, n))` if you
    // don't need to worry about preserving the "this" argument.
    return func.call(this, ...args.slice(0, n));
  };
}

describe('ary()', () => {
  it('only passes in the first n arguments', () => {
    const fn = ary((x, y, z) => [x, y, z], 2);

    expect(fn(2, 3, 4)).toEqual([2, 3, undefined]);
  });

  it('preserves the "this" argument', () => {
    let self;

    const fn = ary(function () {
      self = this;
    }, 0);

    const myThis = { x: 2 };
    fn.call(myThis);

    expect(self).toEqual(myThis);
  });
});
