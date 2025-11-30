```javascript
value == null
```

In general, you should never use loose equality (`==`) in JavaScript, however, many people like to make the comparison against `null` an exception to this rule because it's a convenient way to check for either `null` or `undefined` - a fairly common operation.

Alternatively, if you wish to tailor to an audience who may be unfamiliar with the `== null` trick, the following would be the most explicit and easy-to-read way to go.

```javascript
value === null || value === undefined
```

There's also some who like using the nullish coalescing operator (`??`) to get similar behavior.

```javascript
(value ?? null) === null
```
