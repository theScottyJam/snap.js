function createEventEmitter() {
  const listeners = []
  return {
    subscribe(fn) {
      listeners.push(fn)
      let unsubscribed = false
      return function unsubscribe() {
        if (unsubscribed) return
        const index = listeners.indexOf(fn)
        listeners.splice(index, 1)
        unsubscribed = true
      }
    },
    trigger(...args) {
      return listeners.map(fn => fn(...args))
    }
  }
}