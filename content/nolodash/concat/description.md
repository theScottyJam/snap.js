View this function [on Lodash's website](https://lodash.com/docs/4.17.15#concat).

This replacement solution only works on arrays and other iterables. If some of your values might not be arrays, you can use this solution instead:

```javascript
const array1 = [1, 2, 3];
const value1 = 4
const array2 = [5, 6, 7];

const result = [array1, value1, array2].flat();

// Expected output: [1, 2, 3, 4, 5, 6, 7]
```