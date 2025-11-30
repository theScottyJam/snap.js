If you simply want to remove whitespace from the end of the string, use the following:

```javascript
string.trimEnd()
```

If you want to specify which characters to trim, use the following:

<!-- eslint-skip -->
```javascript
/*# METADATA
[
  {
    "id": "unicodeSupport",
    "type": "radio",
    "message": "Do you need proper unicode/i18n support?",
    "default": "no",
    "options": {
      "no": "No - I only plan on trimming ASCII strings containing English text.",
      "yes": "Yes - I'd like to be able to properly support accent marks, emojis, etc, with an i18n-sensitive solution."
    }
  }
]
#*/

//# CONFIG { "unicodeSupport": "no" }

function trimEnd(str, chars) {
  const strArray = [...str];
  while (strArray.length > 0 && chars.includes(strArray.at(-1))) {
    strArray.pop();
  }

  return strArray.join('');
}

// Normal usage:
// trimEnd('-_-abc-_-', '_-') // => '-_-abc'

// Characters that don't fit in 16 bits,
// such as "👋🏿", can cause unexpected behavior.
// trimEnd('hi!👍🏿', '👋🏿') // => 'hi!👍'

//# CONFIG { "unicodeSupport": "yes" }

// Set this to your preferred locale,
// or set it to `undefined` to use the runtime's default locale.
const LOCALE = 'en';
const segmenter = new Intl.Segmenter(LOCALE);
const collator = new Intl.Collator(LOCALE)

function trimEnd(str, chars) {
  const charList = [...segmenter.segment(chars)]
    .map(({ segment }) => segment);

  let right = 0;
  for (const { segment, index } of segmenter.segment(str)) {
    const isTrimmable = charList.some(
      char => collator.compare(char, segment) === 0,
    );

    if (!isTrimmable) {
      right = index + segment.length;
    }
  }

  return str.slice(0, right);
}

// Normal usage:
// trimEnd('-_-abc-_-', '_-') // => '-_-abc'

// Characters that don't fit in 16 bits,
// such as "👋🏿", will work as expected.
// trimEnd('hi!👍🏿', '👋🏿') // => 'hi!👍🏿'
```

Lodash provides some unicode support with its `_.trim()` implementation, but it isn't as robust as using the native `Intl` APIs that the unicode-aware variant of the above solution utilizes.
