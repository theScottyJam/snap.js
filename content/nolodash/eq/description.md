To check if two values are exactly the same, use `Object.is(x, y)` (which follows the `SameValue` algorithm).

If you want a slightly looser algorithm that considers `-0` and `+0` to be the same, use the `SameValueZero` algorithm. This is the same algorithm that Lodash uses in it's `_.eq()` implementation, and also the same algorithm the JavaScript language uses in many of it's built-in functions, such as `array.includes()`. This algorithm can be implemented as follows:

```javascript
function sameValueZero(x, y) {
  return x === y || (Number.isNaN(x) && Number.isNaN(y));
}
```

If you want an algorithm that also conforms to the IEEE floating point spec, which states that `NaN` is not supposed to be considered equal to itself, use JavaScript's strict equality operator (`x === y`).

If you don't know what to use, use JavaScript's strict equality operator (`x === y`).

[Refer to MDN for a deeper discussion on JavaScript's comparison algorithms](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness).
