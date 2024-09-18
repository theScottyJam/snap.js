```javascript
Math.trunc(value)
```

This does differ from Lodash's implementation in one minor way - `_.toInteger(NaN)` will return `0` while `Math.trunc(NaN)` will return `NaN`. If you need `NaN` to convert to `0`, consider checking if `value` is `NaN` using `Number.isNaN()` before calling `Math.trunc()`.

Both `Math.trunc()` and `_.toInteger()` will return `Infinity` and `-Infinity` as-is, even though these values aren't integers. If you need different behavior, you will need to check for infinity up front (e.g. with `!Number.isFinite(value)`).

If `value` is not a number, you may wish to explicitly convert it into one before-hand instead of relying on `Math.trunc()` to implicitly convert it for you. You can refer to [the `_.toNumber()` entry](#!/nolodash/toNumber) for tips on converting a string into a number.
