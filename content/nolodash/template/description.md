The templating syntax was built to mimic templating syntax from other languages that were commonly used when Lodash's was first created. But we can instead embrace the features JavaScript already provides, including some of its newer syntax, and find that we already have everything we need to achieve what Lodash had accomplished. Let's walk through some of Lodash's templating examples and show what it takes to replicate the same kind of behavior without Lodash.

In some of the non-lodash examples, I will use an "esc" function, derived from the [_.escape](#!/nolodash/escape) entry to escape HTML characters. This function is defined as follows:

```javascript
function esc(string) {
  return string
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
```

With Lodash:

<!-- eslint-disable @stylistic/quote-props -->
```javascript
// Use the "interpolate" delimiter to create a compiled template.
var compiled = _.template('hello <%= user %>!');
compiled({ 'user': 'fred' });
// => 'hello fred!'
```

Without Lodash:

<!-- eslint-disable @stylistic/quote-props -->
```javascript
const compiled = ({ user }) => `hello ${user}!`;
compiled({ 'user': 'fred' });
// => 'hello fred!'
```

With Lodash:

<!-- eslint-disable @stylistic/quote-props -->
```javascript
// Use the HTML "escape" delimiter to escape data property values.
var compiled = _.template('<b><%- value %></b>');
compiled({ 'value': '<script>' });
// => '<b>&lt;script&gt;</b>'
```

Without Lodash:

<!-- eslint-disable @stylistic/quote-props -->
```javascript
const compiled = ({ value }) => `<b>${esc(value)}</b>`;
compiled({ 'value': '<script>' });
// => '<b>&lt;script&gt;</b>'
```

With Lodash:

<!-- eslint-disable @stylistic/quote-props -->
```javascript
// Use the "evaluate" delimiter to execute JavaScript and generate HTML.
var compiled = _.template('<% _.forEach(users, function(user) { %><li><%- user %></li><% }); %>');
compiled({ 'users': ['fred', 'barney'] });
// => '<li>fred</li><li>barney</li>'
```

Without Lodash:

<!-- eslint-disable @stylistic/quote-props -->
```javascript
const compiled = ({ users }) => {
  let result = '';
  for (const user of users) result += `<li>${esc(user)}</li>`;
  return result;
}
compiled({ 'users': ['fred', 'barney'] });
// => '<li>fred</li><li>barney</li>'
```

As a bonus, in the non-lodash versions, you will get proper editor support for the JavaScript code you're writing inside the template, such as syntax highlighting, variable name suggestions, bracket matching, etc.

If you aren't satisfied with the above solution, and really want something more terse like Lodash provides, consider using a generator function instead, with perhaps another helper function to convert the generator's output into a string, as follows:

<!-- eslint-disable @stylistic/quote-props -->
```javascript
const stringBuilder = generator => (...args) => {
  let result = '';
  for (const subString of generator(...args)) {
    result += subString;
  }
  return result;
};

// Usage example:

const compiled = stringBuilder(function* ({ users }) {
  for (const user of users) yield `<li>${esc(user)}</li>`;
});
compiled({ 'users': ['fred', 'barney'] });
// => '<li>fred</li><li>barney</li>'
```

## A caution

Be careful when using a templating solution, like Lodash's `_.template()`, or the string-building patterns describe above - in both cases you're required to know when and how to manually escape HTML characters to avoid XSS vulnerabilities. The following is a quick guideline on how HTML escaping should and should not be done:

```javascript
// ✓ - It is safe to use escaped user input between most HTML tags.
// (Just don't put it inside something silly like the <script> tag).
_.template('<p><%- untrustedUserInput %></p>')
opts => `<p>${esc(opts.untrustedUserInput)}</p>`

// ✓ - It is generally safe to use escaped user input inside of HTML attributes.
// (Just don't put it inside something silly like onclick="...")
_.template('<div data-author="<%- untrustedUserInput %>">...</div>')
opts => `<div data-author="${esc(opts.untrustedUserInput)}">...</div>`

// ✕ - Attribute values should always be quoted when they are being populated
// with user-supplied data.
_.template('<img data-author=<%- untrustedUserInput %>>')
opts => `<img data-author=${esc(opts.untrustedUserInput)}>`

// ✕ - Using escapeHtmlChars() isn't enough if you want to place
// the value where a URL is expected. This is because HTML
// supports fake protocols like `javascript:` that, when used, will execute
// arbitrary code.
_.template('<img src="<%- untrustedUserInput %>">')
opts => `<img src="${esc(opts.untrustedUserInput)}">`
```

For a deep dive on how to prevent XSS attacks, I would recommend [this guide on escaping characters for various different contexts](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html).

Consider using a solution that handles most of the HTML escaping concerns for you. You can't ever fully eliminate the need to consider XXS attacks as you code, but you can reduce the number of places where mistakes could happen. Some alternatives include:
* Building your HTML with the native DOM APIs (using `document.createElement()` and such).
* Using an [`el()`](#!/utils/el) helper function to make the native DOM APIs a little nicer to use.
* Installing a third-party tool such as [Handlebars](https://handlebarsjs.com/guide/) for a simple templating library or [Lit](https://lit.dev/) for a mini framework.
* If you don't want to add an installation step to your project, you can copy some or all of the [Snap Framework](#!/framework) (The `html` template tag is especially useful for solving this problem).
