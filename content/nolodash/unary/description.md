You can get the same effect by simply using arrow function syntax.

```javascript
// With Lodash
['6', '8', '10'].map(_.unary(parseInt)) // => [6, 8, 10]

// Without Lodash
['6', '8', '10'].map(s => parseInt(s)) // => [6, 8, 10]
```

In case you weren't aware, `.map()` supplies multiple parameters to its callbacks, including an index, and `parseInt()` can accept a second parameter, a base, so simply plugging the two together with `['6', '8', '10'].map(parseInt)` will result in the index being fed into the base parameter, resulting in `[6, NaN, 2]`. This is why it's important to use an arrow function (or `_.unary`) to force additional parameters to be ignored.

In general, it's good to avoid passing in more arguments than what a function takes - even if the function you're calling is just ignoring those additional parameters, there's no guarantee that it won't stay that way - often, functions are changed to support additional optional parameters, and this is usually not considered a breaking change - don't let that kind of change break your code. So, for example, prefer `array.map(x => Number(x))` over `array.map(Number)` - both of these will technically behave the same today, but if the JavaScript committee were to ever add a second, optional parameter to `Number`, then any code with `array.map(Number)` would break (In reality, they're unlikely to ever make this specific change to `Number()` because so many people have written `array.map(Number)` in their code, but they do often make other similar changes to other functions).
