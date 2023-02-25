If you want an empty array to throw an error:

```javascript
array.reduce((a, b) => a + b);
```

If you want an empty array to cause `0` to be returned:

```javascript
array.reduce((a, b) => a + b, 0);
```
