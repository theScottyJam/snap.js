`_.zip()` is actually the inverse of itself, meaning you can use it to unzip the result of `_.zip()`, like this:

```javascript
const original = [[1, 2, 3], ['A', 'B', 'C']]
const zipped = _.zip(...original); // [[1, 'A'], [2, 'B'], [3, 'C']]
const unzipped = _.zip(...zipped); // [[1, 2, 3], ['A', 'B', 'C']]
```

The only difference between `_.zip()` and `_.unzip()` is how it accepts parameters.

```javascript
// With _.zip(), arrays are passed in as separate parameters
_.zip([1, 2], ['A', 'B']);     // [[1, 'A'], [2, 'B']]
// With _.unzip(), arrays are placed inside a single larger array.
_.unzip([[1, 2], ['A', 'B']]); // [[1, 'A'], [2, 'B']]
```

So, to implement an unzip function, all you really need is an implementation for `zip()`.

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

If you want a Lodash-style unzip function, here's how to implement it:

```javascript
function unzip(arrays) {
  return zip(...arrays);
}
```
