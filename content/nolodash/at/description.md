We will use a plain JavaScript implementation of `_.get()` to solve this problem.

Let's start with [a plain JavaScript implementation for Lodash's `_.get()`](#!/nolodash/get):

```javascript
function get(object, path, defaultValue = undefined) {
  // Optional string-path support.
  // You can remove this `if` block if you don't need it.
  if (typeof path === 'string') {
    path = path.split(/[.\[\]"]+/).filter(x => x);
  }

  if (path.length === 0) {
    return object;
  }

  const [head, ...tail] = path;
  if (!(head in object)) {
    return defaultValue;
  }

  return get(object[head], tail, defaultValue);
}
```

You can achieve the behavior of `_.at()` by using the above `get()` function as follows:

```javascript
// Maps over the paths array, fetching each field value from `object` corresponding to that path.
paths.map(path => get(object, path))
```

One of the primary reasons Lodash's `_.get()` and `_.at()` functions was commonly used was as a way to easily access a nested property without having to worry about in-between fields being undefined. This is now possible today using [optional chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining) (`?.`) whenever you suspect a property might be undefined, and the [nullish coalescing operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing) to provide a default value.

For example, these two are the same:

```javascript
_.at(obj, ['a.b', 'c.d'])
```

```javascript
[obj?.a?.b, obj?.c?.d]
```

Note that the support for string paths in the above `get()` implementation isn't very robust. It'll take invalid-looking input, such as `"prop1.[prop2"`, ignore the invalid parts, and attempt to work with it anyways. Lodash's `_.get()` and `_.at()` isn't all that different in this regard. If you really need support for string inputs, like this, it's recommended to build out your own mini-parser, according to your specific use-cases. For everyone else, there shouldn't be a real reason to need this capability with the modern syntax that JavaScript provides.
