describe('createEventEmitter()', () => {
  it('triggers subscribed events with arguments', () => {
    const event = _.createEventEmitter()
    const spy1 = jest.fn()
    event.subscribe(spy1)
    const spy2 = jest.fn()
    event.subscribe(spy2)

    event.trigger(1, 2)
    expect(spy1).toHaveBeenCalledWith(1, 2)
    expect(spy2).toHaveBeenCalledWith(1, 2)
  })

  it('returns the results of the subscribed functions', () => {
    const event = _.createEventEmitter()
    event.subscribe(() => 2)
    event.subscribe(() => 3)

    const res = event.trigger()
    expect(res).toEqual([2, 3])
  })

  it('is capable of having async subscribers', async () => {
    const event = _.createEventEmitter()
    event.subscribe(async () => 2)
    event.subscribe(async () => 3)

    const res = await Promise.all(event.trigger())
    expect(res).toEqual([2, 3])
  })

  it('is capable of being triggered multiple times, with new subscribers', () => {
    const event = _.createEventEmitter()
    expect(event.trigger()).toEqual([])

    event.subscribe(() => 1)
    expect(event.trigger()).toEqual([1])

    event.subscribe(() => 2)
    expect(event.trigger()).toEqual([1, 2])
  })

  it('allows unsubscribing', () => {
    const event = _.createEventEmitter()

    const unsubscribe = event.subscribe(() => 1)
    event.subscribe(() => 2)
    unsubscribe()
    expect(event.trigger()).toEqual([2])
  })

  it('allows repeated calls to unsubscribe', () => {
    const event = _.createEventEmitter()

    const unsubscribe = event.subscribe(() => 1)
    event.subscribe(() => 2)
    unsubscribe()
    unsubscribe()
    expect(event.trigger()).toEqual([2])
  })

  it('can unsubscribe the correct function, even if the function identity does not change', () => {
    // Tested by unsubscribing multiple times, but only expecting one unsubscribe to happen
    const fn = () => 2

    const event = _.createEventEmitter()
    const unsubscribe = event.subscribe(fn)
    event.subscribe(fn)
    unsubscribe()
    unsubscribe()
    expect(event.trigger()).toEqual([2])
  })
})