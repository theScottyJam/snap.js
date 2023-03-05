```javascript
function unset(object, path) {
  // Optional string-path support.
  // You can remove this `if` block if you don't need it.
  if (typeof path === 'string') {
    const isQuoted = str => str[0] === '"' && str.at(-1) === '"';
    path = path.split(/[.\[\]]+/)
      .filter(x => x)
      .map(x => !isNaN(Number(x)) ? Number(x) : x)
      .map(x => typeof x === 'string' && isQuoted(x) ? x.slice(1, -1) : x);
  }

  if (path.length === 0) {
    throw new Error('The path must have at least one entry in it');
  }

  const [head, ...tail] = path;

  if (tail.length === 0) {
    delete object[head];
  } else if (head in object) {
    unset(object[head], tail);
  }

  return object;
}
```

One of the primary reasons Lodash's `_.unset()` function was commonly used, was as a way to easily delete a nested property without having to worry about in-between fields being undefined. This is now possible today using [optional chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining) (`?.`) whenever you suspect a property might be undefined.

For example, these two are the same:

```javascript
_.unset(obj, 'a.b');

delete obj?.a?.b;
```

Note that the support for string paths in the above `unset()` implementation isn't very robust. It'll take invalid-looking input, such as `"prop1.[prop2"`, ignore the invalid parts, and attempt to work with it anyways. Lodash's `_.unset()` isn't all that different in this regard. If you really need support for string inputs, like this, it's recommended to build out your own mini-parser, according to your specific use-cases. For everyone else, there shouldn't be a real reason to need this capability with the modern syntax that JavaScript provides.
