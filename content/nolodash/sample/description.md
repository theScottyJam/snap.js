```javascript
// collection must be array-like
function sample(collection) {
  return collection[Math.floor(Math.random() * collection.length)];
}
```

If you have a collection type that's not supported by a chosen technique, you may need to convert it to an array first:
* To convert iterables into an array, use the spread syntax (e.g. `[...collection]`).
* To convert objects into an array, use [`Object.keys()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys), [`Object.values()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/values), or [`Object.entries()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries) depending on what your needs are.
