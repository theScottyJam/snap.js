```javascript
structuredClone(value)
```

`_.cloneDeep()` is loosely based off of the structured clone algorithm, the same algorithm that is provided to you natively with the `structuredClone()` function. The structured clone algorithm can be useful for simpler scenarios, but it has severe limitations that you should be aware of:
* many objects, such as `ArrayBuffer` instances, will have ownership of their data transferred to their clone, rendering the original unusable. A complete list of transferable objects can be found [on MDN's website](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Transferable_objects#supported_objects).
* Some values, like functions, can not be cloned.
* Some objects lose data when they get cloned. This includes the prototypes of most objects (making it impossible to properly clone instances of any userland class), getters and setters, some data stored on regular expression instances, etc.

For a complete reference to the algorithm's limitations, please refer to the [structured clone algorithm page](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm) on MDN.

If `structuredClone()` doesn't suit your needs (because, e.g., maybe you have userland instances that you wish to clone), you'll have to build up your own cloning algorithm by hand, according to your use-case. Here's a simple version to get you started - it shows examples of how you would deep-clone a handful of different types of data. It's up to you to add or remove functionality as needed. Note that this version does not support circular references - if you need to support that, you'll additionally need to keep around a set containing each value you've visited to make sure you're not going in a loop.

```javascript
const isObject = value => ['object', 'function'].includes(typeof value) && value !== null;

function cloneDeep(value) {
  if (!isObject(value)) {
    // It's a primitive, which is immutable, so we don't need to clone it.
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(cloneDeep);
  } else if (value instanceof Map) {
    return new Map(
      [...value].map(([key, value]) => [cloneDeep(key), cloneDeep(value)]),
    );
  } else if (value instanceof Set) {
    return new Set(
      [...value].map(x => cloneDeep(x)),
    );
  } else if (Object.getPrototypeOf(value) === Object.prototype) {
    return Object.fromEntries(
      Object.entries(value).map(([key, value]) => [key, cloneDeep(value)]),
    );
  } else if (Object.getPrototypeOf(value) === null) {
    const newObject = Object.fromEntries(
      Object.entries(value).map(([key, value]) => [key, cloneDeep(value)]),
    );
    Object.setPrototypeOf(newObject, null);
    return newObject;
  } else {
    throw new Error(`Can not clone an instance of ${value.constructor?.name}`);
  }
}
```
