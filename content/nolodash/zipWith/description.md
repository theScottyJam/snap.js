```javascript
function zipWith(...args) {
  const arrays = args.slice(0, -1);
  const iteratee = args.at(-1);
  if (arrays.length === 0) {
    return [];
  }

  const minLength = Math.min(...arrays.map(arr => arr.length));
  const result = [];
  for (let i = 0; i < minLength; ++i) {
    result.push(iteratee(...arrays.map(arr => arr[i])));
  }

  return result;
}
```
