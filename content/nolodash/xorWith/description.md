```javascript
function xorWith(array1, array2, comparator) {
  return [
    ...array1.filter(x => !array2.some(y => comparator(x, y))),
    ...array2.filter(x => !array1.some(y => comparator(x, y))),
  ];
}
```
