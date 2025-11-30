If you need to do this in a one-off situation, you can generally just modify your existing function to make it so it can only be called once, like this:

```javascript
let resultOfExpensiveTask = undefined;
async function doExpensiveTask() {
  if (resultOfExpensiveTask !== undefined) {
    return resultOfExpensiveTask;
  }

  resultOfExpensiveTask = JSON.parse(await fetchResource());
  return resultOfExpensiveTask;
}
```

If you need a helper function similar to Lodash's `_.once()`, you can use the following:

<!-- eslint-skip -->
```javascript
/*# METADATA
[
  {
    "id": "forwardThis",
    "type": "radio",
    "message": "Do you need to forward the \"this\" parameter from the caller to the callback? (Usually this isn't necessary)",
    "default": "no",
    "options": {
      "no": "No",
      "yes": "Yes"
    }
  }
]
#*/

//# CONFIG { "forwardThis": "no" }

function once(func) {
  let cachedResult;
  let hasCachedResult = false;
  return (...args) => {
    if (hasCachedResult) {
      return cachedResult;
    }

    hasCachedResult = true;
    cachedResult = func(...args);
    return cachedResult;
  };
}

//# CONFIG { "forwardThis": "yes" }

function once(func) {
  let cachedResult;
  let hasCachedResult = false;
  return function (...args) {
    if (hasCachedResult) {
      return cachedResult;
    }

    hasCachedResult = true;
    cachedResult = func.call(this, ...args);
    return cachedResult;
  };
}
```
