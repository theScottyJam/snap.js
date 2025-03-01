```javascript
function mean(array) {
  return array.reduce((a, b) => a + b) / array.length;
}
```

There is an upcoming JavaScript proposal to add [a native sum method](https://github.com/tc39/proposal-math-sum) to the language. Once available, you'd be able to simply do this:

```javascript
Math.sumPrecise(array) / array.length
```
