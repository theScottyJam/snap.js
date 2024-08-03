/* eslint-disable react-hooks/rules-of-hooks */

// Top-level jsdocs will be parsed and displayed in their own special sections on the webpage.
// The parsing isn't very exact, but should be good enough for this use-case. It does mean if
// changes are made to those jsdoc comments, it's important to verify that it still renders as expected
// in the webpage.

// The `===== <section text> =====` style comments will be captured and rendered in a special way as well.
// Any whitespace after it will be ignored when viewing it on the webpage.
// This text will be left alone in the downloadable version.

// The comments that start with a "#" are pragmas that control how this
// file will be parsed and displayed on the website.
// Available pragmas:
//   START: Everything above the START pragma is ignored
//   IGNORE-NEXT: The next line will be ignored in the website's main display, but it will be included as part of the download.
//     Any whitespace that follows will also be ignored.
//   COLLAPSE-EXAMPLES: Any examples that follow in this jsdoc comment should be collapsed - you must click to view them.
//     This pragma must be placed directly before an '@example' annotation.

//# START
// Snap Framework beta version

// ==================== Reactivity ====================

/**
 * An event emitter with state. You can provide initial state to it when constructing it,
 * then `.get()` or `.set(...)` that piece of state at any point in time.
 * Others can choose to `.subscribe()` to the signal to listen for state changes,
 * and then later`.unsubscribe()` as needed.
 * 
 * `.subscribe()`/`.unsubscribe()` are considered to be lower-level - typically you would instead
 * use the {@link useSignals} hook which takes care of unsubscribing for you.
 *
 * Variables and properties that hold signals will, by convention, be named with a "$" suffix.
 * If they can hold either a signal or a normal value, you can still use the "$" suffix to indicate that
 * it supports holding a signal.
 * 
 * This is a stand-alone class that isn't dependent on anything else, which means you
 * can easily copy-paste it into other projects if you just want the signal functionality.
 *
 * @example
 * function renderEchoBox() {
 *   const text$ = new Signal('');
 *   return html`
 *     <input type="text" ${set({
 *       onChange: event => text$.set(event.target.value)
 *     })}/>
 *     <p ${set({ textContent: text$ })}></p>
 *   `;
 * }
 *
 * //# COLLAPSE-EXAMPLES
 * @example <caption>Using Signal without the rest of the framework</caption>
 * const enemyHealth$ = new Signal(10)
 * 
 * export function attack() {
 *   enemyHealth.set(enemyHealth$.get() - 1);
 * }
 * 
 * enemyHealth$.subscribe(() => {
 *   if (enemyHealth$.get() === 0) {
 *     console.info('Enemy killed!');
 *   }
 * });
 */
export class Signal {
  #value;
  #listeners = new Set()

  /**
   * Creates a new signal with an optional initial value.
   * If an initial value is not provided, it will, by default, be set to `undefined`.
   */
  constructor(value = undefined) {
    this.#value = value;
  }

  /**
   * Wraps the argument in a signal. If it is already a signal, it'll simply be returned.
   * This is useful as a way to allow components to accept either a signal or a non-signal as a parameter
   * and treat them both the same.
   */
  static from(maybeSignal) {
    return maybeSignal instanceof Signal ? maybeSignal : new Signal(maybeSignal);
  }

  /** The provided callback will be called each time the signal value changes. */
  subscribe(fn) {
    console.assert(!this.#listeners.has(fn));
    this.#listeners.add(fn);
  }

  /** Unsubscribe this callback from this signal, so it will not be called anymore when the signal value changes. */
  unsubscribe(fn) {
    console.assert(this.#listeners.has(fn));
    this.#listeners.delete(fn);
  }

  /** Retrieves the signal's current value. */
  get() {
    return this.#value;
  }

  /**
   * Updates the signal's current value and notifies anyone listening for updates.
   * If the new value is the same as the old one, nothing will happen.
   */
  set(newValue) {
    if (this.#value === newValue) return;
    this.#value = newValue;
    for (const listener of this.#listeners) {
      listener(newValue);
    }
  }
}

/**
 * `useSignals()` is a hook that allows you to subscribe to multiple signals at once.
 * Because it's a hook, it's capable of automatically cleaning up and removing
 * your signal listeners when your component unmounts.
 * 
 * The first argument is a list of signals you want to watch, and the second
 * argument is a callback that will be fired immediately, as well as each time
 * any of those signals gets updated. The callback takes, as arguments,
 * the current values of each signal being listened to.
 * 
 * `useSignals()` will return a signal that holds the last value that the
 * callback returned. Each time the callback returns a different value,
 * the returned signal will be updated. This allows you to easily derive
 * a new signal from existing signals. You may also choose to
 * ignore this capability and simply use `useSignals()` as a way to trigger
 * side-effects whenever a signal changes.
 * 
 * @example <caption>Using useSignals() to derive a new signal</caption>
 * function renderLogo({ src, width$, height$ }) {
 *   return html`
 *     <img $(set({
 *       src,
 *       style: useSignals([width$, height$], (width, height) => {
 *         return `width=${width}px; height=${height}px`;
 *       })
 *     }))>
 *   `;
 * }
 * 
 * @example <caption>Using useSignals() to trigger side-effects</caption>
 * function renderBomb({ show$ }) {
 *   const bombEl = html`<img src="./bomb.png" style="display: block">`;
 * 
 *   let intervalId = undefined;
 *   useSignals([show$], show => {
 *     if (show) {
 *       intervalId = setInterval(() => {
 *         bombEl.style.display = bombEl.style.display === 'none' ? 'block' : 'none';
 *       }, 1000);
 *     } else if (intervalId !== undefined) {
 *       clearInterval(intervalId);
 *       intervalId = undefined;
 *     }
 *   });
 * 
 *   // useCleanup() is another hook that will call its
 *   // callback when the component is being unmounted.
 *   useCleanup(() => {
 *     if (intervalId !== undefined) {
 *       clearInterval(intervalId);
 *     }
 *   });
 * 
 *   return bombEl;
 * }
 */
export function useSignals(dependentSignals, deriveValue) {
  console.assert(dependentSignals.every(signal => signal instanceof Signal));
  const signal$ = new Signal(undefined);

  const onDependentSignalChange = () => {
    const updatedValue = deriveValue(...dependentSignals.map(signal$ => signal$.get()));
    signal$.set(updatedValue);
  };

  for (const depSignal$ of dependentSignals) {
    depSignal$.subscribe(onDependentSignalChange);
  }
  onDependentSignalChange();

  useCleanup(() => {
    for (const depSignal$ of dependentSignals) {
      depSignal$.unsubscribe(onDependentSignalChange);
    }
  });

  return signal$;
}

// ==================== Core Tools ====================

/**
 * The Context class allows you to implicitly pass parameters through the call stack.
 * It can be used as an alternative to "prop-drilling", and it is what powers {@link useCleanup}
 * which in turn powers life-cycles.
 * 
 * This is a stand-alone class that isn't dependent on anything else, which means you
 * can copy-paste it into any project and use it as-is if wanted, without copying the whole Snap Framework.
 * 
 * @example
 * const theme = new Context();
 * 
 * function renderApp() {
 *   const themeOpts = { mainColor: 'blue' };
 *   // The themeOpts object will be available to everyone while
 *   // the callback given to theme.provide() is running.
 *   theme.provide(themeOpts, () => {
 *     return html`
 *       <h1>Hello Theming!</h1>
 *       ${renderContent()}
 *     `;
 *   });
 * }
 * 
 * function renderContent() {
 *   // Retrieves the provided themeOpts object
 *   const themeOpts = theme.get();
 *   return html`
 *     <p ${set({ style: `background: ${themeOpts.mainColor}` })}>
 *       Hello World!
 *     </p>
 *   `;
 * }
 *
 * //# COLLAPSE-EXAMPLES
 * @example <caption>Nesting calls to .provide()</caption>
 * // Setting the log level to 'NONE' for the duration of the provided callback.
 * const logLevel = new Context();
 * logLevel.provide('NONE', doMath);
 * 
 * function doMath() {
 *   // At this point, the log level is set to 'NONE'
 *   // so we will not enter this branch.
 *   if (logLevel.get() === 'VERBOSE') {
 *     console.log('doMath() called');
 *   }
 * 
 *   // Updating the log level to be 'VERBOSE' for the duration of this callback.
 *   logLevel.provide('VERBOSE', () => calcSum(2, 3));
 * 
 *   // At this point, the log level is set back to 'NONE'
 *   // so we will not enter this branch.
 *   if (logLevel.get() === 'VERBOSE') {
 *     console.log('doMath() called');
 *   }
 * }
 * 
 * function calcSum(x, y) {
 *   // Because 'VERBOSE' was provided as the log-level,
 *   // we will enter this branch and log out the arguments.
 *   if (logLevel.get() === 'VERBOSE') {
 *     console.log('Summing', x, 'with', y);
 *   }}
 *   console.info('Result:', x + y);
 * }
 * 
 * @example <caption>Using Context without the rest of the framework</caption>
 * const logLevel = new Context();
 * // Setting the log level to 'VERBOSE' for the duration of the provided callback.
 * logLevel.provide('VERBOSE', () => calcSum(2, 3));
 * 
 * function calcSum(x, y) {
 *   // Because 'VERBOSE' was provided as the log-level,
 *   // we will enter this branch and log out the arguments.
 *   if (logLevel.get() === 'VERBOSE') {
 *     console.log('Summing', x, 'with', y);
 *   }}
 *   console.info('Result:', x + y);
 * }
 */
export class Context {
  #stack = [];

  /** Calls `callback` and provide `value` to it for the duration of the callback. */
  provide(value, callback) {
    this.#stack.push(value);
    try {
      return callback();
    } finally {
      this.#stack.pop();
    }
  }

  /** Retrieves the value provided to this context object via `.provide()`. */
  get() {
    console.assert(
      this.#stack.length > 0,
      'Attempted to use a context object that does not have a value provided (via .provide()).'
    );
    return this.#stack.at(-1);
  }
}

/**
 * The primary purpose of `defineElement()` is to encapsulate the CSS of a component or group of components.
 * 
 * @param name The name of this custom element.
 * @param init A component function. It will receive a "this" argument that is a reference to the custom element
 *   class instance, which you can then use to call methods or attach fields to the instance.
 *   There is a dedicated `api` field provided to you that is intended to be a safe place to attach arbitrary
 *   fields without worrying about conflicting with current or yet-to-be-added built-in methods.
 *   Remember that, to receive a "this" parameter, you must use a non-arrow function. Arrow functions
 *   trap the "this" parameter from its surrounding scope while normal functions do not.
 * 
 * This is a stand-alone function that isn't dependent on anything else, which means you
 * can copy-paste it into any project and use it as-is if wanted, without copying the whole Snap Framework.
 * 
 * @example
 * export const ExampleApp = defineElement('ExampleApp', ({ text }) => {
 *   return html`
 *     ${renderHeader()}
 *     <p ${set({ textContent: text })}></p>
 * 
 *     <style ${set({ textContent: css })}></style>
 *   `;
 * });
 * 
 * function renderHeader() {
 *   return html`<h1>This is an example app!</h1>`;
 * }
 * 
 * // This CSS only effects ExampleApp and renderHeader.
 * // If ExampleApp were to interpolate another custom element instance,
 * // it would not be effected by this CSS.
 * const css = `
 *   h1, p {
 *     color: blue;
 *   }
 * `;
 * 
 * @example <caption>Using slots to create container-like custom elements.</caption>
 * const ExampleApp = defineElement('ExampleApp', () => {
 *   // The CSS is able to target the "children" html property
 *   // because of how the ColoredBackgroundRegion custom element is slotting it.
 *   return html`
 *     <h1>This is an example app!</h1>
 *     ${new ColoredBackgroundRegion({
 *       children: html`
 *         <p>This is the app's contents</p>
 *       `,
 *     })}
 * 
 *     <style>
 *       h1, p {
 *         color: blue;
 *       }
 *     </style>
 *   `;
 * });
 * 
 * // Note the use of the non-arrow function, which permits the use of "this".
 * export const ColoredBackgroundRegion = defineElement('ColoredBackgroundRegion', function({ children }) {
 *   // Adds the children element to the custom element instance, which allowed it to be slotted.
 *   this.append(children);
 * 
 *   // The <slot/> element indicates where the child should get slotted.
 *   return html`
 *     <div>
 *       <slot/>
 *     </div>
 * 
 *     <style>
 *       div {
 *         background: yellow;
 *       }
 *     </style>
 *   `;
 * });
 * 
 * //# COLLAPSE-EXAMPLES
 * @example <caption>Using multiple slots</caption>
 * const ExampleApp = defineElement('ExampleApp', () => {
 *   return html`
 *     <h1>This is an example app!</h1>
 *     ${new ColoredBackgroundRegions({
 *       children: html`
 *         <p slot="child1">This goes in the first slot.</p>
 *         <p slot="child2">This goes in the second slot.</p>
 *       `,
 *     })}
 * 
 *     <style>
 *       h1, p {
 *         color: blue;
 *       }
 *     </style>
 *   `;
 * });
 * 
 * export const ColoredBackgroundRegions = defineElement('ColoredBackgroundRegions', function({ children }) {
 *   this.append(children);
 * 
 *   return html`
 *     <div style="background: yellow">
 *       <slot name="child1"/>
 *     </div>
 *     <div style="background: green">
 *       <slot name="child2"/>
 *     </div>
 *   `;
 * });
 * 
 * @example <caption>Attaching properties to the "api" field.</caption>
 * export const ProfileCard = defineElement('ProfileCard', function({ name, address, src }) {
 *   let textEl;
 *   this.api.getSizeOfText = () => {
 *     return textEl.getBoundingClientRect();
 *   };
 * 
 *   return html`
 *     <img ${set({ src })}>
 *     <div ${el => textEl = el}>
 *       <p ${set({ textContent: name })}></p>
 *       <p ${set({ textContent: address })}></p>
 *     </div>
 *   `;
 * });
 * 
 * const profileCard = new ProfileCard();
 * document.body.append(profileCard);
 * // Logs out the dimensions of the text portion of the profile card.
 * console.log(profileCard.api.getSizeOfText());  
 */
export function defineElement(name, init) {
  return class CustomElement extends HTMLElement {
    // Sets the class name, so its a more meaningful name than "CustomElement".
    static name = name;

    // A dedicated spot where init() can put public fields if wanted
    // without worrying about it conflicting with any built-in APIs.
    api = {};

    constructor(...params) {
      super();
      const shadowRoot = this.attachShadow({ mode: 'closed' });
      shadowRoot.append(init.call(this, ...params));
    };

    static {
      const randomId = String(Math.random()).slice(2, 10);
      customElements.define(`${name.toLowerCase()}-${randomId}`, CustomElement);
    }
  }
}

// ==================== Lifecycle ====================

const onUninitContext = new Context();

/**
 * Use this to bootstrap a root framework component. This is what allows your components to
 * use hooks such as {@link useCleanup}.
 * 
 * It will return an object containing two properties:
 * * value: Contains the return value of your callback.
 * * uninit: If you ever need to remove the component from the DOM,
 *     call this to allow the components to clean themselves up.
 *     If you never plan on uninitializing the component, you
 *     can just ignore this function.
 * 
 * @example <caption>Rendering an app root</caption>
 * // Hooks such as useCleanup() are available to this component
 * // because it was rendered via withLifecycle().
 * // However, useCleanup() will never call its callback,
 * // because the component will never be cleaned up
 * // (the uninit function returned from withLifecycle() is never being called).
 * function renderApp() {
 *   return html`
 *     <h1>Hello App!</h1>
 *     ${renderAppContent()}
 *   `;
 * }
 * 
 * // Only grabbing the .el property and ignoring the uninit property
 * // because we don't need it.
 * const el = withLifecycle(renderApp).el;
 * document.body.append(el);
 * 
 * //# COLLAPSE-EXAMPLES
 * @example <caption>Rendering an element that may be removed in the future</caption>
 * function renderWidget() {
 *   useCleanup(() => {
 *     console.log('This will get called as the component is being cleaned up.');
 *   });
 * 
 *   const el = html`
 *     <p style="background: red">This widget can be added or removed!</p>
 *   `;
 * 
 *   const intervalId = setInterval(() => {
 *     el.style.background = el.style.background === 'red' ? 'blue' : 'red';
 *   }, 1000);
 * 
 *   // The useCleanup() hook will be called when the uninit()
 *   // function returned by withLifecycle() is called.
 *   useCleanup(() => clearInterval(intervalId));
 * }
 * 
 * const widgetContainerEl = document.getElementById('widget-container');
 * let showingWidget = false;
 * let uninit;
 * const toggleWidget = () => {
 *   if (showingWidget) {
 *     uninit();
 *     widgetContainerEl.innerHTML = '';
 *   } else {
 *     const result = withLifecycle(renderWidget);
 *     widgetContainerEl.append(result.value);
 *     uninit = result.uninit;
 *   }
 *   showingWidget = !showingWidget;
 * }
 * 
 * document.getElementById('toggle-widget').addEventListener('click', toggleWidget);
 * toggleWidget();
 */
export function withLifecycle(callback) {
  const uninitialized$ = new Signal(false);
  const value = onUninitContext.provide(uninitialized$, callback);

  const uninit = () => uninitialized$.set(true);
  return { uninit, value };
}

/**
 * The `useCleanup()` hook will call the provided callback as the component is unmounting.
 * 
 * @example
 * function renderTimer({ initialValue }) {
 *   const timeLeft$ = new Signal(initialValue);
 * 
 *   const intervalId = setInterval(() => {
 *     timeLeft$.set(timeLeft$.get() - 1);
 *     if (timeLeft$.get() === 0) {
 *       clearInterval(intervalId);
 *     }
 *   }, 1000);
 * 
 *   // This will make sure the interval is stopped when the component unmounts,
 *   // otherwise, it will continue to try to update the element's contents
 *   // even though the element isn't being shown to the user anymore.
 *   useCleanup(() => clearInterval(intervalId));
 * 
 *   return html`
 *     <p ${set({ textContent: timeLeft$ })}></p>
 *   `;
 * }
 */
export function useCleanup(listener) {
  onUninitContext.get().subscribe(listener);
}

// ==================== Templating ====================

/**
 * A template tag for generating HTML nodes.
 * 
 * If you interpolate a function into an element, that function will get called with
 * a reference to the element as a parameter.
 * 
 * You can also interpolate another HTML node or fragment to insert it
 * at that location.
 * 
 * To set properties on an element in your template, use the {@link set} helper function.
 * 
 * There's one important restriction: never set an id on an element directly.
 * If you need to set an id, you can do so after-the-fact, e.g. through {@link set}.
 * The way this HTML template tag is able to find elements and provide them to interpolated functions
 * is by temporarily setting an id field on those elements, and if you attempt to also set an id field, that can
 * create a conflict.
 * 
 * This is a stand-alone function that isn't dependent on anything else, which means you
 * can copy-paste it into any project and use it as-is if wanted, without copying the whole Snap Framework.
 * 
 * @example <caption>Interpolating nested HTML elements</caption>
 * function renderApp() {
 *   return html`
 *     <h1>Hello World Example</h1>
 *     ${renderHelloWorldText()}
 *   `;
 * }
 * 
 * function renderHelloWorldText() {
 *   return html`
 *     <p>Hello World!</p>
 *   `;
 * }
 * 
 * @example <caption>Interpolating a callback</caption>
 * let color = 'red';
 * document.body.append(html`
 *   <main>
 *     <p ${el => {
 *       setInterval(() => {
 *         color = color === 'red' ? 'blue' : 'red';
 *         el.style.color = color;
 *       }, 1000);
 *     }}>
 *       Hello World!
 *     </p>
 *   </main>
 * `);
 * 
 * //# COLLAPSE-EXAMPLES
 * @example <caption>Setting an ID</caption>
 * // Wrong - may cause issues if you interpolate a callback into the same element.
 * html`
 *   <p id="hello-world">
 *     Hello World!
 *   </p>
 * `
 * 
 * // Correct
 * html`
 *   <p ${el => { el.id = 'hello-world' }}>
 *     Hello World!
 *   </p>
 * `
 * 
 * // Also correct
 * html`
 *   <p ${set({ id: 'hello-world' })}>
 *     Hello World!
 *   </p>
 * `
 */
export function html(strings, ...values) {
  const isFunctionThatIsNotAClass = value => {
    return value !== null && Object.getPrototypeOf(value) === Function.prototype;
  };
  
  const isElementOrFragment = node => {
    return node instanceof HTMLElement || node instanceof DocumentFragment;
  };

  const baseElementId = String(Math.random()).split('.')[1];
  const getValueId = elNum => `autogenerated-id-${baseElementId}-${elNum}`;

  let htmlString = strings[0];
  for (const [i, string] of strings.slice(1).entries()) {
    const value = values[i];
    if (isFunctionThatIsNotAClass(value)) {
      htmlString += `id="${getValueId(i)}"`;
    } else if (isElementOrFragment(value)) {
      htmlString += `<template id="${getValueId(i)}" data-info="child placeholder"></template>`;
    } else {
      throw new Error('Invalid value interpolated into the html tag.');
    }
    htmlString += string;
  }

  const templateEl = document.createElement('template');
  templateEl.innerHTML = htmlString;

  for (const [i, value] of values.entries()) {
    if (isFunctionThatIsNotAClass(value)) {
      const el = templateEl.content.getElementById(getValueId(i));
      el.removeAttribute('id');
      value(el);
    } else if (isElementOrFragment(value)) {
      const placeholderEl = templateEl.content.getElementById(getValueId(i));
      placeholderEl.parentNode.insertBefore(value, placeholderEl);
      placeholderEl.parentNode.removeChild(placeholderEl);
    }
  }

  return templateEl.content;
}

/**
 * Sets properties on an element. If signals are provided, it will
 * automatically subscribe to those signals and auto-update the associated properties
 * whenever the signal is changed.
 * 
 * @param fields an object that maps property names to values (or signals)
 * @param getRef (optional) a callback that will be called with a reference to the element being updated.
 * 
 * @returns a hook that expects an element as an argument. Most of the time you won't call this hook yourself,
 *   instead, you would interpolate it in the {@link html} template tag.
 * 
 * @example
 * function renderButton({ text, color$, onClick }) {
 *   return html`
 *     <button ${set({
 *       // The text of the button tag will be set to the value of this text parameter.
 *       textContent: text,
 *       // The text color will be set to this signal's current value.
 *       // If the signal's value changes, the button's text color will change as well.
 *       color: color$,
 *       // You can easily attach event handlers as well, since those are
 *       // just properties on the element
 *       onclick: onClick,
 *     })}></button>
 *   `;
 * }
 * 
 * @example <caption>using set() on your own components</caption>
 * function renderApp() {
 *   // This example shows how you would use set() to adjust properties from
 *   // an element created by another component. In this case, we are
 *   // calling renderHeader(), receiving a reference to a header component,
 *   // then attaching a style property to it to give it some margin.
 *   return html`
 *     ${set({
 *       style: 'margin: 20px 0px',
 *     })(renderHeader())}
 *     <p>App Body</p>
 *   `;
 * }
 * 
 * function renderHeader() {
 *   return html`<h1>My Awesome App!</h1>`;
 * }
 * 
 * //# COLLAPSE-EXAMPLES
 * @example <caption>Using the getRef parameter</caption>
 * function renderHeader(text) {
 *   return html`
 *     <h1 ${
 *       set({
 *         textContent: text,
 *       }, el => {
 *         el.dataset.idForAutomatedTests = 'application-header';
 *       })
 *     }></h1>
 *   `;
 * }
 */
export const set = (fields, getRef = undefined) => el => {
  for (const [key, maybeSignal] of Object.entries(fields)) {
    const signal$ = Signal.from(maybeSignal);
    useSignals([signal$], value => {
      el[key] = value;
    });
  }

  getRef?.(el);
  return el;
}

// ==================== Flow Control ====================

/**
 * This is similar to doing a for loop in a template.
 * 
 * Given a signal holding a array of entries, `renderChild()` will render
 * one node per entry in the array. Each entry in the signal's array should
 * be a tuple containing a key-value pair. Every time a new element needs
 * to be rendered, the `initChild()` callback will be called with the
 * entry value as the first parameter, followed by the entry key. `initChild()`
 * should return a new HTML node to be rendered.
 * 
 * The singal's entry keys are used to uniquely identify that particular entry,
 * so if the contents of the array is updated, it can figure out, by comparing keys,
 * if elements need to moved, destroyed, or created.
 * 
 * @example
 * function renderTodoItems(todos$) {
 *   return html`
 *     <div class="todo-list">
 *       ${renderEach(
 *         // Derive a new signal from signals$.
 *         // This new signal will use the todo item's id as the key.
 *         useSignals(todos$, todos => todos.map(todo => [todo.id, todo]))
 *         (todo, todoId) => returnTodoItem(todo),
 *       )}
 *     </div>
 *   `;
 * }
 */
export function renderEach(entries$, initChild) {
  // Maps keys to { range: <Range>, onUninit: <EventEmitter> }.
  let currentlyRenderedLookup = new Map();

  const renderEachStartMarker = document.createComment('start renderEach()');
  const renderEachEndMarker = document.createComment('end renderEach()');
  const initialRenderFragment = document.createDocumentFragment();
  initialRenderFragment.append(renderEachStartMarker, renderEachEndMarker);

  useCleanup(() => {
    for (const { uninit } of currentlyRenderedLookup.values()) {
      uninit();
    }
  });

  useSignals([entries$], entries => {
    const updatedFragment = document.createDocumentFragment();
    for (const [key, initParams] of entries) {
      if (!currentlyRenderedLookup.has(key)) {
        // Add a new child
        const markStart = document.createComment('start renderEach child marker');
        const markEnd = document.createComment('end renderEach child marker');

        const { uninit, value: childNode } = withLifecycle(() => initChild(initParams, key));

        updatedFragment.append(markStart, childNode, markEnd);
        currentlyRenderedLookup.set(key, { markStart, markEnd, uninit })
      } else {
        // Move a child
        const { markStart, markEnd } = currentlyRenderedLookup.get(key);
        const range = document.createRange();
        range.setStartBefore(markStart);
        range.setEndAfter(markEnd);
        updatedFragment.append(range.extractContents());
      }
    }

    // Uninitialize unused children
    const usedKeys = new Set(entries.map(([key]) => key));
    for (const [key, { uninit }] of currentlyRenderedLookup) {
      if (!usedKeys.has(key)) {
        uninit();
        currentlyRenderedLookup.delete(key);
      }
    }

    const renderEachRange = document.createRange();
    renderEachRange.setStartAfter(renderEachStartMarker);
    renderEachRange.setEndBefore(renderEachEndMarker);
    renderEachRange.deleteContents();

    renderEachEndMarker.parentNode.insertBefore(updatedFragment, renderEachEndMarker);
  });

  return initialRenderFragment;
}

/**
 * This is similar to doing an if-else chain in a template.
 * 
 * This will find the first matching condition from a list of conditions
 * then render the associated element. If no matches were found, nothing will render.
 * 
 * @param conditions A list of objects. Each object should have two properties - `when$`,
 *   which holds a signal containing a boolean which decides if this element should render or not,
 *   and `render()`, which when called should return an element to render.
 * 
 * @example
 * function renderContent() {
 *   return html`
 *     ${renderChoice([
 *       {
 *         when$: usingDesktopView$,
 *         render: () => renderDesktopViewContent(),
 *       },
 *       {
 *         when$: usingTabletView$,
 *         render: () => renderTabletViewContent(),
 *       },
 *       {
 *         // This signal is always true, making this branch act like an "else" -
 *         // it will render if the above two conditions were false.
 *         when$: Signal(true),
 *         render: () => renderMobileViewContent(),
 *       },
 *     ])}
 *   `;
 * }
 */
export function renderChoice(conditions) {
  const indexToRender$ = useSignals(
    conditions.map(condition => condition.when$),
    (...whens) => {
      const index = whens.findIndex(when => when);
      return index === -1 ? [] : [[index, index]];
    },
  );

  return renderEach(indexToRender$, indexToRender => {
    return conditions[indexToRender].render();
  });
}

/**
 * A shorthand for `renderChoice()` when you only have one condition that's deciding if
 * something should render or not.
 * 
 * @example
 * function renderProfile(user) {
 *   return html`
 *     <p ${set({ textContent: user.name })}></p>
 *     ${renderIf(user.dateOfBirth$, () => html`
 *       <p ${set({ textContent: user.dateOfBirth$.get() })}></p>
 *     `)}
 *   `;
 * }
 */
export function renderIf(when$, render) {
  return renderChoice([{ when$, render }]);
}
