```javascript
// collection must be an array
for (const value of collection.toReversed()) {
  iteratee();
}
```

If you need both the array index and value as you iterate, you can use the `.entries()` function on the array like so:

```javascript
// collcetion must be an iterable (such as an array)
for (const [i, value] of [...collection.entries()].toReversed()) {
  iteratee(value);
}
```

If you have a collection type that's not supported by a chosen technique, you may need to convert it to an array first:
* To convert iterables into an array, use the spread syntax (e.g. `[...collection]`).
* To convert array-likes into an array, use [`Array.from()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from) (e.g. `Array.from(collection)`).
* To convert objects into an array, use [`Object.keys()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys), [`Object.values()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/values), or [`Object.entries()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries) depending on what your needs are.