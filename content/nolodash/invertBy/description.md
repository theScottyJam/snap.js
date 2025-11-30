```javascript
function invertBy(obj, iteratee = x => x) {
  const newObj = {};
  for (const [key, value] of Object.entries(obj)) {
    const newValue = iteratee(value);
    newObj[newValue] ??= [];
    newObj[newValue].push(key);
  }
  return newObj;
}
```
