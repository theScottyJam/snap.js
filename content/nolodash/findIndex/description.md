```javascript
array.findIndex(predicate);
```

If you need to start from a particular index, a simple solution is to check which index you're at inside your predicate. In this example, we'll look for the first non-null element that exists at index 5 or greater.

```javascript
array.findIndex((value, i) => i >= 5 && value !== null);
```

If you need to start from a particular index, and you're dealing with larger arrays, you may just need to build your own `findIndex` function from a simple for loop, in order to help with performance.
