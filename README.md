# Snap.js

The Copy-Paste Library.

View the built website [over here](https://thescottyjam.github.io/snap.js/#!/nolodash).

## Project Structure

The documentation is stored as markdown files, found inside of the content/ directory. Before deployment, a script is run, that's combine everything in `content/`, into a couple of json files, which will be used by the webpage to populate itself.

The rest of the source code is found inside of src/. It's not intended to be the cleanest code, but it does the job.

## Commands

Use `npm ci` to install the dependencies.

To start the development server, use `npm start`. Note that you'll have to restart the command whenever you change something in `content/`.

Before committing, try to remember to run `npm test` and `npm run lint-fix` first. The first command will run a handful of tests and the second will lint the project. The UI itself isn't tested, but some of the utility functions have automated tests to go with them.

Other available commands:

- `npm run predeploy` runs prettier and tests
- `npm run deploy` auto-runs predeploy and publishes this webpage.
