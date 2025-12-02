export function assert(condition, message = 'Assertion Error') {
  if (!condition) {
    throw new Error(message);
  }
}
