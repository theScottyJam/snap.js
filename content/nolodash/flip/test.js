describe('flip()', () => {
  function flip(func) {
    return function (...args) {
      // Using .call() may be overkill.
      // You could just do `return func(...args.reverse())` if you
      // don't need to worry about preserving the "this" argument.
      return func.call(this, ...args.reverse());
    };
  }

  it('can flip the arguments of a function', () => {
    const fn = flip((a, b) => a + b);
    expect(fn('a', 'b')).toEqual('ba');
  });

  it('preserves the "this" argument', () => {
    let self;
    const fn = flip(function () {
      self = this;
    });

    const myThis = { x: 2 };
    fn.call(myThis);

    expect(self).toEqual(myThis);
  });
});
