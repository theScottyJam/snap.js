## Version 2.0

* The `Context` class isn't publicly exported anymore. It was initially advertised as a way to implicitly pass parameters down the component tree, but it doesn't work well at this job since it won't automatically pass the data through `renderEach()` or `renderChoice()` boundaries. Now the `Context` class is just an implementation detail to power the `useCleanup()` hook.
* The `html` template tag now allows you to interpolate text nodes (`Text` instances).
* The original implementation for signals tried to be as simple as possible, but its naive implementation caused some issues. If signal A updated signals B and C, and both B and C updates D, then the original implementation would cause D to update twice. The new update algorithm will look over the entire dependency graph and find an appropriate order to update all dependencies while avoiding repeated updates. For smaller projects, this repeated execution problem may be acceptable and you may wish to go with the simpler version 1.0 implementation.
* `Signal.prototype.subscribe()` and `Signal.prototype.unsubscribe()` were removed, and `useSignals()` was moved to `Signal.use()`. `useSignals()` was originally kept separate from the `Signal` class because it depended on the framework's lifecycle system. By keeping `useSignals()` separated, it allowed the `Signal` class to be a stand-alone class that could be copied out of the project as-is. The `.subscribe()` and `.unsubscribe()` functions also existed to help with this separation. The new signal-update algorithm required each signal to know which signals depended on it, so a simple callback-based listener system couldn't continue to work.
* `Signal.use()` now has its own lifecycle. A `useCleanup()` call that happens inside of `Signal.use()` will execute every time the `Signal.use()` re-executes its callback.
* `Signal.prototype.use()` was added as a shorthand for `Signal.use()`.

## Version 1.0

Initial release
