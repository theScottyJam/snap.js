```javascript
function once(func) {
  let cachedResult;
  let hasCachedResult = false;
  return function(...args) {
    if (hasCachedResult) {
      return cachedResult;
    }

    hasCachedResult = true;
    cachedResult = func.call(this, ...args);
    return cachedResult;
  };
}
```
