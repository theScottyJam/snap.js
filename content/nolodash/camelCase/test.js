describe('camelCase()', () => {
  function camelCase(string) {
    const capitalize = word =>
      word[0].toUpperCase() + word.slice(1).toLowerCase();
    const [firstWord, ...remainingWords] = string.split(' ');
    return [firstWord.toLowerCase(), ...remainingWords.map(capitalize)].join(
      ''
    );
  }

  it('converts text into camel case', () => {
    expect(camelCase('HELLO aWeSoMe world')).toEqual('helloAwesomeWorld');
  });

  it('handles an empty string', () => {
    expect(camelCase('')).toEqual('');
  });
});
