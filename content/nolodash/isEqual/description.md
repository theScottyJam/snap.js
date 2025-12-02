To deeply compare values you'll have to build up your own deep comparison algorithm by hand according to your use-case. General-purpose deep-comparison algorithms like Lodash's `_.isEqual()` can be nice to have for simple use-cases, but it's important to understand that all such algorithms have limitations and you may be forced to revert to building your own deep-comparison algorithm if you are using a data type that the algorithm does not explicitly support (e.g. no general-purpose algorithm can deeply compare private data defined in your classes), or if you need very specific behavior (e.g. should `+0` equal `-0` or not? Will you only compare an object's string keys, or will you include symbol keys too? etc).

Here's a simple version to get you started - it shows examples of how you would compare a handful of different types of data. It's up to you to add, remove, or tweak functionality as needed. Note that this version does not support circular references - if you need to support that, you'll additionally need to keep around a set containing each value you've visited to make sure you're not going in a loop.

```javascript
const isPrimitive = value => value !== Object(value);

const isPlainObject = value => (
  value != null &&
  [null, Object.prototype].includes(Object.getPrototypeOf(value))
);

function isEqual(value1, value2) {
  // Each type corresponds to a particular comparison algorithm
  const getType = value => {
    if (isPrimitive(value)) return 'primitive';
    if (Array.isArray(value)) return 'array';
    if (value instanceof Map) return 'map';
    if (isPlainObject(value)) return 'plainObject';
    throw new Error(`deeply comparing an instance of type ${value.constructor?.name} is not supported.`);
  };

  const type = getType(value1);
  if (type !== getType(value2)) {
    return false;
  }

  if (type === 'primitive') {
    return (
      value1 === value2 ||
      (Number.isNaN(value1) && Number.isNaN(value2))
    );
  } else if (type === 'array') {
    return (
      value1.length === value2.length &&
      value1.every((iterValue, i) => isEqual(iterValue, value2[i]))
    );
  } else if (type === 'map') {
    // In this particular implementation, map keys are not
    // being deeply compared, only map values.
    return (
      value1.size === value2.size &&
      [...value1].every(([iterKey, iterValue]) => {
        return value2.has(iterKey) && isEqual(iterValue, value2.get(iterKey));
      })
    );
  } else if (type === 'plainObject') {
    const value1AsMap = new Map(Object.entries(value1));
    const value2AsMap = new Map(Object.entries(value2));
    return (
      value1AsMap.size === value2AsMap.size &&
      [...value1AsMap].every(([iterKey, iterValue]) => {
        return value2AsMap.has(iterKey) && isEqual(iterValue, value2AsMap.get(iterKey));
      })
    );
  } else {
    throw new Error('Unreachable');
  }
}
```

If you're dealing with JSON-serializable data (i.e. data that does not contain values like `Date` instances or `undefined`), and you're not working in performance-sensitive code, you could also use the simpler solution of `JSON.stringify()`ing the two values and comparing the strings. You'll need to supply a `replacer` function to sort object keys before converting the object to JSON.

```javascript
function sortObjKeysReplacer(key, maybeObj) {
  if (typeof maybeObj !== 'object' || maybeObj === null) return maybeObj;

  return Object.fromEntries(
    Object.entries(maybeObj)
      .sort((a, b) => a[0] > b[0] ? 1 : -1),
  );
}

function isEqual(value1, value2) {
  const jsonValue1 = JSON.stringify(value1, sortObjKeysReplacer);
  const jsonValue2 = JSON.stringify(value2, sortObjKeysReplacer);
  return jsonValue1 === jsonValue2;
}
```
