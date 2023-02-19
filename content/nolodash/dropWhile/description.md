```javascript
function dropWhile(array, predicate) {
  const index = array.findIndex((...args) => !predicate(...args))
  if (index === -1) {
    return [];
  }

  return array.slice(index);
}
```