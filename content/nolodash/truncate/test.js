describe('truncate() without separator support', () => {
  function truncate(string, { length, omission = '...' }) {
    if (string.length <= length) {
      return string;
    }

    return string.slice(0, length - omission.length) + omission;
  }

  it('does not truncate a string that is within the length limit', () => {
    expect(truncate('abcde', { length: 6 })).toEqual('abcde');
    expect(truncate('abcde', { length: 5 })).toEqual('abcde');
    expect(truncate('abcde', { length: 4 })).not.toEqual('abcde');
  });

  it('appends the omission string when truncating', () => {
    expect(truncate('abcde', { length: 4 })).toEqual('a...');
    expect(truncate('abcde', { length: 4, omission: '…' })).toEqual('abc…');
  });
});

describe('truncate() with separator support', () => {
  function truncate(string, { length, separator = '', omission = '...' }) {
    if (string.length <= length) {
      return string;
    }

    // Largest size you can slice `string` while remaining in the `length` restriction.
    const maxSliceLength = length - omission.length;

    if (typeof separator === 'string') {
      let index = string.lastIndexOf(separator, maxSliceLength);
      if (index === -1) {
        index = maxSliceLength;
      }
      return string.slice(0, index) + omission;
    } else if (separator instanceof RegExp) {
      let bestMatch = undefined;
      for (const match of string.matchAll(separator)) {
        if (match.index <= maxSliceLength) {
          bestMatch = match;
        }
      }

      const index = bestMatch?.index ?? maxSliceLength;
      return string.slice(0, index) + omission;
    } else {
      throw new Error('Invalid separator type received.');
    }
  }

  it('does not truncate a string that is within the length limit', () => {
    expect(truncate('abcde', { length: 6 })).toEqual('abcde');
    expect(truncate('abcde', { length: 5 })).toEqual('abcde');
    expect(truncate('abcde', { length: 4 })).not.toEqual('abcde');
  });

  it('appends the omission string when truncating', () => {
    expect(truncate('abcde', { length: 4 })).toEqual('a...');
    expect(truncate('abcde', { length: 4, omission: '…' })).toEqual('abc…');
  });

  it('can truncate using a string separator', () => {
    expect(truncate('abcd~=efgh~=ijklmn', { separator: '~=', length: 'abcd~=efgh~=i...'.length })).toEqual('abcd~=efgh...');
    expect(truncate('abcd~=efgh~=ijklmn', { separator: '~=', length: 'abcd~=efgh~=...'.length })).toEqual('abcd~=efgh...');
    expect(truncate('abcd~=efgh~=ijklmn', { separator: '~=', length: 'abcd~=efgh~...'.length })).toEqual('abcd~=efgh...');
    expect(truncate('abcd~=efgh~=ijklmn', { separator: '~=', length: 'abcd~=efgh...'.length })).toEqual('abcd~=efgh...');
    expect(truncate('abcd~=efgh~=ijklmn', { separator: '~=', length: 'abcd~=efg...'.length })).toEqual('abcd...');
  });

  it('falls back to truncating anywhere if the string separator fails to find a match', () => {
    expect(truncate('abcdefg', { separator: ' ', length: 5 })).toEqual('ab...');
  });

  it('can truncate using a regular expression separator', () => {
    expect(truncate('abcd~=efgh~=ijklmn', { separator: /[~=]+/g, length: 'abcd~=efgh~=i...'.length })).toEqual('abcd~=efgh...');
    expect(truncate('abcd~=efgh~=ijklmn', { separator: /[~=]+/g, length: 'abcd~=efgh~=...'.length })).toEqual('abcd~=efgh...');
    expect(truncate('abcd~=efgh~=ijklmn', { separator: /[~=]+/g, length: 'abcd~=efgh~...'.length })).toEqual('abcd~=efgh...');
    expect(truncate('abcd~=efgh~=ijklmn', { separator: /[~=]+/g, length: 'abcd~=efgh...'.length })).toEqual('abcd~=efgh...');
    expect(truncate('abcd~=efgh~=ijklmn', { separator: /[~=]+/g, length: 'abcd~=efg...'.length })).toEqual('abcd...');
  });

  it('falls back to truncating anywhere if the regular expression separator fails to find a match', () => {
    expect(truncate('abcdefg', { separator: / /g, length: 5 })).toEqual('ab...');
  });
});
