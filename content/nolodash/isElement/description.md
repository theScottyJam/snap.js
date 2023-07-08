To check if your value is an HTML Element:

```javascript
value instanceof Element;
```

This solution has a couple of flaws:
1. it doesn't work with cross-realm values. For example, if you receive an instance of an `Element` from across an iframe boundary, that instance's prototype would link to the iframe's `Element` class, not your `Element` class, and the above check would fail to recognize it as an `Element`.
2. They will state that `Object.create(Element.prototype)` is an element, but it's not. It's just a regular object who's prototype has been set to `Element.prototype`.

Both of these issues can be solved with a helper function like this:

```javascript
// An isElement() check that supports cross-realm Elements.
function isElement(value) {
  try {
    // If you call a Element method, like .getAttribute(),
    // with a "this" value that's anything
    // other than an Element, a TypeError is thrown.
    Element.prototype.getAttribute.call(value, '')
    return true;
  } catch (error) {
    if (error instanceof TypeError) {
      return false;
    }
    throw error;
  }
}
```

Lodash's `_.isElement()` also supports cross-realm `Element` checks, but it uses a far less robust algorithm that can be easily fooled. To spoof it, you just need to provide a [non-plain object](https://lodash.com/docs/4.17.15#isPlainObject) which has a `nodeType` property set to `1`.

```javascript
class NotAnElement {
  nodeType = 1;
}

_.isElement(new NotAnElement()); // true
```
