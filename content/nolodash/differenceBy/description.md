```javascript
function differenceBy(array, values, iteratee) {
  const transformedValues = new Set(values.map(x => iteratee(x)));
  return array.filter(x => !transformedValues.has(iteratee(x)));
}
```
