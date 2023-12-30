```javascript
function xorBy(array1, array2, iteratee) {
  const set1 = new Set(array1.map(x => iteratee(x)));
  const set2 = new Set(array2.map(x => iteratee(x)));
  return [
    ...array1.filter(x => !set2.has(iteratee(x))),
    ...array2.filter(x => !set1.has(iteratee(x))),
  ];
}
```
