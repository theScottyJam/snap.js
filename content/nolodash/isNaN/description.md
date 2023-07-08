```javascript
Number.isNaN(value);
```

Note that `Number.isNaN()` differs from the global `isNaN()` function in that the global `isNaN()` can only be used with numeric values. Non-numeric values will be coerced into numbers, potentially yielding wrong answers.

```javascript
isNaN(undefined); // true
Number.isNaN(undefined); // false
```
