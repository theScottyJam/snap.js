function unescape(string) {
  string = String(string);

  const reEscapedHtml = /&(?:amp|lt|gt|quot|#39);/g;
  const htmlUnescapes = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
  };

  return string && reEscapedHtml.test(string)
    ? string.replace(reEscapedHtml, char => htmlUnescapes[char])
    : string;
}
