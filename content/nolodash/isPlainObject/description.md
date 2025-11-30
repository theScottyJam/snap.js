To check if your value is a "plain object" like `{ x: 2 }`

```javascript
value != null && [null, Object.prototype].includes(Object.getPrototypeOf(value))
```

The above should be good enough for the vast majority of use-cases.

The above type-detection mechanisms has the flaw that it does not work with cross-realm values. For example, if you receive an object from across an iframe boundary, that object's prototype would link to the iframe's `Object`, not your `Object`, and the above checks would fail to recognize it as a plain object. A cross-realm compatible solution could look something like this (depending how spoof-proof you want it to be):

```javascript
function isPlainObject(value) {
  if (value == null) {
    return false;
  }

  const protoOf = Object.getPrototypeOf;
  if (protoOf(value) === null) {
    return true;
  }

  const objectConstructorAsString = 'function Object() { [native code] }';
  return (
    protoOf(protoOf(value)) === null &&
    typeof protoOf(value).constructor === 'function' &&
    Function.prototype.toString.call(protoOf(value).constructor) === objectConstructorAsString
  );
}
```

Unfortunately you can't have an is-plain-object check that's both cross-realm-compatible and spoof-proof. The algorithm presented above can be spoofed as follows:

```javascript
class SpecialClass {
  static {
    Object.setPrototypeOf(SpecialClass.prototype, null);
    // This doesn't literally change the class's constructor,
    // it just changes an informational property to be a lie.
    SpecialClass.prototype.constructor = Object;
  }
}

isPlainObject(new SpecialClass()); // => true
```

Even Lodash's algorithm can be spoofed.

```javascript
class SpecialClass {
  static {
    SpecialClass.prototype.constructor = Object;
  }
}

_.isPlainObject(new SpecialClass()) // => true
```

Some very early JavaScript proposals may provide support for cross-realm type checking:
* [istypes](https://github.com/jasnell/proposal-istypes)
* [Pattern matching's built-in matchers](https://github.com/tc39/proposal-pattern-matching#built-in-custom-matchers-1)
