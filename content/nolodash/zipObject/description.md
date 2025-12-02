We will start with [a plain JavaScript implementation of `_.zip()`](#!/nolodash/zip).

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

We can now mimic `_.zipObject()` like this:

```javascript
// First zips the keys and values,
// then build an object from the zipped entries.
Object.fromEntries(zip(props, values))
```
