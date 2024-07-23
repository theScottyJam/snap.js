```javascript
// Credit for this implementation:
// https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript/37511463#37511463
function deburr(string) {
  return string.normalize('NFKD').replace(/\p{Diacritic}/gu, '');
}
```

This will [normalize a unicode string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize) using the standard "Compatibility Decomposition" algorithm, which will cause accent characters to be represented as separate code point from its base character. Afterwords, all stray accent characters are removed with the `.replace()` call.

The NFKD "compatibility normalization" algorithm will also normalize multiple characters that are supposed to represent the same abstract character, for example, a D in a circle ("Ⓓ") will be normalized into a normal "D". A circled C ("Ⓒ") would likewise be normalized into a "C", however, the copyright symbol ("©") (which is a different code point from a circled C) will not be normalized into a "C", because, conceptually, the copyright symbol isn't intended to simply be a variation on the character "C".

Depending on your use-case, you may find the NFD "Canonical Decomposition" algorithm to be a more appropriate choice. This algorithm will only normalize characters that are literally the same but have multiple representations. For example, the "ñ" character is a single code point while the "ñ" character is an "n" followed by a tilde modifier - since these are just two different ways to represent the exact same character, they'll be normalized by the "Canonical Decomposition" algorithm into the decomposed variant - the "n" followed by a tilde modifier.

[Learn more about normalization algorithms, including other available algorithms on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize).

The above `deburr()` implementation isn't exactly the same as Lodash's. Lodash implemented its `deburr()` function before `.normalize()` was available. It opted to use a large look-up table to convert one unicode character into another, and some of the choices it made was different from what `.normalize()` chose to do.

Before reaching for `deburr()`, try looking around to see if there's a more specific solution to handle your use-case. Are you wanting to sort unicode strings? Consider using [Intl.Collator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator) instead. Are you wanting to just do length-checking? Consider [using `.normalize()` with the "NFC" or "NFKC" algorithm instead](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize#form). In general, it could be good to google around to see if there are solutions available for your more specific problems. `deburr()` is a very blunt solution that could cause your text to be mangled in less-than-ideal ways.
