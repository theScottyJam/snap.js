To simply check if a number is between two others, use the following:

```javascript
start <= number && number < end
```

If you're uncertain which of the two numbers are lower, use the following:

```javascript
function inRange(number, start, end) {
  const bounds = start < end
    ? [start, end]
    : [end, start];

  return bounds[0] <= number && number < bounds[1];
}
```
