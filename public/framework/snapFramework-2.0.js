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
//   NORMAL-VIEW-ONLY-START/NORMAL-VIEW-ONLY-END: The lines inside this boundary
//     will only be rendered in the normal view, not the fully documented or
//     minified view.
//     Can only be started from outside of js-docs. js-docs may be included
//     inside of it - such docs will only be displayed in the code, they
//     won't be converted to nice-looking docs on the side.
//   AUTO-OPEN: For debugging purposes - place this on an example to cause it
//     to be auto-opened, making it easier to develop the example.

// Strive to keep the maximum line width to 80 characters - it needs to be easy
// to read on half a screen on the webpage. The first couple of lines of a
// "condensed" example should be slightly shorter than 80 characters to make
// room for the floating play button that shows up in the top-right corner of
// examples in the UI. (Once you've expanded the example, there will be more
// room, allowing for a little more than 80 characters)

//# START
//# NORMAL-VIEW-ONLY-START
// Read the docs: https://thescottyjam.github.io/snap.js/#!/framework/release/2.0
//# NORMAL-VIEW-ONLY-END

// ==================== Lifecycle ====================

/**
 * Internal tool that allows functions higher-up in the call stack to implicitly
 * provide data to those deeper into the callstack.
 */
class Context {
  #stack = [];

  /**
   * Calls `callback` and provides `value` to it for the duration of the
   * callback.
   *
   * Whatever the callback returns will be returned by this function.
   */
  provide(value, callback) {
    this.#stack.push(value);
    try {
      return callback();
    } finally {
      this.#stack.pop();
    }
  }

  /**
   * Retrieves the value provided to this context object via `.provide()`.
   *
   * Returns undefined if {@link get} was called outside of a {@link provide}
   * callback.
   */
  get() {
    return this.#stack.at(-1);
  }
}

const onUninitContext = new Context();

/**
 * Use this to bootstrap a root component. This is what allows your components
 * to use hooks such as {@link useCleanup}.
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
 * // Hooks such as useCleanup() are available to this component and
 * // descendent components it renders (such as `renderAppContent()`) because it
 * // was rendered via withLifecycle().
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
//# NORMAL-VIEW-ONLY-START
/**
 * Components and hooks should be used during a {@link withLifecycle} callback
 * to receive the capability of registering cleanup handlers. You can manually
 * trigger the cleanup handlers with the returned uninit() function.
 */
//# NORMAL-VIEW-ONLY-END
export function withLifecycle(callback) {
  let uninitializeListeners = [];
  const registerUninitListener = fn => uninitializeListeners.push(fn);
  const value = onUninitContext.provide(registerUninitListener, callback);

  const uninit = () => {
    for (const listener of uninitializeListeners) {
      listener();
    }

    uninitializeListeners = [];
  };

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
//# NORMAL-VIEW-ONLY-START
/**
 * Register a cleanup handler that gets called before your component is removed
 * from the DOM.
 */
//# NORMAL-VIEW-ONLY-END
export function useCleanup(listener) {
  const registerUninitListener = onUninitContext.get();
  if (registerUninitListener === undefined) {
    throw new Error(
      'useCleanup() must be called during the execution ' +
      'of a withLifecycle() callback.'
    );
  }
  registerUninitListener(listener);
}

// ==================== Reactivity ====================

/**
 * An event emitter with state. You can provide an initial state to it when
 * constructing it, then `.get()` or `.set()` that piece of state at any
 * point in time.
 * 
 * Others can listen for state changes via `Signal.use()`, which is a hook that
 * allows you to subscribe to multiple signals at once. Because it's a hook,
 * it's capable of automatically cleaning up after itself when your component
 * unmounts, allowing itself to be garbage collected. Any {@link useCleanup}
 * calls done from within the callback will be executed each time the callback
 * is re-ran, allowing the previous execution to clean itself up.
 * 
 * `Signal.use()` takes a list of signals to watch and an `onChange` callback
 * that fires as soon as it is registered, and whenever any of the watched
 * signals are updated. The callback receives, as a parameter, the current
 * values of all of the watched signals.
 * 
 * `Signal.use()` returns a new, derived signal that holds the last value that
 * the `onChange` callback returned. Each time the callback returns a different
 * value, the returned signal will be updated. You may choose to ignore this
 * return value and simply use `Signal.use()` as a way to trigger side effects
 * whenever a signal changes.
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
 * @example <caption>Using Signal.use() to derive a new signal</caption>
 * //# COMPLETE-EXAMPLE-START
 * import {
 *   Signal, withLifecycle, html, set,
 * } from '%FRAMEWORK_LOCATION%';
 * 
 * //# COMPLETE-EXAMPLE-END
 * function renderLogo({ src, signalWidth, signalHeight }) {
 *   return html`
 *     <img ${set({
 *       src,
 *       style: Signal.use([signalWidth, signalHeight], (width, height) => {
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
 * @example <caption>Using Signal.use() to trigger side-effects</caption>
 * //# COMPLETE-EXAMPLE-START
 * import {
 *   Signal, withLifecycle, useCleanup, html, set,
 * } from '%FRAMEWORK_LOCATION%';
 * 
 * //# COMPLETE-EXAMPLE-END
 * function renderBomb({ signalAnimate }) {
 *   const fragment = html`
 *     <img src="%ASSETS%/bomb.svg" style="visibility: visible"/>
 *   `;
 *   const bombEl = fragment.querySelector('img');
 * 
 *   let intervalId = undefined;
 *   Signal.use([signalAnimate], animate => {
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
//# NORMAL-VIEW-ONLY-START
/** A signal holds state and emits an event whenever that state is updated. */
//# NORMAL-VIEW-ONLY-END
export class Signal {
  #value;
  /** Signals that should be notified when this signal is updated. */
  #signalsListening = new Set();
  /**
   * How this signal should recompute its value
   * if other signals it depends upon are updated.
   */
  #recompute = () => {};

  /**
   * Creates a new signal with an optional initial value. If an initial value is
   * not provided, The signal's value will be initialized as `undefined`.
   */
  constructor(value = undefined) {
    this.#value = value;
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
    const deeplyGetListeningSignals = signal => {
      const result = [];
      for (const iterSignal of signal.#signalsListening) {
        result.push(iterSignal, ...deeplyGetListeningSignals(iterSignal));
      }
    };

    // Which signals have we processed so far?
    const signalsVisited = new Set();
    // Of the signals we've processed, which ones
    // didn't change or need to be changed?
    const unchangedVisitedSignals = new Set();

    // This loop will figure out a good order to update signals, then update
    // them all. During the update process, new signals could be introduced that
    // will also need to be updated, so the loop will start again. It will keep
    // looping until it things become stable.
    while (true) {
      // Go through all signals that will be effected by this change and
      // built this map that maps a signal to a list of "parent" signals that
      // need to be updated first.
      const signalToParents = new Map();
      {
        const processingStack = [{ signal: this, parent: undefined }];
        while (processingStack.length > 0) {
          const { signal, parent } = processingStack.pop();
          if (!signalToParents.has(signal)) {
            signalToParents.set(signal, parent !== undefined ? [parent] : []);
            const toProcess = [...signal.#signalsListening]
              .map(listener => ({ signal: listener, parent: signal }));
            processingStack.push(...toProcess)
          } else {
            console.assert(parent !== undefined);
            signalToParents.get(signal).push(parent);
          }
        }
      }

      // Figure out which order to update the signals,
      // so all "parent signals" update first.
      const orderToUpdate = [];
      {
        const unseenSignals = new Set(signalToParents.keys());
        const processingStack = [this];
        let onHold = [];
        while (processingStack.length > 0) {
          const signal = processingStack.pop();

          if (!unseenSignals.has(signal)) {
            // This signal has already been processed - it's a duplicate.
            continue;
          }

          const hasUnreadyListeners = signalToParents.get(signal)
            .some(listener => unseenSignals.has(listener));
          if (hasUnreadyListeners) {
            // Come back to this signal later - not all of
            // its parent have ran yet.
            onHold.unshift(signal);
          } else {
            if (!signalsVisited.has(signal)) {
              orderToUpdate.push(signal);
            }
            unseenSignals.delete(signal);
            // Reversing the set's content. The set will preserve insertion
            // order, and we want the signals to execute roughly according to
            // insertion order.
            processingStack.push(...[...signal.#signalsListening].toReversed());

            // Now that we've successfully processes a signal, move everything
            // in onHold back onto the processing stack to try them again.
            processingStack.push(...onHold);
            onHold.length = [];
          }
        }
      }

      // We've already visited every signal that needs to be visited.
      // We can stop now.
      if (orderToUpdate.length === 0) {
        break;
      }

      for (const signal of orderToUpdate) {
        const parents = signalToParents.get(signal);
        const allParentsUnchanged = (
          parents.length > 0 &&
          parents.every(parent => unchangedVisitedSignals.has(parent))
        );
        if (allParentsUnchanged) {
          signalsVisited.add(signal);
          unchangedVisitedSignals.add(signal);
          continue;
        }

        const valueBeforeChange = signal.#value;
        if (signal === this) {
          this.#value = newValue;
        } else {
          signal.#recompute();
        }
        signalsVisited.add(signal);
        if (valueBeforeChange === signal.#value) {
          unchangedVisitedSignals.add(signal);
        }
      }
    }
  }

  /**
   * Allows you to subscribe to signals. A derived signal will be returned
   * that holds the last value your callback returned.
   */
  static use(dependentSignals, onChange) {
    const derivedSignal = new Signal(undefined);
    let cleanedUp = false;

    let uninit = () => {};
    derivedSignal.#recompute = () => {
      if (cleanedUp) {
        return;
      }

      uninit();
      const dependencyValues = dependentSignals
        .map(dependentSignal => dependentSignal.#value);
      const onChangeResult = withLifecycle(() => onChange(...dependencyValues));
      derivedSignal.#value = onChangeResult.value;
      uninit = onChangeResult.uninit;
    };
    derivedSignal.#recompute();

    for (const dependentSignal of dependentSignals) {
      dependentSignal.#signalsListening.add(derivedSignal);
    }

    useCleanup(() => {
      uninit();
      for (const dependentSignal of dependentSignals) {
        dependentSignal.#signalsListening.delete(derivedSignal);
      }
      cleanedUp = true;
    });

    return derivedSignal;
  }

  /** A shorthand for {@link Signal.use}. */
  use(onChange) {
    return Signal.use([this], onChange);
  }
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
 * Use the {@link set} helper function to set properties on an element in your
 * template. {@link set} can also be used to dynamically insert text inside of
 * an element, by setting the `textContent` property of that element.
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
 */
//# NORMAL-VIEW-ONLY-START
/**
 * A tagged template used to create HTML fragments.
 * You can interpolate other elements/fragments, or you can interpolate
 * callbacks inside of elements to receive a reference to that element.
 */
//# NORMAL-VIEW-ONLY-END
export function html(strings, ...values) {
  const isFunctionThatIsNotAClass = value => {
    return (
      value !== null &&
      Object.getPrototypeOf(value) === Function.prototype
    );
  };

  const isHtmlNodePermitted = node => {
    return (
      node instanceof HTMLElement ||
      node instanceof DocumentFragment ||
      node instanceof Text
    );
  };

  // Build the HTML string
  let htmlString = strings[0];
  for (const [i, string] of strings.slice(1).entries()) {
    const value = values[i];
    if (isFunctionThatIsNotAClass(value)) {
      htmlString += `data-frameworkref="${i}"`;
    } else if (isHtmlNodePermitted(value)) {
      // Creates a placeholder that'll get replaced with an interpolated value.
      htmlString += (
        `<template data-frameworkref="${i}"></template>`
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
      const el = templateEl.content
        .querySelector(`*[data-frameworkref="${i}"]`);
      delete el.dataset.frameworkref;
      value(el);
    } else if (isHtmlNodePermitted(value)) {
      const placeholderEl = templateEl.content
        .querySelector(`*[data-frameworkref="${i}"]`);
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
 * It's important to note that this sets properties
 * (e.g. `element.id = 'your-id'`), not HTML attributes
 * (e.g. it does not do `element.setAttribute('id', 'your-id')`).
 * As a result, if you want to set the CSS class of an element, you have to use
 * `className` as your key instead of `class`, since that's how the property
 * is named on native HTML elements.
 * 
 * You can update the text inside of an element by setting the `textContent`
 * property on that element.
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
 * @example <caption>setting a CSS class with className</caption>
 * //# COMPLETE-EXAMPLE-START
 * import { withLifecycle, html, set } from '%FRAMEWORK_LOCATION%';
 * 
 * //# COMPLETE-EXAMPLE-END
 * function renderButton({ text, bold }) {
 *   return html`
 *     <button ${
 *       set({
 *         textContent: text,
 *         className: bold ? 'bold' : '',
 *       })
 *     }></button>
 * 
 *     <style>
 *       .bold {
 *         font-weight: bold;
 *       }
 *     </style>
 *   `;
 * }
 * //# COMPLETE-EXAMPLE-START
 * 
 * const renderExample1 = () => renderButton({ text: 'Not Bold', bold: false });
 * document.body.append(withLifecycle(renderExample1).value);
 *
 * const renderExample2 = () => renderButton({ text: 'Bold', bold: true });
 * document.body.append(withLifecycle(renderExample2).value);
 * //# COMPLETE-EXAMPLE-END
 */
//# NORMAL-VIEW-ONLY-START
/**
 * Primarily intended to be used with the html tagged template as a way
 * to dynamically set properties on an element.
 */
//# NORMAL-VIEW-ONLY-END
export const set = (fields, getRef = undefined) => el => {
  for (const [key, maybeSignal] of Object.entries(fields)) {
    const signal = maybeSignal instanceof Signal
      ? maybeSignal
      : new Signal(maybeSignal);

    signal.use(value => { el[key] = value });
  }

  getRef?.(el);
  return el;
}

// ==================== Flow Control ====================

/**
 * This is similar to doing a for loop, but inside of a template.
 * 
 * Given a signal holding an array of entries, the `renderChild()` parameter
 * will render one node per entry in the array. Each entry in the signal's array
 * should be a tuple containing a key-value pair. Every time a new element needs
 * to be rendered, the `initChild()` callback will be called with the
 * entry value as the first parameter, followed by the entry key. `initChild()`
 * should return a new HTML node to be rendered.
 * 
 * The signal's entry keys are used to uniquely identify that particular entry,
 * so if the contents of the array are updated, it can figure out,
 * by comparing keys, if elements need to be moved, destroyed, or created.
 *
 * As long as an entry's key remains the same, the entry's value won't be
 * re-rendered. If you need the value to rerender, make the value into a signal.
 * 
 * @example
 * //# COMPLETE-EXAMPLE-START
 * import { Signal, withLifecycle, html, set, renderEach } from '%FRAMEWORK_LOCATION%';
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
 *     ${renderEach(
 *       // Derive a new signal from signalTodos.
 *       // This new signal will use the todo item's id as the key.
 *       signalTodos.use(todos => {
 *         return todos.map(todo => [todo.id, todo]);
 *       }),
 *       (todo, todoId) => renderTodoItem({ todo, signalTodos }),
 *     )}
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
 * //# COLLAPSE-EXAMPLES
 * @example <caption>Using descendant signals to update list content.</caption>
 * //# COMPLETE-EXAMPLE-START
 * import { Signal, withLifecycle, html, set, renderEach } from '%FRAMEWORK_LOCATION%';
 * 
 * //# COMPLETE-EXAMPLE-END
 * // Holds a list of todo items of the shape
 * // { id: <number>, signalMessage: <signal holding a string> }
 * const signalTodos = new Signal([]);
 * 
 * //# COMPLETE-EXAMPLE-START
 * async function fetchTodos() {
 *   // Generate fake data
 *   const fakeTodos = [];
 *   for (let i = 0; i < 5; i++) {
 *     if (Math.random() > 0.4) {
 *       fakeTodos.push({
 *         id: i,
 *         message: `${Math.random() > 0.5 ? 'Secret' : 'Public'} mission #${i + 1}`
 *       });
 *     }
 *   }
 * 
 *   const shuffle = collection => collection
 *     .map(value => ({ value, order: Math.random() }))
 *     .sort((a, b) => a.order - b.order)
 *     .map(({ value }) => value);
 * 
 *   return shuffle(fakeTodos);
 * }
 * //# COMPLETE-EXAMPLE-END
 * 
 * // Loads an updated todo list and merges the data into signalTodos.
 * // If the updated todo list contains a todo item that we're already aware
 * // of, we'll find the matching todo item from the existing signalTodos,
 * // find its descendant "signalMessage", update that signal, and continue
 * // to use it. This will cause existing nodes in the UI to be updated.
 * // If the updated todo list contains a new todo item, we'll add a
 * // new entry for it in signalTodos and create a new signalMessage for it.
 * async function refreshTodos() {
 *   const newTodos = await fetchTodos();
 *   const oldTodos = signalTodos.get();
 *   signalTodos.set(newTodos.map(todoItem => {
 *     const oldTodo = oldTodos.find(t => t.id === todoItem.id);
 *     const signalMessage = oldTodo?.signalMessage ?? new Signal();
 *     signalMessage.set(todoItem.message);
 *     return { id: todoItem.id, signalMessage };
 *   }));
 * }
 * 
 * //# COMPLETE-EXAMPLE-START
 * refreshTodos();
 * 
 * function renderApp() {
 *   return html`
 *     <button ${set({ onclick: refreshTodos })}>
 *       Refresh
 *     </button>
 *     ${renderTodoItems()}
 *     <p>
 *       Note that a checkbox will stay checked
 *       across a refresh as long as the id stays the same.
 *     </p>
 *   `;
 * }
 * 
 * //# COMPLETE-EXAMPLE-END
 * function renderTodoItems() {
 *   return html`
 *     ${renderEach(
 *       signalTodos.use(todos => {
 *         return todos.map(todo => [todo.id, todo]);
 *       }),
 *       (todo, todoId) => renderTodoItem(todo),
 *     )}
 *   `;
 * }
 * 
 * //# COMPLETE-EXAMPLE-START
 * function renderTodoItem(todo) {
 *   return html`
 *     <label style="display: block">
 *       <input type="checkbox">
 *       <span ${set({ textContent: todo.signalMessage })}></span>
 *     </label>
 *   `;
 * }
 * 
 * document.body.append(withLifecycle(renderApp).value);
 * //# COMPLETE-EXAMPLE-END
 */
//# NORMAL-VIEW-ONLY-START
/**
 * Renders a DOM node for each item in signalEntries's.
 * signalEntries should be a signal holding an array of key-value pairs.
 */
//# NORMAL-VIEW-ONLY-END
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

  signalEntries.use(entries => {
    const updatedFragment = document.createDocumentFragment();
    for (const [key, initParams] of entries) {
      if (!currentlyRenderedLookup.has(key)) {
        // Add a new child
        const markStart = document.createComment('start renderEach child');
        const markEnd = document.createComment('end renderEach child');

        const renderChild = () => initChild(initParams, key);
        const { uninit, value: childNode } = withLifecycle(renderChild);

        updatedFragment.append(markStart, childNode, markEnd);
        currentlyRenderedLookup.set(key, { markStart, markEnd, uninit });
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
 * This will find the first matching condition from a list of conditions and
 * then render the associated element. If no matches are found, nothing will
 * render.
 * 
 * @param conditions A list of objects. Each object should have two properties.
 *   1. `signalWhen`, which holds a signal containing a boolean that decides
 *   if this element should render or not, and 2. `render()`, which should
 *   return an element to render.
 * 
 * @example
 * //# COMPLETE-EXAMPLE-START
 * import { Signal, withLifecycle, html, renderChoice } from '%FRAMEWORK_LOCATION%';
 *
 * // This signal will be set to true when
 * // the container size is smaller than 480px
 * const signalIsMobileView = new Signal(false);
 * const mobileMedia = matchMedia(`(max-width: 480px)`)
 * mobileMedia.addEventListener('change', event => {
 *   signalIsMobileView.set(event.matches)
 * })
 * signalIsMobileView.set(mobileMedia.matches)
 * 
 * // This signal will be set to true when
 * // the container size is smaller than 550px
 * const signalIsTabletView = new Signal(false);
 * const tabletMedia = matchMedia(`(max-width: 550px)`)
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
//# NORMAL-VIEW-ONLY-START
/**
 * Given an array of `{ signalWhen: ..., render: ... }` objects, this will
 * automatically render the first object who's signalWhen property is true.
 */
//# NORMAL-VIEW-ONLY-END
export function renderChoice(conditions) {
  const signalIndexToRender = Signal.use(
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

// ==================== Helpers ====================

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
//# NORMAL-VIEW-ONLY-START
/** Wraps your component in a custom web component to encapsulate your CSS. */
//# NORMAL-VIEW-ONLY-END
export function defineElement(name, init) {
  return class CustomElement extends HTMLElement {
    // A dedicated spot where init() can put public fields if wanted
    // without worrying about it conflicting with any built-in APIs.
    api = {};

    constructor(...params) {
      super();
      const shadowRoot = this.attachShadow({ mode: 'closed' });
      shadowRoot.append(init.call(this, ...params));
    }

    static {
      const randomId = String(Math.random()).slice(2, 10);
      customElements.define(`${name.toLowerCase()}-${randomId}`, CustomElement);
    }
  };
}
