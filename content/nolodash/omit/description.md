If the properties you wish to omit are known in advance, you can use destructuring to omit them (possibly putting this in a helper function, to avoid polluting your scope with unnecessary variables).

```javascript
// `partialObject` will contain everything that's in `object`,
// except, `propA` and `propB` will be omitted.
const { propA, propB, ...partialObject } = object;
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

If you don't know the keys you need to remove in advance, the following helper function can be utilized.

```javascript
function omit(object, keys_) {
  const keys = new Set(keys_);
  const newObject = {};
  for (const [key, value] of Object.entries(object)) {
    if (!keys.has(key)) {
      newObject[key] = value;
    }
  }

  return newObject;
}
```

There is an early [Object.omit() proposal](https://github.com/tc39/proposal-object-pick-or-omit), which, if implemented, would provide functionality similar to the above helper function.

If you need a version of the omit function that can omit nested properties, you can use this:

```javascript
const isObject = value => ['object', 'function'].includes(typeof value) && value !== null;

function omit(object, keys) {
  const newObject = Array.isArray(object) ? [...object] : { ...object };

  for (const key of keys) {
    let keyPath;
    if (typeof key === 'string') {
      // Optional string-path support.
      // You can remove this key.split() stuff, and simply use `keyPath = [key];`
      // if you don't need it.
      keyPath = key.split(/[.\[\]"]+/).filter(x => x);
    } else if (Array.isArray(key)) {
      keyPath = key;
    } else {
      throw new Error(`Received a key ${key}, which is of an invalid type.`);
    }

    const [head, ...tail] = keyPath;
    if (tail.length === 0) {
      delete newObject[key];
    } else if (isObject(newObject[head]) || Array.isArray(newObject[head])) {
      newObject[head] = omit(newObject[head], [tail]);
    }
  }

  return newObject;
}
```

If you're only passing in a handful of keys at a time, the above implementation should work just fine, but if you think your keys array may become fairly large, you may need to do some work to optimize the above implementation a bit.

Note that the support for string paths (e.g. keys like `key.nestedKey`) in the above `omit()` implementation isn't very robust. It'll take invalid-looking input, such as `"prop1.[prop2"`, ignore the invalid parts, and attempt to work with it anyways. Lodash's `_.omit()` isn't all that different in this regard. If you really need support for string-path inputs, like this, it's recommended to build out your own mini-parser, according to your specific use-cases. For everyone else, there shouldn't be a real reason to need this capability.

Note that none of these implementations will actually copy non-enumerable properties from the prototype chain like Lodash's `_.omit()`. It's very likely that you don't actually want this kind of behavior anyways. Generally, all properties found on the prototype chain should be marked as enumerable (this is the default for class syntax) - this is standard practice, and there's really no reason to create a prototype with non-enumerable properties, with the possible exception of dealing with classes that were created before the class syntax came out, where the authors didn't want to put in the work of manually marking each method on the prototype as non-enumerable (it wasn't a common thing to do back in the day, even if it would have technically been more proper).
