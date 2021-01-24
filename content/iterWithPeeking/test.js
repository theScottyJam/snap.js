describe("iterWithPeeking()'s peek()", () => {
  it('lets you peek ahead an arbitrary amount as you iterate', () => {
    for (const [value, peek] of _.iterWithPeeking([1, 2, 3, 4, 5, 6])) {
      if (value === 1) continue
      expect(peek(3)).toBe(5)
      break
    }
  })

  it("can be called with no parameters", () => {
    for (const [value, peek] of _.iterWithPeeking([1, 2, 3, 4, 5, 6])) {
      if (value === 1) continue
      expect(peek()).toBe(3)
      break
    }
  })

  it('does not accept 0 for an index', () => {
    for (const [value, peek] of _.iterWithPeeking([1, 2, 3, 4, 5, 6])) {
      expect(() => peek(0)).toThrow()
      break
    }
  })

  it('returns undefined when index is out of bounds', () => {
    for (const [value, peek] of _.iterWithPeeking([1, 2, 3])) {
      if (value === 1) continue
      expect(peek(2)).toBeUndefined()
      break
    }
  })

  it('can peek at different points in the same iteration', () => {
    for (const [value, peek] of _.iterWithPeeking([1, 2, 3, 4, 5, 6])) {
      if (value === 1) {
        expect(peek()).toBe(2)
      } else if (value === 2) {
        expect(peek()).toBe(3)
      } else if (value === 4) {
        expect(peek(3)).toBeUndefined()
        expect(peek(2)).toBe(6)
      }
    }
  })

  it('does not mess with the values being iterated over', () => {
    const res = []
    for (const [value, peek] of _.iterWithPeeking([1, 2, 3, 4, 5, 6])) {
      res.push(value)
      if (value === 1) {
        peek()
      } else if (value === 2) {
        peek()
      } else if (value === 4) {
        peek(3)
        peek(2)
      }
    }
    expect(res).toEqual([1, 2, 3, 4, 5, 6])
  })

  it('does not generate more values then needed', () => {
    function* generator() {
      yield 1
      yield 2
      yield 3
      yield 4
      yield 5
      throw new Error('This should not get evaluated')
    }

    for (const [value, peek] of _.iterWithPeeking(generator())) {
      if (value === 1) continue
      expect(peek(3)).toBe(5)
      break
    }
  })
})