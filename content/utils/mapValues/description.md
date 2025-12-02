## Parameters

- `obj`

  The object to be processed

- `fn`

  A callback that will be called with each value in the object. This function should return a transformed value that will be used to construct the new object. The callback accepts the following parameters:

  - `value`: The current value to transform.

## Examples

```javascript
mapValues({ a: 2, b: 3 }, x => x ** 2)
// => { a: 4, b: 9 }
```

## Additional Information

Any attributes in `obj`'s prototype will be ignored.
