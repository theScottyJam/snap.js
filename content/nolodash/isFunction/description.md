```javascript
typeof value === 'function';
```

Note that `typeof Function.prototype` is also `'function'`. While it may be overkill, you can use a helper function like the following to exclude `Function.prototype`.

```javascript
function isFunction(value) {
  const protoOf = Object.getPrototypeOf;
  return (
    typeof value === 'function' &&
    protoOf(protoOf(value)) !== null // Make sure Function.prototype was not passed in
  )
}
```
