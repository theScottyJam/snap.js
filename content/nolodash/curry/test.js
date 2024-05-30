describe('curry() without "_" placeholder support', () => {
  function curry(func, arity, _appliedArgs = []) {
    return (...args) => {
      const newAppliedArgs = [..._appliedArgs, ...args];
      if (newAppliedArgs.length < arity) {
        return curry(func, arity, newAppliedArgs);
      } else {
        return func(...newAppliedArgs);
      }
    };
  }

  it('can curry a function', () => {
    const fn = curry((a, b) => a + b, 2);
    expect(fn('a')('b')).toEqual('ab');
  });

  it('allows you to supply multiple arguments at once to a curried function', () => {
    const fn = curry((a, b, c) => a + b + c, 3);
    expect(fn('a', 'b')('c')).toEqual('abc');
  });

  it('can call a curried function with an arity argument of 0', () => {
    const fn = curry(() => 'result', 0);
    expect(fn()).toEqual('result');
  });
});

describe('curry() with "_" placeholder support', () => {
  const _ = Symbol('curry placeholder');

  function curry(func, arity, _appliedArgs = {}) {
    return (...args) => {
      const appliedArgs = { ..._appliedArgs };
      for (let i = 0; i < arity; i++) {
        if (i in appliedArgs) continue;
        if (args[0] !== _) {
          appliedArgs[i] = args[0];
        }
        args.shift();
        if (args.length === 0) break;
      }

      if (arity - 1 in appliedArgs || arity === 0) {
        return func(...Array.from({ ...appliedArgs, length: arity }));
      } else {
        return curry(func, arity, appliedArgs);
      }
    };
  }

  it('can curry a function', () => {
    const fn = curry((a, b) => a + b, 2);
    expect(fn('a')('b')).toEqual('ab');
  });

  it('allows you to supply multiple arguments at once to a curried function', () => {
    const fn = curry((a, b, c) => a + b + c, 3);
    expect(fn('a', 'b')('c')).toEqual('abc');
  });

  it('allows you to skip parameters when partially apply a curried function', () => {
    const fn = curry((a, b, c) => a + b + c, 3);
    expect(fn(_, 'b')('a', 'c')).toEqual('abc');
  });

  it('can call a curried function with an arity argument of 0', () => {
    const fn = curry(() => 'result', 0);
    expect(fn()).toEqual('result');
  });
});
