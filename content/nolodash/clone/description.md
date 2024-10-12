To shallow-clone a value, you can simply use the API provided by the specific object type you have. If a particular class doesn't provide any particular way to clone a value, then it may not be possible clone it - not even Lodash's `_.cone()` will be able to help.

Here are a few different ways to create shallow clones of various built-in data types.

* Primitives (such as strings, numbers, booleans, etc): It's not possible to clone these. You also don't need to - they're immutable anyways.
* Objects: Use the spread syntax, e.g. `const newObj = { ...oldObj };`
* Arrays: Use the spread syntax, e.g. `const newArray = [...oldArray];`
* Maps: `const newMap = new Map(oldMap);`
* Sets: `const newSet = new Set(oldSet);`
* Dates: `const newDate = new Date(oldDate)`
* Regular Expressions: `const newRegex = new RegExp(oldRegex); newRegex.lastIndex = oldRegex.lastIndex;`. The `lastIndex` property holds state related to where the regular expression was last searching in a given string - depending on your use-case, it may or may not make sense to preserve this information when cloning.
* Array Buffers: `const newArrayBuffer = oldArrayBuffer.slice();`
* typed arrays: As these are just views on array buffers, they don't need to be cloned - unless you're trying to clone both the view and the underlying array buffer, in which case, use the `.buffer` property on your typed array to get access to the underlying buffer, clone it with `.slice()`, then build a new type array of the same type from the cloned buffer. Put together, for `Uint8Array`, this would look like `const newTypedArray = new Uint8Array(oldTypedArray.buffer.slice())`.
