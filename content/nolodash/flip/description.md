Flipping a function's arguments is a technique that is sometimes done to facilitate point-free programming, a programming style that JavaScript wasn't really designed to support. You can do it, but without the help of a third-party library, you'll just be fighting against the language every step of the way. If you want to do point-free programming, you are better off adopting a library such as Rambda, which basically provides an alternative standard library built from the ground up to make point-free programming much easier to handle, as well as providing utility functions such as this flip function.

That being said, if you really want your own implementation of the flip function, you can use the following:

```javascript
function flip(func) {
  return function (...args) {
    // Using .call() may be overkill.
    // You could just do `return func(...args.reverse())` if you
    // don't need to worry about preserving the "this" argument.
    return func.call(this, ...args.reverse());
  };
}
```
