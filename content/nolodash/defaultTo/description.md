The recommended way to fall back to a default value is the following:

```javascript
value ?? defaultValue
```

This will cause `defaultValue` to be used if `value` is either `null` or `undefined`. Unlike Lodash, it will _not_ cause the `defaultValue` to be given when `NaN` is provided - this is a good thing, both `null` and `undefined` are used to represent the absent of a value while `NaN` is intended to represent an error in a numerical calculation. In typical scenarios you shouldn't expect `NaN` to fall back to a default value any more than you would expect an instance of `Error` to do that.

If you are in a scenario where you are expecting an error in a numeric calculation (i.e. you're expecting to see `NaN`), and you would like to fall back to a default value if an error occurs, you can use the following:

```javascript
Number.isNaN(value) ? defaultValue : value
```
