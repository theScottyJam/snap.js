describe('startCase()', () => {
  function startCase(string) {
    const capitalize = ([first = '', ...rest]) => first.toUpperCase() + rest.join('');
    return string.split(' ').map(capitalize).join(' ');
  }

  it('converts text into start case', () => {
    expect(startCase('HELLO aWeSoMe world')).toEqual('HELLO AWeSoMe World');
  });

  it('handles an empty string', () => {
    expect(startCase('')).toEqual('');
  });
});
