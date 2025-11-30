```javascript
[...new Set(array)]
```

Sets internally use [the SameValueZero comparison algorithm](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness#same-value-zero_equality) under-the-hood, just like Lodash's `_.uniq()`.
