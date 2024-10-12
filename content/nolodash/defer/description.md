```javascript
setTimeout(fn)
// or
setTimeout(fn, 0, ...args)
```

If the timeout is omitted, it's the same as setting it to zero, which causes the function to run on the next event loop cycle assuming [it doesn't get delayed, which can happen for various reasons](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#reasons_for_delays_longer_than_specified).

Lodash's implementation will actually use a timeout of `1` instead of `0`, which means there will always be a `1ms` delay when using their implementation. Browsers in general also used to clamp `setTimeout()` to a minimum, but those restrictions have since been removed ([Here's one example of Chrome removing their 1ms clamping restriction](https://chromestatus.com/feature/4889002157015040)).

Please use `setTimeout(fn, 0)` as a last resort. If you need to wait for other code to finish running, prefer letting that other code tell you when it's finished running instead of trying to automatically figure it out based on when the call stack empties. Using `setTimeout(fn, 0)` means the code you're waiting on can't also use `setTimeout(fn, 0)` without causing your code to break (i.e. this hack can only be used so many times), and it means your code is at the mercy of running whenever `setTimeout()` lets it, which isn't always immediate.
