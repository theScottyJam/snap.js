If you have a simple key, then the `in` operator can be used to check if the property is found in the object.

```javascript
'x' in { x: 2 }; // true
'toString' in { x: 2 }; // true - `in` checks for inherited properties as well
```

If you have an array of path keys you wish to travel down, or perhaps, a string containing nested property access (like `x.y.z`), use this:

```javascript
function hasIn(object, path) {
  // Optional nested-property string support.
  // You can remove this `if` block if you don't need it.
  if (typeof path === 'string') {
    path = path.split(/[.\[\]\"]+/).filter(x => x);
  }

  const [head, ...tail] = path;
  if (!(head in object)) {
    return false;
  }

  if (tail.length === 0) {
    return true;
  }

  return hasIn(object[head], tail);
}
```

One of the primary reasons Lodash's `_.hasIn()` function was commonly used, was as a way to easily check if a nested property existed, without having to worry about in-between fields being undefined. This is now possible today using [optional chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining) (`?.`) whenever you suspect a property might be undefined.

For example, these two are the same:

```javascript
_.hasIn(obj, 'a.b.c');

'c' in obj?.a?.b;
```

Note that the support for nested string paths in the above `hasIn()` implementation isn't very robust. It'll take invalid-looking input, such as `"prop1.[prop2"`, ignore the invalid parts, and attempt to work with it anyways. Lodash's `_.hasIn()` isn't all that different in this regard. If you really need support for nested string paths, it's recommended to build out your own mini-parser, according to your specific use-cases. For everyone else, there shouldn't be a real reason to need this capability. Just provide the path you desire as an array instead.
