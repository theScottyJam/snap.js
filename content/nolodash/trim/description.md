If you simply want to remove whitespace from both ends of the string, use the following:

```javascript
string.trim()
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

function trim(str, chars) {
  let left = 0;
  while (left < str.length && chars.includes(str[left])) {
    left++;
  }

  let right = str.length - 1;
  while (right >= left && chars.includes(str[right])) {
    right--;
  }

  return str.slice(left, right + 1);
}

// Normal usage:
// trim('-_-abc-_-', '_-') // => 'abc'

// Characters that don't fit in 16 bits,
// such as "👋🏿", can cause unexpected behavior.
// trim('👋🏿hi!👍🏿', '👋🏿') // => 'hi!👍'

//# CONFIG { "unicodeSupport": "yes" }

// Set this to your preferred locale,
// or set it to `undefined` to use the runtime's default locale.
const LOCALE = 'en';
const segmenter = new Intl.Segmenter(LOCALE);
const collator = new Intl.Collator(LOCALE)

function trim(str, chars) {
  const charList = [...segmenter.segment(chars)]
    .map(({ segment }) => segment);

  let left = 0;
  let right = 0;
  let onlySeenTrimmableChars = true;
  for (const { segment, index } of segmenter.segment(str)) {
    const isTrimmable = charList.some(
      char => collator.compare(char, segment) === 0,
    );
    if (onlySeenTrimmableChars && isTrimmable) {
      left = index + segment.length;
    }
    if (!isTrimmable) {
      onlySeenTrimmableChars = false;
      right = index + segment.length;
    }
  }

  return str.slice(left, right);
}

// Normal usage:
// trim('-_-abc-_-', '_-') // => 'abc'

// Characters that don't fit in 16 bits,
// such as "👋🏿", will work as expected.
// trim('👋🏿hi!👍🏿', '👋🏿') // => 'hi!👍🏿'
```

Lodash provides some unicode support with its `_.trim()` implementation, but it isn't as robust as using the native `Intl` APIs that the unicode-aware variant of the above solution utilizes.
