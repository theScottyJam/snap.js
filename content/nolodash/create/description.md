If you just need to create an object that inherits from another object:

```javascript
Object.create(prototype)
```

If you also need to assign some fields to the newly created object, either of these options work:

```javascript
Object.assign(Object.create(prototype), properties);

Object.create(prototype, Object.getOwnPropertyDescriptors(properties));
```
