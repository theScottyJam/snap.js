setDefault(obj, key, defaultValue) {
  if (obj[key] == null) {
    obj[key] = defaultValue
  }
  return obj[key]
}