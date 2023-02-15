function memoize(fn, { argsToKey = null } = {}) {
  argsToKey =
    argsToKey ??
    ((...args) => {
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
