/* global globalThis */

// The below function is copied into description.md under
//   //# CONFIG { "when": "leading", "withHelpers": "none" }
//   (with the debounced.cancel() function removed)
// and
//   //# CONFIG { "when": "leading", "withHelpers": "cancel" }

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

// The below function is copied into description.md under
//   //# CONFIG { "when": "trailing", "withHelpers": "none" }
//   (with the debounced.cancel() function removed)
// and
//   //# CONFIG { "when": "trailing", "withHelpers": "cancel" }

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

// The below function is copied into description.md under
//   //# CONFIG { "when": "trailing", "withHelpers": "flushAndCancel" }
//   (with the function renamed to simply debounceTrailing())

/**
 * Starts a countdown for `wait` ms.
 * Any invocations that happen during the countdown will reset the countdown
 * back to `wait` ms. When the countdown is done, the function `func` will be called.
 * @return The value that `func` returned when it was last called, or
 *   undefined if it hasn't been called yet.
 */
function debounceTrailingWithFlushSupport(func, wait) {
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

// The below function is copied into description.md under
//   //# CONFIG { "when": "leadingAndTrailing", "withHelpers": "none" }
//   (with the debounced.cancel() function removed)
// and
//   //# CONFIG { "when": "leadingAndTrailing", "withHelpers": "cancel" }

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

// The below function is copied into description.md under
//   //# CONFIG { "when": "debounceLeadingAndTrailing", "withHelpers": "flushAndCancel" }
//   (with the function renamed to simply debounceLeadingAndTrailing())

/**
 * Invokes the function `func` then starts a countdown for `wait` ms.
 * Any further invocations that happen during the countdown will be ignored,
 * and will reset the countdown back to `wait` ms.
 * When the countdown expires, `func` will be called if there was an
 * attempt to call it during the countdown.
 * @return The value that `func` returned when it was last called.
 */
function debounceLeadingAndTrailingWithFlushSupport(func, wait) {
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

class FakeTimeout {
  #originals = {};
  #now = 0;
  #events = [];
  #fakeSetTimeout(callback, ms=0) {
    if (!Number.isInteger(ms) || ms < 0) {
      throw new Error(`Invalid timeout: ${ms}`);
    }
    const id = Math.floor(Math.random() * 1e8);
    this.#events.push({ callback, fireAt: this.#now + ms, id });
    return id;
  }

  #fakeClearTimeout(id) {
    this.#events = this.#events.filter(event => event.id !== id);
  }

  tick(deltaMs, { expectedError = undefined } = {}) {
    const newNow = this.#now + deltaMs;
    this.#events.sort((a, b) => b.fireAt - a.fireAt);
    while (this.#events.length > 0 && this.#events.at(-1).fireAt < newNow) {
      const event = this.#events.pop();
      // Update this.#now before calling event.callback(),
      // because the callback() could, in turn, call setTimeout()
      this.#now = event.fireAt;
      try {
        event.callback();
      } catch (error) {
        if (expectedError !== undefined && expectedError === error) {
          // ignore it
        } else {
          throw error;
        }
      }
      // Re-sorting events - it's possible that the callback registered another event.
      this.#events.sort((a, b) => b.fireAt - a.fireAt);
    }
    this.#now = newNow;
  }

  flush() {
    // Doing this in a loop, in case further events got registered after the flush happened
    while (this.#events.length > 0) {
      const furthestEventTime = Math.max(...this.#events.map(event => event.fireAt));
      // The +1 is probably unnecessary, but doing it anyways.
      this.tick(furthestEventTime - this.#now + 1);
    }
  }

  areTherePendingTimers() {
    return this.#events.length > 0;
  }

  getTimestamp() {
    return this.#now;
  }

  install() {
    this.#originals = {
      setTimeout: globalThis.setTimeout,
      clearTimeout: globalThis.clearTimeout,
    };
    globalThis.setTimeout = this.#fakeSetTimeout.bind(this);
    globalThis.clearTimeout = this.#fakeClearTimeout.bind(this);
  }

  uninstall() {
    globalThis.setTimeout = this.#originals.setTimeout;
    globalThis.clearTimeout = this.#originals.clearTimeout;
    this.#originals = {};
  }
}

// What gets returned if no return value was specified.
const DEFAULT_RETURN_VALUE = Symbol('Default mock callback return value');
class MockCallback {
  #eventTimes = [];
  #returns = { value: DEFAULT_RETURN_VALUE }; // { value: ... } or { error: ... }
  #fakeTimeout;
  constructor(fakeTimeout) {
    this.#fakeTimeout = fakeTimeout;
  }

  fn = () => {
    this.#eventTimes.push(this.#fakeTimeout.getTimestamp());
    if ('value' in this.#returns) {
      return this.#returns.value;
    } else {
      throw this.#returns.error;
    }
  };

  reset() {
    this.#eventTimes = [];
    this.#returns = { value: DEFAULT_RETURN_VALUE };
  }

  setReturnValue(value) {
    this.#returns = { value };
  }

  throwWhenCalled(error) {
    this.#returns = { error };
  }

  getCallCount() {
    return this.#eventTimes.length;
  }

  wasCalledAt(timeStamp) {
    return this.#eventTimes.some(eventTime => eventTime === timeStamp);
  }

  // Not actually used in any tests, but it can be helpful to call this to debug test issues.
  _getAllCallTimes() {
    return [...this.#eventTimes];
  }
}

function multiTest(description, expectationGroups, testFn, { only = false } = {}) {
  (only ? describe.only.bind(describe) : describe)(description, () => {
    for (const { targets, expectations = undefined } of expectationGroups) {
      for (const [name, target] of Object.entries(targets)) {
        if (only) console.log('???')
        it(`${name}()`, () => testFn(target, expectations));
      }
    }
  });
}

multiTest.only = (description, expectationGroups, testFn) => multiTest(description, expectationGroups, testFn, { only: true });

describe('debounce()', () => {
  const DEBOUNCE_TIME = 10 * 1000; // 10 seconds

  const fakeTimeout = new FakeTimeout();
  const mockCallback = new MockCallback(fakeTimeout);
  // Using the same debounced instances across all tests as an easy way to
  // verify that debounced functions clean themselves up between
  // different types of interactions.
  const debounced = {
    leading: debounceLeading(mockCallback.fn, DEBOUNCE_TIME),
    trailing: debounceTrailing(mockCallback.fn, DEBOUNCE_TIME),
    trailingWithFlushSupport: debounceTrailingWithFlushSupport(mockCallback.fn, DEBOUNCE_TIME),
    leadingAndTrailing: debounceLeadingAndTrailing(mockCallback.fn, DEBOUNCE_TIME),
    leadingAndTrailingWithFlushSupport: debounceLeadingAndTrailingWithFlushSupport(mockCallback.fn, DEBOUNCE_TIME),
  };

  beforeAll(() => {
    fakeTimeout.install();
  });

  afterEach(() => {
    fakeTimeout.flush();
    mockCallback.reset();
  })

  afterAll(() => {
    fakeTimeout.uninstall();
  });

  multiTest('repeated calls to the debounced function prevents the wrapped function from getting called', [
    {
      targets: {
        debounceLeading: debounced.leading,
        debounceTrailing: debounced.trailing,
        debounceTrailingWithFlushSupport: debounced.trailingWithFlushSupport,
      },
      expectations: { callCount: 1 },
    },
    {
      targets: {
        debounceLeadingAndTrailing: debounced.leadingAndTrailing,
        debounceLeadingAndTrailingWithFlushSupport: debounced.leadingAndTrailingWithFlushSupport,
      },
      // If multiple invocations happen during the debounce interval, and it's supposed
      // to fire both on the leading and trailing end of the interval, then we'd expect
      // the wrapped function to be called twice.
      expectations: { callCount: 2 },
    },
  ], (debouncedFn, expectations) => {
    for (let i = 0; i < 100; i++) {
      debouncedFn();
      fakeTimeout.tick(1000);
    }
    fakeTimeout.flush();

    expect(mockCallback.getCallCount()).toEqual(expectations.callCount);
  });

  multiTest('An isolated call to the debounced function results in a single call to the wrapped function', [
    {
      targets: {
        debounceLeading: debounced.leading,
        debounceTrailing: debounced.trailing,
        debounceTrailingWithFlushSupport: debounced.trailingWithFlushSupport,
        // This test is especially important for these two functions.
        // If multiple calls happen in quick succession, these two functions
        // are configured to call the wrapped function twice - on the leading and trailing end of the interval.
        // However, when only one call happens, these should only invoke the wrapped function once instead of twice.
        debounceLeadingAndTrailing: debounced.leadingAndTrailing,
        debounceLeadingAndTrailingWithFlushSupport: debounced.leadingAndTrailingWithFlushSupport,
      }
    },
  ], debouncedFn => {
    debouncedFn();
    fakeTimeout.flush();

    expect(mockCallback.getCallCount()).toEqual(1);
  });

  // Only applicable for a leading debounce function
  multiTest('Calls the wrapped function on the leading end', [
    {
      targets: {
        debounceLeading: debounced.leading,
        debounceLeadingAndTrailing: debounced.leadingAndTrailing,
        debounceLeadingAndTrailingWithFlushSupport: debounced.leadingAndTrailingWithFlushSupport,
      },
    },
  ], debouncedFn => {
    const startTime = fakeTimeout.getTimestamp();

    debouncedFn();
    fakeTimeout.tick(100);
    debouncedFn();
    fakeTimeout.tick(100);
    debouncedFn();
    fakeTimeout.flush();

    expect(mockCallback.wasCalledAt(startTime)).toEqual(true);
  });

  // Only applicable for a trailing debounce function
  multiTest('Calls the wrapped function on the trailing end', [
    {
      targets: {
        debounceTrailing: debounced.trailing,
        debounceTrailingWithFlushSupport: debounced.trailingWithFlushSupport,
        debounceLeadingAndTrailing: debounced.leadingAndTrailing,
        debounceLeadingAndTrailingWithFlushSupport: debounced.leadingAndTrailingWithFlushSupport,
      },
    },
  ], debouncedFn => {
    debouncedFn();
    fakeTimeout.tick(100);
    debouncedFn();
    fakeTimeout.tick(100);
    debouncedFn();
    const lastCallTime = fakeTimeout.getTimestamp();
    fakeTimeout.flush();

    expect(mockCallback.wasCalledAt(lastCallTime + DEBOUNCE_TIME)).toEqual(true);
  });

  // Only applicable for leading debounce functions
  multiTest('Memoizes the return value from the leading call', [
    {
      targets: {
        debounceLeading: debounced.leading,
        debounceLeadingAndTrailing: debounced.leadingAndTrailing,
        debounceLeadingAndTrailingWithFlushSupport: debounced.leadingAndTrailingWithFlushSupport,
      },
    },
  ], debouncedFn => {
    mockCallback.setReturnValue('THE_RETURN_VALUE');
    debouncedFn();
    mockCallback.setReturnValue('NOT_THE_RETURN_VALUE');

    fakeTimeout.tick(100);
    expect(debouncedFn()).toBe('THE_RETURN_VALUE');
  });

  // only applicable for trailing-only debounce functions
  multiTest('returns undefined if no value has been memoized yet', [
    {
      targets: {
        // Using fresh debounce instances, because this undefined-returning behavior only happens
        // with fresh instances.
        debounceTrailing: debounceTrailing(mockCallback.fn, DEBOUNCE_TIME),
        debounceTrailingWithFlushSupport: debounceTrailingWithFlushSupport(mockCallback.fn, DEBOUNCE_TIME),
      },
    },
  ], debouncedFn => {
    mockCallback.setReturnValue('THE_RETURN_VALUE');

    expect(debouncedFn()).toBe(undefined);
    // Even after a bit of time, it still behaves the same
    fakeTimeout.tick(100);
    expect(debouncedFn()).toBe(undefined);
  });


  // This is only applicable for trailing-only debounce functions, because leading debounce functions
  // will simply call the wrapped function again at this point in time and get a new value to memoize.
  multiTest('returns the memoized value shortly after the trailing end of the wait window', [
    {
      targets: {
        debounceTrailing: debounced.trailing,
        debounceTrailingWithFlushSupport: debounced.trailingWithFlushSupport,
      },
    },
  ], debouncedFn => {
    mockCallback.setReturnValue('THE_RETURN_VALUE');
    debouncedFn()

    fakeTimeout.tick(DEBOUNCE_TIME + 100);
    mockCallback.setReturnValue('NOT_THE_RETURN_VALUE');

    expect(debouncedFn()).toBe('THE_RETURN_VALUE');
  });

  // Only applicable for leading debounce functions
  multiTest('recovers if a callback called on the leading end of the debounce window throws', [
    {
      targets: {
        debounceLeading: debounced.leading,
        debounceLeadingAndTrailing: debounced.leadingAndTrailing,
        debounceLeadingAndTrailingWithFlushSupport: debounced.leadingAndTrailingWithFlushSupport,
      },
    },
  ], debouncedFn => {
    const error = new Error('Wuh Woh!');
    mockCallback.throwWhenCalled(error);

    // Just showing that when we start, no timers are scheduled
    expect(fakeTimeout.areTherePendingTimers()).toBe(false);

    expect(debouncedFn).toThrowError(error);

    // After it's been called, we should stay in the exact same state,
    // which means no timers should be scheduled still.
    // Timers aren't needed, because the way we're implementing this,
    // we don't want to start a debounce window unless the
    // callback returns successfully.
    expect(fakeTimeout.areTherePendingTimers()).toBe(false);
  });

  // This set of tests only handles leading debounce functions.
  // There's another set of tests below for the trailing-only functions that test the same thing
  multiTest('recovers if a callback called on the trailing end throws', [
    {
      targets: {
        debounceLeading: debounced.leading,
        debounceLeadingAndTrailing: debounced.leadingAndTrailing,
        debounceLeadingAndTrailingWithFlushSupport: debounced.leadingAndTrailingWithFlushSupport,
      },
    },
  ], debouncedFn => {
    debouncedFn()

    const error = new Error('Wuh Woh!');
    mockCallback.throwWhenCalled(error);

    // It throws an error while trying to auto-call the callback at the trailing end
    fakeTimeout.tick(DEBOUNCE_TIME + 100, { expectedError: error });

    // Things still work as normal afterwards, e.g. it'll still cache return values and what-not.
    fakeTimeout.tick(100);
    mockCallback.setReturnValue('NEW_RETURN_VALUE');
    expect(debouncedFn()).toBe('NEW_RETURN_VALUE');
  });

  // This set of tests only handles trailing-only debounce functions.
  // There's another set of tests below for the leading functions that test the same thing
  multiTest('recovers if a callback called on the trailing end throws', [
    {
      targets: {
        debounceTrailing: debounced.trailing,
        debounceTrailingWithFlushSupport: debounced.trailingWithFlushSupport,
      },
    },
  ], debouncedFn => {
    // Get an old value into the cache
    mockCallback.setReturnValue('OLD_RETURN_VALUE');
    debouncedFn()
    fakeTimeout.tick(DEBOUNCE_TIME + 100);

    // Start a new time window
    mockCallback.setReturnValue('NEW_RETURN_VALUE_1');
    debouncedFn()

    // Throw an error after the trailing end of the new time window
    // (which means, nothing will be cached from this time window)
    const error = new Error('Wuh Woh!');
    mockCallback.throwWhenCalled(error);
    // It throws an error while trying to auto-call the callback at the trailing end
    fakeTimeout.tick(DEBOUNCE_TIME + 100, { expectedError: error });

    // Things still work as normal afterwards, e.g. it'll still pull the old value from the cache and what-not
    fakeTimeout.tick(100);
    mockCallback.setReturnValue('NEW_RETURN_VALUE_2');
    expect(debouncedFn()).toBe('OLD_RETURN_VALUE');
  });

  // Only applicable for a leading debounce function
  multiTest('cancel() cancels timers, letting you re-trigger leading-edge behavior', [
    {
      targets: {
        debounceLeading: debounced.leading,
        debounceLeadingAndTrailing: debounced.leadingAndTrailing,
        debounceLeadingAndTrailingWithFlushSupport: debounced.leadingAndTrailingWithFlushSupport,
      },
    },
  ], debouncedFn => {
    debouncedFn();
    fakeTimeout.tick(100);

    expect(mockCallback.getCallCount()).toEqual(1);
    
    debouncedFn.cancel();
    debouncedFn();
    expect(mockCallback.getCallCount()).toEqual(2);
  });

  // Only applicable for a trailing debounce function
  multiTest('cancel() cancels timers, preventing the callback from getting called on the trailing end', [
    {
      targets: {
        debounceTrailing: debounced.trailing,
      },
      expectations: { callCount: 0 },
    },
    {
      targets: {
        debounceLeadingAndTrailing: debounced.leadingAndTrailing,
        debounceLeadingAndTrailingWithFlushSupport: debounced.leadingAndTrailingWithFlushSupport,
      },
      // It gets called once on the leading end
      expectations: { callCount: 1 },
    },
  ], (debouncedFn, expectations) => {
    debouncedFn();
    debouncedFn.cancel();

    expect(mockCallback.getCallCount()).toEqual(expectations.callCount);

    // Make what would have been the debounce time window pass.
    fakeTimeout.tick(DEBOUNCE_TIME + 100);

    // The number of calls hasn't changed, even though we
    // passed what would have been the trailing-end point of the time window.
    expect(mockCallback.getCallCount()).toEqual(expectations.callCount);
  });
});
