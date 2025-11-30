Like with `_.isEqual()`, deep comparison algorithms need to be hand-built according to your use-cases. Lodash's `_.isEqualWith()` can be convenient to help with some use cases, but it won't cover everything (e.g. it can't peer into private data).

Here's a simple version to get you started - it shows examples of how you would compare a handful of different types of data. It's up to you to add, remove, or tweak functionality as needed. Note that this version does not support circular references - if you need to support that, you'll additionally need to keep around a set containing each value you've visited to make sure you're not going in a loop.

```javascript
const isPrimitive = value => value !== Object(value);

const isPlainObject = value => (
  value != null &&
  [null, Object.prototype].includes(Object.getPrototypeOf(value))
);

function isEqualWith(value1, value2, customizer, _parentNodeInfo = undefined) {
  // Each type corresponds to a particular comparison algorithm
  const getType = value => {
    if (isPrimitive(value)) return 'primitive';
    if (Array.isArray(value)) return 'array';
    if (isPlainObject(value)) return 'plainObject';
    throw new Error(`deeply comparing an instance of type ${value1.constructor?.name} is not supported.`);
  };

  // Checks with the customizer() function to see if it
  // wants to override the default comparison behavior
  {
    let customizerResult;
    if (_parentNodeInfo === undefined) {
      customizerResult = customizer(value1, value2);
    } else {
      const { key, value1Parent, value2Parent } = _parentNodeInfo;
      customizerResult = customizer(value1, value2, key, value1Parent, value2Parent);
    }

    if (customizerResult !== undefined) {
      return customizerResult;
    }
  }

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
      value1.every(
        (iterValue, i) => isEqualWith(
          iterValue,
          value2[i],
          customizer,
          { value1Parent: value1, value2Parent: value2, key: i },
        ),
      )
    );
  } else if (type === 'plainObject') {
    const value1AsMap = new Map(Object.entries(value1));
    const value2AsMap = new Map(Object.entries(value2));
    return (
      value1AsMap.size === value2AsMap.size &&
      [...value1AsMap].every(([iterKey, iterValue]) => {
        return (
          value2AsMap.has(iterKey) &&
          isEqualWith(
            iterValue,
            value2AsMap.get(iterKey),
            customizer,
            { value1Parent: value1, value2Parent: value2, key: iterKey },
          )
        );
      })
    );
  } else {
    throw new Error('Unreachable');
  }
}
```

In Lodash, the `customizer` function would be called with a sixth "stack" argument. Some probing shows that it's an instance of an internal "Stack" class that provides some methods which, presumably, can be used to gather information about the objects you're comparing. Due to the fact that this seems to be a rather complex feature that's entirely undocumented, it'll be assumed that the vast majority of users do not use this parameter, and so it's functionality won't be recreated here either.

Special data types, like Maps and Sets, are not supported in the above example. This is partly because Lodash chooses to support them in a slightly odd way that you may not wish to mirror. For example:
* The fourth or fifth argument to your `customizer` function is supposed to be the parent node, but if that parent node was a `Map` or `Set` instance, you'll instead receive arrays containing the node's contents (e.g. a map of usernames to ids would be turned into `[['Sally', 1], ['Zack', 2]]` before being provided to you).
* When comparing two sets, like `new Set([1, 2, 3, 4])` and `new Set([5, 6, 7, 8])`, its going to call your `customizer` function _16_ different times (assuming the `customizer` function returns `false` or `undefined` each time). As your sets grow in length, the amount of times it has to call your customizer grows exponentially. Maps have a similar issue. This behavior is required to implement the general-purpose algorithm Lodash was going for, but maybe for your use-case you don't need your algorithm to be so general-purpose - maybe you can cut some corners to help with performance.
