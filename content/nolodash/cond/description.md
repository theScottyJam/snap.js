This function is basically trying to recreate the feel of pattern-matching behaviors that you might find in other languages. There is [a proposal to introduce pattern matching as a native feature into JavaScript](https://github.com/tc39/proposal-pattern-matching), which would be capable of providing much more power than what this `_.cond()` function can do. Until then, this `_.cond()` really isn't all that different from simply using an if-else chain.

From their example, instead of doing:

<!-- eslint-skip -->
```javascript
var func = _.cond([
  [_.matches({ 'a': 1 }),           _.constant('matches A')],
  [_.conforms({ 'b': _.isNumber }), _.constant('matches B')],
  [_.stubTrue,                      _.constant('no match')]
]);
```

You could instead do:

<!-- eslint-skip -->
```javascript
const func = obj => {
  if (_.isMatch({ 'a': 1 }, obj)) return 'matches A';
  if (_.conformsTo({ 'b': _.isNumber }, obj)) return 'matches B';
  return 'no match';
};
```

The `_.matches` and `_.conforms` functions from the first example are essentially curried versions of `_.isMatch` and `_.conformsTo`. Since currying isn't needed anymore, I switched which function was being used (I didn't have to switch, I could have done `_.matches({ 'a': 1 })(obj)` as well, it just doesn't make sense to use a curried function when currying isn't necessary). Of course, you don't need to use these `_.isMatch()` or `_.conformsTo()` functions either if you don't want to, but that's a different topic.

If you don't like how we've gone from an expression to statements, here's an alternative formulation that you may prefer. Many people dislike the use of nested ternaries, but if done carefully, with specific formatting, they can be used to visually mimic the behavior of an if-else chain - it's a pattern that, once you're familiar with, isn't hard to read. I personally like the pattern, but also tend to avoid it simply because I know it's unfamiliar to many people.

<!-- eslint-skip -->
```javascript
const func = obj => (
  _.isMatch({ 'a': 1 }, obj) ? 'matches A' :
  _.conformsTo({ 'b': _.isNumber }, obj) ? 'matches B' :
  'no match'
);
```
