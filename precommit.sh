node ./buildContent.js
npm run lint-fix
npm run test
sleep 1 # Give people a chance to notice any test failures before proceeding.