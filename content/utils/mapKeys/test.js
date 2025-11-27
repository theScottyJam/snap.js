function mapKeys(obj, fn) {
  const newObj = {};
  for (const [key, value] of Object.entries(obj)) {
    newObj[fn(key)] = value;
  }
  return newObj;
}

describe('mapKeys()', () => {
  it('maps keys in objects', () => {
    const oldObj = { a: 2, b: 3 };
    const newObj = mapKeys(oldObj, k => k + k);
    expect(newObj).toEqual({ aa: 2, bb: 3 });
  });

  it('only maps own (non-inherited) values', () => {
    class MyClass {
      x = 2;
      f() {}
    }

    const oldObj = new MyClass();
    const newObj = mapKeys(oldObj, k => k + k);
    expect(newObj).toEqual({ xx: 2 });
  });
});
