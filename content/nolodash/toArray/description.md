To get an array of values out of an object, use `Object.values()`.

```javascript
Object.values({ a: 1, b: 2 })
// => [1, 2]
```

You can also use `Object.keys()` or `Object.entries()` to get all keys or all properties as tuples respectively.

To convert a string to an array, spread it into an array.

```javascript
[...'abc']
// => ['a', 'b', 'c']
```

If you need better unicode support and an internationalization-friendly character splitter, use `Intl.Segmenter()` instead:

```javascript
// Set this to your preferred locale,
// or set it to `undefined` to use the runtime's default locale.
const LOCALE = 'en';
const segmenter = new Intl.Segmenter(LOCALE);

function stringToArray(text) {
  return [...segmenter.segment(text)]
    .map(({ segment }) => segment);
}

console.log(stringToArray('abc')) // => ['a', 'b', 'c']
```

Any iterable can be converted to an array using the same syntax. Strings are just one common example of an iterable, but other built-in types such as maps, sets, argument objects, and more are all iterable.

```javascript
const colors = new Set(['red', 'blue', 'green']);
console.log([...colors]); // => ['red', 'blue', 'green']
```

To convert [an array-like value](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#array-like_objects) into an array, use `Array.from()`.

```javascript
Array.from({ 0: 'a', 1: 'b', length: 2 })
// => ['a', 'b']
```

Be cautious when using Lodash to convert an object into an array with `_.toArray()`. It will inspect your object and try to guess which pattern to follow when converting it, and it may guess wrong. For example, you could try using `_.toArray()` to get a list of property values from an object, but if the given object happens to have a "length" key with a numeric value, it's behavior will change, and it will instead treat it like an array-like object. Thus `_.toArray({ width: 2, height: 5 })` will give you `[2, 5]`, but `_.toArray({ width: 2, height: 5, length: 3 })` will give you `[undefined, undefined, undefined]`.
