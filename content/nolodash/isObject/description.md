All of these solutions are equivalent. Pick the one you find to be the most readable.

```javascript
const isObject = value => value === Object(value);

const isObject = value => ['object', 'function'].includes(typeof value) && value !== null;

const isObject = value => typeof value === 'function' || (typeof value === 'object' && value !== null);
```