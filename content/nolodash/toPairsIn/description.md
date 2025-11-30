If you have a normal object, the following:

```javascript
function toPairsIn(object) {
  const pairs = [];
  for (let key in object) {
    pairs.push([key, object[key]]);
  }

  return pairs;
}
```

If you have a map, use `[...map]`.

And, while it's not all that useful, you can get the contents of a set, formatted in pairs the same way Lodash's `_.toPairs()` does it, as follows:

```javascript
[...set].map(value => [value, value])
```

It's very likely that you don't actually need the above `toPairsIn()` function. The only way this function is different from `_.toPairs()` (or `Object.entries()`), is that it'll also operate on non-enumerable inherited fields. But class syntax will automatically make all methods on the prototype chain non-enumerable, which means the `toPairsIn()` function won't operate on them anyways. Even if you achieve inheritance other ways (by manually messing with the prototypes), it can be argued that it's more proper to make the methods on the prototype non-enumerable.

Perhaps there's some niche use-cases for this sort of function that arise from fairly abnormal and tricky uses of the JavaScript prototype, but, for day-to-day development, it's best to stay away from this function. If you just want to get a list of non-inherited pairs (entries), please look at `_.toPairs()` instead.
