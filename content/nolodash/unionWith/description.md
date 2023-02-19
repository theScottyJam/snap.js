We will use a vanilla JavaScript implementation of `_.uniqWith()` to solve this problem.

```javascript
function uniqWith(array, comparator) {
  const result = [];
  for (const element of array) {
    if (result.every(x => !comparator(x, element))) {
      result.push(element);
    }
  }

  return result;
}

// Merge the given arrays, then filter out duplicates.
// This end-effect will be the union of these two arrays,
// using `comparator` to decide equivalence.
uniqWith([...array1, ...array2], comparator);
```
