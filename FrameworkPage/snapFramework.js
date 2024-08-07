/* eslint-disable react-hooks/rules-of-hooks */

// Top-level jsdocs will be parsed and displayed in their own special sections
// on the webpage. The parsing isn't very exact, but should be good enough for
// this use-case. It does mean if changes are made to those jsdoc comments, it's
// important to verify that it still renders as expected in the webpage.

// The `===== <section text> =====` style comments will be captured and rendered
// in a special way as well. Any whitespace after it will be ignored when
// viewing it on the webpage. This text will be left alone in the downloadable
// version.

// The comments that start with a "#" are pragmas that control how this
// file will be parsed and displayed on the website.
// Available pragmas:
//   START: Everything above the START pragma is ignored
//   IGNORE-NEXT: The next line will be ignored in the website's main display,
//     but it will be included as part of the download. Any whitespace that
//     follows will also be ignored.
//   COLLAPSE-EXAMPLES: Any examples that follow in this jsdoc comment should be
//     collapsed - you must click to view them. This pragma must be placed
//     directly before an '@example' annotation.

// Keep the maximum line width to 80 characters - it needs to be easy to read on
// half a screen on the webpage.

//# START
// Snap Framework beta version

// ==================== Reactivity ====================

/**
 * An event emitter with state. You can provide initial state to it when
 * constructing it, then `.get()` or `.set(...)` that piece of state at any
 * point in time. Others can choose to `.subscribe()` to the signal to listen
 * for state changes, and then later`.unsubscribe()` as needed.
 * 
 * `.subscribe()`/`.unsubscribe()` are considered to be lower-level - typically
 * you would instead use the {@link useSignals} hook which takes care of
 * unsubscribing for you.
 *
 * This is a stand-alone class that isn't dependent on anything else, which
 * means you can easily copy-paste it into other projects if you just want the
 * signal functionality.
 *
 * @example
 * function renderEchoBox() {
 *   const signalText = new Signal('');
 *   return html`
 *     <input type="text" ${set({
 *       onChange: event => signalText.set(event.target.value),
 *     })}/>
 *     <p ${set({ textContent: signalText })}></p>
 *   `;
 * }
 *
 * //# COLLAPSE-EXAMPLES
 * @example <caption>Using Signal without the rest of the framework</caption>
 * const signalEnemyHealth = new Signal(10);
 * console.info(`Enemy health starting at ${signalEnemyHealth.get()}`);
 * 
 * export function attack() {
 *   enemyHealth.set(signalEnemyHealth.get() - 1);
 * }
 * 
 * signalEnemyHealth.subscribe(enemyHealth => {
 *   if (enemyHealth <= 0) {
 *     console.info('Enemy killed!');
 *   }
 * });
 */
export class Signal {
  #value;
  #listeners = new Set()

  /**
   * Creates a new signal with an optional initial value. If an initial value is
   * not provided, The signal's value will be initialized as `undefined`.
   */
  constructor(value = undefined) {
    this.#value = value;
  }

  /** The callback `fn` will be called each time the signal value changes. */
  subscribe(fn) {
    console.assert(!this.#listeners.has(fn));
    this.#listeners.add(fn);
  }

  /**
   * Unsubscribe the callback `fn` from this signal so it will not be called
   * anymore when the signal value changes.
   */
  unsubscribe(fn) {
    console.assert(this.#listeners.has(fn));
    this.#listeners.delete(fn);
  }

  /** Retrieves the signal's current value. */
  get() {
    return this.#value;
  }

  /**
   * Updates the signal's current value and notifies anyone listening for
   * updates. If the new value is the same as the old one, nothing will happen.
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
 * `useSignals()` is a hook that allows you to subscribe to multiple signals at
 * once. Because it's a hook, it's capable of automatically cleaning up after
 * itself when your component unmounts, making sure to detach all subscriptions
 * from the signals.
 * 
 * @param dependentSignals A list of signals you want to watch.
 * @param onChange A callback that will be fired immediately, as well as each
 *   time any of those signals gets updated. The callback takes, as parameters,
 *   the current values of each signal being listened to.
 * 
 * @returns A signal that holds the last value that the `onChange` callback
 *   returned. Each time the callback returns a different value, the signal
 *   will be updated. This allows you to easily derive a new signal from
 *   existing signals. You may also choose to ignore this capability and simply
 *   use `useSignals()` as a way to trigger side-effects whenever a signal
 *   changes.
 * 
 * @example <caption>Using useSignals() to derive a new signal</caption>
 * function renderLogo({ src, signalWidth, signalHeight }) {
 *   return html`
 *     <img ${set({
 *       src,
 *       style: useSignals([signalWidth, signalHeight], (width, height) => {
 *         return `width=${width}px; height=${height}px`;
 *       })
 *     })}>
 *   `;
 * }
 * 
 * @example <caption>Using useSignals() to trigger side-effects</caption>
 * function renderBomb({ signalShow }) {
 *   const bombEl = html`<img src="./bomb.png" style="display: block">`;
 * 
 *   let intervalId = undefined;
 *   useSignals([signalShow], show => {
 *     if (show) {
 *       intervalId = setInterval(() => {
 *         bombEl.style.display = (
 *           bombEl.style.display === 'none' ? 'block' : 'none'
 *         );
 *       }, 1000);
 *     } else if (intervalId !== undefined) {
 *       clearInterval(intervalId);
 *       intervalId = undefined;
 *     }
 *   });
 * 
 *   // This callback will be called when the component is being unmounted.
 *   useCleanup(() => {
 *     if (intervalId !== undefined) {
 *       clearInterval(intervalId);
 *     }
 *   });
 * 
 *   return bombEl;
 * }
 */
export function useSignals(dependentSignals, onChange) {
  const derivedSignal = new Signal(undefined);

  const onDependentSignalChange = () => {
    const updatedValue = onChange(
      ...dependentSignals.map(dependentSignal => dependentSignal.get())
    );
    derivedSignal.set(updatedValue);
  };

  for (const dependentSignal of dependentSignals) {
    dependentSignal.subscribe(onDependentSignalChange);
  }
  onDependentSignalChange();

  useCleanup(() => {
    for (const dependentSignal of dependentSignals) {
      dependentSignal.unsubscribe(onDependentSignalChange);
    }
  });

  return derivedSignal;
}

// ==================== Core Tools ====================

/**
 * The Context class allows you to implicitly pass around parameters.
 * It can be used as an alternative to "prop-drilling", and it is what powers
 * {@link useCleanup} which in turn powers life-cycles.
 * 
 * This is a stand-alone class that isn't dependent on anything else, which
 * means you can copy-paste it into any project and use it as-is, without
 * copying the whole Snap Framework.
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
 * const logLevel = new Context();
 * // Setting the log level to 'NONE' for the duration of the provided callback.
 * logLevel.provide('NONE', doMath);
 * 
 * function doMath() {
 *   // At this point, the log level is set to 'NONE'
 *   // so we will not enter this branch.
 *   if (logLevel.get() === 'VERBOSE') {
 *     console.log('doMath() called');
 *   }
 * 
 *   // Updating the log level to be 'VERBOSE' for the
 *   // duration of this callback.
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
 */
export class Context {
  #stack = [];

  /**
   * Calls `callback` and provide `value` to it
   * for the duration of the callback.
   */
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
      'Attempted to use a context object that does not have ' +
      'a value provided to it (via .provide()).'
    );
    return this.#stack.at(-1);
  }
}

/**
 * The primary purpose of `defineElement()` is to encapsulate the CSS of a
 * component or group of components.
 * 
 * @param name The name of this custom element.
 * @param init A component function. It will receive a "this" argument that is
 *   a reference to the custom element class instance, which you can then use to
 *   call methods or attach fields to the instance. There is a dedicated `api`
 *   field provided on the "this" object that is intended to be a safe place to
 *   attach arbitrary fields without worrying about conflicting with current or
 *   yet-to-be-added built-in methods. Remember that to receive a "this"
 *   parameter, you must use a non-arrow function. Arrow functions trap the
 *   "this" parameter from its surrounding scope while normal functions do not.
 * 
 * This is a stand-alone function that isn't dependent on anything else, which
 * means you can copy-paste it into any project and use it as-is, without
 * copying the whole Snap Framework.
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
 *   // The CSS is able to target the "children" html property because
 *   // of how the Colored custom element is slotting it.
 *   return html`
 *     <h1>This is an example app!</h1>
 *     ${new Colored({
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
 * // Note the use of the non-arrow function,
 * // which permits the use of "this".
 * export const Colored = defineElement('Colored', function({ children }) {
 *   // Adds the children element to the custom element instance,
 *   // which allows it to be slotted.
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
 *     ${new Colored({
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
 * export const Colored = defineElement('Colored', function({ children }) {
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
 * export const ProfileCard = defineElement('ProfileCard', function(params) {
 *   const { name, address, src } = params;
 *
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
 * Use this to bootstrap a root framework component. This is what allows your
 * components to use hooks such as {@link useCleanup}.
 * 
 * @param callback This callback will be auto-called. While it is running,
 *   lifecycle hooks will be available to be used.
 * 
 * @returns an object containing two properties:
 * * value: Contains the return value of your callback.
 * * uninit: If you ever need to remove the component from the DOM,
 *     call this to allow the components to clean themselves up.
 *     If you never plan on uninitializing the component, you
 *     can just ignore this function.
 * 
 * @example <caption>Rendering an app root</caption>
 * // Hooks such as useCleanup() are available to this component and descendent
 * // components it renders (such as `renderAppContent()`) because it was
 * // rendered via withLifecycle().
 * //
 * // Note that in this specific example, these root components are never
 * // uninitialized (because the uninit function returned by withLifecycle()
 * // is never called), which means any callback given to the useCleanup()
 * // hook would effectively be ignored.
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
 *     console.log('This will be called as the component is being cleaned up.');
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
 * document.getElementById('toggle-widget')
 *   .addEventListener('click', toggleWidget);
 *
 * toggleWidget();
 */
export function withLifecycle(callback) {
  const signalUninitialized = new Signal(false);
  const value = onUninitContext.provide(signalUninitialized, callback);

  const uninit = () => signalUninitialized.set(true);
  return { uninit, value };
}

/**
 * The `useCleanup()` hook will call the provided callback as the component
 * is unmounting.
 * 
 * @example
 * function renderTimer({ initialValue }) {
 *   const signalTimeLeft = new Signal(initialValue);
 * 
 *   const intervalId = setInterval(() => {
 *     signalTimeLeft.set(signalTimeLeft.get() - 1);
 *     if (signalTimeLeft.get() === 0) {
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
 *     <p ${set({ textContent: signalTimeLeft })}></p>
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
 * If you interpolate HTML elements or fragments, they will be inserted at that
 * location.
 * 
 * If you interpolate a function inside of an element tag, that function will
 * get called with a reference to the element as a parameter.
 * 
 * To set properties on an element in your template, use the {@link set} helper
 * function.
 * 
 * There's one important restriction: never set the id attribute on an element
 * in your HTML template string. If you need to set an id, you can do so
 * after-the-fact, by using {@link set} or some other method. The way this HTML
 * template tag is able to find elements and provide them to interpolated
 * functions is by temporarily setting an id attribute on those elements, and if
 * you attempt to also set an id attribute, that can create a conflict.
 * 
 * This is a stand-alone function that isn't dependent on anything else, which
 * means you can copy-paste it into any project and use it as-is, without
 * copying the whole Snap Framework.
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
 * // Wrong - may cause issues if you interpolate a callback into this element.
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
    return (
      value !== null &&
      Object.getPrototypeOf(value) === Function.prototype
    );
  };
  
  const isElementOrFragment = node => {
    return node instanceof HTMLElement || node instanceof DocumentFragment;
  };

  const baseElementId = String(Math.random()).split('.')[1];
  const getIdAtIndex = index => `autogenerated-id-${baseElementId}-${index}`;

  // Build the HTML string
  let htmlString = strings[0];
  for (const [i, string] of strings.slice(1).entries()) {
    const value = values[i];
    if (isFunctionThatIsNotAClass(value)) {
      htmlString += `id="${getIdAtIndex(i)}"`;
    } else if (isElementOrFragment(value)) {
      htmlString += (
        `<template id="${getIdAtIndex(i)}" data-info="child placeholder">` +
        '</template>'
      );
    } else {
      throw new Error('Invalid value interpolated into the html tag.');
    }
    htmlString += string;
  }

  // Convert the HTML string into an element tree
  const templateEl = document.createElement('template');
  templateEl.innerHTML = htmlString;

  // Apply interpolated values to the element tree
  for (const [i, value] of values.entries()) {
    if (isFunctionThatIsNotAClass(value)) {
      const el = templateEl.content.getElementById(getIdAtIndex(i));
      el.removeAttribute('id');
      value(el);
    } else if (isElementOrFragment(value)) {
      const placeholderEl = templateEl.content.getElementById(getIdAtIndex(i));
      placeholderEl.parentNode.insertBefore(value, placeholderEl);
      placeholderEl.parentNode.removeChild(placeholderEl);
    }
  }

  return templateEl.content;
}

/**
 * Sets properties on an element. If signals are provided, it will
 * automatically subscribe to those signals and auto-update the associated
 * properties whenever the signal is changed.
 * 
 * @param fields an object that maps property names to values
 *   (or signals with values)
 * @param getRef (optional) a callback that will be called with a reference
 *   to the element being updated.
 * 
 * @returns a hook that expects an element as an argument.
 *   Most of the time you won't call this hook yourself,
 *   instead, you would interpolate it in the {@link html} template tag.
 * 
 * @example
 * function renderButton({ text, signalColor, onClick }) {
 *   return html`
 *     <button ${set({
 *       // The text of the button tag will be set to the
 *       // value of the text argument.
 *       textContent: text,
 *       // The text color will be set to this signal's current value. If the
 *       // signal's value changes, the button's text color will change as well.
 *       color: signalColor,
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
    const signal = maybeSignal instanceof Signal
      ? maybeSignal
      : new Signal(maybeSignal);

    useSignals([signal], value => { el[key] = value });
  }

  getRef?.(el);
  return el;
}

// ==================== Flow Control ====================

/**
 * This is similar to doing a for loop, but inside of a template.
 * 
 * Given a signal holding a array of entries, `renderChild()` will render
 * one node per entry in the array. Each entry in the signal's array should
 * be a tuple containing a key-value pair. Every time a new element needs
 * to be rendered, the `initChild()` callback will be called with the
 * entry value as the first parameter, followed by the entry key. `initChild()`
 * should return a new HTML node to be rendered.
 * 
 * The singal's entry keys are used to uniquely identify that particular entry,
 * so if the contents of the array is updated, it can figure out,
 * by comparing keys, if elements need to moved, destroyed, or created.
 * 
 * @example
 * function renderTodoItems(signalTodos) {
 *   return html`
 *     <div class="todo-list">
 *       ${renderEach(
 *         // Derive a new signal from signalTodos.
 *         // This new signal will use the todo item's id as the key.
 *         useSignals(signalTodos, todos => todos.map(todo => [todo.id, todo]))
 *         (todo, todoId) => returnTodoItem(todo),
 *       )}
 *     </div>
 *   `;
 * }
 */
export function renderEach(signalEntries, initChild) {
  // Maps entry keys to an object of the shape:
  //   {
  //     markStart: <reference to an HTML comment node>,
  //     markEnd: <reference to an HTML comment node>,
  //     uninit: <function to trigger uninitialization>,
  //   }
  let currentlyRenderedLookup = new Map();

  // These HTML comments will book-end everything being rendered.
  // This helps us know what's our to manage and what we shouldn't touch.
  const renderEachStartMarker = document.createComment('start renderEach()');
  const renderEachEndMarker = document.createComment('end renderEach()');

  // This fragment contains what will be rendered initially.
  // Remember that once a fragment is attached to the DOM, it'll
  // be emptied, rendering this fragment unusable afterwards.
  const initialRenderFragment = document.createDocumentFragment();
  initialRenderFragment.append(renderEachStartMarker, renderEachEndMarker);

  useCleanup(() => {
    for (const { uninit } of currentlyRenderedLookup.values()) {
      uninit();
    }
  });

  useSignals([signalEntries], entries => {
    const updatedFragment = document.createDocumentFragment();
    for (const [key, initParams] of entries) {
      if (!currentlyRenderedLookup.has(key)) {
        // Add a new child
        const markStart = document.createComment('start renderEach child');
        const markEnd = document.createComment('end renderEach child');

        const renderChild = () => initChild(initParams, key);
        const { uninit, value: childNode } = withLifecycle(renderChild);

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

    // detach the existing content from the DOM
    const renderEachRange = document.createRange();
    renderEachRange.setStartAfter(renderEachStartMarker);
    renderEachRange.setEndBefore(renderEachEndMarker);
    renderEachRange.deleteContents();

    // insert the updated content
    renderEachEndMarker.parentNode.insertBefore(
      updatedFragment,
      renderEachEndMarker
    );
  });

  return initialRenderFragment;
}

/**
 * This is similar to doing an if-else chain, but inside of a template.
 * 
 * This will find the first matching condition from a list of conditions
 * then render the associated element. If no matches were found, nothing will render.
 * 
 * @param conditions A list of objects. Each object should have two properties - `signalWhen`,
 *   which holds a signal containing a boolean which decides if this element should render or not,
 *   and `render()`, which should return an element to render.
 * 
 * @example
 * function renderContent() {
 *   return html`
 *     ${renderChoice([
 *       {
 *         signalWhen: signalIsDesktopView,
 *         render: () => renderDesktopViewContent(),
 *       },
 *       {
 *         signalWhen: signalIsTabletView,
 *         render: () => renderTabletViewContent(),
 *       },
 *       {
 *         // This signal is always true, making this branch act like an
 *         // "else" - it will render if the above two conditions are false.
 *         signalWhen: new Signal(true),
 *         render: () => renderMobileViewContent(),
 *       },
 *     ])}
 *   `;
 * }
 */
export function renderChoice(conditions) {
  const signalIndexToRender = useSignals(
    conditions.map(condition => condition.signalWhen),
    (...whens) => {
      const index = whens.findIndex(when => when);
      return index === -1 ? [] : [[index, index]];
    },
  );

  return renderEach(signalIndexToRender, indexToRender => {
    return conditions[indexToRender].render();
  });
}

/**
 * A shorthand for `renderChoice()` when you only have one condition that's
 * deciding if something should render or not.
 * 
 * @example
 * function renderProfile(user) {
 *   return html`
 *     <p ${set({ textContent: user.name })}></p>
 *     ${renderIf(user.signalDateOfBirth, () => html`
 *       <p ${set({ textContent: user.signalDateOfBirth })}></p>
 *     `)}
 *   `;
 * }
 */
export function renderIf(signalWhen, render) {
  return renderChoice([{ signalWhen, render }]);
}
