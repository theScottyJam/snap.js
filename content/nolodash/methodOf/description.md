```javascript
// This _.invoke() implementation is borrows from the _.invoke() doc entry.
function invoke(object, path, ...args) {
  // Optional string-path support.
  // You can remove this `if` block if you don't need it.
  if (typeof path === 'string') {
    path = path.split(/[.\[\]"]+/).filter(x => x);
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

function methodOf(object, ...args) {
  return path => invoke(object, path, ...args);
}
```

Be aware that, like Lodash's `_.methodOf()`, the above implementation doesn't do anything to guard against prototype look-ups, for example, `methodOf({})('toString')` will work, and will return the string `'[object Object]'`. To guard against this, use `if (!(Object.hasOwn(head, object)))` instead of `if(!(head in object))`.

Note that the support for string paths in the above `methodOf()` implementation isn't very robust. It'll take invalid-looking input, such as `"prop1.[prop2"`, ignore the invalid parts, and attempt to work with it anyways. Lodash's `_.methodOf()` isn't all that different in this regard. If you really need support for string inputs, like this, it's recommended to build out your own mini-parser, according to your specific use-cases. For everyone else, there shouldn't be a real reason to need this capability with the modern syntax that JavaScript provides.
