You can use an arrow function to get the same effect, or the native `.bind()` method will work for most use cases as well.

To bind a method to the object it is found on:

```javascript
// Instead of this
_.bind(obj.method, obj)
```

```javascript
// You can use an arrow function
(...args) => obj.method(...args)
```

```javascript
// or you can use the native .bind() method.
obj.method.bind(obj)
```

To bind a method to any object:

```javascript
// Instead of this
_.bind(obj.method, anyObj)
```

```javascript
// You can use an arrow function with .call()
(...args) => obj.method.call(anyObj, ...args)
```

```javascript
// or you can use the native .bind() method.
obj.method.bind(anyObj)
```

If you wish to partially apply some initial arguments:

```javascript
// Instead of this
_.bind(obj.method, obj, 1, 2, 3)
```

```javascript
// You can use an arrow function
(...args) => obj.method(1, 2, 3, ...args)
```

```javascript
// or you can use the native .bind() method.
obj.method.bind(obj, 1, 2, 3)
```

If you wish to partially apply some arguments from any position

```javascript
// Instead of this
_.bind(obj.method, obj, 1, _, 2, 3)
```

```javascript
// You can use an arrow function
x => obj.method(1, x, 2, 3)
```
