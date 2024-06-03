describe('deburr() with NFKD', () => {
  function deburr(string) {
    return string.normalize('NFKD').replace(/\p{Diacritic}/gu, '');
  }

  it('deburrs accented characters that do not use combination marks', () => {
    // This "ñ" is of length 1 - it only uses a single code point to represent the character.
    expect(deburr('ñ')).toEqual('n');
  });

  it('deburrs combination marks', () => {
    // This "ñ" is of length 2 - it encodes the "n" with one code point and the combining tilde with another.
    expect(deburr('ñ')).toEqual('n');
  });

  it('deburrs compatible characters', () => {
    // A "D" and a "D" inside of a circle are considered compatible.
    expect(deburr('Ⓓ')).toEqual('D');
  });
});

describe('deburr() with NFD', () => {
  function deburr(string) {
    return string.normalize('NFD').replace(/\p{Diacritic}/gu, '');
  }

  it('deburrs accented characters that do not use combination marks', () => {
    // This "ñ" is of length 1 - it only uses a single code point to represent the character.
    expect(deburr('ñ')).toEqual('n');
  });

  it('deburrs combination marks', () => {
    // This "ñ" is of length 2 - it encodes the "n" with one code point and the combining tilde with another.
    expect(deburr('ñ')).toEqual('n');
  });

  it('does not deburr compatible characters', () => {
    // A "D" and a "D" inside of a circle are considered compatible,
    // but we aren't using the compatible deburring algorithm,
    // so the string should be left alone.
    expect(deburr('Ⓓ')).toEqual('Ⓓ');
  });
});
