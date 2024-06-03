describe('upperFirst()', () => {
  function upperFirst([first='', ...rest]) {
    return first.toUpperCase() + rest.join('');
  }

  it('It only converts the first character to upper case', () => {
    expect(upperFirst('a b C')).toEqual('A b C');
  });

  it('does not touch the string if the first character can not be converted to upper-case', () => {
    expect(upperFirst('+a')).toEqual('+a');
  });

  it('works on empty strings', () => {
    expect(upperFirst('')).toEqual('');
  });

  // I would have a test case that shows how it can properly uppercase a multi-code-unit character,
  // but I'm not actually aware of any specific scenarios that would show the different.
  // Upper casing an entire character vs upper casing the first first part of a character usually yields the same results,
  // but languages are weird, and I'm sure there's scenarios where the two differ.
});
