```javascript
function functions(object) {
  const result = [];
  for (const [key, value] of Object.entries(object)) {
    if (typeof value === 'function') {
      result.push(key);
    }
  }

  return result;
}
```
