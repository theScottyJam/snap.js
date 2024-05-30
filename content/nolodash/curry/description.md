Currying is a principle of point-free programming, a programming style that JavaScript wasn't really designed to support. You can do it, but without the help of a third-party library, you'll just be fighting against the language and its uncurried standard library every step of the way. If you want to do point-free programming, you are better off adopting a library such as Rambda, which basically provides an alternative, pre-curried standard library along with some helper functions such as a replacement for Lodash's `_.curry()`.

That being said, if you really want a basic implementation for a curry function, you can use the following:

```javascript
function curry(func, arity, _appliedArgs = []) {
  return (...args) => {
    const newAppliedArgs = [..._appliedArgs, ...args];
    if (newAppliedArgs.length < arity) {
      return curry(func, arity, newAppliedArgs)
    } else {
      return func(...newAppliedArgs);
    }
  };
}
```

And if you need support for being able to skip parameters when partially applying a curried function (i.e. passing in the `_` value when calling it), you can use the following:

```javascript
const _ = Symbol('curry placeholder');

function curry(func, arity, _appliedArgs = {}) {
  return (...args) => {
    const appliedArgs = { ..._appliedArgs };
    for (let i = 0; i < arity; i++) {
      if (i in appliedArgs) continue;
      if (args[0] !== _) {
        appliedArgs[i] = args[0];
      }
      args.shift();
      if (args.length === 0) break;
    }

    if ((arity - 1) in appliedArgs || arity === 0) {
      return func(...Array.from({ ...appliedArgs, length: arity }));
    } else {
      return curry(func, arity, appliedArgs)
    }
  };
}
```

Notice that the `curry()` function above does not fall back to setting the `arity` parameter to `func.length` (i.e. the number of parameters `func` says it takes), instead, you're required to pass it in. This is purposely different from Lodash's `_.curry()`. Code maintainers often don't consider the `length` property of their functions to be a value they're supposed to keep stable between releases - in fact, many JavaScript developers are not even be aware of its existence. People are generally free to do updates such as `(x, y) => { ... }` to `(...args) => { ... }` or `(x, y) => { if (y === undefined) { y = someDefault; } ... }` to `(x, y=someDefault) => { ... }`. Lets keep it that way. Don't write fragile code that depends on the `.length` property of functions, causing your code to break if a refactoring like this occurs.
