It's recommended to avoid this function. Building objects via dynamic string paths may (or may not) be indicative of a deeper issue with how the problem is being approached. But, if you really do need support for this sort of thing, it can be done, with the help of the vanilla JavaScript implementation of `_.set()` and `_.zip()`.

```javascript
function set(object, path, value) {
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
    object[head] = value;
    return;
  }

  if (!(head in object)) {
    object[head] = typeof tail[0] === 'number' ? [] : {};
  }

  return set(object[head], tail, value)
}

function zip(...arrays) {
  if (arrays.length === 0) {
    return [];
  }

  const minLength = Math.min(...arrays.map(arr => arr.length));
  const result = [];
  for (let i = 0; i < minLength; ++i) {
    result.push(arrays.map(arr => arr[i]));
  }

  return result;
}

function zipObjectDeep(props, values) {
  const resultObj = {};
  for (const [path, value] of zip(props, values)) {
    set(resultObj, path, value);
  }

  return resultObj;
}
```

Note that the support for string paths in the above `zipObjectDeep()` implementation isn't very robust. It'll take invalid-looking input, such as `"prop1.[prop2"`, ignore the invalid parts, and attempt to work with it anyways. Lodash's `_.zipObjectDeep()` isn't all that different in this regard.
