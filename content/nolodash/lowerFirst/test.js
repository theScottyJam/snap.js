describe('lowerFirst()', () => {
  function lowerFirst([first='', ...rest]) {
    return first.toLowerCase() + rest.join('');
  }

  it('It only converts the first character to lower case', () => {
    expect(lowerFirst('a b C')).toEqual('a b C');
  });

  it('does not touch the string if the first character can not be converted to lower-case', () => {
    expect(lowerFirst('+a')).toEqual('+a');
  });

  it('works on empty strings', () => {
    expect(lowerFirst('')).toEqual('');
  });

  // I would have a test case that shows how it can properly lowercase a multi-code-unit character,
  // but I'm not actually aware of any specific scenarios that would show the different.
  // Lower casing an entire character vs lower casing the first first part of a character usually yields the same results,
  // but languages are weird, and I'm sure there's scenarios where the two differ.
});
