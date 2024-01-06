```javascript
// collection can be any iterable (such as an array)
for (const value of collection) {
  iteratee(value);
}
```

If you need both the array index and value as you iterate, you can use the `.entries()` function on the array like so:

```javascript
// collection must be an array
for (const [i, value] of collection.entries()) {
  iteratee(value);
}
```

If you have a collection type that's not supported by a chosen technique, you may need to convert it to an array first:
* To convert iterables into an array, use the spread syntax (e.g. `[...collection]`).
* To convert array-likes into an array, use [`Array.from()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from) (e.g. `Array.from(collection)`).
* To convert objects into an array, use [`Object.keys()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys), [`Object.values()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/values), or [`Object.entries()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries) depending on what your needs are.

JavaScript also offers an `array.forEach()` function which behaves similarly to Lodash's `_.forEach()` (with the biggest difference being that you can't break out of the native `.forEach()` loop early, while you can in Lodash's version by returning `false`). In practice, there's no real reason to use the native `.forEach()` function anymore. The newer "for of" syntax presented above is strictly better and more powerful than `.forEach()`:
* It supports `break` and `continue`.
* You can do `await` inside a "for of" loop. ["await" will not work properly in `.forEach()`](https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop).
* You can use `return` to return early from a function from inside your loop.
* "for-of" works with any iterable, including some odd-ball ones like the arguments object.
