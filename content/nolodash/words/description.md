To split a string into words:

```javascript
string.split(' ')
```

The above will simply split the string on a single space. You can alternatively use one of these as an argument instead:
* `/ +/` - split on one or more spaces. This will correctly split the string `"a    b"` into `["a", "b"]`.
* `/\s+/` - split on one or more white-space characters (spaces, new lines, etc).
* `/[^a-zA-Z0-9]+/` - split on any non-alpha-numeric text.

If you need a more robust solution that's language-sensitive, consider using [`Intl.Segmenter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter) instead.

```javascript
const str = '吾輩は猫である。名前はたぬき。';
const segmenterJa = new Intl.Segmenter('ja-JP', { granularity: 'word' });

console.log(
  [...segmenterJa.segment(str)]
    .filter(segmentInfo => segmentInfo.isWordLike)
    .map(segmentInfo => segmentInfo.segment),
);
// => ['吾輩', 'は', '猫', 'で', 'ある', '名前', 'は', 'たぬき']
```

Lodash attempts to get fancy with how it determines whether or not something should be considered a word or not, but it doesn't do as good of a job as `Intl.Segmenter()` (which wasn't available when Lodash was being created). As always, remember that language is messy and even `Intl.Segmenter()` isn't a perfect solution, but it is the best option that's natively available.

Lodash also lets you define what a word is via a pattern argument to `_.words()`. Using the pattern argument is really the same as doing `string.match(pattern) ?? []`. (This is different from doing `string.split(pattern)` in that the regular expression needs to define what characters are inside of a word, instead of defining what characters are between the words).

```javascript
'fred, barney, & pebbles'.match(/[^, ]+/g) ?? []
// => [ 'fred', 'barney', '&', 'pebbles' ]
```
