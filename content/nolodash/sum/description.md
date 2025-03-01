If you want an empty array to throw an error:

```javascript
array.reduce((a, b) => a + b)
```

If you want an empty array to cause `0` to be returned:

```javascript
array.reduce((a, b) => a + b, 0)
```

There is an upcoming JavaScript proposal to add [a native sum method](https://github.com/tc39/proposal-math-sum) to the language. Once available, you'd be able to simply do this:

```javascript
Math.sumPrecise([1, 2, 3]) // => 6
```
