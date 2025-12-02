```javascript
Number(value)
```

```javascript
+value
```

Both `Number()` and the `+` unary operator behave the exact same, so either can be chosen. These can be used to convert a variety of different values, including bigint, booleans, strings, etc.

If you are converting a string to a number, you will likely want to additionally compare your string against a regular expression to make sure it is in the format you expect it to be in. The following are some strings that `Number()` will happily parse for you, that you may want prevent with your regular expression, depending on your use-case:
* Strings containing numbers with leading and/or trailing spaces (e.g. `Number('  23  ') === 23`)
* Decimal number (e.g. `Number('2.3') === 2.3` or `Number('2.3E+5') === 2.3E+5`)
* Scientific notation (e.g. `Number('2e3') === 2e3`)
* Numbers in different basis (e.g. `Number('0x2a') === 0x2a`, `Number('0o47') === 0o47`, or `Number('0b101') === 0b101`)
* Empty strings and white-space-only strings (e.g. `Number(' \t \n ') === 0`)
* Numbers with a sign (e.g. `Number('-2') === -2` or `Number('+2') === +2`)
* Infinity and -Infinity (e.g. `Number('-Infinity') === -Infinity`)
* Leading zeros (e.g. `Number('012') === 12`)

As a concrete example, if you are receiving user input, and you only want to allow integer inputs (and you are ok with leading zeros), you can use a function like the following to get your desired behavior:

```javascript
function parseUserInput(value) {
  // Ensures the string only contains digits and nothing else.
  if (!value.match(/^\d+$/)) {
    throw new Error('Invalid user input');
  }

  const parsedValue = Number(value);

  if (Number.isNaN(parsedValue)) {
    throw new Error('Invalid user input');
  }

  return parsedValue;
}
```

## What about parseInt() and parseFloat()?

You are welcome to use either of these functions as well for string-to-number conversions. These two functions follow their own different algorithms for parsing numbers that may or may not align with what you need. One unfortunate design decision to be aware of with these functions is the fact that as soon as they come across an invalid character, instead of returning an error value (`NaN`), they just parse what they can and return a number. This means, for example, `parseInt('2e7')` will unintuitively return the number `2`, because it doesn't know how to parse the `e`. All this really means is that it is even more important to use some up-front checking with a regular expression to ensure your string is formatted the way you would expect before handing the string off to `parseInt()` or `parseFloat()` to parse. It is also for this reason that I prefer using `Number()` over `parseInt()`/`parseFloat()` - `Number()` is less likely to surprise you with an unexpected result.
