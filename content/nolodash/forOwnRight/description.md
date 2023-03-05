```javascript
for (const [key, value] of Object.entries(object).reverse()) {
  ...
}
```

Please don't actually use this solution.

Objects are supposed to be treated as unordered collections. Yes, it's technically true that the JavaScript committee has standardized a stable ordering for object properties, but they only did this so your JavaScript programs will run exactly the same, no matter which engine they run on. They don't provide any tools to modify the ordering of an object (like, "move this property, so that it's second in iteration order, instead of last"), and the lack of these types of tools exist for a reason - they don't _want_ you to write code that relies on the order, nor does anyone trying to read and understand your code. Conceptually, objects are supposed to be unordered, please treat them that way. Because of this, there's no reason to iterate over an object from the end to the beginning, you should be able to just use `_.forOwn()` instead of `_.forOwnRight()`.
