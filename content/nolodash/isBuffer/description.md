The `Buffer` class is part of Node, and isn't found in the core JavaScript language. You can check if something is an instance of Buffer using Node's `isBuffer()` method as follows:

```javascript
Buffer.isBuffer(value);
```

This will return `true` for `Buffer` subclasses. If you want to ensure your buffer instance is not a subclass, you can do the following:

```javascript
function isNonInheritedBuffer(value) {
  // A Buffer's prototype's chain should be
  // value -> Buffer.prototype -> Uint8Array.prototype -> TypedArray.prototype -> Object.prototype -> null
  // If it's not, then we're dealing with a Buffer subclass.
  const protoOf = Object.getPrototypeOf;
  return (
    Buffer.isBuffer(value) &&
    protoOf(protoOf(protoOf(protoOf(protoOf(value))))) === null
  )
}
```

Both of these solutions will work with cross-realm `Buffer` instances.