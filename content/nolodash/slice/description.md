```javascript
array.slice(start, end)
```

One benefit of Lodash's implementation of `.slice()`, is that it'll always return a dense array (as opposed to a [sparse one](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Indexed_collections#sparse_arrays)). The same behavior can be achieved in plain JavaScript by simply spreading the array into another one.

<!--eslint-disable no-sparse-arrays -->
```javascript
const sparseArray = [2,,3,,4]; // => [2, <empty>, 3, <empty>, 4]
const denseArray = [...sparseArray]; // => [2, undefined, 3, undefined, 4]
console.log(denseArray.slice(1, 3)); // => [undefined, 3]
```

Note, however, that Lodash is providing this behavior, mostly because it makes their `.slice()` implementation more consistent with how newer JavaScript array methods treat sparse arrays - by pretending the holes are the same as `undefined` values. In practice, such a feature shouldn't make a difference in your codebase, as it's generally considered bad practice to create or pass around sparse arrays. If you're a library developer who may be receiving arbitrary user input, simply treat arguments that could potentially be sparse arrays the same way you would treat any other kind of bad input the end-user gives you. If you don't do any data validation, then don't worry about it - a sparse array would result in undefined behavior, the same way any other bad input would. If you do up-front data validation, you can choose to add the detection of sparse arrays as an additional up-front check.
