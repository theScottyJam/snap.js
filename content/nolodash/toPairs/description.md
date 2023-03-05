If you have a normal object, use `Object.entries(object);`.

If you have a map, use `[...map]`.

And, while it's not all that useful, you can get the contents of a set, formatted in pairs the same way Lodash's `_.toPairs()` does it, as follows:

```javascript
[...set].map(value => [value, value]);
```
