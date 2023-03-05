```javascript
function mapValues(obj, iteratee) {
  const newObj = {};
  for (const [key, value] of Object.entries(obj)) {
    newObj[key] = iteratee(value, key, obj);
  }

  return newObj;
}
```
