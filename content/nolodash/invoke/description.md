```javascript
function invoke(object, path, ...args) {
  // Optional string-path support.
  // You can remove this `if` block if you don't need it.
  if (typeof path === 'string') {
    path = path.split(/[.\[\]\"]+/).filter(x => x);
  }

  const [head, ...tail] = path;
  if (!(head in object)) {
    return undefined;
  }

  if (tail.length === 0) {
    return object[head](...args);
  }

  return invoke(object[head], tail, ...args);
}
```

Be aware that, like Lodash's `_.invoke()`, the above implementation doesn't do anything to guard against prototype look-ups, for example, `invoke({}, 'toString')` will work, and will return the string `'[object Object]'`. To guard against this, use `if (!(Object.hasOwn(head, object)))` instead of `if(!(head in object))`.

One of the primary reasons Lodash's `_.invoke()` function was commonly used, was as a way to easily invoke a function nested in an object without having to worry about in-between fields being undefined. This is now possible today using [optional chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining) (`?.`) whenever you suspect a property might be undefined.

For example, these two are effectively the same:

```javascript
_.invoke(obj, 'subObj.fn', 2, 4);

obj?.subObj?.fn?.(2, 4);
```

Note that the support for string paths in the above `invoke()` implementation isn't very robust. It'll take invalid-looking input, such as `"prop1.[prop2"`, ignore the invalid parts, and attempt to work with it anyways. Lodash's `_.invoke()` isn't all that different in this regard. If you really need support for string inputs, like this, it's recommended to build out your own mini-parser, according to your specific use-cases. For everyone else, there shouldn't be a real reason to need this capability with the modern syntax that JavaScript provides.
