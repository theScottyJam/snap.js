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

## Commands

Use `npm ci` to install the dependencies.

To start the development server, use `npm start`. Note that you'll have to restart the command whenever you change something in `content/`.

Before committing, try to remember to run `npm test` and `npm run lint-fix` first. The first command will run a handful of tests and the second will lint most of the project. The UI itself isn't tested, but some of the utility functions have automated tests to go with them.

Other available commands:

- `npm run predeploy` runs prettier and tests
- `npm run deploy` auto-runs predeploy and publishes this webpage.
