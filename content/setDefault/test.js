describe('setDefault()', () => {
  it('returns an existing value when the key is found', () => {
    const obj = {x: 2}
    const existingValue = _.setDefault(obj, 'x', 5)
    expect(existingValue).toBe(2)
  })

  it('returns the new default value when the key is not found', () => {
    const obj = {}
    const newValue = _.setDefault(obj, 'x', 5)
    expect(newValue).toBe(5)
  })

  it('does not modify the object when the key is found', () => {
    const obj = {x: 2}
    _.setDefault(obj, 'x', 5)
    expect(obj.x).toBe(2)
  })

  it('modifies the object when the key is not found', () => {
    const obj = {}
    _.setDefault(obj, 'x', 5)
    expect(obj.x).toBe(5)
  })

  it('can find existing properties in the prototype', () => {
    class MyClass { f() {} }

    const obj = new MyClass()
    _.setDefault(obj, 'f', 2)
    expect(obj.f).toBe(MyClass.prototype.f)
  })
})