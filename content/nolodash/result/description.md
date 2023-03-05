```javascript
function result(object, path, defaultValue = undefined) {
  // Optional string-path support.
  // You can remove this `if` block if you don't need it.
  if (typeof path === 'string') {
    path = path.split(/[.\[\]\"]+/).filter(x => x);
  }

  const [head, ...tail] = path;
  if (!(head in object)) {
    return defaultValue;
  }

  if (tail.length === 0) {
    return object[head]();
  }

  return result(object[head], tail, defaultValue);
}
```

One of the primary reasons Lodash's `_.result()` function was commonly used, was as a way to easily invoke a function nested in an object, without having to worry about in-between fields being undefined. This is now possible today using [optional chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining) (`?.`) whenever you suspect a property might be undefined, and the [nullish coalescing operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing) to provide a default value.

For example, these two are effectively the same:

```javascript
_.result(obj, 'subObj.fn', 'fallback');

obj?.subObj?.fn?.() ?? 'fallback';
```

Note that the support for string paths in the above `result()` implementation isn't very robust. It'll take invalid-looking input, such as `"prop1.[prop2"`, ignore the invalid parts, and attempt to work with it anyways. Lodash's `_.result()` isn't all that different in this regard. If you really need support for string inputs, like this, it's recommended to build out your own mini-parser, according to your specific use-cases. For everyone else, there shouldn't be a real reason to need this capability with the modern syntax that JavaScript provides.
