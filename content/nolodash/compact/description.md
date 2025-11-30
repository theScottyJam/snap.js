All of these solutions are equivalent and commonly used in the wild. Pick the one you find to be the most readable.

```javascript
array.filter(value => !!value)

array.filter(value => value)

array.filter(Boolean)
```

That being said, I would discourage the use of the last option out of principle. If the JavaScript committee were to ever add additional, optional parameters to `Boolean` like they often do with many other functions, it could cause your code to break, because `array.filter()` will pass in an index as a second parameter. In practice, so many people have used this specific `array.filter(Boolean)` trick that they wouldn't be able to do such a change without breaking existing webpages, but it's unfortunate that we've limited their ability to extend their language based on how we've programmed. In general, it is good to avoid doing anything that causes extra arguments to be passed into someone else's function.
