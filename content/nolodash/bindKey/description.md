You can use arrow functions to achieve the same results.

To bind a method's this parameter to the object it is found on:

```javascript
// Instead of this
_.bindKey(obj, 'method')
```

```javascript
// You can use an arrow function
(...args) => obj.method(...args)
```

If you wish to partially apply some initial arguments in addition to binding a this parameter:

```javascript
// Instead of this
_.bindKey(obj, 'method', 1, 2, 3)
```

```javascript
// You can use an arrow function
(...args) => obj.method(1, 2, 3, ...args)
```

If you wish to partially apply some arguments from any position in addition to binding a this parameter:

```javascript
// Instead of this
_.bindKey(obj, 'method', 1, _, 2, 3)
```

```javascript
// You can use an arrow function
x => obj.method(1, x, 2, 3)
```

Notice that if we changed the `method` property on `obj` and swap it out for a new method, both the arrow function and `_.bindKey` will start invoking the new method, while using the native `.bind()` method or Lodash's `_.bind()` will use the old method.

```javascript
const obj = {
  method: () => 'before',
};

const lodashBindKeyFn = _.bindKey(obj, 'method');
const arrowFn = () => obj.method();
const lodashBindFn = _.bind(obj.method, obj);
const nativeBindFn = obj.method.bind(obj);

obj.method = () => 'after';

lodashBindKeyFn(); // 'after'
arrowFn(); // 'after'
lodashBindFn(); // 'before'
nativeBindFn(); // 'before'
```