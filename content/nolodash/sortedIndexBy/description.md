```javascript
function sortedIndexBy(array, value, iteratee, _recurseOpts) {
  _recurseOpts ??= {
    range: [0, array.length],
    transformedValue: iteratee(value),
  };

  const transformedValue = _recurseOpts.transformedValue;
  const [low, high] = _recurseOpts.range;
  if (low === high) {
    return low;
  }

  const midPoint = low + Math.floor((high - low) / 2);
  const newRange = transformedValue <= iteratee(array[midPoint])
    ? [low, midPoint]
    : [midPoint + 1, high];

  return sortedIndexBy(array, value, iteratee, { transformedValue, range: newRange });
}
```
