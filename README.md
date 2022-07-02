# Snap.Js

The copy-past library.

## Commands

- `npm run prepare` after fetching this repository to install the prettier pre-commit hook.
- `npm run deploy` to publish this webpage.
- `npm run test` to run tests
- `npm run start` to run the webpage in development mode. Currently, if you change anything in content/ you'll have to rerun this command to receive the changes.

There's also a pre-commit hook registered to automatically run the linter and tests.

Note that the pre-commit hook wasn't written to be cross-platform, and will probably fail on non-unix machines. The pre-commit hook is experimental in general, I might throw it out if I don't like it.
