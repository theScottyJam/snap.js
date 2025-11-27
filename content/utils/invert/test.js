function invert(obj) {
  const newObj = {};
  for (const [key, value] of Object.entries(obj)) {
    newObj[value] = key;
  }
  return newObj;
}

describe('invert()', () => {
  it('inverts keys and values of an object', () => {
    const oldObj = { a: 2, b: 3 };
    const newObj = invert(oldObj);
    expect(newObj).toEqual({ 2: 'a', 3: 'b' });
  });

  it('only maps own (non-inherited) values', () => {
    class MyClass {
      x = 2;
      f() {}
    }

    const oldObj = new MyClass();
    const newObj = invert(oldObj);
    expect(newObj).toEqual({ 2: 'x' });
  });
});
