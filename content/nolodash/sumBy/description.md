Simply map over your array with `iteratee`, before trying to sum them:

```javascript
array
  .map(iteratee)
  .reduce((a, b) => a + b);
```
