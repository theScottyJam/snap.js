```javascript
array.findLastIndex(x => x === value)
```

If you need to start from a particular index, a simple solution is to check which index you're at inside your predicate. In this example, we'll look for the index of the last `42` that exists at index 5 or lower.

```javascript
array.findLastIndex((value, i) => i <= 5 && value === 42)
```

If you need to start from a particular index, and you're dealing with larger arrays, you may just need to build your own `findLastIndex` function using a simple for loop, in order to help with performance.

If you wish to perform comparisons using [the SameValueZero algorithm](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness#same-value-zero_equality), similar to how Lodash does it, you can use this helper function:

```javascript
function sameValueZero(x, y) {
  return x === y || (Number.isNaN(x) && Number.isNaN(y));
}
```
