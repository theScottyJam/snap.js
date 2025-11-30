```javascript
const isObject = value => ['object', 'function'].includes(typeof value) && value !== null;

// A "plain" object is an object who's a direct instance of Object
// (or, who has a null prototype).
const isPlainObject = value => {
  if (!isObject(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === null || prototype === Object.prototype;
};

// NOTE: This mutates `object`.
// It also may mutate anything that gets attached to `object` during the merge.
function mergeWith(object, sources, customizer) {
  for (const source of sources) {
    for (const [key, value] of Object.entries(source)) {
      const mergedValue = customizer(object[key], value, key, object, source);
      if (mergedValue !== undefined) {
        object[key] = mergedValue;
        continue;
      }
      // Otherwise, fall back to default behavior

      if (value === undefined) {
        continue;
      }

      // These checks are a week attempt at mimicking the various edge-case behaviors
      // that Lodash's `_.merge()` exhibits. Feel free to simplify and
      // remove checks that you don't need.
      if (!isPlainObject(value) && !Array.isArray(value)) {
        object[key] = value;
      } else if (Array.isArray(value) && !Array.isArray(object[key])) {
        object[key] = value;
      } else if (!isObject(object[key])) {
        object[key] = value;
      } else {
        mergeWith(object[key], value, customizer);
      }
    }
  }

  return object;
}
```

Lodash implementation will pick both own and inherited properties from the default objects, while this implementation does not. In practice, this shouldn't matter much because 1. Generally, your default objects won't have inherited fields, and 2. Even if they did, if those inherited fields are set up "properly" (i.e. the same way the class syntax automatically does for you), they should also be non-enumerable, and Lodash's `_.merge()` does not pick non-enumerable fields from the defaults object.

In Lodash, the customizer function would be called with a sixth "stack" argument. Some probing shows that it's an instance of an internal "Stack" class that provides some methods which, presumably, can be used to gather information about the objects you're merging. Due to the fact that this seems to be a rather complex feature that's entirely undocumented, it'll be assumed that the vast majority of users do not use this parameter, and so it's functionality won't be recreated here either.

The implementation above also does not support circular references. There's a handful of different ways you could support circular references depending on your needs:
* Don't bother checking for them at all (what the above implementation does)
* Check for them on the source objects and throw an error if you encounter one (another good option)
* When traversing a `source` object, stop before using a source node that you've seen before (what `lodash` was probably trying to do).
* When traversing a `source` object, if you encounter a node in `source` that you have seen before, merge its immediate properties but do not recurse into it anymore (what `lodash` does).
* When traversing a `source` object, stop if you find yourself trying to merge a source node to the same target node a second time. (This is arguably the most correct algorithm)

In practice, it's not common to need support for circular references, so you will probably be fine just leaving out support or throwing an error if you detect a circular reference.