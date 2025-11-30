```javascript
function pad(string, length, chars = ' ') {
  const charsToAdd = Math.max(0, length - string.length);
  const leftPadLength = string.length + Math.floor(charsToAdd / 2);
  return string.padStart(leftPadLength, chars).padEnd(length, chars);
}
```
