```javascript
const keys = [];
for (const key in object) {
  keys.push(key);
}
keys.reverse();

for (const key of keys) {
  const value = object[key];
  ...
}
```

Please don't actually use this solution.

Objects are supposed to be treated as unordered collections. Yes, it's technically true that the JavaScript committee has standardized a stable ordering for object properties, but they only did this so your JavaScript programs will run exactly the same, no matter which engine they run on. They don't provide any tools to modify the ordering of an object (like, "move this property, so that it's second in iteration order, instead of last"), and the lack of these types of tools exist for a reason - they don't _want_ you to write code that relies on the order, nor does anyone trying to read and understand your code. Conceptually, objects are supposed to be unordered, please treat them that way. Because of this, there's no reason to iterate over an object from the end to the beginning, you should be able to just use `_.forIn()` instead of `_.forInRight()`.

Except, both `_.forIn()` and `_.forInRight()` have another problem.

It's very likely that you don't actually want to iterate over the enumerable, inherited properties, because:
1. Class syntax will automatically make all methods on the prototype chain non-enumerable, which means the for-in loop won't iterate over them anyways. Even if you achieve inheritance other ways (by manually messing with the prototypes), it can be argued that it's more proper to make the methods on the prototype non-enumerable.
2. It's long been considered a good practice whenever using a for-in loop, to also check if the property you're iterating over is non-inherited, by nesting an `if (Object.prototype.hasOwnProperty.call(object, key)) { ... }` check into your loop. This was done, among other reasons, to guard against the case where someone may have improperly mutated `Object.prototype`, and added an enumerable property to it. This `for-in` + `is-own` check isn't seen as much in the wild anymore, because the language has since come out with a better way to inherit over non-inherited keys, which is discussed in the `_.forOwn()` entry.

If you just want to iterate over object keys, and don't want to worry about inherited properties or the ordering of keys, look at `_.forOwn()` instead.
