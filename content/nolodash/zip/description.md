```javascript
function zip(...arrays) {
  if (arrays.length === 0) {
    return [];
  }

  const minLength = Math.min(...arrays.map(arr => arr.length));
  const result = [];
  for (let i = 0; i < minLength; ++i) {
    result.push(arrays.map(arr => arr[i]));
  }

  return result;
}
```
