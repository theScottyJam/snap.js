If you simply want to remove whitespace from the start of the string, use the following:

```javascript
string.trimStart()
```

If you want to specify which characters to trim, use the following:

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

function trimStart(str, chars) {
  let left = 0;
  while (left < str.length && chars.includes(str[left])) {
    left++;
  }

  return str.slice(left);
}

// Normal usage:
// trimStart('-_-abc-_-', '_-') // => 'abc-_-'

// Characters that don't fit in 16 bits,
// such as "👋🏿", can cause unexpected behavior.
// trimStart('👋🏽hi!', '👋🏿') // => '�hi!'

//# CONFIG { "unicodeSupport": "yes" }

// Set this to your preferred locale,
// or set it to `undefined` to use the runtime's default locale.
const LOCALE = 'en';
const segmenter = new Intl.Segmenter(LOCALE);
const collator = new Intl.Collator(LOCALE)

function trimStart(str, chars) {
  const charList = [...segmenter.segment(chars)]
    .map(({ segment }) => segment);

  let left = 0;
  for (const { segment, index } of segmenter.segment(str)) {
    const isTrimmable = charList.some(
      char => collator.compare(char, segment) === 0
    );

    if (!isTrimmable) {
      break;
    }

    left = index + segment.length;
  }

  return str.slice(left);
}

// Normal usage:
// trimStart('-_-abc-_-', '_-') // => 'abc-_-'

// Characters that don't fit in 16 bits,
// such as "👋🏿", will work as expected.
// trimStart('👋🏽hi!', '👋🏿') // => '👋🏽hi!'
```

Lodash provides some unicode support with its `_.trimStart()` implementation, but it isn't as robust as using the native `Intl` APIs that the unicode-aware variant of the above solution utilizes.
