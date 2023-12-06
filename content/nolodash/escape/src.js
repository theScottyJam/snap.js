function escape(string) {
  string = String(string);

  const reHtmlChars = /[&<>"']/g;
  const htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };

  return string && reHtmlChars.test(string)
    ? string.replace(reHtmlChars, char => htmlEscapes[char])
    : string;
}
