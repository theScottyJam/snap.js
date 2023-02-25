We will use a vanilla JavaScript implementation of `_.mean()` to solve this problem.

```javascript
function mean(array) {
  return array.reduce((a, b) => a + b) / array.length;
}

// Uses `iteratee` on each element of the array, to convert them to
// new values, before taking the mean.
mean(array.map(iteratee));
```
