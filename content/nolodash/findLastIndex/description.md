```javascript
array.findLastIndex(predicate);
```

If you need to start from a particular index, a simple solution is to check which index you're at inside your predicate. In this example, we'll look for the first non-null element that exists at index 5 or earlier.

```javascript
array.findLastIndex((value, i) => i <= 5 && value !== null);
```

If you need to start from a particular index, and you're dealing with larger arrays, you may just need to build your own `findLastIndex` function from a simple for loop, in order to help with performance.
