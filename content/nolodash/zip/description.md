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

There is also [an upcoming proposal](https://github.com/tc39/proposal-joint-iteration) to provide this as a native feature. Once available, you will be able to do the following:

```javascript
Iterator.zip([
  [0, 1, 2],
  [3, 4, 5],
]).toArray()

/*
Produces:
[
  [0, 3],
  [1, 4],
  [2, 5],
]
*/
```
