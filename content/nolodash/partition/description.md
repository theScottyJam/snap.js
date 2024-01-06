In Lodash, you might use the partition function to sort between evens and odds as follows:

```javascript
const numbers = [2, 3, 7, 8, 9];

const [evens, odds] = _.partition(numbers, n => n % 2 === 0);
// evens -> [ 2, 8 ]
// odds -> [ 3, 7, 9 ]
```

The same objective can be accomplished in JavaScript as follows:

```javascript
const numbers = [2, 3, 7, 8, 9];

const { true: evens, false: odds } = Object.groupBy(numbers, n => n % 2 === 0);
// evens -> [ 2, 8 ]
// odds -> [ 3, 7, 9 ]
```
