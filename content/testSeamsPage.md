# Test Seams

<a data-click-target="file:Dependency.ts" href="javascript://Jump to Dependency.ts">Jump to the copy-pastable tool</a>

If you wish to see the code snippets on this page in a single repo, or whish to see JavaScript versions of the code snippets, you can visit [the test-seams example GitHub repo](https://github.com/theScottyJam/snap-test-seams-example).

## The problem with current test-seam approaches

When writing unit tests, the size of your <span data-tooltip="The code you are trying to validate with a specific automated test. In terms of an arrange-act-assert testing style, only the code being ran in the &quot;act&quot; phase of your test is part of the SUT.">SUT (system under test)</span> matters. Make the SUT too small and your tests become extremely brittle, falling apart with every minor refactor. Make the SUT too large and a large portion of your tests may fall apart when a piece of widely shared behavior within your SUT needs to change. A deeper exploration of SUT size and other related topics are explored in [the fortified testing philosophy](https://thescottyjam.github.io/fortified-testing-philosophy/revisions/1/), a philosophy which underpins much of this page.

The important thing is that in order to make high quality unit tests, you need good control over the size of your SUT. You need the ability to create "seams" in your codebase where your unit tests can take control and provide fake behavior wherever it's needed.

Unfortunately, many existing solutions today fall short of handling this problem effectively:
* Using mocking libraries to patch in behavior, such as [Sinon](https://sinonjs.org/), [Rewire](https://www.npmjs.com/package/rewire), or the mocking tools that come with your favorite testing framework, can cause your tests to be brittle. These libraries are capable of mocking almost anything in your codebase without requiring you to change how you write your code, but they come with severe limits. They follow a black-list approach to mocking, where it assumes any piece of code should run unless you explicitly mock it out. As such, it becomes extremely difficult to do proper mocking with a larger SUT without accidentally missing a spot and running real side-effects during your unit tests. It's for this reason that these tools are often used with extremely small SUTs - typically no bigger than a single module or class, and anything that module depends on would be mocked out.
* On the opposite end of the spectrum we have dependency injection. When using dependency injection across the entire project, it's trivial to allow SUTS of any size to be strung together in your test. Unfortunately, dependency injection also takes a large toll on code readability - instead of being able to jump from a function call to the function definition with a quick hotkey, you have to instead jump to the interface then look for the concrete implementation that implements this interface. Extra hops like this can make your codebase really difficult to navigate, especially for newcomers.
* There's also the group of people who say "screw it, anything that has side-effects won't be unit tested, we'll just make sure it's got good integration (or end-to-end) test coverage". This solution works, but you are limited in the number of integration tests you can write due to their slower performance. High quality integration tests are important, but you're missing something if you rely on those for the bulk of your testing.

<details>
<summary>Notes on Dependency Injection and type safety</summary>
One advantage that dependency injection has, that the proposed "better alternative" discussed below does not have is type safety. With dependency injection, you know when writing your tests exactly which dependencies need to be provided up-front - your editor will tell you which dependencies you still need to provide. With the solution proposed below, you may have to run a test, see an error about a missing dependency, add it, and repeat.

_However_, the most common way people use Dependency Injection isn't as type-safe as it may seem. It is very common to have one class that depends on an interface containing many functions, where only some of the functions are actually needed by the class. Even if the class fully utilizes the interface, that doesn't mean an individual method on the class needs every method from the interface. For example, the interface might supply methods with CRUD operations for managing users - you typically don't need a single method to both create and delete users on a system.

This problem is solvable - 1. instead of having a class decide which dependencies it requires, you have each individual method take an object of required dependencies as the first argument, and 2. Make many of your interfaces only contain a single function, so you only need to depend on exactly what you need.

I've actually done this, and with TypeScript's powerful type system it works better than you might imagine. But it is a lot of plumbing to wire dependencies through every function who might need it in this fine-grain manner. This whole page you're reading was created to be a simpler alternative - one where you loose the helpful type information that dependency injection can give you, but in return leaves you with much simpler-to-follow-and-manage code. In my opinion, the type safety that dependency injection can give you isn't worth the toll it takes on your code readability.
</details>

## A better way to create seams

If we're willing to step away from traditional testing strategies, there is a "happy middle" option that can be used - an option that still lets you write code in a fairly traditional fashion that's easy to navigate, while also letting you write high quality tests with SUTs that cover as much distance as you need.

The solution is to add explicit "seams" into your code - places where, at test time, tests can take over and change the behavior however they want. Unlike mocking libraries, the explicit seams we'll be using will throw an error if your code tries to use it when no swapped behavior has been provided.

It works like this.

Copy the following test-seam tool into your project.

```typescript
//# fileName Dependency.ts
//# selectAllButton
/** Used to ensure that type T is a function */
type AssertFn<T> = T extends (...args: any[]) => any ? T : never;

/**
 * Use this to define a set of functions that you may
 * wish to replace in automated tests with test doubles.
 *
 * Note: This class keeps tabs on all instances which in turn prevents them from
 * being garbage collected. This isn't an issue as long as you don't
 * generate an arbitrary number of instances.
 */
export class Dependency<T extends {}> {
  #dependencyName: string;
  #behavior: Partial<T> = {};
  static #instances: Dependency<any>[] = [];

  /** This function should get called in your global before-each. */
  static beforeEach() {
    for (const instance of this.#instances) {
      // Clears out all behavior so any attempt to use a dependency will
      // result in an error until a new replacement behavior is
      // explicitly provided (via .replaceWith()).
      instance.#behavior = {};
    }
  }

  constructor(name: string) {
    this.#dependencyName = name;
    Dependency.#instances.push(this);
  }

  /**
   * Registers the real implementation of a given function.
   * A wrapped version of that function will be returned that is capable
   * of being controlled during tests.
   */
  define<FnName extends Extract<keyof T, string>, FnDef extends AssertFn<T[FnName]>>(
    fnName: FnName,
    realImplementation: NoInfer<FnDef>,
  ): (...Params: Parameters<FnDef>) => ReturnType<FnDef> {
    this.#behavior[fnName] = realImplementation;
    return (...args: Parameters<FnDef>) => {
      if(!(fnName in this.#behavior)) {
        throw new Error(
          `The "${this.#dependencyName}" dependency does not have an ` +
          `implementation provided for the function ${fnName}().`
        );
      }
      return (this.#behavior[fnName] as any)(...args);
    }
  }

  /**
   * This should only be invoked when running tests.
   * Pass in an object who's keys correspond to the function names provided
   * to define(), and who's values are fake functions. These fake functions
   * will be called in place of the real ones.
   */
  replaceWith(testDouble: Partial<T>) {
    this.#behavior = testDouble;
  }
}
```

Lets say you have the following code you'd like to test:

```typescript
import * as fs from 'node:fs';

// ~~~ File I/O ~~~

const TODOS_FILE_PATH = 'todos.json';

async function writeToTodoFile(data: string[]): Promise<void> {
  await fs.promises.writeFile(TODOS_FILE_PATH, JSON.stringify(data), 'utf-8');
}

async function readFromTodoFile(): Promise<string[]> {
  try {
    return JSON.parse(await fs.promises.readFile(TODOS_FILE_PATH, 'utf-8'));
  } catch (error: any) {
    if (error.code === 'ENOENT') { // File not found
      return [];
    }
    throw error;
  }
}

// ~~~ main ~~~

// Usage example: main(process.argv.slice(2));
async function main(args: string[]) {
  // Adds the todo item to the list
  const updatedTodoItems = [
    ...await readFromTodoFile(),
    args.join(' '),
  ];

  await writeToTodoFile(updatedTodoItems);

  // Prints the updated list of TODO items
  console.log(updatedTodoItems.join('\n'));
}
```

This is very simple todo-list management program - you run it with a todo item you'd like to add to your list, and it'll add it to your todo file and print out your current list. That's it. I'm trying to keep the example simple, but you could imagine that this project could grow much larger - the act of adding a new todo item is currently contained in the main function, but over time it could have logic spread across many different modules, all of which you might want to include in your SUT.

We want to write some unit tests for the main function. In this specific scenario, we want the SUT to be as large as reasonably possible without including any code that causes side effects in the SUT, so we're going to add test seams to keep actual file I/O and logging out of the SUT.

```typescript
import * as fs from 'node:fs';
import { Dependency } from './Dependency.ts';

// ~~~ File I/O ~~~

const TODOS_FILE_PATH = 'todos.json';

export interface TodoFileDependency {
  writeToTodoFile: (data: string[]) => Promise<void>
  readFromTodoFile: () => Promise<string[]>
}

export const todoFileDependency = new Dependency<TodoFileDependency>('TodoFileDependency');

const writeToTodoFile = todoFileDependency.define('writeToTodoFile', async data => {
  await fs.promises.writeFile(TODOS_FILE_PATH, JSON.stringify(data), 'utf-8');
});

const readFromTodoFile = todoFileDependency.define('readFromTodoFile', async () => {
  try {
    return JSON.parse(await fs.promises.readFile(TODOS_FILE_PATH, 'utf-8'));
  } catch (error: any) {
    if (error.code === 'ENOENT') { // File not found
      return [];
    }
    throw error;
  }
});

// ~~~ logging ~~~

export interface LoggerDependency {
  log: (...messages: string[]) => void
}

export const loggerDependency = new Dependency<LoggerDependency>('LoggerDependency');

const log = loggerDependency.define('log', console.log);

// ~~~ main ~~~

// Usage example: main(process.argv.slice(2));
export async function main(args: string[]) {
  // Adds the todo item to the list
  const updatedTodoItems = [
    ...await readFromTodoFile(),
    args.join(' '),
  ];

  await writeToTodoFile(updatedTodoItems);

  // Prints the updated list of TODO items
  log(updatedTodoItems.join('\n'));
}
```

To add a test seam, we create an instance of `Dependency`, such as `todoFileDependency`, and supply a type parameter (`TodoFileDependency`) containing all of the functions that this dependency will handle. For each function the dependency handles, we call `const theFn = todoFileDependency.define('aFnName', ...the fn definition...)`. We pass in the desired, default behavior, and the function that gets returned by `.define()` will behave exactly the same as our supplied callback, except when unit testing has started, at which point it'll instead have it's behavior switched to throw errors or to provide fake behavior, depending on what the test does.

Note that the code in `main()` that was calling the functions registered with `todoFileDependency` did not have to be updated - that portion of the code still reads exactly the same. Adding test seams like this is relatively unobtrusive. The same isn't true for `console.log()` - any code that directly depended on a built-in function that causes side-effects will need to be updated.

Now we can write our tests.

The first thing you'll want to do is make sure `Dependency.beforeEach()` gets called before every single test in your entire test suite. This is how the `Dependency` class detects that tests are being ran, and how it automatically resets behavior after every test. The way to do that depends from testing framework to testing framework - here's links to how to do it in [Mocha](https://mochajs.org/#root-hook-plugins), [Jest](https://jestjs.io/docs/configuration#setupfilesafterenv-array), and [Node's native test runner](https://nodejs.org/api/test.html#global-setup-and-teardown). Whatever testing framework you use should support it as well - please refer to its documentation. For this example, since we're only using one test file, we'll just place it in a regular old `beforeEach()` within that file - this isn't scalable (you don't want to be required to remember to do that for every test file), but it's good enough for demonstration purposes.

```typescript
beforeEach(() => {
  Dependency.beforeEach();
});
```

Let's now prepare some fake objects we can use in place of the real ones. We're going to use classes that implement the required behavior, but there's other ways to do it - you can pass in object literals, or you can even use mocking libraries like Sinon to create functions that capture information every time they get called (Using Sinon to monkey patch dependencies is generally a no-no - you'll have trouble making larger SUTs, but it's still fine to use other parts of the library).

```typescript
export class TodoFileFake implements TodoFileDependency {
  #contents: string[] = [];

  async writeToTodoFile(data: string[]) {
    this.#contents = data;
  }

  async readFromTodoFile() {
    return this.#contents;
  }
}

export class LoggerFake implements LoggerDependency {
  logged = '';
  log(...messages: string[]) {
    this.logged += messages.join(' ') + '\n';
  }
}
```

Lets write an initialize() function that we can call at the start of each test (You could use `beforeEach()` as well, but an `initialize()` function has the advantage that it could take arguments to configure the initialization behavior).

```typescript
function initialize() {
  const testDoubles = {
    todoFile: new TodoFileFake(),
    logger: new LoggerFake(),
  };

  todoFileDependency.replaceWith(testDoubles.todoFile);
  loggerDependency.replaceWith(testDoubles.logger);

  return testDoubles;
}
```

Note how we're calling `<dependency>.replaceWith()` to supply the fake behavior we wish to use. If you were to comment one of these out, then try to run one of the tests defined below, you'll quickly get an error stating that an implementation for that dependency is missing.

It's not shown in this example, but also note that when you provide a test double to `.replaceWith()`, you're not required to provide a fake implementation to every function - you can omit some when the test doesn't need it.

And now we're ready to write our actual test cases. We'll just write a couple of test cases for this demonstration.

```typescript
await describe('main()', async () => {
  await test('adds a new todo item to the todo list file', async () => {
    const testDoubles = initialize();

    // Add some initial TODO items to the list
    await testDoubles.todoFile.writeToTodoFile(['item 1', 'item 2']);

    await main(['item', '3']);

    assert.deepEqual(await testDoubles.todoFile.readFromTodoFile(), [
      'item 1',
      'item 2',
      'item 3',
    ]);
  });

  await test('prints the updated list of todo items', async () => {
    const testDoubles = initialize();

    // Add some initial TODO items to the list
    await testDoubles.todoFile.writeToTodoFile(['item 1', 'item 2']);

    await main(['item', '3']);

    assert.deepEqual(testDoubles.logger.logged, (
      'item 1\n' +
      'item 2\n' +
      'item 3\n'
    ));
  });
});
```

Be creative when using this seam tool. The example provided is just a basic one to get you started, it's not trying to be prescriptive on the best way to use it - there's a number of valid ways to run with the tool. It's also expected that you will modify the `Dependency` class provided to best suit whatever your changing needs are - what's provided can get you quite far, but it can't do everything (there are, for example, some patterns in the [fortified testing philosophy](https://thescottyjam.github.io/fortified-testing-philosophy/revisions/1/) that aren't supported by this minimal implementation). If there's demand, a more feature-filled NPM library may be released in the future.
