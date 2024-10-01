```javascript
let nextId = 1;
function uniqueId(prefix = '') {
  return prefix + String(nextId++);
}
```
