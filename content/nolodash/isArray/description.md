Lodash's `_.isArray()` is simply an alias for `Array.isArray(value)`.

Note that `Array.isArray()` will return `true` both for array subclasses and if you directly pass in `Array.prototype`. If you want to prevent both subclasses and `Array.prototype` from getting through, there's various solutions you can use, depending on how robust you need the solution to be shown below. (And if you only want to prevent `Array.prototype` from getting through, you should be able to modify the following examples to your needs).

1. `Object.getPrototypeOf(value) === Array.prototype` is the simplest solution, but has issues with cross-realm arrays (see footnote 1) and `Object.create(Array.prototype)` (see footnote 2).
2. `Array.isArray(value) && Object.getPrototypeOf(value) === Array.prototype` is a little more robust and solved the `Object.create(Array.prototype)` issue (footnote 2), but still has issues with cross-realm arrays (footnote 1).
3. The helper function below would be the strongest solution, and doesn't have any of the issues that the simpler solutions have.

```javascript
// Cross realm compatible is-non-inherited-array check.
function isNonInheritedArray(value) {
  const protoOf = Object.getPrototypeOf;
  // An array's prototype chain should normally be
  // value -> Array.prototype -> Object.prototype -> null
  // If there's an extra link in there, it means inheritance has happened.
  return (
    Array.isArray(value) &&
    protoOf(protoOf(value)) !== null && // This check fails if you pass in Array.prototype.
    protoOf(protoOf(protoOf(value))) === null
  );
}
```

Footnotes:
1. A "cross-realm array" is, for example, an array from an iframe. Since the Array class from within the iframe is separate from the Array class outside of the iframe, you can't simply do an equality check on their prototypes.
2. The problem with `Object.create(Array.prototype)` is that this does not create a real array, it's just an object who's prototype happens to be `Array.prototype`.
