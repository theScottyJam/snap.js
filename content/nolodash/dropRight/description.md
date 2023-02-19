```javascript
array.slice(0, -n)
```

You do have to watch out for the zero case. `_.dropRight(0)` will return the whole array, while, `array.slice(0, -0)` will return an empty array.
