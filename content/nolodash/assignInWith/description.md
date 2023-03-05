```javascript
function assignInWith(object, sources, customizer) {
  for (const source of sources) {
    for (const key in source) {
      const customizerResult = customizer(object[key], value, key, object, source);
      object[key] = customizerResult !== undefined ? customizerResult : source[key];
    }
  }

  return object;
}
```

It's very likely that you don't actually need this function. The only way this function is different from `_.assignWith()`, is that it'll also copy over non-enumerable inherited fields. But class syntax will automatically make all methods on the prototype chain non-enumerable, which means the `assignInWith()` function won't copy them anyways. Even if you achieve inheritance other ways (by manually messing with the prototypes), it can be argued that it's more proper to make the methods on the prototype non-enumerable.

Perhaps there's some niche use-cases for this sort of function that arise from fairly abnormal and tricky uses of the JavaScript prototype, but, for day-to-day development, it's best to stay away from this function. If you just want to copy data over from one object to another with a customizer function (and don't need to worry about inherited fields), please look at the JavaScript equivalent to `_.assignWith()` instead.
