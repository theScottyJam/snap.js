Instead of using `_.spread()`, you can use the spread syntax to spread arguments at the call site, such as what's seen in this example:

<!-- eslint-skip -->
```javascript
// -- An example from their documentation --
var say = _.spread(function(who, what) {
  return who + ' says ' + what;
});
 
say(['fred', 'hello']);
// => 'fred says hello'

// -- The example re-written to use spread syntax --
function say(who, what) {
  return who + ' says ' + what;
};
 
say(...['fred', 'hello']); // or, in this specific case, say('fred', 'hello') does the same thing.
// => 'fred says hello'
```

They also provided an example where it wasn't convenient to use spread syntax at the call site - in this particular case, you can just destructure the parameters.

<!-- eslint-skip -->
```javascript
// -- An example from their documentation --
var numbers = Promise.all([
  Promise.resolve(40),
  Promise.resolve(36)
]);
 
numbers.then(_.spread(function(x, y) {
  return x + y;
}));
// => a Promise of 76

// -- The example re-written to use destructuring --
const numbers = Promise.all([
  Promise.resolve(40),
  Promise.resolve(36)
]);
 
numbers.then(([x, y]) => x + y);
// => a Promise of 76

// -- The example re-written to also make use of async/await --
const [x, y] = await Promise.all([
  Promise.resolve(40),
  Promise.resolve(36)
]);

x + y;
// => 76
```
