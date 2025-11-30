To check if a value is a string primitive:

```javascript
typeof value === 'string'
```

The above should be good enough for the vast majority of use-cases.

Lodash will also check if the value is a string object. In practice, such objects should never be found in your codebase, and if someone ever tries to hand such an object to you you really ought to treat it the same way you would treat any other bad input (throw an error, or if you aren't explicitly trying to check for bad inputs just let your library fall over, the same way it would with any other bad input).

To check if something is specifically a string object (and not a primitive), use the following:

```javascript
value instanceof Boolean
```

This, however, doesn't work cross realm (i.e. a string object created from inside an iframe would fail this check). It also would incorrectly state that `Object.create(String.prototype)` is a string object, when in reality, it's just a normal object who's prototype is set to `String.prototype`. If you need to worry about these kinds of issues, use the following solution instead:

```javascript
// An isString() check that supports cross-realm String instances.
// This will check if `value` is a string primitive or object.
// Returns `true` for values that inherit from `String` as well.
function isString(value) {
  try {
    // If you call this method with a "this" value that's anything
    // other than a boolean primitive or object, a TypeError is thrown.
    String.prototype.toString.call(value);
    // Makes sure String.prototype was not passed in.
    const protoOf = Object.getPrototypeOf;
    return protoOf(protoOf(value)) !== null;
  } catch (error) {
    if (error instanceof TypeError) {
      return false;
    }
    throw error;
  }
}
```

Lodash's `_.isString()` also supports cross-realm `String` object checks, but it uses a less robust algorithm that can be easily fooled. For example, the following will return the wrong answer.

```javascript
_.isString({ get [Symbol.toStringTag]() { return 'String' } })
// => true
```

If you're exclusively using Node, you can use `require('util').types.isStringObject(value)` to specifically check if the value is a string object (not a primitive). This solution will also return `true` for both subclasses and `Boolean.prototype`.