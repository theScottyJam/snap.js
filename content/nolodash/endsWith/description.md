```javascript
'abc'.endsWith('bc') // => true
```

If you search from a particular location, use the following:

```javascript
const end = 3;
'abcde'.slice(0, end).endsWith('bc'); // => true
```
