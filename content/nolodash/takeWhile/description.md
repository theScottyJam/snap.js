```javascript
function takeWhile(array, predicate) {
  const index = array.findIndex((...args) => !predicate(...args))
  if (index === -1) {
    return array;
  }

  return array.slice(0, index);
}
```
