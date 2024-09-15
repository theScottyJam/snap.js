# Snap.js

The Copy-Paste Library.

View the built website [over here](https://thescottyjam.github.io/snap.js/#!/nolodash).

## Project Structure

The website content is stored as markdown files found inside of the content/ directory. Before deployment, a script is run that combines everything in `content/` into a couple of json files. These json files will be used by the webpage to populate itself. They also get used by the test-runner to run the automated tests found within.

The rest of the source code is found inside of src/. It's not intended to be the cleanest code, but it does the job.

A typical folder for a doc entry will contain some or all of the following:
* manifest.json - contains metadata about this doc entry.
* description.md - The actual description for this entry.
* src.js - (optional) A complmete implementation of a utility function. These files only get used for the "Simple Utilities" section of the website. For the "Lodash Replacements", always put your code into the description.md files (it'll make the entries look more consistent with each other).
* test.js - (optional) A test file for your code in this doc entry. If you're testing an entry that has a src.js file, the function it defines will be automatically available to you as `_.<name of function>()` (Don't confuse the underscore with Lodash - this system was put in place before I had decided to add content related to Lodash, and even then, it may not have been the smartest choice - sorry about that). If you're testing an entry who's code resides in the description.md file, you'll have to copy-paste your function into the test file.
* extraNotes.txt - (optional) Any extra notes you may wish to provide for maintainers that you didn't want to include in the webpage itself.

When updating a description.md file, if you notice the folder also has a test.js file as well, please check its contents. Its possible the test.js file has a copy of a function from description.md that its trying to test.

The code for the Snap Framework page is made using the Snap Framework, and is in the public/FrameworkPage/ folder (in order to make it render outside of React's control).

## Commands

Use `npm ci` to install the dependencies.

To start the development server, use `npm start`. Note that you'll have to restart the command whenever you change something in `content/`.

Before committing, try to remember to run `npm test` and `npm run lint-fix` first. The first command will run a handful of tests and the second will lint most of the project. The UI itself isn't tested, but some of the utility functions have automated tests to go with them.

Other available commands:

- `npm run predeploy` runs prettier and tests
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

# Updating the Snap Framework Code

The actual source code for the snap framework contains lots of pragmas to describe how to parse and present various parts of the framework. The pragma parsing code is somewhat brittle, but it does the job, but it does mean that any time you make a change to the source code, make sure to pay close attention to how it looks on the rendered page. Does it look ok in both the fully documented mode and the "classic" mode? Does it look ok in mobile view? Do the examples open up fine and run?

When you're done making updates to the framework, there's a number of places that need to be updated with new informatino:
1. Update the link to more docs at the top of the framework file. Make sure the new link points to an actual, updated documentation page. (At the moment of writing, there's only one version released, so there's not any code written up yet to support multiple doc pages).
2. Minify the code (I've been using minify-js.com), then paste the minified version into snapFramework.min.js.
3. gzip the minified code, then take note of the number of bytes it uses. Update the size comparison if needed (which can be found by searching the project for §G2Fme). Currently it's measured at 1391 bytes (Please update this number in this README as well whenever making a change).
4. Count the number of lines without whitespace or comments. I use the "cloc" tool on npm (`npx cloc ./snapFramework.js`). Search the project for §u5gEq to know where to paste it.

The link at the top of the file contains a version number embedded in it - use the following guide to update that version number.
Given a version number of X.Y:
* X: Breaking change
* Y: New feature added or bugs fixed

If you're only changing js-doc comments, you can simply make the change without bumping the version number, or making any changes to the statistics (since none of the statistics measure the comments).