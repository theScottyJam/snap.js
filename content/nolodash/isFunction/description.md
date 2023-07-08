```javascript
typeof value === 'function';
```

Note that `typeof Function.prototype` is also `'function'`. To exclude `Function.prototype`, you can use a helper function like this:

```javascript
function isFunction(value) {
  const protoOf = Object.getPrototypeOf;
  return (
    typeof value === 'function' &&
    protoOf(protoOf(value)) !== null // Make sure Function.prototype was not passed in
  )
}
```
