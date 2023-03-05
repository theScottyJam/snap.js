```javascript
function assignIn(object, ...sources) {
  for (const source of sources) {
    for (const key in source) {
      object[key] = source[key];
    }
  }

  return object;
}
```

It's very likely that you don't actually need this function. The only way this function is different from `_.assign()` (or `Object.assign()`), is that it'll also copy over non-enumerable inherited fields. But...
1. Class syntax will automatically make all methods on the prototype chain non-enumerable, which means the `assignIn()` function won't copy them anyways. Even if you achieve inheritance other ways (by manually messing with the prototypes), it can be argued that it's more proper to make the methods on the prototype non-enumerable.
2. Why are you even trying to copy both the data and the inherited methods off of an object? If you want one object to share the same methods as another object, consider using normal inheritance.

Perhaps there's some niche use-cases for this sort of function that arise from fairly abnormal and tricky uses of the JavaScript prototype, but, for day-to-day development, it's best to stay away from this function. If you just want to copy data over from one object to another, please look at `_.assign()` instead.
