function clamp(numb, lowerBound, upperBound) {
  if (numb < lowerBound) return lowerBound
  if (numb > upperBound) return upperBound
  return numb
}