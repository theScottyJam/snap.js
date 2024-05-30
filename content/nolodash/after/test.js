function after(n, func) {
  let callCount = 0;
  return function (...args) {
    callCount++;
    if (callCount < n) {
      return;
    }

    // Using .call() may be overkill.
    // You could just do `return func(...args)` if you
    // don't need to worry about preserving the "this" argument.
    return func.call(this, ...args);
  };
}

describe('after()', () => {
  it('calls the passed-in callback as normal once returned function has been called n times', () => {
    const fn = after(3, (x, y) => x + y);

    expect(fn(2, 3)).toEqual(undefined);
    expect(fn(2, 3)).toEqual(undefined);
    expect(fn(2, 3)).toEqual(5);
  });

  it('preserves the "this" argument', () => {
    let self;

    const fn = after(1, function () {
      self = this;
    });

    const myThis = { x: 2 };
    fn.call(myThis);

    expect(self).toEqual(myThis);
  });
});
