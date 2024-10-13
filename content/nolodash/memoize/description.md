```javascript
function defaultResolver(...args) {
  if (args.length !== 1) {
    throw new Error(
      'Exactly one argument must be passed in to this memoized function ' +
      '(unless a custom resolver function is provided)'
    );
  }
  return args[0];
}

function memoize(fn, resolver = defaultResolver) {
  const cache = new Map();
  return function (...args) {
    const key = resolver(...args);
    if (cache.has(key)) {
      return cache.get(key);
    }

    // Using .call() may be overkill.
    // You could just do `const res = fn(...args);` if you
    // don't need to worry about preserving the "this" argument.
    const res = fn.call(this, ...args);
    cache.set(key, res);
    return res;
  };
}
```

The default resolver behavior in the above implementation is to cache the result based on the first argument, but unlike Lodash's `_.memoize()`, it will also require that only one argument is supplied, in order to help avoid accidental mis-use. If you want a resolver that behave's more like Lodash's, just pass in `x => x` as your resolver function.

