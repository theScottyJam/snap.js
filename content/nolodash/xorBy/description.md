```javascript
function xorBy(array1, array2, predicate) {
  const set1 = new Set(array1.map(x => predicate(x)));
  const set2 = new Set(array2.map(x => predicate(x)));
  return [
    ...array1.filter(x => !set2.has(predicate(x))),
    ...array2.filter(x => !set1.has(predicate(x))),
  ];
}
```
