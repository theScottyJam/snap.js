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
//   COLLAPSE-EXAMPLES: Any examples that follow in this jsdoc comment should be
//     collapsed - you must click to view them. This pragma must be placed
//     directly before an '@example' annotation.
//   COMPLETE-EXAMPLE-START/COMPLETE-EXAMPLE-END: Indicates content that should
//     only be rendered when you're viewing a complete, runnable example. If
//     you're viewing the concise version of the example, this content will
//     be hidden.
//   NORMAL-VIEW-ONLY-NEXT: The following line will only be rendered in the normal
//     view, not the fully documented or minified view.
//   AUTO-OPEN: For debugging purposes - place this on an example to cause it
//     to be auto-opened, making it easier to develop the example.

// Keep the maximum line width to 80 characters - it needs to be easy to read on
// half a screen on the webpage.

//# START
// Snap Framework beta version
//# NORMAL-VIEW-ONLY-NEXT
// Read the docs: https://thescottyjam.github.io/snap.js/#!/framework/release/1.0


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
 * Signals are on the JavaScript standard track!
 * See {@link https://github.com/tc39/proposal-signals|the Signals proposal}.
 *
 * @example
 * //# COMPLETE-EXAMPLE-START
 * import { Signal, withLifecycle, html, set } from '%FRAMEWORK_LOCATION%';
 * 
 * //# COMPLETE-EXAMPLE-END
 * function renderEchoBox() {
 *   const signalText = new Signal('');
 *   return html`
 *     <input type="text" ${set({
 *       oninput: event => signalText.set(event.target.value),
 *     })}/>
 *     <p ${set({ textContent: signalText })}></p>
 *   `;
 * }
 * //# COMPLETE-EXAMPLE-START
 * 
 * document.body.append(withLifecycle(renderEchoBox).value);
 * //# COMPLETE-EXAMPLE-END
 *
 * //# COLLAPSE-EXAMPLES
 * @example <caption>Using Signal without the rest of the framework</caption>
 * //# COMPLETE-EXAMPLE-START
 * import { Signal } from '%FRAMEWORK_LOCATION%';
 * 
 * //# COMPLETE-EXAMPLE-END
 * const signalEnemyHealth = new Signal(10);
 * console.info(`Enemy health starting at ${signalEnemyHealth.get()}`);
 * 
 * export function attack() {
 *   signalEnemyHealth.set(signalEnemyHealth.get() - 1);
 * }
 * 
 * signalEnemyHealth.subscribe(enemyHealth => {
 *   if (enemyHealth <= 0) {
 *     console.info('Enemy killed!');
 *   }
 * });
 * //# COMPLETE-EXAMPLE-START
 * 
 * for (let i = 0; i < 10; i++) {
 *   attack();
 * }
 * //# COMPLETE-EXAMPLE-END
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
 * //# COMPLETE-EXAMPLE-START
 * import {
 *   Signal, useSignals, withLifecycle, html, set,
 * } from '%FRAMEWORK_LOCATION%';
 * 
 * //# COMPLETE-EXAMPLE-END
 * function renderLogo({ src, signalWidth, signalHeight }) {
 *   return html`
 *     <img ${set({
 *       src,
 *       style: useSignals([signalWidth, signalHeight], (width, height) => {
 *         return `width: ${width}px; height: ${height}px`;
 *       })
 *     })}>
 *   `;
 * }
 * //# COMPLETE-EXAMPLE-START
 * 
 * const params = {
 *   src: '%ASSETS%/snap-logo.png',
 *   signalWidth: new Signal(64),
 *   signalHeight: new Signal(64),
 * };
 *
 * document.body.append(withLifecycle(() => renderLogo(params)).value);
 *
 * const randNumb = max => Math.floor(Math.random() * max);
 * setInterval(() => {
 *   params.signalWidth.set(randNumb(128));
 *   params.signalHeight.set(randNumb(128));
 * }, 1000)
 * //# COMPLETE-EXAMPLE-END
 * 
 * @example <caption>Using useSignals() to trigger side-effects</caption>
 * //# COMPLETE-EXAMPLE-START
 * import {
 *   Signal, useSignals, withLifecycle, useCleanup, html, set,
 * } from '%FRAMEWORK_LOCATION%';
 * 
 * //# COMPLETE-EXAMPLE-END
 * function renderBomb({ signalAnimate }) {
 *   const fragment = html`
 *     <img src="%ASSETS%/bomb.svg" style="visibility: visible">
 *   `;
 *   const bombEl = fragment.querySelector('img');
 * 
 *   let intervalId = undefined;
 *   useSignals([signalAnimate], animate => {
 *     if (animate) {
 *       intervalId = setInterval(() => {
 *         bombEl.style.visibility = (
 *           bombEl.style.visibility === 'visible' ? 'hidden' : 'visible'
 *         );
 *       }, 250);
 *     } else if (intervalId !== undefined) {
 *       clearInterval(intervalId);
 *       intervalId = undefined;
 *       bombEl.style.visibility = 'visible';
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
 *   return fragment;
 * }
 * //# COMPLETE-EXAMPLE-START
 * 
 * function renderExample() {
 *   const signalAnimate = new Signal(false);
 *   return html`
 *     ${renderBomb({ signalAnimate })}
 *     <button ${set({
 *       onclick: () => signalAnimate.set(!signalAnimate.get()),
 *     })}>
 *       Toggle Animation
 *     </button>
 *   `;
 * }
 * 
 * const renderedResult = withLifecycle(renderExample);
 * document.body.append(renderedResult.value);
 * 
 * // Provide a button to self-destruct the content,
 * // mostly as a way to demonstrate that the cleanup hook works.
 * const selfDestructFragment = html`<button>Self Destruct!</button>`;
 * const selfDestructEl = selfDestructFragment.querySelector('button');
 * selfDestructEl.addEventListener('click', () => {
 *   renderedResult.uninit();
 *   document.body.innerHTML = '';
 * });
 * document.body.append(selfDestructFragment);
 * //# COMPLETE-EXAMPLE-END
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
 * Data is provided via the `.provide()` function, and later retrieved via
 * `.get()`.
 * 
 * This is a stand-alone class that isn't dependent on anything else, which
 * means you can copy-paste it into any project and use it as-is, without
 * copying the whole Snap Framework.
 * 
 * @example
 * //# COMPLETE-EXAMPLE-START
 * import { Context, withLifecycle, html, set } from '%FRAMEWORK_LOCATION%';
 * 
 * //# COMPLETE-EXAMPLE-END
 * const theme = new Context();
 * 
 * function renderApp() {
 *   const themeOpts = { mainColor: 'lightblue' };
 *   // The themeOpts object will be available to everyone while
 *   // the callback given to theme.provide() is running.
 *   return theme.provide(themeOpts, () => {
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
 * //# COMPLETE-EXAMPLE-START
 * 
 * document.body.append(withLifecycle(renderApp).value);
 * //# COMPLETE-EXAMPLE-END
 *
 * //# COLLAPSE-EXAMPLES
 * @example <caption>Nesting calls to .provide()</caption>
 * //# COMPLETE-EXAMPLE-START
 * import { Context } from '%FRAMEWORK_LOCATION%';
 * 
 * //# COMPLETE-EXAMPLE-END
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
 *   }
 *   console.info('Result:', x + y);
 * }
 */
export class Context {
  #stack = [];

  /**
   * Calls `callback` and provide `value` to it for the duration of the
   * callback. Whatever the callback returns will be returned by this function.
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
 * //# COMPLETE-EXAMPLE-START
 * import { defineElement, withLifecycle, html, set } from '%FRAMEWORK_LOCATION%';
 * 
 * //# COMPLETE-EXAMPLE-END
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
 * //# COMPLETE-EXAMPLE-START
 * 
 * const renderExampleApp = () => new ExampleApp({ text: 'Example Text' });
 * document.body.append(withLifecycle(renderExampleApp).value);
 * document.body.append(html`<p>This is not affected by the CSS</p>`);
 * //# COMPLETE-EXAMPLE-END
 * 
 * @example <caption>Using slots to create container-like custom elements.</caption>
 * //# COMPLETE-EXAMPLE-START
 * import { defineElement, withLifecycle, html } from '%FRAMEWORK_LOCATION%';
 * 
 * //# COMPLETE-EXAMPLE-END
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
 *         font-style: italic;
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
 * //# COMPLETE-EXAMPLE-START
 * 
 * document.body.append(withLifecycle(() => new ExampleApp()).value);
 * //# COMPLETE-EXAMPLE-END
 * 
 * //# COLLAPSE-EXAMPLES
 * @example <caption>Using multiple slots</caption>
 * //# COMPLETE-EXAMPLE-START
 * import { defineElement, withLifecycle, html } from '%FRAMEWORK_LOCATION%';
 * 
 * //# COMPLETE-EXAMPLE-END
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
 *         font-style: italic;
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
 *     <div style="background: pink">
 *       <slot name="child2"/>
 *     </div>
 *   `;
 * });
 * //# COMPLETE-EXAMPLE-START
 * 
 * document.body.append(withLifecycle(() => new ExampleApp()).value);
 * //# COMPLETE-EXAMPLE-END
 * 
 * @example <caption>Attaching properties to the "api" field.</caption>
 * //# COMPLETE-EXAMPLE-START
 * import { defineElement, withLifecycle, html, set } from '%FRAMEWORK_LOCATION%';
 * 
 * //# COMPLETE-EXAMPLE-END
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
 * const profileInfo = {
 *   name: 'Cookie Monster',
 *   address: 'sesame street',
 *   src: '%ASSETS%/profile.svg',
 * };
 * 
 * const profileEl = withLifecycle(() => new ProfileCard(profileInfo)).value;
 * 
 * document.body.append(profileEl);
 * 
 * // Logs out the dimensions of the text portion of the profile card.
 * console.log(profileEl.api.getSizeOfText());
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
 * //# COMPLETE-EXAMPLE-START
 * import { withLifecycle, useCleanup, html } from '%FRAMEWORK_LOCATION%';
 * 
 * //# COMPLETE-EXAMPLE-END
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
 * //# COMPLETE-EXAMPLE-START
 *
 * function renderAppContent() {
 *   useCleanup(() => {
 *     // It's possible to register cleanup hooks,
 *     // but under this current setup, they won't be
 *     // called, because it never uninitializes.
 *   });
 *
 *   return html`<p>Dummy app content</p>`;
 * }
 * //# COMPLETE-EXAMPLE-END
 * 
 * // Only grabbing the .el property and ignoring the uninit property
 * // because we don't need it.
 * const el = withLifecycle(renderApp).value;
 * document.body.append(el);
 * 
 * //# COLLAPSE-EXAMPLES
 * @example <caption>Rendering an element that may be removed in the future</caption>
 * //# COMPLETE-EXAMPLE-START
 * import { withLifecycle, useCleanup, html } from '%FRAMEWORK_LOCATION%';
 * 
 * document.body.append(html`
 *   <button ${el => el.id = 'toggle-widget'}>Toggle Widget</button>
 *   <div ${el => el.id = 'widget-container'}></div>
 * `);
 * 
 * //# COMPLETE-EXAMPLE-END
 * function renderWidget() {
 *   useCleanup(() => {
 *     console.log('This will be called as the component is being cleaned up.');
 *   });
 * 
 *   const fragment = html`
 *     <p style="background: pink">This widget can be added or removed!</p>
 *   `;
 * 
 *   const el = fragment.querySelector('p');
 *   const intervalId = setInterval(() => {
 *     el.style.background = el.style.background === 'pink' ? 'yellow' : 'pink';
 *   }, 1000);
 * 
 *   // The useCleanup() hook will be called when the uninit()
 *   // function returned by withLifecycle() is called.
 *   useCleanup(() => clearInterval(intervalId));
 * 
 *   return fragment;
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
 * //# COMPLETE-EXAMPLE-START
 * import { Signal, withLifecycle, useCleanup, html, set } from '%FRAMEWORK_LOCATION%';
 * 
 * //# COMPLETE-EXAMPLE-END
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
 * //# COMPLETE-EXAMPLE-START
 * 
 * const renderExample = () => renderTimer({ initialValue: 5 });
 * const { value: el, uninit } = withLifecycle(renderExample);
 * document.body.append(el);
 * document.body.append(html`<button class="stop-timer">Stop Timer</button>`);
 * document.querySelector('.stop-timer').addEventListener('click', () => {
 *   uninit();
 *   document.body.innerHTML = '';
 * });
 * //# COMPLETE-EXAMPLE-END
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
 * //# COMPLETE-EXAMPLE-START
 * import { withLifecycle, html } from '%FRAMEWORK_LOCATION%';
 * 
 * //# COMPLETE-EXAMPLE-END
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
 * //# COMPLETE-EXAMPLE-START
 * 
 * document.body.append(withLifecycle(renderApp).value);
 * //# COMPLETE-EXAMPLE-END
 * 
 * @example <caption>Interpolating a callback</caption>
 * //# COMPLETE-EXAMPLE-START
 * import { html } from '%FRAMEWORK_LOCATION%';
 * 
 * //# COMPLETE-EXAMPLE-END
 * let color = 'red';
 * document.body.append(html`
 *   <main>
 *     <p style="color: red" ${el => {
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
 * //# COMPLETE-EXAMPLE-START
 * import { withLifecycle, html, set } from '%FRAMEWORK_LOCATION%';
 * 
 * function renderBadExample() {
 * //# COMPLETE-EXAMPLE-END
 *   // Wrong - may cause issues if you
 *   // interpolate a callback into this element.
 * //# COMPLETE-EXAMPLE-START
 *   //
 *   // Technically nothing bad will happen in this specific case, but it's
 *   // simpler to treat this as a general hard-and-fast rule instead of
 *   // trying to learn what the exceptions are.
 * //# COMPLETE-EXAMPLE-END
 *   return html`
 *     <p id="bad-example-id">
 *       Bad Example!
 *     </p>
 *   `;
 * //# COMPLETE-EXAMPLE-START
 * };
 * //# COMPLETE-EXAMPLE-END
 *
 * //# COMPLETE-EXAMPLE-START
 * function renderGoodExample1() {
 * //# COMPLETE-EXAMPLE-END
 *   // Correct
 *   return html`
 *     <p ${el => { el.id = 'good-example-1-id' }}>
 *       Good Example 1!
 *     </p>
 *   `;
 * //# COMPLETE-EXAMPLE-START
 * }
 * //# COMPLETE-EXAMPLE-END
 *
 * //# COMPLETE-EXAMPLE-START
 * function renderGoodExample2() {
 * //# COMPLETE-EXAMPLE-END
 *   // Also correct
 *   return html`
 *     <p ${set({ id: 'good-example-2-id' })}>
 *       Good Example 2!
 *     </p>
 *   `;
 * //# COMPLETE-EXAMPLE-START
 * }
 * 
 * withLifecycle(() => {
 *   document.body.append(renderBadExample());
 *   document.body.append(renderGoodExample1());
 *   document.body.append(renderGoodExample2());
 * });
 * //# COMPLETE-EXAMPLE-END
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
  templateEl.innerHTML = htmlString.trim();

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
 * //# COMPLETE-EXAMPLE-START
 * import { Signal, withLifecycle, html, set } from '%FRAMEWORK_LOCATION%';
 * 
 * //# COMPLETE-EXAMPLE-END
 * function renderButton({ text, signalDisabled, onClick }) {
 *   return html`
 *     <button ${set({
 *       // The text of the button tag will be set to the
 *       // value of the text argument.
 *       textContent: text,
 *       // The disable property will be set to this signal's current value.
 *       // If the signal's value changes, the button's disable status will
 *       // change as well.
 *       disabled: signalDisabled,
 *       // You can easily attach event handlers as well, since those are
 *       // just properties on the element
 *       onclick: onClick,
 *     })}></button>
 *   `;
 * }
 * //# COMPLETE-EXAMPLE-START
 * 
 * const signalDisabled = new Signal(false);
 * setInterval(() => {
 *   signalDisabled.set(!signalDisabled.get());
 * }, 1000);
 * 
 * const renderExample = () => renderButton({
 *   text: 'Push Me!',
 *   signalDisabled,
 *   onClick: () => console.log('I got clicked!'),
 * });
 * document.body.append(withLifecycle(renderExample).value);
 * //# COMPLETE-EXAMPLE-END
 * 
 * @example <caption>using set() on your own components</caption>
 * //# COMPLETE-EXAMPLE-START
 * import { withLifecycle, html, set } from '%FRAMEWORK_LOCATION%';
 * 
 * //# COMPLETE-EXAMPLE-END
 * function renderApp() {
 *   // This example shows how you would use set() to adjust properties from
 *   // an element created by another component. In this case, we are
 *   // calling renderHeader(), receiving a reference to a header component,
 *   // then attaching a style property to it to give it some margin.
 *   return html`
 *     ${set({
 *       style: 'margin: 20px 40px',
 *     })(renderHeader())}
 *     <p>App Body</p>
 *   `;
 * }
 * 
 * function renderHeader() {
 *   // The html template tag returns a fragment.
 *   // Fragments can't be styled, but elements can,
 *   // so we're grabbing the first element in the fragment,
 *   // (the h1 tag), and returning that.
 *   return html`<h1>My Awesome App!</h1>`.firstElementChild;
 * }
 * //# COMPLETE-EXAMPLE-START
 * 
 * document.body.append(withLifecycle(renderApp).value);
 * //# COMPLETE-EXAMPLE-END
 * 
 * //# COLLAPSE-EXAMPLES
 * @example <caption>Using the getRef parameter</caption>
 * //# COMPLETE-EXAMPLE-START
 * import { withLifecycle, html, set } from '%FRAMEWORK_LOCATION%';
 * 
 * //# COMPLETE-EXAMPLE-END
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
 * //# COMPLETE-EXAMPLE-START
 * 
 * const renderExample = () => renderHeader('Example App');
 * document.body.append(withLifecycle(renderExample).value);
 * //# COMPLETE-EXAMPLE-END
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
 * //# COMPLETE-EXAMPLE-START
 * import { Signal, useSignals, withLifecycle, html, set, renderEach } from '%FRAMEWORK_LOCATION%';
 * 
 * function renderApp() {
 *   const signalTodos = new Signal([]);
 *   return html`
 *     ${renderTodoItems(signalTodos)}
 *     <button ${set({
 *       onclick: () => {
 *         const randomItemNumb = Math.floor(Math.random() * 100_000);
 *         signalTodos.set([
 *           ...signalTodos.get(),
 *           { id: randomItemNumb, value: `Todo Item #${randomItemNumb}` },
 *         ]);
 *       },
 *     })}>
 *       Add random item
 *     </button>
 *   `;
 * }
 * 
 * //# COMPLETE-EXAMPLE-END
 * function renderTodoItems(signalTodos) {
 *   return html`
 *     <div class="todo-list">
 *       ${renderEach(
 *         // Derive a new signal from signalTodos.
 *         // This new signal will use the todo item's id as the key.
 *         useSignals([signalTodos], todos => {
 *           return todos.map(todo => [todo.id, todo]);
 *         }),
 *         (todo, todoId) => renderTodoItem({ todo, signalTodos }),
 *       )}
 *     </div>
 *   `;
 * }
 * //# COMPLETE-EXAMPLE-START
 * 
 * function renderTodoItem({ todo, signalTodos }) {
 *   return html`
 *     <div style="display: flex; gap: 5px">
 *       <p ${set({ textContent: todo.value })}></p>
 *       <button ${set({
 *         onclick: () => {
 *           const filteredTodos = signalTodos.get()
 *             .filter(({ id }) => id !== todo.id);
 *
 *           signalTodos.set([todo, ...filteredTodos]);
 *         },
 *       })}>Move to top</button>
 *       <button ${set({
 *         onclick: () => {
 *           signalTodos.set(
 *             signalTodos.get().filter(({ id }) => id !== todo.id)
 *           );
 *         },
 *       })}>Remove</button>
 *     </div>
 *   `;
 * }
 * 
 * document.body.append(withLifecycle(renderApp).value);
 * //# COMPLETE-EXAMPLE-END
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
 * @param conditions A list of objects. Each object should have two properties.
 *   1. `signalWhen`, which holds a signal containing a boolean which decides
 *   if this element should render or not, and 2. `render()`, which should
 *   return an element to render.
 * 
 * @example
 * //# COMPLETE-EXAMPLE-START
 * import { Signal, withLifecycle, html, renderChoice } from '%FRAMEWORK_LOCATION%';
 *
 * // This signal will be set to true when
 * // the container size is smaller than 300px
 * const signalIsMobileView = new Signal(false);
 * const mobileMedia = matchMedia(`(max-width: 300px)`)
 * mobileMedia.addEventListener('change', event => {
 *   signalIsMobileView.set(event.matches)
 * })
 * signalIsMobileView.set(mobileMedia.matches)
 * 
 * // This signal will be set to true when
 * // the container size is smaller than 500px
 * const signalIsTabletView = new Signal(false);
 * const tabletMedia = matchMedia(`(max-width: 500px)`)
 * tabletMedia.addEventListener('change', event => {
 *   signalIsTabletView.set(event.matches)
 * })
 * signalIsTabletView.set(tabletMedia.matches)
 * 
 * //# COMPLETE-EXAMPLE-END
 * function renderContent() {
 *   return html`
 *     ${renderChoice([
 *       {
 *         signalWhen: signalIsMobileView,
 *         render: () => renderMobileViewContent(),
 *       },
 *       {
 *         signalWhen: signalIsTabletView,
 *         render: () => renderTabletViewContent(),
 *       },
 *       {
 *         // This signal is always true, making this branch act like an
 *         // "else" - it will render if the above two conditions are false.
 *         signalWhen: new Signal(true),
 *         render: () => renderDesktopViewContent(),
 *       },
 *     ])}
 *   `;
 * }
 * //# COMPLETE-EXAMPLE-START
 * function renderDesktopViewContent() {
 *   return html`<p>Desktop View</p>`;
 * }
 *
 * function renderTabletViewContent() {
 *   return html`<p>Tablet View</p>`;
 * }
 *
 * function renderMobileViewContent() {
 *   return html`<p>Mobile View</p>`;
 * }
 * 
 * document.body.append(withLifecycle(renderContent).value);
 * //# COMPLETE-EXAMPLE-END
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
 * //# COMPLETE-EXAMPLE-START
 * import { Signal, withLifecycle, html, set, renderIf } from '%FRAMEWORK_LOCATION%';
 * 
 * //# COMPLETE-EXAMPLE-END
 * function renderProfile(user) {
 *   return html`
 *     <p ${set({ textContent: user.name })}></p>
 *     ${renderIf(user.signalDateOfBirth, () => html`
 *       <p ${set({ textContent: user.signalDateOfBirth })}></p>
 *     `)}
 *   `;
 * }
 * 
 * //# COMPLETE-EXAMPLE-START
 * 
 * const profile = {
 *   name: 'Cookie Monster',
 *   signalDateOfBirth: new Signal(undefined),
 * };
 * 
 * setTimeout(() => {
 *   profile.signalDateOfBirth.set('1/1/1966');
 * }, 2000);
 * 
 * document.body.append(withLifecycle(() => renderProfile(profile)).value);
 * //# COMPLETE-EXAMPLE-END
 */
export function renderIf(signalWhen, render) {
  return renderChoice([{ signalWhen, render }]);
}
