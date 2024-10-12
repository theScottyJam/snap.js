```javascript
function bindAll(object, methodNames) {
  for (const method of methodNames) {
    object[method] = object[method].bind(object);
  }
}
```
