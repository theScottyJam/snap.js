```javascript
function pickBy(object, predicate) {
  const newObject = {};
  for (const [key, value] of Object.entries(object)) {
    if (predicate(value, key)) {
      newObject[key] = value;
    }
  }

  return newObject;
}
```

There is also an early [Object.pick() proposal](https://github.com/tc39/proposal-object-pick-or-omit), which, if implemented, would provide functionality similar to the above helper function.

Note that this implementation will not actually copy non-enumerable properties from the prototype chain like Lodash's `_.pickBy()`. It's very likely that you don't actually want this kind of behavior anyways. Generally, all properties found on the prototype chain should be marked as enumerable (this is the default for class syntax) - this is standard practice, and there's really no reason to create a prototype with non-enumerable properties, with the possible exception of dealing with classes that were created before the class syntax came out, where the authors didn't want to put in the work of manually marking each method on the prototype as non-enumerable (it wasn't a common thing to do back in the day, even if it would have technically been more proper).
