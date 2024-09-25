```javascript
// The maximum array size is the largest 32bit integer (2**32 - 1).
const MAX_ARRAY_SIZE = 4294967295;

function toLength(value) {
  if (Number.isNaN(value)) {
    // Alternatively, you can choose to return NaN here.
    // Or do what Lodash does and return 0.
    // Or take out this check and not provide any explicit NaN handling code.
    throw new Error('Can not convert NaN to a safe integer');
  }

  if (value < 0) return 0;
  if (value > MAX_ARRAY_SIZE) return MAX_ARRAY_SIZE;
  return Math.trunc(value);
}
```

The above implementation expects `value` to be a number. If you expect arguments of other types, then refer to tips in [the `_.toNumber()` entry](#!/nolodash/toNumber) for converting arbitrary values into numbers.
