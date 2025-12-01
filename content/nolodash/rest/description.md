Instead of this:

```javascript
const buildMessage = _.rest((key, values) => {
  return `${key}: ${values.join(', ')}`;
});

buildMessage('users', 'fred', 'barney', 'pebbles'); // => 'users: fred, barney, pebbles'
```

Use the "rest" syntax.

```javascript
const buildMessage = (key, ...values) => {
  return `${key}: ${values.join(', ')}`;
};

buildMessage('users', 'fred', 'barney', 'pebbles'); // => 'users: fred, barney, pebbles'
```
