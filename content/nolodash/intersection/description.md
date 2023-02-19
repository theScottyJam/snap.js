To take the intersection of array1 and array2, use the following:

```javascript
array1.filter(x => array2.includes(x));
```

If you also wish to remove duplicate elements from the final result, the same way `_.intersection()` does, you can use a set, like so:

```javascript
const resultWithDuplicates = array1.filter(x => array2.includes(x));
const resultWithoutDuplicates = [...new Set(resultWithDuplicates)];
```

Remember that `.includes()` has an `O(n)` lookup time. If you're dealing with larger arrays, make sure to convert the second array into a set (a set's `.has()` method has `O(1)` lookup time).

```javascript
const set2 = new Set(array2);
const resultWithDuplicates = array1.filter(x => set2.has(x));
```

Both `array.includes()` and `set.has()` use [the SameValueZero comparison algorithm](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness#same-value-zero_equality) under-the-hood as well, just like Lodash's `_.intersection()`.

There is [an upcoming proposal](https://github.com/tc39/proposal-set-methods) that will introduce a native `.intersection()` method for sets.
