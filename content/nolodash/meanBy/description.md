```javascript
function mean(array) {
  // Or use `Math.sumPrecise(array) / array.length` once sumPrecise() is widely available
  return array.reduce((a, b) => a + b) / array.length;
}

// Uses `iteratee` on each element of the array, to convert them to
// new values, before taking the mean.
mean(array.map(iteratee));
```

Refer to [mean()'s page](#!/nolodash/mean) for more information on its implementation.
