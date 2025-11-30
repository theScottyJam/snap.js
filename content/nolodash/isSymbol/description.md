To check if a value is a symbol primitive:

```javascript
typeof value === 'symbol'
```

The above should be good enough for the vast majority of use-cases.

Lodash will also check if the value is a symbol object. In practice, such objects should never be found in your codebase, and if someone ever tries to hand such an object to you you really ought to treat it the same way you would treat any other bad input (throw an error, or if you aren't explicitly trying to check for bad inputs just let your library fall over, the same way it would with any other bad input).

To check if something is specifically a symbol object (and not a primitive), use the following:

```javascript
value instanceof Symbol
```

This, however, doesn't work cross realm (i.e. a symbol object created from inside an iframe would fail this check). It also would incorrectly state that `Object.create(Symbol.prototype)` is a symbol object, when in reality, it's just a normal object who's prototype is set to `Symbol.prototype`. If you need to worry about these kinds of issues, use the following solution instead:

```javascript
// An isSymbol() check that supports cross-realm Symbol instances.
// This will check if `value` is a symbol primitive or object.
function isSymbol(value) {
  try {
    // If you call this method with a "this" value that's anything
    // other than a boolean primitive or object, a TypeError is thrown.
    Symbol.prototype.valueOf.call(value);
    return true;
  } catch (error) {
    if (error instanceof TypeError) {
      return false;
    }
    throw error;
  }
}
```

Lodash's `_.isSymbol()` also supports cross-realm `Symbol` object checks, but it uses a less robust algorithm that can be easily fooled. For example, the following will return the wrong answer.

```javascript
_.isSymbol({ get [Symbol.toStringTag]() { return 'Symbol' } })
// => true
```

If you're exclusively using Node, you can use `require('util').types.isSymbolObject(value)` to specifically check if the value is a string object (not a primitive).