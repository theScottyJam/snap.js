To check if your value is an instance of `WeakSet`:

```javascript
value instanceof WeakSet;
```

The above should be good enough for the vast majority of use-cases.

It's generally considered a bad practice to subclass built-ins, but if you suspect that a subclass might be handed to you and you wish to exclude subclasses from your check, you can compare prototypes like this:

```javascript
Object.getPrototypeOf(value) === WeakSet.prototype;
```

Both of the above type-detection mechanisms have a couple of flaws:
1. they don't work with cross-realm values. For example, if you receive an instance of a `WeakSet` from across an iframe boundary, that instance's prototype would link to the iframe's `WeakSet` class, not your `WeakSet` class, and both of the above checks would fail to recognize it as a `WeakSet`.
2. They will state that `Object.create(WeakSet.prototype)` is a `WeakSet`, but it's not. It's just a regular object who's prototype has been set to `WeakSet.prototype`.

Both of these issues can be solved with a helper function like this:

```javascript
// An isWeakSet() check that supports cross-realm WeakSets.
function isWeakSet(value) {
  try {
    // If you call a WeakSet method, like .has(),
    // with a "this" value that's anything
    // other than a WeakSet, a TypeError is thrown.
    WeakSet.prototype.has.call(value, undefined);
    return true;
  } catch (error) {
    if (error instanceof TypeError) {
      return false;
    }
    throw error;
  }
}
```

If you additionally need to ensure your are not receiving a `WeakSet` instance from an inherited class, you'd also need to walk up the prototype chain. You can modify the above example and replace `return true;` with the following:

```javascript
// A WeakSet's prototype's chain should be
// value -> WeakSet.prototype -> Object.prototype -> null
// If it's not, then we're dealing with a WeakSet subclass.
const protoOf = Object.getPrototypeOf;
return protoOf(protoOf(protoOf(value))) === null;
```

Lodash's `_.isWeakSet()` also supports cross-realm `WeakSet` checks, but it uses a less robust algorithm that can be easily fooled. For example, the following will return the wrong answer.

```javascript
_.isWeakSet({ get [Symbol.toStringTag]() { return 'WeakSet' } }); // true
```

If you're exclusively using Node, you can use `require('util').types.isWeakSet(value)` to specifically check if the value is a WeakSet. This solution will also return `true` for subclasses.

Some very early JavaScript proposals may provide support for more ergonomic ways to do cross-realm type checking:
* [istypes](https://github.com/jasnell/proposal-istypes)
* [Pattern matching's built-in matchers](https://github.com/tc39/proposal-pattern-matching#built-in-custom-matchers-1)
