<!-- Due to the repeated variable names, eslint can't lint this. You'll need to manually lint it through other means. -->
<!-- eslint-skip -->
```javascript
/*# METADATA
[
  {
    "id": "when",
    "type": "radio",
    "message": "When a user attempts to call your debounced function multiple times in quick succession, at what point should the wrapped function actually be called?",
    "default": "trailing",
    "options": {
      "leading": "At the leading end of the series of calls.",
      "trailing": "At the trailing end of the series of calls (Lodash's default behavior).",
      "leadingAndTrailing": "At both the leading and trailing end of the series of calls."
    }
  },
  {
    "id": "withHelpers",
    "type": "radio",
    "message": "Should functions be attached to the returned debounced function for additional control?",
    "default": "none",
    "options": {
      "none": "No",
      "cancel": "Provide a cancel function, to cancel delayed function invocations.",
      "flushAndCancel": "In addition to a cancel function, provide a flush function that forces any delayed function invocations to run immediately."
    }
  }
]
#*/

//# CONFIG { "when": "leading", "withHelpers": "none" }

/**
 * Invokes the function `func` then starts a countdown for `wait` ms.
 * Any further invocations that happen during the countdown will be ignored,
 * and will reset the countdown back to `wait` ms.
 * @return The value that `func` returned when it was last called.
 */
function debounceLeading(func, wait) {
  let timeoutId = undefined;
  let lastResult;

  const debounced = (...args) => {
    if (timeoutId === undefined) {
      // Invokes the function and starts a countdown
      lastResult = func(...args);
      timeoutId = setTimeout(() => { timeoutId = undefined }, wait);
    } else {
      // Ignores this call and resets the countdown
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => { timeoutId = undefined }, wait);
    }

    return lastResult;
  };

  return debounced;
}

//# CONFIG { "when": "leading", "withHelpers": "cancel" }

/**
 * Invokes the function `func` then starts a countdown for `wait` ms.
 * Any further invocations that happen during the countdown will be ignored,
 * and will reset the countdown back to `wait` ms.
 * @return The value that `func` returned when it was last called.
 */
function debounceLeading(func, wait) {
  let timeoutId = undefined;
  let lastResult;

  const debounced = (...args) => {
    if (timeoutId === undefined) {
      // Invokes the function and starts a countdown
      lastResult = func(...args);
      timeoutId = setTimeout(() => { timeoutId = undefined }, wait);
    } else {
      // Ignores this call and resets the countdown
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => { timeoutId = undefined }, wait);
    }

    return lastResult;
  };

  debounced.cancel = () => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
  };

  return debounced;
}

//# CONFIG { "when": "leading", "withHelpers": "flushAndCancel" }

/*
.flush() doesn't actually make sense in the context of a leading-only debounce function,
as there's nothing to flush - the callback has already been called.

Choose a different combination of options :).
*/

//# CONFIG { "when": "trailing", "withHelpers": "none" }

/**
 * Starts a countdown for `wait` ms.
 * Any invocations that happen during the countdown will reset the countdown
 * back to `wait` ms. When the countdown is done, the function `func` will be called.
 * @return The value that `func` returned when it was last called, or
 *   undefined if it hasn't been called yet.
 */
function debounceTrailing(func, wait) {
  let lastFuncResult = undefined;
  let timeoutId = undefined;

  const debounced = (...args) => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      timeoutId = undefined;
      lastFuncResult = func(...args);
    }, wait);

    return lastFuncResult;
  };

  return debounced;
}

//# CONFIG { "when": "trailing", "withHelpers": "cancel" }

/**
 * Starts a countdown for `wait` ms.
 * Any invocations that happen during the countdown will reset the countdown
 * back to `wait` ms. When the countdown is done, the function `func` will be called.
 * @return The value that `func` returned when it was last called, or
 *   undefined if it hasn't been called yet.
 */
function debounceTrailing(func, wait) {
  let lastFuncResult = undefined;
  let timeoutId = undefined;

  const debounced = (...args) => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      timeoutId = undefined;
      lastFuncResult = func(...args);
    }, wait);

    return lastFuncResult;
  };

  debounced.cancel = () => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
  };

  return debounced;
}

//# CONFIG { "when": "trailing", "withHelpers": "flushAndCancel" }

/**
 * Starts a countdown for `wait` ms.
 * Any invocations that happen during the countdown will reset the countdown
 * back to `wait` ms. When the countdown is done, the function `func` will be called.
 * @return The value that `func` returned when it was last called, or
 *   undefined if it hasn't been called yet.
 */
function debounceTrailing(func, wait) {
  let lastFuncResult = undefined;
  let timeoutId = undefined;
  let debouncedArgs = undefined; // This will only be set when timeoutId is also set

  const onTimeout = () => {
    timeoutId = undefined;
    try {
      lastFuncResult = func(...debouncedArgs);
    } finally {
      debouncedArgs = undefined;
    }
    return lastFuncResult;
  };

  const debounced = (...args) => {
    debouncedArgs = args;

    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(onTimeout, wait);

    return lastFuncResult;
  };

  debounced.cancel = () => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
      debouncedArgs = undefined;
    }
  };

  debounced.flush = () => {
    if (timeoutId === undefined) {
      return lastFuncResult;
    }

    clearTimeout(timeoutId);
    return onTimeout();
  };

  return debounced;
}

//# CONFIG { "when": "leadingAndTrailing", "withHelpers": "none" }

/**
 * Invokes the function `func` then starts a countdown for `wait` ms.
 * Any further invocations that happen during the countdown will be ignored,
 * and will reset the countdown back to `wait` ms.
 * When the countdown expires, `func` will be called if there was an
 * attempt to call it during the countdown.
 * @return The value that `func` returned when it was last called.
 */
function debounceLeadingAndTrailing(func, wait) {
  let lastFuncResult;
  let timeoutId = undefined;

  const debounced = (...args) => {
    if (timeoutId === undefined) {
      // Invokes the function and starts a countdown
      lastFuncResult = func(...args);
      timeoutId = setTimeout(() => {
        timeoutId = undefined;
      }, wait);
    } else {
      // Ignores this call and resets the countdown.
      // When the countdown ends, it'll now also call func() again.
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        timeoutId = undefined;
        lastFuncResult = func(...args);
      }, wait);
    }

    return lastFuncResult;
  };

  return debounced;
}

//# CONFIG { "when": "leadingAndTrailing", "withHelpers": "cancel" }

/**
 * Invokes the function `func` then starts a countdown for `wait` ms.
 * Any further invocations that happen during the countdown will be ignored,
 * and will reset the countdown back to `wait` ms.
 * When the countdown expires, `func` will be called if there was an
 * attempt to call it during the countdown.
 * @return The value that `func` returned when it was last called.
 */
function debounceLeadingAndTrailing(func, wait) {
  let lastFuncResult;
  let timeoutId = undefined;

  const debounced = (...args) => {
    if (timeoutId === undefined) {
      // Invokes the function and starts a countdown
      lastFuncResult = func(...args);
      timeoutId = setTimeout(() => {
        timeoutId = undefined;
      }, wait);
    } else {
      // Ignores this call and resets the countdown.
      // When the countdown ends, it'll now also call func() again.
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        timeoutId = undefined;
        lastFuncResult = func(...args);
      }, wait);
    }

    return lastFuncResult;
  };

  debounced.cancel = () => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
  };

  return debounced;
}

//# CONFIG { "when": "leadingAndTrailing", "withHelpers": "flushAndCancel" }

/**
 * Invokes the function `func` then starts a countdown for `wait` ms.
 * Any further invocations that happen during the countdown will be ignored,
 * and will reset the countdown back to `wait` ms.
 * When the countdown expires, `func` will be called if there was an
 * attempt to call it during the countdown.
 * @return The value that `func` returned when it was last called.
 */
function debounceLeadingAndTrailing(func, wait) {
  let lastFuncResult;
  let timeoutId = undefined;
  // Set to undefined when no countdown is active or
  // the function does not need to be called during timeout handling.
  // Otherwise, set to a list of arguments that'll be sent to `func` during
  // timeout handling.
  let debouncedArgs = undefined;

  const onTimeout = () => {
    timeoutId = undefined;
    if (debouncedArgs !== undefined) {
      lastFuncResult = func(...debouncedArgs);
    }
    return lastFuncResult;
  };

  const debounced = (...args) => {
    if (timeoutId === undefined) {
      // Invokes the function and starts a countdown
      lastFuncResult = func(...args);
      debouncedArgs = undefined;
      timeoutId = setTimeout(onTimeout, wait);
    } else {
      // Ignores this call and resets the countdown.
      // When the countdown ends, it'll now also call func() again.
      clearTimeout(timeoutId);
      debouncedArgs = args;
      timeoutId = setTimeout(onTimeout, wait);
    }

    return lastFuncResult;
  };

  debounced.cancel = () => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
  };

  debounced.flush = () => {
    if (timeoutId === undefined) {
      return lastFuncResult;
    }

    clearTimeout(timeoutId);
    return onTimeout();
  };

  return debounced;
}
```
