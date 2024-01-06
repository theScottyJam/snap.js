To sort using a single "iteratee" (sort) function:

```javascript
// collection must be an array
function sortBy(collection, iteratee) {
  return collection.sort((value1, value2) => {
    const comparable1 = iteratee(value1);
    const comparable2 = iteratee(value2);
    if (comparable1 < comparable2) return -1;
    if (comparable1 > comparable2) return 1;
    return 0;
  });
}
```

To support using multiple "iteratee" functions:

```javascript
// collection must be an array
function sortBy(collection, iteratees) {
  return collection.sort((value1, value2) => {
    for (const iteratee of iteratees) {
      const comparable1 = iteratee(value1);
      const comparable2 = iteratee(value2);
      if (comparable1 < comparable2) return -1;
      if (comparable1 > comparable2) return 1;
    }
    return 0;
  });
}
```

If you have a collection type that's not supported by a chosen technique, you may need to convert it to an array first:
* To convert iterables into an array, use the spread syntax (e.g. `[...collection]`).
* To convert array-likes into an array, use [`Array.from()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from) (e.g. `Array.from(collection)`).
* To convert objects into an array, use [`Object.keys()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys), [`Object.values()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/values), or [`Object.entries()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries) depending on what your needs are.
