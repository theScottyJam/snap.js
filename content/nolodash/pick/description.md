If the properties you wish to pick are known in advance, you can use destructuring to pick them (possibly putting this in a helper function, to avoid polluting your scope with unnecessary variables).

```javascript
const { propA, propB } = object;
const newObject = { propA, propB };
```

If you need to also omit nested properties, a similar pattern can still be followed.

```javascript
// omit properties from `object`
const { propA, propB, nestedObj, ...partialObject } = object;

// omit properties from `object.nestedObj`
const { nestedPropA, ...partialNestedObject } = nestedObj;

// Combine the two partial objects, to build the final result.
const result = { ...partialObject, partialNestedObject };
```

If you don't know the keys you need to pick in advance, the following helper function can be utilized.

```javascript
function pick(object, keys) {
  const newObject = {};
  for (const key of keys) {
    if (key in object) {
      if (key in object) {
        newObject[key] = object[key];
      }
    }
  }

  return newObject;
}
```

There is an early [Object.pick() proposal](https://github.com/tc39/proposal-object-pick-or-omit), which, if implemented, would provide functionality similar to the above helper function.

If you need a version of the pick function that can pick nested properties, you can use this:

```javascript
const isObject = value => ['object', 'function'].includes(typeof value) && value !== null;

function pick(object, keys) {
  if (object == null) {
    return {};
  }
  const newObject = {};

  for (const key of keys) {
    let keyPath;
    if (typeof key === 'string') {
      // Optional string-path support.
      // You can remove this key.split() stuff, and simply use `keyPath = [key];`
      // if you don't need it.
      keyPath = key.split(/[.\[\]\"]+/).filter(x => x);
    } else if (Array.isArray(key)) {
      keyPath = key;
    } else {
      throw new Error(`Received a key ${key}, which is of an invalid type.`);
    }

    const [head, ...tail] = keyPath;
    if (!(head in object)) {
      continue;
    } else if (tail.length === 0) {
      newObject[key] = object[key];
    } else if (isObject(object[head]) || Array.isArray(object[head])) {
      newObject[head] = {
        ...newObject[head] ?? {},
        ...pick(object[head], [tail])
      };
    }
  }

  return newObject;
}
```

If you're only passing in a handful of keys at a time, the above implementation should work just fine, but if you think your keys array may become fairly large, you may need to do some work to optimize the above implementation a bit.

Note that the support for string paths (e.g. keys like `key.nestedKey`) in the above `pick()` implementation isn't very robust. It'll take invalid-looking input, such as `"prop1.[prop2"`, ignore the invalid parts, and attempt to work with it anyways. Lodash's `_.pick()` isn't all that different in this regard. If you really need support for string-path inputs, like this, it's recommended to build out your own mini-parser, according to your specific use-cases. For everyone else, there shouldn't be a real reason to need this capability.

In all of these implementations, you'll be able to pick own properties and inherited properties. This can lead to issues if you accept arbitrary untrusted user input in your keys array. For example, even though the object passed into `pick({}, [untrustedUserInput])` is empty, you can still pick inherited methods off of it, e.g. if untrustedUserInput is set to `'toString'`, you'd pick the `'toString'` method off of the empty object.