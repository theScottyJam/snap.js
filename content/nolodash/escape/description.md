```javascript
function escapeHtmlChars(string) {
  return string
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
```

Please be careful when using functions like this as improper usage can result in XSS vulnerabilities. The following is a quick guideline on how this `escapeHtmlChars()` function should and should not be used.

<!-- eslint-skip -->
```javascript
// ✓ - It is safe to use escaped user input between most HTML tags.
// (Just don't put it inside something silly like the <script> tag).
`<p>${escapeHtmlChars(untrustedUserInput)}</p>`

// ✓ - It is generally safe to use escaped user input inside of HTML attributes.
// (Just don't put it inside something silly like onclick="...")
`<div data-author="${escapeHtmlChars(untrustedUserInput)}">...</div>`

// ✕ - Attribute values should always be quoted when they are being populated
// with user-supplied data.
`<img data-author=${escapeHtmlChars(untrustedUserInput)}>`

// ✕ - Using escapeHtmlChars() isn't enough if you want to place
// the value where a URL is expected. This is because HTML
// supports fake protocols like `javascript:` that, when used, will execute
// arbitrary code.
`<img src="${escapeHtmlChars(untrustedUserInput)}">`
```

For a deep dive on how to prevent XSS attacks, I would recommend [this guide on escaping characters for various different contexts](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html).

## Don't use escapeHtmlChars() unless you have to

Do you _really_ need an `escape()` function? Or would an alternative, less-error-prone solution work instead? There are valid reasons to need a function like `_.escape()`, but there are also some coding styles that force you to use it much more often than necessary. For example, perhaps you like to build your webpages via string interpolation and `.innerHTML`, such as in the following:

```javascript
document.body.innerHTML = `<p>${_.escape(userSuppliedString)}</p>`;
```

This has the appearance of being simple and concise, but managing when and how to use `_.escape()` can be error-prone. There are a number of alternative solutions out there that remove many of these pitfalls (but not all, so you still need to look out for XSS vulnerabilities no matter how you code). For example, you can use the browser APIs to manually build up your HTML instead of using string manipulation + `.innerHTML`.

```javascript
const paragraph = document.createElement('p');
// .textContent will automatically escape HTML characters for you.
paragraph.textContent = userSuppliedString;
document.body.replaceWith(paragraph);
```

If you find this APIs to be cumbersome to use, you may enjoy [a little helper function](#!/utils/el) to make using it more tolerable.

Or you can consider installing a third-party tool such as [Handlebars](https://handlebarsjs.com/guide/) for a simple templating library or [Lit](https://lit.dev/) for a mini framework.

Or if you don't want to add an installation step to your project, you can copy some or all of the [Snap Framework](#!/framework) (The `html` template tag is especially useful for solving this problem).

All of these options will provide ways to auto-escape user-input for you, allowing you to focus more on UI building and less on data sanitization.
