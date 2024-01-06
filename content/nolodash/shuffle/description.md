```javascript
// collection must be an array
function shuffle(collection) {
  return collection
    .map(value => ({ value, order: Math.random() }))
    .sort((a, b) => a.order - b.order)
    .map(({ value }) => value);
}
```

If you have a collection type that's not supported by a chosen technique, you may need to convert it to an array first:
* To convert iterables into an array, use the spread syntax (e.g. `[...collection]`).
* To convert array-likes into an array, use [`Array.from()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from) (e.g. `Array.from(collection)`).
* To convert objects into an array, use [`Object.keys()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys), [`Object.values()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/values), or [`Object.entries()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries) depending on what your needs are.

Sometimes you'll see a recommendation to shuffle using an algorithm such as this:

```javascript
function shuffle(collection) {
  return collection.sort(() => Math.random() - 0.5);
}
```

Such an algorithm has the appearance of working, but it is actually a very bias and broken shuffle. This is because a random choice is being made at each comparison, causing some elements to be compared more often than others, which in turn results in this bias.
