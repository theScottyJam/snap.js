```javascript
function dropRightWhile(array, predicate) {
  const index = array.findLastIndex((...args) => !predicate(...args))
  if (index === -1) {
    return [];
  }

  return array.slice(0, index + 1);
}
```