```javascript
function keysIn(object) {
  const keys = [];
  for (let key in object) {
    keys.push(key);
  }

  return keys;
}
```

It's very likely that you don't actually need this function. The only way this function is different from `_.keys()` (or `Object.keys()`), is that it'll also grab over non-enumerable inherited keys. But class syntax will automatically make all methods on the prototype chain non-enumerable, which means the `keysIn()` function won't consider those inherited methods anyways. Even if you achieve inheritance other ways (by manually messing with the prototypes), it can be argued that it's more proper to make the methods on the prototype non-enumerable.

Perhaps there's some niche use-cases for this sort of function, that arise from using the prototype in abnormal or legacy ways, but, for day-to-day development, it's best to stay away from this function. If you just want to get the non-inherited keys from an object, use `Object.keys(object)` instead.
