They give the following usage example, which calls a method on each value in your array:

```javascript
_.invokeMap([[5, 1, 7], [3, 2, 1]], 'sort')
// => [[1, 5, 7], [1, 2, 3]]
```

The equivalent in JavaScript would be:

```javascript
[[5, 1, 7], [3, 2, 1]].map(value => value.sort())
```

Lodash's `_.invokeMap()` also has a completely separate use-case with it - it can behave like a regular `.map()`, except it passes each value to the callback as the "this" parameter instead of a normal parameter, as they demonstrated with this example:

```javascript
_.invokeMap([123, 456], String.prototype.split, '')
// => [['1', '2', '3'], ['4', '5', '6']]
```

The generalized equivalent in JavaScript would be to use a normal `.map()` with a `.call()` as follows:

```javascript
[123, 456].map(value => String.prototype.split.call(value, ''))
```

Though in this specific example, you can just do this:

```javascript
[123, 456].map(value => String(value).split(''))
```

The use of `.map()` requres an array. If you have a collection type that's not supported by a chosen technique, you may need to convert it to an array first:
* To convert iterables into an array, use the spread syntax (e.g. `[...collection]`).
* To convert array-likes into an array, use [`Array.from()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from) (e.g. `Array.from(collection)`).
* To convert objects into an array, use [`Object.keys()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys), [`Object.values()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/values), or [`Object.entries()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries) depending on what your needs are.

If you're using `_.invokeMap()` but your path argument is a string or an array of strings, then you can use the JavaScript equivalent to [Lodash's `_.invoke()`](#!/nolodash/invoke) inside of a `.map()` as follows:

```javascript
// Please see the "_.invoke()" documentation entry to see
// how to implement it.
array.map(value => invoke(value, path, ...args))
```
