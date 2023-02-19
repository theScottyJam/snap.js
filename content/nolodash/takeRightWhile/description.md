```javascript
function takeRightWhile(array, predicate) {
  const index = array.findLastIndex((...args) => !predicate(...args))
  if (index === -1) {
    return array;
  }

  return array.slice(index + 1);
}
```
