An equivalent to Lodash's "is-array-like" algorithm is as follows:

```javascript
function isArrayLike(value) {
  return (
    typeof value !== 'function' &&
    Number.isInteger(value?.length) &&
    value.length >= 0
  );
}
```

The JavaScript specification uses a much looser definition for "array-like" - basically, as long as you can get a "length" property from the value and coerce it into an integer somehow, then it's an array-like value. This means that even `{}` is "array-like", because it's able to get the (non-existent) length property (`undefined`), then coerce that into an integer (`0`). This definition technically makes almost any value except undefined, null, and a couple of other minor edge cases "array-like". A good way to check if something is considered array-like or not per the spec, is to run the following snippet and see if it throws an error, if it does not, your value is an array-like value.

```javascript
Array.prototype.slice.call(<your value>);
```

In day-to-day conversation the term "array-like" goes beyond the technical definition of array-like as outlined by the spec. An array-like value is additionally a value that was intentionally designed to have array-like characteristics, which is why Lodash's implementation still makes sense - Lodash's does a good job at rejecting values that were never intended to be used like an array. The point is that Lodash's implementation isn't the only correct way to implement this check - depending on your use-case you might find that a different `isArrayLike()` implementation would be more appropriate.

An even better lesson from all of this is that if you're tempted to design a function that behaves differently depending on if an input value is array-like or not, it might be worthwhile to reconsider the API design so you don't have to make your public API depend on either a non-standard or overly loose definition of "array-like".
