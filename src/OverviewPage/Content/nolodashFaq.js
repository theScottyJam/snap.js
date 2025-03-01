export const nolodashFaq = `
**Are you trying to get me to give up Lodash?**

  The point of this webpage isn't to protest the usage of Lodash. Think of it more as, among other things, a tool to help you know if you need Lodash or not. You can look up your favorite Lodash functions in this reference, and if the non-Lodash alternatives you find seem trivial enough, then sure, this webpage may be pushing you to give it up. On the other hand, if the alternatives are fairly complicated, then this webpage has served to reaffirm your commitment to Lodash.

  Even if you never plan on using Lodash, it can be nice to have a quick reference of all sorts of data-manipulation utilities in your pocket. Or, perhaps, you might enjoy just browsing the pages and learning how another JavaScript developer writes code - you might learn a thing or two, or not.

**Lodash is battle-tested. Why would someone use a copy-paste solution instead?**

  Lodash is also an extra dependency. When there's not a strong reason to install a dependency, it can be healthy to avoid them, because:
  * More dependencies means more bloat
  * Dependencies aren't always trustworthy. We're often hearing news about yet-another-NPM package being hacked or sabotaged in some way. The more dependencies we install, the more likely we will be affected by a rogue package.
  * For smaller or older projects you may not have any infrastructure set up to install NPM dependencies. Bringing in Lodash may be a lot of extra work, and if it means adding a build step, it may make the overall developer experience a little less nice.

  These particular issues may not be very important to you specifically, but they are important to one degree or another for many developers.

**Hold up - Lodash doesn't create extra bloat if you properly tree-shake it.**

  Tree-shaking is not a magic wand that makes all of your bundle-size problems disappear. Let's take, just as an example, Lodash's \`_.find()\` function. Their pre-tree-shaken version of this function (a.k.a. [the stand-alone NPM package](https://www.npmjs.com/package/lodash.find)) is 1,000 lines of code long (not counting whitespace or comments). Why is there so much code? The problem is that Lodash's functions are overloaded with many different behaviors depending on the types of values you pass in. Their \`find()\` function takes up to three parameters - \`collection\`, \`predicate\`, and \`fromIndex\`. There's different code that runs if your \`collection\` argument is an array, an ordinary object, if you pass in the prototype of an object, etc. There's also different code that runs if you provide, as your \`predicate\` argument a function, or a string, or an object, etc. Even the \`lastIndex\` parameter will have special logic to auto-coerce the value in case you did something silly like pass in \`Infinity\` or \`2.5\`.

  If all you want to do is the most common scenario of searching for something in an array based off of a predicate function and \`fromIndex\` integer you provide, then only about 30 lines of those 1,000 lines are relevant to your use case (and those 30 lines could easily be simplified to less). If you need to search through an object instead, it only takes minor tweaks to those 30 lines of code to support that use-case. It's the use-cases that aren't as commonly used that make up the bulk of the weight, e.g. if you never pass in an object as your predicate, you're still going to drag in the entire deep-comparison algorithm it uses for this use-case, and that whole algorithm will just be sitting there as dead code.

  If you heavily rely on Lodash, then the fact that their functions don't tree-shake very well won't be a major issue for you since you'll be directly depending on most of the package anyways. It's just important to be aware that tree-shaking, in general, doesn't mesh well with the way the Lodash library was designed, which means any argument that states that you can just depend on one or two functions then tree-shake it doesn't really hold water.

**Why copy-paste from this webpage instead of from Lodash's source code directly? That way you get Lodash's exact behavior.**

  * Because of the point above, the Lodash solutions can be quite bulky, so it's not that easy to just copy-paste their source code, especially if you don't need all of the features they provide.
  * Lodash's source code is built to standards that your own code may not need to follow, and unnecessarily following them could make your code more difficult to maintain. For example, instead of calling \`someArray.splice(...)\` directly, they'll do \`var arraySplice = Array.prototype.splice\` outside the function, then later they'll do \`splice.call(someArray, ...)\`. This is done, in part, to ensure that Lodash will continue to work without an issue even if someone messes with the globals in bad ways (as long as they mess with the globals after Lodash has been loaded). If your own code isn't trying to follow this sort of standard, then there's no need for you to obfuscate your code in this manner.
  * Lodash is built to support older browsers. This means it'll only use older syntax and APIs, and it also provides a lot of work-arounds for old browser bugs. All of this is unnecessary if you do not support old browsers.
  * This website doesn't just provide copy-paste solutions. It also explains ways to tailor the solution to your needs ([example](#!/nolodash/cloneDeep)), and sometimes shows multiple solutions ([example](#!/nolodash/isMap)). It'll also explain modern best-practices and explain why some of Lodash's behaviors may not always be the smartest to mimic ([example](#!/nolodash/forInRight)).
  * The goal is to achieve Lodash's _documented_ behaviors, not the exact behaviors down to the smallest edge cases. In other words, think about the reason someone might reach for a Lodash function - this website is striving to provide alternative solutions people could reach for instead, if they so choose.

**This is nice and all, but one major reason I like Lodash is because it offers a fluent API, making it easy to chain your method calls together.**

  The EcmaScript committee is working on fixing this with [the pipeline proposal](https://github.com/tc39/proposal-pipeline-operator), allowing any function to be chained in a fluent-like way. In the mean time, it's not too difficult to hand-roll [your own pipe function](#!/utils/pipe) to get a similar benefit.

**I like Lodash because it's extremely optimized and fast.**

  Who told you that? While it's true that it does not suffer from poor performance issues, it has other higher priorities that often trump minor performance optimizations, like the aforementioned need to support older browsers. There's also cases in the source code where it will unnecessarily perform the same check twice, for example, their [createCaseFirst()](https://github.com/lodash/lodash/blob/4.17.15/lodash.js#L15197) function (used to implement \`_.lowerFirst()\` and others) calls both \`hasUnicode()\` (which is an O(n) operation) and \`stringToArray()\`, and [\`stringToArray()\`](https://github.com/lodash/lodash/blob/4.17.15/lodash.js#L1323) also calls \`hasUnicode()\`. This sort of thing is a common occurrence in their codebase. None of this is a bad thing per-say, it just means that you should not expect Lodash to be handing you solutions that are optimized to the max because that's not what it's trying to do. If you really need that, you shouldn't use Lodash or this website (except, perhaps, as starting points), instead, you'll need to do your own performance benchmarks to figure out how to build micro-optimized solutions.

**Using a copy-pasted utility function means you have to write your own unit tests for them, which is a pain.**

  In most cases you do _not_ need to write unit tests for the utility function you want to copy-paste. That is not how unit-testing is supposed to work. Treat these utility functions the same way you would treat private functions in your project - as implementation details to your public API. If your public API is properly unit-tested, you won't need to write separate tests for these utility functions, that would be redundant, you can know that the utility functions are working because your tests for your public APIs are passing.

  That being said, there are cases where it makes sense to unit test the piece of functionality in isolation. perhaps in the future I'll provide copy-paste unit tests for some of the more complicated entries. In the mean time, you'll have to write the tests yourself, or you can try checking [the source code](https://github.com/theScottyJam/snap.js/tree/main/content/nolodash) to see if the particular entry you want to grab has a test file with it.

**What about TypeScript support?**

  I do like TypeScript, but I chose to write the entries in JavaScript in order to make them friendlier to a wider audience. The code samples are intended to be modified after being pasted into your project to conform with your project's standards, and that includes adding types as needed.

**But I don't want to maintain a bunch of copy-pasted utility functions.**

  If you're doing so much copy-pasting from this webpage that the burden of maintaining your copied utilities is a concern to you, then you're probably overusing this webpage.

**What about Ramda?**

  While on the surface Lodash and Ramda are somewhat similar, their reasons for existing are very, very different. Lodash exists because the creators felt that JavaScript's built-in standard library was weak and they wanted to supplement it. Ramda exists to facilitate the point-free style of programming, and to do point-free programming effectively in JavaScript, you basically need the standard library to be rebuilt from ground up in a curried, data-last approach.

  Because of this, Ramda really shouldn't be thought of as a better version of Lodash, that's not what it's trying to be. Those who like to use Lodash and aren't into point-free programming won't find Ramda to be better, rather, it's a tool that fulfills a use-case they don't have. Likewise, of course Ramda users won't be drawn to Lodash, Lodash doesn't fulfill their currying needs. This website is focused solely on Lodash's use-case of "supplementing the standard library". If you're into point-free programming, then by all means, use Ramda (or fp-ts, or whatever other tool you choose) and ignore this webpage.

**What about these existing webpages?**

You mean these awesome webpages?
* [You might not need Lodash](https://youmightnotneed.com/lodash)
* [You don't (may not) need Lodash/Underscore](https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore)

These accomplish a similar goal - feel free to check them out if you want to see the same kind of content but presented in a different format.

**Do you really not have a strong opinion on whether or not a project should use Lodash?**

Oh, I do. It's this: Lodash is large, does not tree-shake well, and contains an overwhelming number of functions, many of which are not very useful anymore, which makes it difficult to search through their docs to find anything helpful. If you're building a webpage, I would advise against using Lodash to avoid the extra bloat. On the server or when writing scripts it may not be as bad, but I would still avoid it - if you only need a couple of functions, it's better to just implement the handful of lines of code yourself (or copy-paste them from here) instead of grabbing an entire dependency. If you must depend on Lodash in a non-browser environment, then consider installing the npm packages containing only the specific functions you need instead of installing the entire library - this helps make it clear which Lodash functions you actually intend to use in your project, which helps future maintainers follow suit. If you install the whole thing, you'll end up giving your developers a constant battle of trying to decide between using a Lodash function vs a built in solution, and I'm of the opinion that it's generally better to have one obvious way to accomplish something as opposed to multiple very similar ways to perform a task.

I'd also like to note that while I did recommend using the NPM packages containing individual functions, [Lodash does not plan on maintaining these kinds of packages anymore](https://github.com/lodash/lodash/issues/3838), though then again, [Lodash hasn't been seeing much maintenance in general](https://github.com/lodash/lodash/commits/main/). If you're tempted to install Lodash, maybe it's worth looking around for newer competitors to see if they can offer something better for you?

But that's just my opinion. You're welcome to completely disagree with me while still finding value in this webpage. This webpage doesn't mandate that you share my opinion.
`;
