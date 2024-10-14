If you're not in a very performance sensitive area of your codebase or dealing with large arrays, consider just using the native `.filter()` function instead which returns a copy instead of mutating the original. If you are worried about performance, you can use the following `filterInPlace()` helper to achieve the desired result in `O(n)` time.

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

function pullAt(array, indexes_) {
  const pulled = indexes_.map(i => array[i]);
  const indexes = new Set(indexes_);
  filterInPlace(array, (_, i) => !indexes.has(i));
  return pulled;
}
```
