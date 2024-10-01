describe('curryRight() without "_" placeholder support', () => {
  function curryRight(func, arity, _appliedArgs = []) {
    return (...args) => {
      const newAppliedArgs = [...args, ..._appliedArgs];
      if (newAppliedArgs.length < arity) {
        return curryRight(func, arity, newAppliedArgs);
      } else {
        return func(...newAppliedArgs);
      }
    };
  }

  it('can curry a function', () => {
    const fn = curryRight((a, b) => a + b, 2);
    expect(fn('a')('b')).toEqual('ba');
  });

  it('allows you to supply multiple arguments at once to a curried function', () => {
    const fn = curryRight((a, b, c) => a + b + c, 3);
    expect(fn('a', 'b')('c')).toEqual('cab');
  });

  it('can call a curried function with an arity argument of 0', () => {
    const fn = curryRight(() => 'result', 0);
    expect(fn()).toEqual('result');
  });
});

describe('curryRight() with "_" placeholder support', () => {
  const _ = Symbol('curry placeholder');

  function curryRight(func, arity, _appliedArgs = {}, _numApplied = 0) {
    return (...args) => {
      const appliedArgs = { ..._appliedArgs };
      let numApplied = _numApplied;
      for (let i = arity - 1; i >= 0; i--) {
        if (i in appliedArgs) continue;
        if (args.at(-1) !== _) {
          numApplied++;
          appliedArgs[i] = args.at(-1);
        }
        args.pop();
        if (args.length === 0) break;
      }

      if (numApplied === arity) {
        return func(...Array.from({ ...appliedArgs, length: arity }));
      } else {
        return curryRight(func, arity, appliedArgs, numApplied);
      }
    };
  }

  it('can curry a function', () => {
    const fn = curryRight((a, b) => a + b, 2);
    expect(fn('b')('a')).toEqual('ab');
  });

  it('allows you to supply multiple arguments at once to a curried function', () => {
    const fn = curryRight((a, b, c) => a + b + c, 3);
    expect(fn('b', 'c')('a')).toEqual('abc');
  });

  it('allows you to skip parameters when partially apply a curried function', () => {
    const fn = curryRight((a, b, c) => a + b + c, 3);
    expect(fn('b', _)('a', 'c')).toEqual('abc');
  });

  it('allows you to fill all parameters except for skipped ones', () => {
    const fn = curryRight((a, b, c, d) => a + b + c + d, 4);
    expect(fn('a', _, _, 'd')('c')('b')).toEqual('abcd');
  });

  it('can call a curried function with an arity argument of 0', () => {
    const fn = curryRight(() => 'result', 0);
    expect(fn()).toEqual('result');
  });
});
