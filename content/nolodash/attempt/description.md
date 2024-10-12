```javascript
function attempt(func, ...args) {
  try {
    // Using .call() may be overkill.
    // You could just do `return func(...args)` if you
    // don't need to worry about preserving the "this" argument.
    return func.call(...args);
  } catch (error) {
    return error instanceof Error ? error : new Error(error);
  }
}
```
