If you want to replace all occurrences:

```javascript
string.replaceAll(pattern, replacement)

// -- Examples --

'a-b-c'.replaceAll('-', '.') // => 'a.b.c'
'a-b-c'.replaceAll(/-/g, '.') // => 'a.b.c'

// If the g flag is unset, an error will be thrown
'a-b-c'.replaceAll(/-/, '.') // => TypeError!
```

If you only want to replace the first occurrence:

```javascript
string.replace(pattern, replacement)

// -- Examples --

'a-b-c'.replace('-', '.') // => 'a.b-c'
'a-b-c'.replace(/-/, '.') // => 'a.b-c'

// If the g flag is set, it will actually replace all
// occurrences, just like .replaceAll()
'a-b-c'.replace(/-/g, '.') // => 'a-b-c'
```

Lodash's `_.replace()` will behave like `string.replaceAll()` when you give it a string `pattern`, in that it'll replace all occurrences of that string, and it will behave like `string.replace()` if you give it a regular expression pattern, in that it'll replace all occurrences if the global flag is set, otherwise it will only replace the first occurrence.
