To check if your value is an instance of `ArrayBuffer`:

```javascript
value instanceof ArrayBuffer
```

The above should be good enough for the vast majority of use-cases.

It's generally considered a bad practice to subclass built-ins, but if you suspect that a subclass might be handed to you and you wish to exclude subclasses from your check, you can compare prototypes like this:

```javascript
Object.getPrototypeOf(value) === ArrayBuffer.prototype
```

Both of the above type-detection mechanisms have a couple of flaws:
1. they don't work with cross-realm values. For example, if you receive an instance of an `ArrayBuffer` from across an iframe boundary, that instance's prototype would link to the iframe's `ArrayBuffer` class, not your `ArrayBuffer` class, and both of the above checks would fail to recognize it as an ArrayBuffer.
2. They will state that `Object.create(ArrayBuffer.prototype)` is an `ArrayBuffer`, but it's not. It's just a regular object who's prototype has been set to `ArrayBuffer.prototype`.

Both of these issues can be solved with a helper function like this:

```javascript
// An isArrayBuffer() check that supports cross-realm ArrayBuffers.
function isArrayBuffer(value) {
  try {
    // If you call an ArrayBuffer method, like .slice(),
    // with a "this" value that's anything
    // other than an ArrayBuffer, a TypeError is thrown.
    ArrayBuffer.prototype.slice.call(value, 0, 0);
    return true;
  } catch (error) {
    if (error instanceof TypeError) {
      return false;
    }
    throw error;
  }
}
```

If you additionally need to ensure that you are not receiving an ArrayBuffer instance from an inherited class, you'd also need to walk up the prototype chain. You can modify the above example and replace `return true;` with the following:

<!-- eslint-skip -->
```javascript
// A ArrayBuffer's prototype's chain should be
// value -> ArrayBuffer.prototype -> Object.prototype -> null
// If it's not, then we're dealing with an ArrayBuffer subclass.
const protoOf = Object.getPrototypeOf;
return protoOf(protoOf(protoOf(value))) === null;
```

Lodash's `_.isArrayBuffer()` also supports cross-realm ArrayBuffer checks, but it uses a less robust algorithm that can be easily fooled. For example, if you run Lodash in the browser, the following will return the wrong answer.

```javascript
_.isArrayBuffer({ get [Symbol.toStringTag]() { return 'ArrayBuffer' } })
// => true
```

In Node, Lodash will instead use `require('util').types.isArrayBuffer(value)` for it's implementation, which you are also welcome to use if you know your code will only run in Node.

Some very early JavaScript proposals may provide support for more ergonomic ways to do cross-realm type checking:
* [istypes](https://github.com/jasnell/proposal-istypes)
* [Pattern matching's built-in matchers](https://github.com/tc39/proposal-pattern-matching#built-in-custom-matchers-1)
