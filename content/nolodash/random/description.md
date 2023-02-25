## For random floats

If you want a random float between 0 and `upper`:

```javascript
Math.random() * upper;
```

If you want a random float between `lower` and `upper`:

```javascript
lower + Math.random() * (upper - lower);
```

## For random integers

All of these examples will treat `upper` as exclusive, not inclusive. If you want it to be inclusive like it is in Lodash (i.e. you want it to be possible for the upper bound to be returned), add one to `upper`.

If you want a random integer between 0 and `upper`:

```javascript
Math.floor(Math.random() * upper);
```

If you want a random integer between lower and upper:

```javascript
lower + Math.floor(Math.random() * (upper - lower));
```
