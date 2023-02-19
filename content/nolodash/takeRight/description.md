```javascript
array.slice(-n);
```

You do have to watch out for the zero case. `_.takeRight(0)` will return an empty array, while, `array.slice(-0)` will return the whole array.
