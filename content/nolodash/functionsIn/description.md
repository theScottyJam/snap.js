```javascript
function functionsIn(object) {
  const result = [];
  for (const key in object) {
    if (typeof object[key] === 'function') {
      result.push(key);
    }
  }

  return result;
}
```

It's very likely that you don't actually need this function. The only way this function is different from `_.functions()`, is that it'll also search for non-enumerable inherited fields. But class syntax will automatically make all methods on the prototype chain non-enumerable, which means the `functionsIn()` function won't look for them anyways. Even if you achieve inheritance other ways (by manually messing with the prototypes), it can be argued that it's more proper to make the methods on the prototype non-enumerable, i.e. if the methods were attached to the prototype "properly", the `functionsIn()` implementation wouldn't be able to find anything on there anyways, since they'd all be marked as non-enumerable.

Perhaps there's some niche use-cases for this sort of function, that arise from using the prototype in abnormal or legacy ways, but, for day-to-day development, it's best to stay away from this function. If you just want to search for non-inherited function names, use `_.functions()` instead. If you need to get all non-enumerable, inherited method names, first double check how you're designing your program to see if, perhaps, there's a better way to approach the problem, and if not, you can use `Object.getOwnPropertyNames()` to get non-inherited, non-enumerable properties in combination with manually walking up the prototype chain to achieve your desired effect.
