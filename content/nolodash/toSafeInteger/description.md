```javascript
function toSafeInteger(value) {
  if (Number.isNaN(value)) {
    // Alternatively, you can choose to return NaN here.
    // Or do what Lodash does and return 0.
    // Or take out this check and not provide any explicit NaN handling code.
    throw new Error('Can not convert NaN to a safe integer');
  }

  if (value < Number.MIN_SAFE_INTEGER) return Number.MIN_SAFE_INTEGER;
  if (value > Number.MAX_SAFE_INTEGER) return Number.MAX_SAFE_INTEGER;
  return Math.trunc(value);
}
```

The above implementation expects `value` to be a number. If you expect arguments of other types, then refer to tips in [the `_.toNumber()` entry](#!/nolodash/toNumber) for converting arbitrary values into numbers.
