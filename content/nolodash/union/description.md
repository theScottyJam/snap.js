If you have arrays or other iterables:

```javascript
[...new Set([...array1, ...array2])]
```

If you have sets:

```javascript
set1.union(set2)
```

Sets internally use [the SameValueZero comparison algorithm](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness#same-value-zero_equality) under-the-hood, just like Lodash's `_.union()`.
