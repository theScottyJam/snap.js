```javascript
for (const key in object) {
  const value = object[key];
  ...
}
```

It's very likely that you don't actually want this behavior. The only way this solution different from the solutions for `_.forOwn()`, is that it'll also iterate over non-enumerable inherited properties. But...
1. Class syntax will automatically make all methods on the prototype chain non-enumerable, which means the for-in loop won't iterate over them anyways. Even if you achieve inheritance other ways (by manually messing with the prototypes), it can be argued that it's more proper to make the methods on the prototype non-enumerable.
2. It's long been considered a good practice whenever using a for-in loop, to also check if the property you're iterating over is non-inherited, by nesting an `if (Object.prototype.hasOwnProperty.call(object, key)) { ... }` check into your loop. This was done, among other reasons, to guard against the case where someone may have improperly mutated `Object.prototype`, and added an enumerable property to it. This `for-in` + `is-own` check isn't seen as much in the wild anymore, because the language has since come out with a better way to iterate over non-inherited keys, which is discussed in the `_.forOwn()` entry.

For day-to-day development, it's best to stay away from the raw for-in loop. If you just want to iterate over object keys, and don't want to worry about inherited fields, look at `_.forOwn()` instead.
