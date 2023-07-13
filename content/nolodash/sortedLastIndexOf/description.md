We will use a plain JavaScript implementation of `_.sortedLastIndex()` to help define `sortedLastIndexOf()`.

```javascript
function sortedLastIndex(array, value, _range) {
  const [low, high] = _range ?? [0, array.length];
  if (low === high) {
    return low;
  }

  const midPoint = low + Math.floor((high - low) / 2);
  const newRange = value < array[midPoint]
    ? [low, midPoint]
    : [midPoint + 1, high];

  return sortedLastIndex(array, value, newRange);
}

function sortedLastIndexOf(array, value) {
  const index = sortedLastIndex(array, value) - 1;
  return index > -1 && array[index] === value ? index : -1;
}
```