To check if a value is a number primitive:

```javascript
typeof value === 'number'
```

The above should be good enough for the vast majority of use-cases.

Lodash will also check if the value is a number object. In practice, such objects should never be found in your codebase, and if someone ever tries to hand such an object to you you really ought to treat it the same way you would treat any other bad input (throw an error, or if you aren't explicitly trying to check for bad inputs just let your library fall over, the same way it would with any other bad input).

To check if something is specifically a number object (and not a primitive), use the following:

```javascript
value instanceof Number
```

This, however, doesn't work cross realm (i.e. a number object created from inside an iframe would fail this check). It also would incorrectly state that `Object.create(Number.prototype)` is a number object, when in reality, it's just a normal object who's prototype is set to `Number.prototype`. If you need to worry about these kinds of issues, use the following solution instead:

```javascript
// An isNumber() check that supports cross-realm Number instances.
// This will check if `value` is a number primitive or object.
// Returns `true` for values that inherit from `Number` as well.
function isNumber(value) {
  try {
    // If you call this method with a "this" value that's anything
    // other than a Number primitive or object, a TypeError is thrown.
    Number.prototype.valueOf.call(value);
    // Makes sure Number.prototype was not passed in.
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

Lodash's `_.isNumber()` also supports cross-realm Number object checks, but it uses a less robust algorithm that can be easily fooled. For example, the following will return the wrong answer.

```javascript
_.isNumber({ get [Symbol.toStringTag]() { return 'Number' } })
// => true
```

If you're exclusively using Node, you can use `require('util').types.isNumberObject(value)` to specifically check if the value is a number object (not a primitive). This solution will also return `true` for both subclasses and `Number.prototype`.
