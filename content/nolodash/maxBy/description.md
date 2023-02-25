```javascript
function maxBy(array, iteratee) {
  if (array.length === 0) {
    return undefined;
  }

  return array
    .map(value => ({ value, score: iteratee(value) }))
    .reduce((best, cur) => cur.score > best.score ? cur : best)
    .value;
}
```
