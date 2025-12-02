We will start with [a plain JavaScript implementation of `_.uniqBy()`](#!/nolodash/uniqBy) to solve this problem.

```javascript
function uniqBy(array, iteratee) {
  const transformedResults = new Set();
  const result = [];
  for (const element of array) {
    const transformedElement = iteratee(element);
    if (!transformedResults.has(transformedElement)) {
      transformedResults.add(transformedElement);
      result.push(element);
    }
  }

  return result;
}
```

We can now mimic `_.unionBy()` like this:

```javascript
// Merge the given arrays, then filter out duplicates.
// This end-effect will be the union of these two arrays,
// using `iteratee` to decide equivalence.
uniqBy([...array1, ...array2], iteratee)
```
