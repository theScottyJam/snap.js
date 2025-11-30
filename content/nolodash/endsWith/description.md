```javascript
'abc'.endsWith('bc'); // => true
```

If you need to search from a particular location, use the following:

```javascript
const end = 3;
'abcde'.slice(0, end).endsWith('bc'); // => true
```
