```javascript
function xor(array1, array2) {
  const set1 = new Set(array1);
  const set2 = new Set(array2);
  return [
    ...array1.filter(x => !set2.has(x)),
    ...array2.filter(x => !set1.has(x)),
  ];
}
```
