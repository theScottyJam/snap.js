If you don't need to use the optional precision argument, then you can simply use the following:

```javascript
Math.round(number);
```

Otherwise:

```javascript
function round(number, precision=0) {
  const factor = 10**precision;
  return Math.round(number * factor) / factor;
}
```
