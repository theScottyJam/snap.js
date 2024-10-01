```javascript
() => ({})
```

Remember that when arrow functions return an object without explicitly using the `return` keyword, you must wrap the object in parentheses to distinguish it from a block of code (`() => {}` is interpreted as an arrow function with an empty body, which is not the same thing as an arrow function that returns an object).

The `_.stubObject()` method was created before arrow function syntax was standard, which meant it used to be a lot more verbose to accomplish this task without Lodash.
