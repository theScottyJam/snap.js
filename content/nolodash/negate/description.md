Instead of this:

```javascript
function isEven(n) {
  return n % 2 == 0;
}

[1, 2, 3, 4, 5, 6].filter(_.negate(isEven)) // => [1, 3, 5]
```

just use an arrow function like this:

```javascript
[1, 2, 3, 4, 5, 6].filter(n => !isEven(n)) // => [1, 3, 5]
```