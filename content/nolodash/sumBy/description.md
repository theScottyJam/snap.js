Simply map over your array with `iteratee`, before trying to sum it:

```javascript
array
  .map(iteratee)
  .reduce((a, b) => a + b);
```
