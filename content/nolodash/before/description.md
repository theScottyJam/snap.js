```javascript
function before(n, func) {
  let lastResult;
  return function (...args) {
    n--;
    if (n <= 0) {
      return lastResult;
    }

    lastResult = func.call(this, ...args);
    return lastResult;
  };
}
```

Personally, I'm not sure why a function like this is all that useful. If you ever find this function to be helpful, I'd be interested to hear why - you can open a GitHub issue and let me know.

If you want to use this function with `n=1`, then refer to `_.once()` instead.
