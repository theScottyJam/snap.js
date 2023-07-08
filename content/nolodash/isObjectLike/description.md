```javascript
const isObjectLike = value => typeof value === 'object' && value !== null;
```

`_.isObjectLike()` is really the same thing as `_.isObject()` except that it excludes functions. You could be more explicit about this by naming the function something like `isObjectButNotFunction()`, or by spelling this out in code at the usage site as follows:

```javascript
const isObject = value => value === Object(value);

if (isObject(value) && typeof value !== 'function') { ... }
```
