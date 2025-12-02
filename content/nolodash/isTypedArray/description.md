All concrete type array classes (like `Int8Array` and `Uint32Array`) inherit from the same abstract superclass `TypedArray`. This superclass isn't directly available on the global object, but it's not too hard to get your hands on it. You can use the `TypedArray` superclass to check if a value is a typed array as follows:

```javascript
function isTypedArray(value) {
  // Get the super class of all typed arrays.
  const TypedArray = Object.getPrototypeOf(Int8Array);

  return value instanceof TypedArray;
}

isTypedArray(new Int8Array()); // => true
isTypedArray(new Uint32Array()); // => true
```

For the vast majority of scenarios the above should be good enough, but it does technically have a couple of flaws:
1. they don't work with cross-realm values. For example, if you receive an instance of an `Int8Array` from across an iframe boundary, that instance's prototype would link to the iframe's `TypedArray` class, not your `TypedArray` class, and both of the above checks would fail to recognize it as a typed array.
2. They will state that `Object.create(TypedArray.prototype)` is a `TypedArray`, but it's not. It's just a regular object who's prototype has been set to `TypedArray.prototype`.

Both of these issues can be solved with a helper function like this:

```javascript
// An isTypedArray() check that supports cross-realm typed arrays.
function isTypedArray(value) {
  const TypedArray = Object.getPrototypeOf(Int8Array);
  try {
    // If you call a TypedArray method, like .at(),
    // with a "this" value that's anything
    // other than a typed array, a TypeError is thrown.
    TypedArray.prototype.at.call(value, 0);
    return true;
  } catch (error) {
    if (error instanceof TypeError) {
      return false;
    }
    throw error;
  }
}
```

It's generally considered a bad practice to subclass built-ins, but if you suspect that one of the concrete typed array classes might getting subclassed and handed to you, and you wish to exclude subclasses from your check, you'd also need to walk up the prototype chain. You can modify the above example and replace `return true;` with the following:

<!-- eslint-skip -->
```javascript
// A typed array prototype's chain should be
// value -> concrete class prototype (like Int8Array.prototype) -> TypedArray.prototype -> Object.prototype -> null
// If it's not, then we're dealing with a subclass of a concrete typed array.
const protoOf = Object.getPrototypeOf;
return protoOf(protoOf(protoOf(protoOf(value)))) === null;
```

Lodash's `_.isTypedArray()` also supports cross-realm typed array checks, but it uses a less robust algorithm that can be easily fooled. For example, if you run Lodash in the browser, the following will return the wrong answer.

```javascript
_.isTypedArray({ length: 0, get [Symbol.toStringTag]() { return 'Uint8Array' } })
// => true
```

In Node, Lodash will instead use `require('util').types.isTypedArray(value)` for it's implementation, which you are also welcome to use if you know your code will only run in Node. This solution will also return `true` for subclasses.

Future JavaScript proposals may provide support for more ergonomic ways to do cross-realm type checking:
* [Pattern matching's built-in matchers](https://github.com/tc39/proposal-pattern-matching#built-in-custom-matchers-1)
