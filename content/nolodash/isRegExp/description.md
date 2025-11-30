To check if your value is a regular expression instance:

```javascript
value instanceof RegExp
```

The above should be good enough for the vast majority of use-cases.

It's generally considered a bad practice to subclass built-ins, but if you suspect that a subclass might be handed to you and you wish to exclude subclasses from your check, you can compare prototypes like this:

```javascript
Object.getPrototypeOf(value) === RegExp.prototype
```

Both of the above type-detection mechanisms have a couple of flaws:
1. they don't work with cross-realm values. For example, if you receive an instance of `RegExp` from across an iframe boundary, that instance's prototype would link to the iframe's `RegExp` class, not your `RegExp` class, and both of the above checks would fail to recognize it as an RegExp instance.
2. They will state that `Object.create(RegExp.prototype)` is a regular expression instance, but it's not. It's just a regular object who's prototype has been set to `RegExp.prototype`.

Both of these issues can be solved with a helper functions such as this:

```javascript
class StringifyError extends Error {}

// An isRegExp() check that supports cross-realm RegExp instances.
// This solution is loosely inspired by https://github.com/inspect-js/is-regex's implementation.
function isRegExp(value) {
  // An argument that throws when stringified will be used
  // to prevent exec() from completing and updating value.lastIndex.
  const badArgument = {
    toString() { throw new StringifyError(); },
  }

  try {
    // Calling the `.exec()` method,
    // with a "this" value that's anything
    // other than a RegExpr will throw a TypeError.
    RegExp.prototype.exec.call(value, badArgument);
  } catch (error) {
    if (error instanceof TypeError) {
      return false;
    } else if (error instanceof StringifyError) {
      return true;
    } else {
      throw error;
    }
  }
}
```

If you additionally need to ensure your are not receiving a `RegExp` instance from an inherited class, you'd also need to walk up the prototype chain. You can modify the above example and replace `return true;` with the following:

<!-- eslint-skip -->
```javascript
// A RegExp's prototype's chain should be
// value -> RegExp.prototype -> Object.prototype -> null
// If it's not, then we're dealing with a RegExp subclass.
const protoOf = Object.getPrototypeOf;
return protoOf(protoOf(protoOf(value))) === null;
```

Lodash's `_.isRegExp()` also supports cross-realm `RegExp` checks, but it uses a less robust algorithm that can be easily fooled. For example, if you run Lodash in the browser, the following will return the wrong answer.

```javascript
_.isRegExp({ get [Symbol.toStringTag]() { return 'RegExp' } })
// => true
```

In Node, Lodash will instead use `require('util').types.isRegExp(value)` for it's implementation, which you are also welcome to use if you know your code will only run in Node. This solution will also return `true` for subclasses.

Some very early JavaScript proposals may provide support for more ergonomic ways to do cross-realm type checking:
* [istypes](https://github.com/jasnell/proposal-istypes)
* [Pattern matching's built-in matchers](https://github.com/tc39/proposal-pattern-matching#built-in-custom-matchers-1)
