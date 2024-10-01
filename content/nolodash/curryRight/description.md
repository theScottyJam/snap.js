Currying is a principle of point-free programming, a programming style that JavaScript wasn't really designed to support. You can do it, but without the help of a third-party library, you'll just be fighting against the language and its uncurried standard library every step of the way. If you want to do point-free programming, you are better off adopting a library such as Rambda, which basically provides an alternative, pre-curried standard library along with some helper functions such as a replacement for Lodash's `_.curryRight()`.

That being said, you can easily curry-right any function by using arrow function syntax. For example, to curry-right a function that takes two arguments, do the following:

```javascript
// hasOwn() is a curried-right version of Object.hasOwn()
const hasOwn = prop => obj => Object.hasOwn(obj, prop);

// Example usage:
const doesObjHaveMyProp = hasOwn('exampleProp');
console.log(doesObjHaveMyProp({ exampleProp: 22 })); // true
```

If you want a function that does it, you can use the following:

```javascript
function curryRight(func, arity, _appliedArgs = []) {
  return (...args) => {
    const newAppliedArgs = [...args, ..._appliedArgs];
    if (newAppliedArgs.length < arity) {
      return curryRight(func, arity, newAppliedArgs);
    } else {
      return func(...newAppliedArgs);
    }
  };
}
```

And if you need support for being able to skip parameters when partially applying a curried function (i.e. passing in the `_` value when calling it), you can use the following:

```javascript
const _ = Symbol('curry placeholder');

function curryRight(func, arity, _appliedArgs = {}, _numApplied = 0) {
  return (...args) => {
    const appliedArgs = { ..._appliedArgs };
    let numApplied = _numApplied;
    for (let i = arity - 1; i >= 0; i--) {
      if (i in appliedArgs) continue;
      if (args.at(-1) !== _) {
        numApplied++;
        appliedArgs[i] = args.at(-1);
      }
      args.pop();
      if (args.length === 0) break;
    }

    if (numApplied === arity) {
      return func(...Array.from({ ...appliedArgs, length: arity }));
    } else {
      return curryRight(func, arity, appliedArgs, numApplied);
    }
  };
}
```

Notice that the `curryRight()` functions above requires you to supply an `arity` parameter - it does not fall back to using `func.length` (i.e. the number of parameters `func` says it takes). This is purposely different from Lodash's `_.curryRight()`. Code maintainers often don't consider the `length` property of their functions to be a value they're supposed to keep stable between releases - in fact, many JavaScript developers are not even be aware of its existence. People are generally free to do updates such as `(x, y) => { ... }` to `(...args) => { ... }` or `(x, y) => { if (y === undefined) { y = someDefault; } ... }` to `(x, y=someDefault) => { ... }`. Lets keep it that way. Don't write fragile code that depends on the `.length` property of functions, causing your code to break if a refactoring like this occurs.
