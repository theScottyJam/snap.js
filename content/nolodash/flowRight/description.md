If you need to allow the first function to take multiple arguments:

```javascript
const flowRight = fns => (...args) => {
  for (const fn of fns.toReversed()) {
    args = [fn(...args)];
  }
  return args[0];
};

// Example Usage:

const addSquare = flowRight([
  n => n ** 2,
  (a, b) => a + b,
]);

addSquare(1, 2)
// => 9
```

If the first function will only take one argument

```javascript
const flowRight = fns => value => {
  for (const fn of fns.toReversed()) {
    value = fn(value);
  }
  return value;
};
```
