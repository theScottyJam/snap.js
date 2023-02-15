View this function [on Lodash's website](https://lodash.com/docs/4.17.15#difference).

When dealing with larger arrays, you may wish to turn the second array (the one you use `.includes()` on) into a set first, since `.includes()` has an O(n) worst-case lookup time, while `yourSet.has()` has an O(1) lookup time.

Note that both `array.includes()` and `set.has()` use [the SameValueZero comparison algorithm](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness#same-value-zero_equality) under-the-hood as well, just like Lodash's `_.difference()`.
