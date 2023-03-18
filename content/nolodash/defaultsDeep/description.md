There's a handful of different patterns that can be used when you need to apply default values deeply to your object. Each of these methods will handle `null`, `undefined`, and absent properties differently.

1. Destructuring with defaults

Defaults will be applied if the properties on `object` are absent or set to `undefined`.

```javascript
function addDefaultValues(object) {
  const {
    prop1 = 'default 1',
    subObj = {
      prop2 = 'default 2',
      prop3 = 'default 3',
    } = {},
  } = object;

  return { prop1, subObj: { prop2, prop3 } };
}
```

2. Using the nullish coalescing operator (`??`)

Defaults will be applied if the properties on `object` are absent, set to `undefined`, or set to `null`.

```javascript
const result = {
  prop1: object.prop1 ?? 'default 1',
  subObj: {
    prop2: object.subObj?.prop2 ?? 'default 2',
    prop3: object.subObj?.prop3 ?? 'default 3',
  },
};
```

3. Spreading a defaults object with your target object

Defaults will only be applied if the properties on `object` are absent.

```javascript
const defaults = {
  prop1: 'default 1',
};

const subObjDefault = {
  prop2: 'default 2',
  prop3: 'default 3',
};

const result = {
  ...defaults,
  ...object,
  subObj: {
    ...subObjDefaults,
    ...object.subObj ?? {},
  },
};
```

If you already have an object containing default values, option 3 fits the nicest, but it can't be used as-is if you need the defaults to be applied against `undefined` and/or `null` fields. This can be handled by removing `undefined`/`null` from `object` before applying default values, as follows:

```javascript
// The behavior of this function can easily be tweaked if, for example,
// you also wish to remove `null` fields from an object.
function removeUndefinedProps(object) {
  const filteredEntries = Object.entries(object)
    .filter(([key, value]) => value !== undefined);

  return Object.fromEntries(filteredEntries);
}

const result = {
  ...defaults,
  ...removeUndefinedProps(object),
  subObj: {
    ...subObjDefaults,
    ...removeUndefinedProps(object.subObj ?? {}),
  },
};
```

Finally, if you don't feel any of these patterns will fit your use-case very well, you can use the following helper function, which mimics `_.defaultsDeep()`.

```javascript
const isObject = value => ['object', 'function'].includes(typeof value) && value !== null;

// NOTE: This mutates `object`.
function defaultsDeep(object, ...sources) {
  for (const source of sources) {
    for (const [key, value] of Object.entries(source)) {
      if (object[key] === undefined) {
        object[key] = value;
      } else if (isObject(value) && isObject(source[key])) {
        defaultsDeep(object[key], value);
      }
    }
  }

  return object;
}
```

Note that the Lodash implementation would pick both own and inherited properties from the default objects, while this third pattern of spreading objects does not. In practice, this shouldn't matter much because 1. Generally, your default objects won't have inherited fields, and 2. Even if they did, if those inherited fields are set up "properly" (i.e. the same way the class syntax automatically does for you), they should also be non-enumerable, and Lodash's `_.defaultsDeep()` does not pick non-enumerable fields from the defaults object.
