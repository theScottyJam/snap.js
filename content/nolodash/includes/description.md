To search for an item in an array:

```javascript
array.includes(item)
```

To search for an item in an array-like value:

```javascript
Array.from(array).includes(item)
```

To search for a property value in an object:

```javascript
Object.values(yourObject).includes(item)
```

To search for a substring in a string:

```javascript
string.includes(subString)
```

Many iterables will provide some form of an `.includes()` method, but if they don't, you can convert the iterable to an array before looking for a value in there.

```javascript
[...array].includes(item)
```
