To check if your value is an instance of `Map`:

```javascript
value instanceof Map;
```

It's generally considered a bad practice to subclass built-ins, but if you suspect that a subclass might be handed to you and you wish to exclude subclasses from your check, you can compare prototypes like this:

```javascript
Object.getPrototypeOf(value) === Map.prototype;
```

Both of the above type-detection mechanisms have a couple of flaws:
1. they don't work with cross-realm values. For example, if you receive an instance of a `Map` from across an iframe boundary, that instance's prototype would link to the iframe's `Map` class, not your `Map` class, and both of the above checks would fail to recognize it as a `Map`.
2. They will state that `Object.create(Map.prototype)` is a `Map`, but it's not. It's just a regular object who's prototype has been set to `Map.prototype`.

Both of these issues can be solved with a helper function like this:

```javascript
// An isMap() check that supports cross-realm Maps.
function isMap(value) {
  try {
    // If you call a Map method, like .get(),
    // with a "this" value that's anything
    // other than a Map, a TypeError is thrown.
    Map.prototype.get.call(value, undefined);
    return true;
  } catch (error) {
    if (error instanceof TypeError) {
      return false;
    }
    throw error;
  }
}
```

If you additionally need to ensure your are not receiving a `Map` instance from an inherited class, you'd also need to walk up the prototype chain. You can modify the above example and replace `return true;` with the following:

```javascript
// A Map's prototype's chain should be
// value -> Map.prototype -> Object.prototype -> null
// If it's not, then we're dealing with a Map subclass.
const protoOf = Object.getPrototypeOf;
return protoOf(protoOf(protoOf(value))) === null;
```

Lodash's `_.isMap()` also supports cross-realm `Map` checks, but it uses a less robust algorithm that can be easily fooled. For example, if you run Lodash in the browser, the following will return the wrong answer.

```javascript
_.isMap({ get [Symbol.toStringTag]() { return 'Map' } }); // true
```

In Node, Lodash will instead use `require('util').types.isMap(value)` for it's implementation, which you are also welcome to use if you know your code will only run in Node. This solution will also return `true` for subclasses.

Some very early JavaScript proposals may provide support for more ergonomic ways to do cross-realm type checking:
* [istypes](https://github.com/jasnell/proposal-istypes)
* [Pattern matching's built-in matchers](https://github.com/tc39/proposal-pattern-matching#built-in-custom-matchers-1)
