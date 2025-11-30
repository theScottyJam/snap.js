If you have a simple key, then `Object.hasOwn()` can be used to check if it's a non-inherited property.

```javascript
Object.hasOwn({}, 'toString') // => false
Object.hasOwn({ toString() { return '{}' } }, 'toString') // => true
```

If you have an array of path keys you wish to travel down, or perhaps, a string containing nested property access (like `x.y.z`), use this:

```javascript
function has(object, path) {
  // Optional nested-property string support.
  // You can remove this `if` block if you don't need it.
  if (typeof path === 'string') {
    path = path.split(/[.\[\]"]+/).filter(x => x);
  }

  const [head, ...tail] = path;
  if (!Object.hasOwn(object, head)) {
    return false;
  }

  if (tail.length === 0) {
    return true;
  }

  return has(object[head], tail);
}
```

Note that the support for nested string paths in the above `has()` implementation isn't very robust. It'll take invalid-looking input, such as `"prop1.[prop2"`, ignore the invalid parts, and attempt to work with it anyways. Lodash's `_.has()` isn't all that different in this regard. If you really need support for nested string paths, it's recommended to build out your own mini-parser, according to your specific use-cases. For everyone else, there shouldn't be a real reason to need this capability. Just provide the path you desire as an array instead.

If you don't have dynamic strings being provided to you, and you don't need to do the "is-not-inherited" checks, then you can simply use the `in` operator with "optional chaining" (`?.`) to check for the existence of a nested property.

```javascript
'z' in (object?.x?.y ?? {})
```

The `?? {}` portion of this example is necessary since `?.` may produce `undefined`, and executing `... in undefined` causes an error to be thrown.
