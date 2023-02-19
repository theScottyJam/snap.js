In general, it's recommended to avoid mutating the original array, but if you must, the following `filterInPlace()` helper can be used to achieve the desired result in `O(n)` time.

```javascript
function filterInPlace(array, predicate) {
  let destIndex = 0;
  for (let srcIndex = 0; srcIndex < array.length; ++srcIndex) {
    if (!predicate(array[srcIndex], srcIndex)) {
      continue;
    }
    array[destIndex] = array[srcIndex]
    destIndex++;
  }

  array.splice(destIndex, array.length - destIndex);
}

// Pull everything in the `values` array from `array`.
const result = filterInPlace(array, x => values.include(x));
```

Remember that the `values.includes()` used at the end also has an `O(n)` lookup time. If you're dealing with a larger `values` array, make sure to convert it into a set first (a set's `.has()` method has `O(1)` lookup time).

Both `array.includes()` and `set.has()` use [the SameValueZero comparison algorithm](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness#same-value-zero_equality) under-the-hood as well, just like Lodash's `_.pull()`.
