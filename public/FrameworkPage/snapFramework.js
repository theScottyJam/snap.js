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
//# HIDE-NEXT
// Snap Framework V1.0

// ==================== Reactivity ====================

/**
 * An event emitter with state. You can provide initial state to it when constructing it,
 * then `.get()` or `.set(...)` that piece of state at any point in time.
 * Others can choose to `.subscribe()` to the signal to listen for state changes,
 * and they can also `.unsubscribe()` those same listeners at any point in time.
 * `.subscribe()`/`.unsubscribe()` are considered to be lower-level - typically you would instead
 * use the {@link useSignals} hook which takes care of unsubscribing for you.
 *
 * Variables and properties that hold signals will, by convention, be named with a "$" suffix.
 * If they can hold either a signal or a normal value, you can still use the "$" suffix to indicate that
 * it supports holding a signal.
 * 
 * This is a stand-alone class that isn't dependent on anything else, which means you
 * can copy-paste it into any project and use it as-is if wanted, without copying the whole Snap Framework.
 *
 * @example
 * function renderEchoBox() {
 *   const text$ = new Signal('');
 *   return html`
 *     <input type="text" ${set({ onChange: event => text$.set(event.target.value) })}/>
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
 * TODO (Document: Depends on life-cycle)
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

// ==================== Lifecycle ====================

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

const onUninitContext = new Context();

/**
 * TODO
 */
export function withLifecycle(callback) {
  const uninitialized$ = new Signal(false);
  const value = onUninitContext.provide(uninitialized$, callback);

  const uninit = () => uninitialized$.set(true);
  return { uninit, value };
}

/**
 * TODO
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
 * TODO
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

/**
 * TODO (DOCUMENT: Can I relate this to templating at all? Or should I just move this to a different section)
 * 
 * This is a stand-alone function that isn't dependent on anything else, which means you
 * can copy-paste it into any project and use it as-is if wanted, without copying the whole Snap Framework.
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

// ==================== Flow Control ====================

/**
 * TODO
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
 * TODO
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
 * TODO
 */
export function renderIf(when$, render) {
  return renderChoice([{ when$, render }]);
}
