Instead of this:

```javascript
const doubled = n => n * 2;
const square = n => n ** 2;
const originalFunc = (x, y) => [x, y];

const wrappedFunc = _.overArgs(originalFunc, [square, doubled]);

wrappedFunc(9, 3); // => [81, 6]
```

just create a new function like this:

```javascript
const doubled = n => n * 2;
const square = n => n ** 2;
const originalFunc = (x, y) => [x, y];

function wrappedFunc(x, y) {
  return originalFunc(square(x), doubled(y));
}

wrappedFunc(9, 3); // => [81, 6]
```
