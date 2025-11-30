To check if a value is a boolean primitive:

```javascript
typeof value === 'boolean'
```

The above should be good enough for the vast majority of use-cases.

Lodash will also check if the value is a boolean object. In practice, such objects should never be found in your codebase, and if someone ever tries to hand such an object to you you really ought to treat it the same way you would treat any other bad input (throw an error, or if you aren't explicitly trying to check for bad inputs just let your library fall over, the same way it would with any other bad input).

To check if something is specifically a boolean object (and not a primitive), use the following:

```javascript
value instanceof Boolean
```

This, however, doesn't work cross realm (i.e. a boolean object created from inside an iframe would fail this check). It also would incorrectly state that `Object.create(Boolean.prototype)` is a boolean object, when in reality, it's just a normal object who's prototype is set to `Boolean.prototype`. If you need to worry about these kinds of issues, use the following solution instead:

```javascript
// An isBoolean() check that supports cross-realm Boolean instances.
// This will check if `value` is a boolean primitive or object.
// Returns `true` for values that inherit from `Boolean` as well.
function isBoolean(value) {
  try {
    // If you call this method with a "this" value that's anything
    // other than a boolean primitive or object, a TypeError is thrown.
    Boolean.prototype.toString.call(value);
    // Makes sure Boolean.prototype was not passed in.
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

Lodash's `_.isBoolean()` also supports cross-realm `Boolean` object checks, but it uses a less robust algorithm that can be easily fooled. For example, the following will return the wrong answer.

```javascript
_.isBoolean({ get [Symbol.toStringTag]() { return 'Boolean' } })
// => true
```

If you're exclusively using Node, you can use `require('util').types.isBooleanObject(value)` to specifically check if the value is a boolean object (not a primitive). This solution will also return `true` for both subclasses and `Boolean.prototype`.