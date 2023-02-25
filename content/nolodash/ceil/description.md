If you don't need to use the optional precision argument, then you can simply use the following:

```javascript
Math.ceil(number);
```

Otherwise:

```javascript
function ceil(number, precision=0) {
  const factor = 10**precision;
  return Math.ceil(number * factor) / factor;
}
```