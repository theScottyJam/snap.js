```javascript
[...new Set([...array1, ...array2])];
```

Sets internally use [the SameValueZero comparison algorithm](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness#same-value-zero_equality) under-the-hood, just like Lodash's `_.union()`.

There is [an upcoming proposal](https://github.com/tc39/proposal-set-methods) that will introduce a native `.union()` method for sets.
