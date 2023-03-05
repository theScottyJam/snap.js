```javascript
function valuesIn(object) {
  const values = [];
  for (let key in object) {
    values.push(object[key]);
  }

  return values;
}
```

It's very likely that you don't actually need the above `valuesIn()` function. The only way this function is different from `_.values()` (or `Object.values()`), is that it'll also operate on non-enumerable inherited fields. But class syntax will automatically make all methods on the prototype chain non-enumerable, which means the `valuesIn()` function won't operate on them anyways. Even if you achieve inheritance other ways (by manually messing with the prototypes), it can be argued that it's more proper to make the methods on the prototype non-enumerable.

Perhaps there's some niche use-cases for this sort of function that arise from fairly abnormal and tricky uses of the JavaScript prototype, but, for day-to-day development, it's best to stay away from this function. If you just want to get an object's non-inherited property values, please look at `_.values()` instead.
