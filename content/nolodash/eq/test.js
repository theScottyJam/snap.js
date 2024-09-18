function sameValueZero(x, y) {
  return x === y || (Number.isNaN(x) && Number.isNaN(y));
}

describe('sameValueZero()', () => {
  it('considers -0 and +0 to be equal', () => {
    expect(sameValueZero(-0, 0)).toEqual(true);
  });

  it('considers NaN to equal NaN', () => {
    expect(sameValueZero(NaN, NaN)).toEqual(true);
  });

  it('considers different values of the same type to not be equal', () => {
    expect(sameValueZero(1, 2)).toEqual(false);
  });

  it('considers values of different types to not be equal', () => {
    expect(sameValueZero(1, '1')).toEqual(false);
  });

  it('considers references to the same object to be equal', () => {
    const myObj = {};
    expect(sameValueZero(myObj, myObj)).toEqual(true);
    expect(sameValueZero(myObj, {})).toEqual(false);
  });
});
