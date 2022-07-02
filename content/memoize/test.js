describe('memoize()', () => {
  it('caches the result of the function call', () => {
    const originalFn = jest.fn(x => x + 1);
    const memoizedFn = _.memoize(originalFn);

    expect(memoizedFn(5)).toBe(6);
    originalFn.mockReturnValue(null);
    expect(memoizedFn(5)).toBe(6);
  });

  it('caches the promise when the callback is async', async () => {
    const originalFn = jest.fn(async x => x + 1);
    const memoizedFn = _.memoize(originalFn);

    const promise1 = memoizedFn(5).then(x => expect(x).toBe(6));
    originalFn.mockReturnValue(43);
    const promise2 = memoizedFn(5).then(x => expect(x).toBe(6));

    await Promise.all([promise1, promise2]);
  });

  it('can cache multiple items', () => {
    const originalFn = jest.fn(x => x + 1);
    const memoizedFn = _.memoize(originalFn);

    expect(memoizedFn(5)).toBe(6);
    expect(memoizedFn(6)).toBe(7);
    originalFn.mockReturnValue(null);
    expect(memoizedFn(5)).toBe(6);
    expect(memoizedFn(6)).toBe(7);
  });

  it('does not allow 0 arguments when the default comparison function is used', () => {
    const memoizedFn = _.memoize(() => {});
    expect(() => memoizedFn()).toThrow();
  });

  it('does not allow multiple arguments when the default comparison function is used', () => {
    const memoizedFn = _.memoize(() => {});
    expect(() => memoizedFn(1, 2)).toThrow();
  });

  it('accepts a custom comparison function', () => {
    const originalFn = jest.fn((x, y) => x * y);
    const memoizedFn = _.memoize(originalFn, { argsToKey: (x, y) => x + y });

    expect(memoizedFn(2, 3)).toBe(6);
    originalFn.mockReturnValue(null);
    expect(memoizedFn(4, 1)).toBe(6);
  });
});
