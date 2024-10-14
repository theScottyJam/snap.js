To subtract everything in array2 from array1, use the following:

```javascript
array1.filter(x => !array2.includes(x));
```

Remember that `.includes()` has an `O(n)` lookup time. If you're dealing with larger arrays, make sure to convert the target array into a set first (a set's `.has()` method has `O(1)` lookup time).

```javascript
const set2 = new Set(array2);
const result = array1.filter(x => !set2.has(x));
```

If you don't care about preserving element order or allowing duplicates, perhaps it would be better to use sets from the start and take advantage of [the built-in `set.difference()` function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/difference).

Both `array.includes()` and sets use [the SameValueZero comparison algorithm](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness#same-value-zero_equality) under-the-hood as well, just like Lodash's `_.difference()`.
