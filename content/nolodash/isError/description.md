Lodash's documentation makes it sound like they're checking if the value is specifically an instance of a set of built-in errors, but in reality, they're considering any [non-plain object]('https://lodash.com/docs/4.17.15#isPlainObject') that has `message` and `name` properties that are strings to be errors. So, the following would return `true` despite not being an error.

```javascript
class NotAnError {
  name = 'NotAnError';
  message = 'this is not an error';
}

_.isError(new NotAnError()); // true
```

If you actually want to check if a value is an error or one of its subclasses (like `TypeError`, or a user-defined subclass), you can simply do this:

```javascript
value instanceof Error;
```

And if you want to check if a value is a specific error type (like `Error`, `TypeError`, or a user defined error), and you want to exclude subclasses, you can compare prototypes like this:

```javascript
// Replace `TypeError` with the Error class of your choice.
Object.getPrototypeOf(value) === TypeError.prototype;
```

Both of the above type-detection mechanisms have a couple of flaws:
1. they don't work with cross-realm values. For example, if you receive an instance of an `Error` from across an iframe boundary, that instance's prototype would link to the iframe's `Error` class, not your `Error` class, and both of the above checks would fail to recognize it as a `Error`.
2. They will state that `Object.create(Error.prototype)` is an `Error`, but it's not. It's just a regular object who's prototype has been set to `Error.prototype`.

Both of these issues can be solved with a helper function like this:

```javascript
// An isError() check that supports cross-realm Errors.
function isError(value) {
  // DOMException and its subclasses will set a `Symbol.toStringTag` property
  // on their instances to the string 'DOMException'.
  const errorAsString = Object.prototype.toString.call(value);
  return ['[object Error]', '[object DOMException]'].includes(errorAsString);
}
```

This helper function can unfortunately be spoofed by providing any object with a `Symbol.toStringTag` property set to one of the expected string tags, like this:

```javascript
isError({ [Symbol.toStringTag]: 'DOMException' }); // true
```

There's not really anything that can be done to avoid this. You could try layering on additional checks, but there will always be a way to cause your `isError()` function to return a wrong answer.

If you're exclusively using Node, you can use `require('util').types.isNativeError(value)` to specifically check if the value is an instance of `Error` or one of its subclasses.

Some very early JavaScript proposals may provide support for more robust ways to do cross-realm type checking:
* [istypes](https://github.com/jasnell/proposal-istypes)
* [Pattern matching's built-in matchers](https://github.com/tc39/proposal-pattern-matching#built-in-custom-matchers-1)
