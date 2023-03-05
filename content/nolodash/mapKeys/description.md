```javascript
function mapKeys(obj, iteratee) {
  const newObj = {};
  for (const [key, value] of Object.entries(obj)) {
    const newKey = iteratee(value, key, obj);
    newObj[newKey] = value;
  }

  return newObj;
}
```
