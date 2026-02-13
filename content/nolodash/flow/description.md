If you need to allow the first function to take multiple arguments:

```javascript
const flow = fns => (...args) => {
  for (const fn of fns) {
    args = [fn(...args)];
  }
  return args[0];
};

// Example Usage:

const addSquare = flow([
  (a, b) => a + b,
  n => n ** 2,
]);

addSquare(1, 2)
// => 9
```

If the first function will only take one argument

```javascript
const flow = fns => value => {
  for (const fn of fns) {
    value = fn(value);
  }
  return value;
};
```

There is [a proposal to introduce a pipeline operator into JavaScript](https://github.com/tc39/proposal-pipeline-operator). Once available, it will become possible to use its syntax instead of a `flow` function to accomplish the same goal. (Syntax subject to change).

<!-- eslint-skip -->
```javascript
const add = (a, b) => a + b;
const square = n => n ** 2;

const calc = (a, b) => (
  add(a, b)
  |> square(%)
  |> add(%, -1)
);

calc(1, 2)
// => 8
```
