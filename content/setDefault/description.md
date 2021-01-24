`obj[key]` is considered to not have a value if `key` is not on `obj` or if `obj[key]` is undefined or null.

The purpose of this method is to provide a convinient way to retrieve a value from an object

# Parameters

* `obj`

  The object to be processed.

* `key`

  A key to use on `obj`.

* `defaultValue`

  The value to assign to `obj[key]` if `obj[key]` is undefined/null.

# Examples

```
> obj = {x: 2, y: null}
> setDefault(obj, 'x', 5)
2
> setDefault(obj, 'y', 5)
5
> setDefault(obj, 'z', 5)
5
> obj
{x: 2, y: 5, z: 5}
```

# Additional Information

If `key` is found in `obj`'s prototype, the prototype's value will be returned, and `obj` will not be altered.

# Native Syntax

Alternativly, if your target browsers support it, the following can be used instead.

```
const currentValue = (obj.x ??= 0)
```