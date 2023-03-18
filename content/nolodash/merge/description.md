If you know the shape of the objects you're wishing to merge, you can just use the spread syntax, like this:

```javascript
const result = {
  ...object1,
  ...object2,
  subObject: {
    ...object1.subObject,
    ...object2.subObject,
  },
};
```

Otherwise, the following `merge()` function can be used to roughly mirror Lodash's `_.merge()`.

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
function merge(object, ...sources) {
  for (const source of sources) {
    for (const [key, value] of Object.entries(source)) {
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
        merge(object[key], value)
      }
    }
  }

  return object;
}
```

Note that the Lodash implementation would pick both own and inherited properties from the default objects, while this implementation does not. In practice, this shouldn't matter much because 1. Generally, your default objects won't have inherited fields, and 2. Even if they did, if those inherited fields are set up "properly" (i.e. the same way the class syntax automatically does for you), they should also be non-enumerable, and Lodash's `_.merge()` does not pick non-enumerable fields from the defaults object.

If all you want to do is deeply merge some plain objects, and you don't need to worry about odd scenarios, like "what happens when I merge an array with a number", or, "how does a Map instance get merged with a plain object", then an implementation like this should be sufficient.

```javascript
const isObject = value => ['object', 'function'].includes(typeof value) && value !== null;

// NOTE: This mutates `object`.
// It also may mutate anything that gets attached to `object` during the merge.
function merge(object, ...sources) {
  if (!isObject(object)) {
    throw new Error(`Expected ${object} to be an object.`)
  }

  for (const source of sources) {
    for (const [key, value] of Object.entries(source)) {
      if (value === undefined) {
        continue;
      }

      if (object[key] === undefined) {
        object[key] = value;
      } else {
        merge(object[key], value)
      }
    }
  }

  return object;
}
```
