Lodash's documentation makes it sound like they're checking if the value is specifically an instance of a set of built-in errors, but in reality, they're considering any [non-plain object](https://lodash.com/docs/4.17.15#isPlainObject) that has `message` and `name` properties that are strings to be errors. So, the following would return `true` despite not being an error.

```javascript
class NotAnError {
  name = 'NotAnError';
  message = 'this is not an error';
}

_.isError(new NotAnError()) // => true
```

If you actually want to check if a value is an error or one of its subclasses (like `TypeError`, or a user-defined subclass), you can simply do this:

```javascript
Error.isError(value)
```

And if you want to check if a value is a specific error type (like `Error`, `TypeError`, or a user defined error), and you want to exclude subclasses, you can compare prototypes like this:

```javascript
// Replace `TypeError` with the Error class of your choice.
Object.getPrototypeOf(value) === TypeError.prototype
```

For the vast majority of scenarios the above should be good enough, but the exclude-subclasses solutions does technically have a couple of flaws:
1. it doesn't work with cross-realm values. For example, if you receive an instance of an `Error` from across an iframe boundary, that instance's prototype would link to the iframe's `Error` class, not your `Error` class, and the above prototype comparison would fail to recognize it as a `Error`.
2. It will state that `Object.create(TypeError.prototype)` is a `TypeError`, but it's not. It's just a regular object who's prototype has been set to `TypeError.prototype`. (This issue isn't unique to `TypeError` - any error type you're trying to check will have this issue).

Both of these issues can be solved with a helper function like this:

```javascript
// Cross realm compatible is-non-inherited-type-error check.
function isNonInheritedTypeError(value) {
  const protoOf = Object.getPrototypeOf;
  // A TypeError's prototype chain should normally be
  // value -> TypeError.prototype -> Error.prototype -> null
  // If there's an extra link in there, it means inheritance has happened.
  return (
    Error.isError(value) &&
    protoOf(protoOf(value)) !== null &&
    protoOf(protoOf(protoOf(value))) !== null &&
    protoOf(protoOf(protoOf(protoOf(value)))) === null
  );
}
```

You can adapt this helper function to any error type you wish - you'll first need to walk the error type's prototype link to see how many links it has before updating the function to count that many links.
