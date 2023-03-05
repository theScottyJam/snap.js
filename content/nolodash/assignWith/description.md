A complete implementation would look like this:

```javascript
function assignWith(object, sources, customizer) {
  for (const source of sources) {
    for (const [key, value] of Object.entries(source)) {
      const customizerResult = customizer(object[key], value, key, object, source);
      object[key] = customizerResult !== undefined ? customizerResult : source[key];
    }
  }

  return object;
}
```

However, it's possible that all you really need to do is map over your source objects before merging them, like this:

```javascript
// Merge your sources together, then map over each entry, updating them as you map over them.
const updatedEntries = Object.entries({ ...source1, ...source2, ...source3 })
  .map(([key, value]) => [key, ...operate on `value` however you want...]);

// Construct a new object from the mapped entries
const updatedSource = Object.fromEntries(updatedEntries);

// If needed, assign the updated entries to `object`, mutating it so it contains this new data.
Object.assign(object, updatedSource);
```
