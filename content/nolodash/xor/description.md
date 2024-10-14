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

If you don't care about preserving element order or allowing duplicates, perhaps it would be better to use sets from the start and take advantage of [the built-in `set.symmetricDifference()` function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/symmetricDifference).
