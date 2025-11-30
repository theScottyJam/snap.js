If you don't need to use the optional precision argument, then you can simply use the following:

```javascript
Math.floor(number);
```

Otherwise:

```javascript
function floor(number, precision = 0) {
  const factor = 10 ** precision;
  return Math.floor(number * factor) / factor;
}
```