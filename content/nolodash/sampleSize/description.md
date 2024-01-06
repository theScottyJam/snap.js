```javascript
// collection must be iterable
function sampleSize(collection_, n) {
  const collection = [...collection_];
  const result = [];
  for (let i = 0; i < n; i++) {
    const randomIndex = Math.floor(Math.random() * collection.length);
    result.push(collection[randomIndex]);
    collection.splice(randomIndex, 1);
  }
  return result;
}
```

If you have a collection type that's not supported by a chosen technique, you may need to convert it to an array first:
* To convert array-likes into an array, use [`Array.from()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from) (e.g. `Array.from(collection)`).
* To convert objects into an array, use [`Object.keys()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys), [`Object.values()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/values), or [`Object.entries()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries) depending on what your needs are.
