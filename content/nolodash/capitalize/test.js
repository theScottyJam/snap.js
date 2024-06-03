describe('capitalize()', () => {
  function capitalize([first='', ...rest]) {
    return first.toUpperCase() + rest.join('').toLowerCase();
  }

  it('It converts the first character to upper case and the remaining to lower case', () => {
    expect(capitalize('a b C')).toEqual('A b c');
  });

  it('works on empty strings', () => {
    expect(capitalize('')).toEqual('');
  });

  // I would have a test case that shows how it can properly uppercase a multi-code-unit character,
  // but I'm not actually aware of any specific scenarios that would show the different.
  // Upper casing an entire character vs upper casing the first first part of a character usually yields the same results,
  // but languages are weird, and I'm sure there's scenarios where the two differ.
});
