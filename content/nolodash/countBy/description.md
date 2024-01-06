```javascript
// collection must be an iterable (such as an array)
function countBy(collection, iteratee = x => x) {
  const result = {};
  for (const value of collection) {
    const changedValue = iteratee(value);
    result[changedValue] ??= 0;
    result[changedValue]++;
  }
  return result;
}
```

If you have a collection type that's not supported by a chosen technique, you may need to convert it to an array first:
* To convert array-likes into an array, use [`Array.from()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from) (e.g. `Array.from(collection)`).
* To convert objects into an array, use [`Object.keys()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys), [`Object.values()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/values), or [`Object.entries()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries) depending on what your needs are.
