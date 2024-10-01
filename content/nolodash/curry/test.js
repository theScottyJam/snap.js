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

  function curry(func, arity, _appliedArgs = {}, _numApplied = 0) {
    return (...args) => {
      const appliedArgs = { ..._appliedArgs };
      let numApplied = _numApplied;
      for (let i = 0; i < arity; i++) {
        if (i in appliedArgs) continue;
        if (args[0] !== _) {
          numApplied++;
          appliedArgs[i] = args[0];
        }
        args.shift();
        if (args.length === 0) break;
      }

      if (numApplied === arity) {
        return func(...Array.from({ ...appliedArgs, length: arity }));
      } else {
        return curry(func, arity, appliedArgs, numApplied);
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

  it('allows you to fill all parameters except for skipped ones', () => {
    const fn = curry((a, b, c, d) => a + b + c + d, 4);
    expect(fn('a', _, _, 'd')('b')('c')).toEqual('abcd');
  });

  it('can call a curried function with an arity argument of 0', () => {
    const fn = curry(() => 'result', 0);
    expect(fn()).toEqual('result');
  });
});
