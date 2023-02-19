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

// Pull everything out from `array` that equals `targetValue`.
const result = filterInPlace(array, x => x === targetValue);
```

If you wish to perform comparisons using [the SameValueZero algorithm](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness#same-value-zero_equality), similar to how Lodash does it, you can use this helper function:

```javascript
function sameValueZero(x, y) {
  return x === y || (Number.isNaN(x) && Number.isNaN(y));
}
```

See the `_.pullAll()` entry if you have multiple items you wish to pull at once.
