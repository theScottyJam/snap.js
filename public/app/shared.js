import { Signal, useCleanup } from './snapFramework.js';
import { assert } from './util.js';

// Extracting variables and dependencies that are provided by index.html
export const Prism = globalThis.Prism;

export function parentPage(route) {
  return route.split('/').slice(0, -1).join('/');
}

/** May return null if the route is invalid or not related to a utility page. */
export function extractUtilityPageTypeFromRoute(route) {
  if (route.startsWith('utils')) {
    return 'utils';
  } else if (route.startsWith('nolodash')) {
    return 'nolodash';
  } else {
    return null;
  }
}

/**
 * May return null if there was no matching entry found.
 * If a content entry is returned, it will have an additional
 * "hidden" property, indicating if the entry is intended
 * to be unlisted.
 */
export function lookupContentEntryFromRoute(content, route) {
  const utilityPageType = extractUtilityPageTypeFromRoute(route);

  if (utilityPageType === null) {
    return null;
  }

  for (const category of content[utilityPageType]) {
    for (const entry of category.entries) {
      if ([utilityPageType, entry.name].join('/') === route) {
        return { ...entry, hidden: category.hidden };
      }
    }
  }

  return null;
}

// ========================================================================== //
// Snap.js helpers                                                            //
// ========================================================================== //

/**
 * Maps CSS classes to booleans, or to boolean signals.
 * When true, the returned signal will include it as part of the list of classes it provides.
 * 
 * The optional second argument is a list of signals holding class names.
 */
export function classNameBuilder(classToBool, listOfSignalClasses = []) {
  let activeClasses = new Set();
  const signalActiveClasses = new Signal('');

  for (const [singleClass, isActive] of Object.entries(classToBool)) {
    if (typeof isActive === 'boolean') {
      if (isActive) {
        activeClasses.add(singleClass);
      }
    } else {
      const signalIsActive = isActive;
      let initializing = true;
      signalIsActive.use(isActive => {
        if (isActive) {
          activeClasses.add(singleClass);
        } else {
          activeClasses.delete(singleClass);
        }
        if (!initializing) {
          signalActiveClasses.set([...activeClasses].join(' '));
        }
      });
      initializing = false;
    }
  }

  for (const signalClass of listOfSignalClasses) {
    let previousValue = undefined;
    signalClass.use(className => {
      if (previousValue !== undefined) {
        activeClasses.delete(previousValue);
      }
      activeClasses.add(className);
      if (previousValue !== undefined) {
        signalActiveClasses.set([...activeClasses].join(' '));
      }
      previousValue = className;
    });
  }

  signalActiveClasses.set([...activeClasses].join(' '));
  return signalActiveClasses;
}

// It's not the best way to implement this kind of behavior, because places in code that do `instanceof Signal`
// might wrongly assume that all signal methods are available to be used, when in reality, update-related methods
// would throw an error. but it'll do for our purposes.
/**
 * Creates a signal that can't be modified directly.
 */
export function useProtectedSignal(initialValue = undefined) {
  const signal = new Signal(initialValue);

  let allowSet = false;
  const updateSignal = value => {
    allowSet = true;
    try {
      signal.set(value);
    } finally {
      allowSet = false;
    }
  };

  allowSet = true;
  signal.use(() => {
    assert(allowSet, 'Attempted to update a read-only signal');
  });
  allowSet = false;

  return [signal, updateSignal];
}

const PHASES = {
  initEntering: { name: 'init-entering', direction: 'enter' },
  entering: { name: 'entering', direction: 'enter' },
  entered: { name: 'entered', direction: 'enter' },
  exiting: { name: 'exiting', direction: 'exit' },
  exited: { name: 'exited', direction: 'exit' },
};

export function useCssTransition(signalActive) {
  const signalPhase = new Signal(signalActive.get() ? PHASES.entered : PHASES.exited)

  let timeoutId;
  signalPhase.use(phase => {
    if (phase.name !== 'init-entering') return;
    if (timeoutId !== undefined) clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      const phase = signalPhase.get();
      signalPhase.set(phase.name === 'init-entering' ? PHASES.entering : phase);
    });
  })

  useCleanup(() => {
    clearTimeout(timeoutId);
  });

  signalActive.use(active => {
    if (active && signalPhase.get().direction === 'exit') {
      signalPhase.set(PHASES.initEntering);
    }
    if (!active && signalPhase.get().direction === 'enter') {
      signalPhase.set(PHASES.exiting);
    }
  });

  const endTransition = () => {
    if (signalPhase.get().direction === 'enter') signalPhase.set(PHASES.entered);
    if (signalPhase.get().direction === 'exit') signalPhase.set(PHASES.exited);
  };

  return [signalPhase, endTransition];
}

// When signalFreezeIf is false, the passed-in value will be captured.
// When signalFreezeIf is true, the captured value will be returned instead of the current one.
export function useCapturedValue(signalValue, { signalFreezeIf }) {
  let capturedValue = signalValue.get();
  return Signal.use([signalValue, signalFreezeIf], (value, freezeIf) => {
    if (!freezeIf) {
      capturedValue = value;
      return value;
    } else {
      return capturedValue;
    }
  });
}

export function promiseToSignal(promise, { loadingValue }) {
  const signal = new Signal(loadingValue);
  promise.then(value => signal.set(value));
  return signal;
}

/**
 * Should be used instead of snap-framework's defineElement().
 * This will automatically inject shared styles into all elements,
 * and will add custom styles in a more performant fashion.
 */
export function defineStyledElement(name, getStyleStr, init) {
  const customStyleSheet = new CSSStyleSheet();
  customStyleSheet.replaceSync(typeof getStyleStr === 'string' ? getStyleStr : getStyleStr());

  return class CustomElement extends HTMLElement {
    // A dedicated spot where init() can put public fields if wanted
    // without worrying about it conflicting with any built-in APIs.
    api = {};

    constructor(...params) {
      super();
      const shadowRoot = this.attachShadow({ mode: 'closed' });
      shadowRoot.adoptedStyleSheets.push(sharedStyleSheet);
      shadowRoot.adoptedStyleSheets.push(customStyleSheet);
      shadowRoot.append(init.call(this, ...params));
    }

    static {
      const randomId = String(Math.random()).slice(2, 10);
      customElements.define(`${name.toLowerCase()}-${randomId}`, CustomElement);
    }
  };
}

/** Allows you to apply the font rules to anything, not just headers. */
export const headerStyleMixinRules = `
  font-family: 'Questrial', sans-serif;
  letter-spacing: 0.05em;
`;

const sharedStyleSheet = new CSSStyleSheet();
sharedStyleSheet.replaceSync(`
:host, fieldset, label {
  font-family: 'Fira Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  line-height: 1.25em;
}

h1, h2, h3, h4, h5 {
  ${headerStyleMixinRules}
}

pre, code {
  font-family: 'Roboto Mono', monospace;
}
`);
