`_.zip()` is actually the inverse of itself, meaning you can use it to unzip the result of `_.zip()`, like this:

```javascript
const original = [[1, 2, 3], ['A', 'B', 'C']];
const zipped = _.zip(...original); // [[1, 'A'], [2, 'B'], [3, 'C']]
const unzipped = _.zip(...zipped); // [[1, 2, 3], ['A', 'B', 'C']]
```

The only difference between `_.zip()` and `_.unzip()` is how it accepts parameters.

<!-- eslint-disable @stylistic/no-multi-spaces -->
```javascript
// With _.zip(), arrays are passed in as separate parameters
_.zip([1, 2], ['A', 'B'])     // => [[1, 'A'], [2, 'B']]
// With _.unzip(), arrays are placed inside a single larger array.
_.unzip([[1, 2], ['A', 'B']]) // => [[1, 'A'], [2, 'B']]
```

This means that the you don't need both `zip()` and `unzip()`, you can just use [a `zip` implementation](#!/nolodash/zip) for both use-cases:

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

If you want a Lodash-style unzip function, here's how to implement it based off of `zip()`:

```javascript
function unzip(arrays) {
  return zip(...arrays);
}
```

Note that there is also [an upcoming proposal](https://github.com/tc39/proposal-joint-iteration) to provide array zipping as a native feature. Once implemented, you'll be able to do the following:

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
