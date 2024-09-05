import { Signal } from './snapFramework.js';

export function assert(condition, message='Assertion Error') {
  if (!condition) {
    throw new Error(message);
  }
}

export function promiseToSignal(promise, { loadingValue }) {
  const signal = new Signal(loadingValue);
  promise.then(value => signal.set(value));
  return signal;
}
