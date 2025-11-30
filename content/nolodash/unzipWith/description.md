The only difference between `_.zipWith()` and `_.unzipWith()` is how it accepts parameters.

<!-- eslint-disable @stylistic/no-multi-spaces -->
```javascript
// With _.zipWith(), arrays are passed in as separate parameters
_.zipWith([10, 20], [1, 2], (a, b) => a + b)     // [11, 22]
// With _.unzipWith(), arrays are placed inside a single larger array.
_.unzipWith([[10, 20], [1, 2]], (a, b) => a + b) // [11, 22]
```

This means that the you don't need both `zipWith()` and `unzipWith()`, you can just use a `zipWith()` implementation for both use-cases:

```javascript
function zipWith(...args) {
  const arrays = args.slice(0, -1);
  const iteratee = args.at(-1);
  if (arrays.length === 0) {
    return [];
  }

  const minLength = Math.min(...arrays.map(arr => arr.length));
  const result = [];
  for (let i = 0; i < minLength; ++i) {
    result.push(iteratee(...arrays.map(arr => arr[i])));
  }

  return result;
}
```

If you want a Lodash-style unzipWith function, here's how to implement it:

```javascript
function unzipWith(arrays, iteratee) {
  return zipWith(...arrays, iteratee);
}
```
