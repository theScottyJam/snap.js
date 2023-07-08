Lodash implements the "is-array-like-object" algorithm as follows:

```javascript
function isArrayLikeObject(value) {
  return (
    // Intentionally not including `typeof value === 'function'`.
    // Lodash does not consider functions to be an array-like object.
    typeof value === 'object' &&
    value !== null &&
    Number.isInteger(value.length) &&
    value.length >= 0 &&
    value.length <= Number.MAX_SAFE_INTEGER
  );
}
```

(Note that the only difference between `_.isArrayLikeObject()` and `_.isArrayLike()` is that `_.isArrayLikeObject()` does not return `true` for string primitives).

The JavaScript specification uses a much looser definition for "array-like object" - basically, as long as the value is an object and you can get a "length" property from the value and coerce it into an integer somehow, then it's an array-like value. This means that even `{}` is "array-like", because it's able to get the (non-existent) length property (`undefined`), then coerce that into an integer (`0`). This definition technically makes almost any non-primitive value "array-like" (an exception could be, for example, an object with a "length" getter that throws an error).

In day-to-day conversation the term "array-like object" goes beyond the technical definition of array-like object as outlined by the spec. An array-like object is additionally an object that was intentionally designed to have array-like characteristics, which is why Lodash's implementation still makes sense - Lodash's does a good job at rejecting values that were never intended to be used like an array. The point is that Lodash's implementation isn't the only correct way to implement this check - depending on your use-case you might find that a different `isArrayLikeObject()` implementation would be more appropriate.

An even better lesson from all of this is that if you're tempted to design a function that behaves differently depending on if an input value is an array-like object or not, it might be worthwhile to reconsider the API design so you don't have to make your public API depend on either a non-standard or overly loose definition of "array-like object".
