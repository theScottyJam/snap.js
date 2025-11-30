```javascript
array.filter(x => x !== value)
```

If you wish to filter out multiple values, look at the plain JavaScript version of `_.difference()`. Both `_.difference()` and `_.without()` achieve the same effect, but with slightly different function signatures.

If you wish to perform comparisons using [the SameValueZero algorithm](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness#same-value-zero_equality), similar to how Lodash does it, you can use this helper function:

```javascript
function sameValueZero(x, y) {
  return x === y || (Number.isNaN(x) && Number.isNaN(y));
}
```
