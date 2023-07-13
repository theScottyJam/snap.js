Using `_.transform()` really isn't any different from using the built-in `array.reduce()` method, except for a couple of minor things.

1. If you're dealing with objects, you need to use `Object.entries(yourObject)` to turn it into an array of tuples first.
2. With `array.reduce()`, you need to always return the accumulator

What this looks like in practice, using an example from Lodash's website.

```javascript
_.transform({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
  (result[value] || (result[value] = [])).push(key);
}, {});
// => { '1': ['a', 'c'], '2': ['b'] }

// Note the use of `Object.entries()` (point 1) here.
Object.entries({ 'a': 1, 'b': 2, 'c': 1 }).reduce((result, [key, value]) => {
  (result[value] || (result[value] = [])).push(key);
  return result; // Note how we return the accumulator (point 2) here.
}, {});
```

A simple for loop will work just as well, if that's your preference.

```javascript
const result = {};
for (const [key, value] of Object.entries({ 'a': 1, 'b': 2, 'c': 1 })) {
  (result[value] || (result[value] = [])).push(key);
}
```