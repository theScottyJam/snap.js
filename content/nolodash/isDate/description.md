To check if your value is an instance of `Date`:

```javascript
value instanceof Date;
```

The above should be good enough for the vast majority of use-cases.

It's generally considered a bad practice to subclass built-ins, but if you suspect that a subclass might be handed to you and you wish to exclude subclasses from your check, you can compare prototypes like this:

```javascript
Object.getPrototypeOf(value) === Date.prototype;
```

Both of the above type-detection mechanisms have a couple of flaws:
1. they don't work with cross-realm values. For example, if you receive an instance of a `Date` from across an iframe boundary, that instance's prototype would link to the iframe's `Date` class, not your `Date` class, and both of the above checks would fail to recognize it as a `Date`.
2. They will state that `Object.create(Date.prototype)` is a `Date`, but it's not. It's just a regular object who's prototype has been set to `Date.prototype`.

Both of these issues can be solved with a helper function like this:

```javascript
// An isDate() check that supports cross-realm Dates.
function isDate(value) {
  try {
    // If you call a Date method, like .valueOf(),
    // with a "this" value that's anything
    // other than a Date, a TypeError is thrown.
    Date.prototype.valueOf.call(value);
    return true;
  } catch (error) {
    if (error instanceof TypeError) {
      return false;
    }
    throw error;
  }
}
```

If you additionally need to ensure your are not receiving a `Date` instance from an inherited class, you'd also need to walk up the prototype chain. You can modify the above example and replace `return true;` with the following:

```javascript
// A Date's prototype's chain should be
// value -> Date.prototype -> Object.prototype -> null
// If it's not, then we're dealing with a Map subclass.
const protoOf = Object.getPrototypeOf;
return protoOf(protoOf(protoOf(value))) === null;
```

Lodash's `_.isDate()` also supports cross-realm `Date` checks, but it uses a less robust algorithm that can be easily fooled. For example, if you run Lodash in the browser, the following will return the wrong answer.

```javascript
_.isDate({ get [Symbol.toStringTag]() { return 'Date' } }); // true
```

In Node, Lodash will instead use `require('util').types.isDate(value)` for it's implementation, which you are also welcome to use if you know your code will only run in Node. This solution will also return `true` for subclasses.

Some very early JavaScript proposals may provide support for more ergonomic ways to do cross-realm type checking:
* [istypes](https://github.com/jasnell/proposal-istypes)
* [Pattern matching's built-in matchers](https://github.com/tc39/proposal-pattern-matching#built-in-custom-matchers-1)
