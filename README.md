# Snap.js

The Copy-Paste Library.

View the built website [over here](https://thescottyjam.github.io/snap.js/#!/nolodash).

## Contributing

I'm an opinionated guy and will be very picky with what's contained in this website, how things are worded, etc.

If you want to open a PR to fix some of my poor spelling/grammar, or help improve things in other minor ways, great! That'll be very much appreciated.

If you want to see larger changes or additions happen, I would recommend starting by discussing your desired changes in the GitHub issues. If you submit a PR out of the blue, that's fine, but don't be surprised if I overhaul it with my own ideas or reject it entirely.

## Project Structure

The website content is stored as markdown files found inside of the content/ directory. Before deployment, a script is run that combines everything in `content/` into a couple of json files. These json files will be used by the webpage to populate itself. They also get used by the test-runner to run the automated tests found within.

The rest of the source code is found inside of app/.

A typical folder for a doc entry will contain some or all of the following:
* manifest.json - contains metadata about this doc entry.
* description.md - The actual description for this entry.
* src.js - (optional) A complete implementation of a utility function. These files only get used for the "Simple Utilities" section of the website. For the "Lodash Replacements", always put your code into the description.md files (it'll make the entries look more consistent with each other).
* test.js - (optional) A test file for your code in this doc entry. You'll have to copy-paste your function into the test file to test it.
* notes.txt - (optional) Any extra notes you may wish to provide for maintainers that you didn't want to include in the webpage itself.

When updating a description.md file, if you notice the folder also has a test.js file as well, please check its contents. Its possible the test.js file has a copy of a function from description.md that its trying to test.

## Commands

Use `npm ci` to install the dependencies.

To start the development server, use `npm start`. If you're making changes to `content/`, you'd want to run `npm run build:watch` as well, which will auto-build the content/ folder for you.

Before committing, try to remember to run `npm test` and `npm run lint:fix` first. The first command will run a handful of tests and the second will lint most of the project. The UI itself isn't tested, but some of the utility functions have automated tests to go with them.

Other available commands:

- `npm run predeploy` runs the linter and tests
- `npm run deploy` auto-runs predeploy and publishes this webpage.

## The spirit of a Lodash doc entry

To get a good idea of the vibe I'm shooting for with thesee Lodash doc entries, take a look at the FAQ section on the [Lodash Replacements page](https://thescottyjam.github.io/snap.js/#!/nolodash). In short, these are the guidelines (not rules) that I've been following:

* Ask yourself "what problem is this Lodash function trying to solve", then ask yourself how you would solve this problem if you weren't using Lodash. This may make your solution behave very differently from Lodash's solution, and that's fine - just make a note of important differences. (For unimportant differences, favor keeping parity with Lodash's API - i.e. don't run with a different function signature for your version of the utility function if there's no real reason to do so). In some cases, your solution might not even be a utility function, sometimes the way to solve a problem is to follow a certain pattern as you code, or to use syntax the language provides for you, etc. Sometimes there's multiple solutions that have different pros and cons, and it may be best to explain all of these solutions.
* If two solutions have the same big-O, show the one that's more maintainable. In other words, don't micro-optimize. If two solutions have different big-Os, still favor showing the one that's more maintainable, but maybe leave a note about how there's room to improve its performance, or you could even show both solutions, letting the user pick the one that suits them best.
* Lodash's implementations don't always follow modern best practices. Some examples:
  * They like to overload their functions to have many different behaviors depending on the types of data you pass in (to a degree, this is fine, but sometimes its taken too far). It may be best to think of these as different problems being solved in the same function, which means you'd need to provide a list of solution for each problem being solved.
  * They have a habit of making parameters optional that really shouldn't be optional. If you can't think of a sensible reason for someone to purposefully omit a parameter, then don't bother supporting that "use case" in your non-lodash replacement.
  * If you give Lodash a bad parameter, they like to try to coerce it into something usable instead of throwing an error. Don't bother supporting this in your non-lodash replacement functions. The end-user is encouraged to modify these helper functions to fit their project's style, and that could be mean "don't do any explicit handling of bad parameters as that's too much noise in the codebase" or "throw runtime errors on bad parameters" or "add TypeScript type definitions". This website's job is to just provide the solutions in their simplist form so that it's easy to build on top of them if needed.
  * Some Lodash functions should simply not be used. In cases like this, explain why its a bad idea to use the given function, then provide a non-lodash replacement anyways.

## Code sample formatting

These are general guidelines I've been striving to follow. They're often broken for various reasons - sometimes unintentionally, many times I just feel like it looks better to break it in a specific scenario.
* If you're have a codeblock that contains an incomplete expression, omit the semicolon on that expression. For example, `array.map(x => x + 1)` should not be shown with a semicolon if that's the only thing contained on the line - that line of code is useless by itself, and it's expected that the reader would add more to the line before using it.
* If you wish to show what a line would evaluate to or what it would output, use `// =>`, followed by its output.
  * If there's only one line of code in the code block, then prefer placing the `// =>` on its own line, after the line of code. Otherwise, prefer placing it on the same line as the code it's describing.
  * For simple examples, prefer avoiding the use of `console.log()` and instead just write the expression followed by a `// =>` comment.

The linter will run over the code samples in the markdown entries, but various rules have been disabled to make the linter more permissive. For example, it won't check the use of semicolons due to the fact that the above guidelines often recommend omitting semicolons on incomplete lines. There's also many instances where the linter will need to be disabled entirely for a codeblock, such as if a single code block contains an object literal - that will be parsed as a block and may cause errors. In scenarios like these, `<!-- eslint-skip -->` can be used to skip its parsing.

If you wish to show multiple ways of defining a variable, show each example in a separate code block. The code blocks will be smashed together when shown to the user, making them look like one long code block (with a couple of minor differences). If you don't do this, the linter will throw a parsing error due to the variable redeclaration and will refuse to lint anything from that code block as a result.


## Updating the Snap Framework Code

The actual source code for the snap framework contains lots of pragmas to describe how to parse and present various parts of the framework. The pragma parsing code is somewhat brittle, but it does the job, but it does mean that any time you make a change to the source code, make sure to pay close attention to how it looks on the rendered page. Does it look ok in both the fully documented mode and the "classic" mode? Does it look ok in mobile view? Do the examples open up fine and run?

When you're done making updates to the framework, there's a number of places that need to be updated with new information:
1. Add the new version to the framework/ folder. The minified version can be created by using an online tool such as minify-js.com.
2. Update the documentation link near the top of the framework source file.
3. Update the changelog.
4. Count the number of lines without whitespace or comments. I use the "cloc" tool on npm (`npx cloc ./snapFramework.js`).
5. Register the new framework version with the line count in the list of available versions. Search the project for §u5gEq to know where to paste it.
6. Update the project to use the latest version of the framework.

Version numbers obey the following pattern. Given a version number of X.Y:
* X: Breaking change
* Y: New feature added or bugs fixed

If you're only changing js-doc comments, you can simply make the change without bumping the version number, or making any changes to the statistics (since none of the statistics measure the comments).