```javascript
const isObject = value => value === Object(value);
```

or

```javascript
const isObject = value => typeof value === 'function' || (typeof value === 'object' && value !== null);
```