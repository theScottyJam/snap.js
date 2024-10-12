describe('camelCase()', () => {
  function camelCase(string) {
    const capitalize = ([first = '', ...rest]) => first.toUpperCase() + rest.join('').toLowerCase();
    const [firstWord, ...remainingWords] = string.split(' ');
    return [
      firstWord.toLowerCase(),
      ...remainingWords.map(capitalize),
    ].join('');
  }

  it('converts text into camel case', () => {
    expect(camelCase('HELLO aWeSoMe world')).toEqual('helloAwesomeWorld');
  });

  it('handles an empty string', () => {
    expect(camelCase('')).toEqual('');
  });
});
