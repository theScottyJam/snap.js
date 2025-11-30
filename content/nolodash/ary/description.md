`_.ary()` was created before JavaScript provided arrow function syntax. Now days, it's fairly easy and concise to just use an arrow function to accomplish the same job.


```javascript
// An example of using _.ary() from their documentation
_.map(['6', '8', '10'], _.ary(parseInt, 1)); // => [6, 8, 10]

// How you can do the same thing with an arrow function
['6', '8', '10'].map(n => parseInt(n)); // => [6, 8, 10]
```

If you wish to have a utility function that acts like Lodash's `_.ary()`, you can use the following:

```javascript
function ary(func, n) {
  return function (...args) {
    // Using .call() may be overkill.
    // You could just do `return func(...args.slice(0, n))` if you
    // don't need to worry about preserving the "this" argument.
    return func.call(this, ...args.slice(0, n));
  };
}
```
