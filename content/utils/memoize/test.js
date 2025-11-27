function memoize(fn, { argsToKey = null } = {}) {
  argsToKey = argsToKey ?? ((...args) => {
    if (args.length !== 1) {
      throw new Error(
        'Exactly one argument must be passed in to this memoized function ' +
        '(unless a custom args-to-key mapper is provided)'
      );
    }
    return args[0];
  });

  const cache = new Map();
  return (...args) => {
    const key = argsToKey(...args);
    if (cache.has(key)) return cache.get(key);

    const res = fn(...args);
    cache.set(key, res);
    return res;
  };
}

describe('memoize()', () => {
  it('caches the result of the function call', () => {
    const originalFn = jest.fn(x => x + 1);
    const memoizedFn = memoize(originalFn);

    expect(memoizedFn(5)).toBe(6);
    originalFn.mockReturnValue(null);
    expect(memoizedFn(5)).toBe(6);
  });

  it('caches the promise when the callback is async', async () => {
    const originalFn = jest.fn(async x => x + 1);
    const memoizedFn = memoize(originalFn);

    const promise1 = memoizedFn(5).then(x => expect(x).toBe(6));
    originalFn.mockReturnValue(43);
    const promise2 = memoizedFn(5).then(x => expect(x).toBe(6));

    await Promise.all([promise1, promise2]);
  });

  it('can cache multiple items', () => {
    const originalFn = jest.fn(x => x + 1);
    const memoizedFn = memoize(originalFn);

    expect(memoizedFn(5)).toBe(6);
    expect(memoizedFn(6)).toBe(7);
    originalFn.mockReturnValue(null);
    expect(memoizedFn(5)).toBe(6);
    expect(memoizedFn(6)).toBe(7);
  });

  it('does not allow 0 arguments when the default comparison function is used', () => {
    const memoizedFn = memoize(() => {});
    expect(() => memoizedFn()).toThrow();
  });

  it('does not allow multiple arguments when the default comparison function is used', () => {
    const memoizedFn = memoize(() => {});
    expect(() => memoizedFn(1, 2)).toThrow();
  });

  it('accepts a custom comparison function', () => {
    const originalFn = jest.fn((x, y) => x * y);
    const memoizedFn = memoize(originalFn, { argsToKey: (x, y) => x + y });

    expect(memoizedFn(2, 3)).toBe(6);
    originalFn.mockReturnValue(null);
    expect(memoizedFn(4, 1)).toBe(6);
  });
});
