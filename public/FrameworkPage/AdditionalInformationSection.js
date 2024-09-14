/* eslint-disable no-template-curly-in-string */

import { CodeViewer } from "./CodeViewer.js";
import { jumpToInternalLinkTarget, registerInternalLinkTarget } from "./shared.js";
import { headerStyleMixin } from "./sharedStyles.js";
import { defineElement, html, set } from "./snapFramework.js";

export const AdditionalInformationSection = defineElement('AdditionalInformationSection', () => {
  return html`
    <h2>How will you snap this framework in?</h2>

    <p>
      There are many valid routes to go, including:
    </p>
    <ul>
      <li>copy-paste the framework, then never modify it. Add additional functionality as needed through a separate utility file.</li>
      <li>Make it your own. Add, remove, or modify functionality until it fits your app perfectly.</li>
      <li>Only grab what you need. Maybe you only want the signals or the context API - grab just those pieces and leave everything else behind.</li>
    </ul>

    <p>
      If you don't like something about the core framework's API, it is expected that you will go and modify it
      or create your own facade to improve the experience for your use case.
    </p>

    <h2>Usage Tips</h2>

    <p>
      If you are using a custom element and you want to apply some styles to it, you can get the tag name to use within your CSS via <code>customElements.getName(YourComponent)</code>.
    </p>

    ${new CodeViewer([
      'function renderApp() {',
      '  return html`',
      '    <h1>The App</h1>',
      '    ${new AppContent()}',
      '',
      '    <style ${set({ textContent: css })}></style>',
      '  `;',
      '}',
      '',
      "const AppContent = defineElement('AppContent', () => {",
      '  return `<p>App Content</p>`;',
      '});',
      '',
      'const css = `',
      '  ${customElements.getName(AppContent)} {',
      '    position: relative;',
      '    left: 50px;',
      '  }',
      '`;',
    ].join('\n'))}

    <p>
      If you defining a custom element and want to apply styles to the element you're defining, you can use the <code>:host</code> CSS selector. You might, for example, set the <code>display</code> property to something other than the default value of <code>inline</code> in order to allow your custom element to receive paddings/margin styling, among other reasons.
    </p>

    ${new CodeViewer([
      "const AppContent = defineElement('AppContent', () => {",
      '  return `',
      '    <p>App Content</p>',
      '',
      '    <style>',
      '      :host {',
      '        /*',
      '        Setting to "display: block" allows us,',
      '        or others using our element, to set a margin.',
      '        */',
      '        display: block;',
      '        margin-top: 50px;',
      '      }',
      '    </style>',
      '  `;',
      '});',
    ].join('\n'))}

    <h2>Good Practices</h2>

    <p>
      You can do what you want with the framework, it's all yours to hack away at.
      But if you want a few suggestions to keep your code a little more organized, try out the following guidelines:
    </p>

    <ul>
      <li>
        Each module should generally export a single public component that's defined with <code>defineComponent()</code>
        and a number of private, helper components that are defined as regular functions.
      </li>
      <li>
        <code>defineElement()</code> requires you to supply a name for the component. Don't try to get fancy with
        this name, just follow the simple rule of calling it the exact same thing that you name the class that it returns
        (e.g. <code>const Slider = defineElement('Slider', ...)</code>).
      </li>
      <li>
        There are many valid reasons to use the context API, but there are also many ways to abuse it.
        It's possible you won't need to directly use it at all and that's fine.
        It's usually better to explicitly pass data from parent to child, or to use
        <a href='javascript://Jump to "global state management"' ${set({
          onclick: () => jumpToInternalLinkTarget('section:global-state-management')
        })}>
          a global state management strategy
        </a>.
      </li>
    </ul>

    <h2 ${el => {
      registerInternalLinkTarget('section:global-state-management', el);
    }}>
      Global State Management
    </h2>

    <p>
      Many applications benefit from having their state kept outside of their component tree.
      In modern frameworks, this is often accomplished through additional tools (such a Redux, Vuex, etc).
      The Snap Framework supports this kind of state management natively through signals. Because the signal API
      isn't inherently tied to the rest of the framework, they can be used, independently, to manage state outside of the component tree.
    </p>

    <p>
      Here's an example of how one might set up a global store for state management.
    </p>

    ${new CodeViewer([
      "import { Signal } from './snapFramework.js';",
      '',
      '// Symbols are JavaScript primitives that are guaranteed to be unique.',
      '',
      '/** Indicates that the data is currently loading */',
      "export const LOADING = Symbol('loading');",
      '',
      '/** Indicates that the data failed to load */',
      "export const LOAD_FAILED = Symbol('load failed');",
      '',
      'export const state = {',
      '  profile: new Signal(LOADING),',
      '  passwordResetFormFields: {',
      "    password: new Signal(''),",
      "    confirmPassword: new Signal(''),",
      '  },',
      '};',
      '',
      '(async function loadProfile() {',
      '  try {',
      '    state.profile.set(await services.loadProfile());',
      '  } catch (error) {',
      '    state.profile.set(LOAD_FAILED);',
      '    throw error;',
      '  }',
      '})();',
    ].join('\n'))}

    <p>
      You can derive new global-state signals from existing global-state signals in with the help of the <code>useSignals()</code> hook.
    </p>

    ${new CodeViewer([
      "import { Signal, useSignals } from './snapFramework.js';",
      '',
      'function derive(sourceSignals, deriveNewSignal) {',
      '  // useSignals() must run within a life-cycle because it needs to know when to',
      "  // unregister its listeners. Since we're dealing with global state, we won't",
      '  // ever need to unregister the listeners, so we can just call `useSignals()`',
      '  // within `withLifecycle()`, and then never instruct it to clean up',
      '  // by ignoring the uninit function we get back.',
      '  const { value, uninit } = withLifecycle(() => {',
      '    return useSignals(sourceSignals, deriveNewSignal);',
      '  });',
      '  return value;',
      '}',
      '',
      'export const state = {',
      '  formFields: {',
      '    dateOfBirth: new Signal(new Date()),',
      '  },',
      '};',
      '',
      '// -- derived fields -- //',
      '',
      'export const derivedState = {',
      '  age: derive([state.formFields.dateOfBirth], dateOfBirth => {',
      '    // A crude, imprecise age calculator.',
      '    const diff = Date.now() - ageOfBirth.now();',
      '    return Math.floor(diff / 60 / 60 / 24 / 365);',
      '  }),',
      '}',
    ].join('\n'))}

    <h2>Design decision notes</h2>
    
    <details>
      <summary>View</summary>
      
      <p>
        <strong>Q: This framework is uglier than React/Angular/Vue/etc! Why?</strong>
      </p>

      <p>
        "Prettiness" isn't the highest priority. So yes, you may find that some tasks in &lt;insert your favorite framework&gt; is less verbose than the Snap Framework, and that's fine. The priorities of this framework are, in order:
      </p>

      <ol>
        <li>The framework should provide a similar feature-set that modern frameworks provide.</li>
        <li>The framework's code should be small <em>and</em> simple.</li>
        <li>The framework should feel nice to use.</li>
        <li>The framework should be reasonably performant.</li>
      </ol>

      <p>
        There are a number of features and performance improvements that were considered for this framework that ultimately got cut, not because they weren't useful or improved the end-user's experience, but because they added too much complexity or too much code to the overall framework. Some performance improvements were cut as well because they would have had a negligible effect for the majority of users, while adding a fair amount of complexity to the code itself.
      </p>

      <p>
        <strong>Q: Where are the unit tests?</strong>
      </p>

      <p>
        I may publish some at a future point in time depending on the demand. For now, if you want them, you'll either need to write them yourself, or create a GitHub issue to let me know that this is wanted.
      </p>

      <p>
        <strong>Q: How do the hooks provided by this framework compare with React's hooks?</strong>
      </p>

      <p>
        A lot of React's hooks are simply unnecessary in the Snap Framework mostly due to the fact that components in the Snap Framework don't rerender. It's actually quite surprising how much simpler things become when the concept of rerendering is removed. I'll go over the most common React hooks and explain how the equivalent functionality is handled in the Snap framework - for no particular reason aside from the fact that it's an interesting comparison.
      </p>

      <p>
        <strong>useState/useReducer:</strong> In React, <code>useState()</code> will keep track of a piece of state between rerenders. Each time you update a piece of state, it will trigger an entire rerender. <code>useReducer()</code> is very similar to <code>useState()</code>, just with an alternative API that makes it easier to make changes to a deeply nested piece of state. In the Snap Framework, signals are used instead. A signal holds a piece of mutable state, and whoever cares about that piece of state can subscribe to to the signal. This is what eliminates the need to have rerenders, a virtual DOM, and DOM diffing.
      </p>

      <p>
        <strong>useRef:</strong> <code>useRef()</code> allows you to keep state between rerenders without causing a rerender whenever the state is updated. In the Snap Framework, this is just a local variable inside of your component - anyone can read or update that local variable, and it will persist for the lifetime of the component.
      </p>

      <p>
        <strong>useCallback/useMemo:</strong> These are optimization techniques that are used to prevent too much stuff from rerendering whenever a state change happens. React is actually coming out with a new <a href="https://react.dev/learn/react-compiler">React Compiler</a> that will, in part, automatically memoize values for you to take the worry off of you. In the Snap framework, there aren't any rerenders so there's nothing that needs to be optimized in this regard.
      </p>

      <p>
        <strong>useContext:</strong> This is pretty much the same as the Snap Framework's <code>Context</code> <code>get()</code> method. They both give you access to parameters that have been implicitly passed from parent component to child component. Snap Framework's <code>Context</code> class is a little more powerful in that it isn't explicitly tied to components - you can use it to implicitly pass parameters down any function.
      </p>

      <p>
        <strong>useImperativeHandle:</strong> A React component returns an element tree representation, but with <code>useImperativeHandle()</code>, it allows a component to additionally register a custom API of any shape to go along with the element tree. Consumers of the component can get access to that custom API and use the methods/properties provided on it. In the Snap Framework, the same objective is accomplished by creating a custom element (with <code>defineElement()</code>), then attaching whatever methods/properties you want to its <code>.api</code> property. Consumers can create an instance of your custom element, then interact with it through that <code>.api</code> property.
      </p>

      <p>
        <strong>useEffect:</strong> This hook has multiple use-cases rolled into one function. 1. It allows you to react when a component is being mounted. In the Snap framework, your component function itself is basically an on-mount handler - everything you put in there will execute as the component is being set up. 2. It allows you to react when a component is being unmounted. In the Snap Framework, this is provided through the <code>useCleanup()</code> hook. 3. It allows you to react to state changes. In the Snap Framework, this is done via <code>useSignals()</code>.
      </p>

      <p>
        <strong>Q: I don't like hooks, why did you have to include them?</strong>
      </p>

      <p>
        I know there's mixed feelings on hooks. I almost didn't include them - I was really close to stripping out both <code>useCleanup()</code> and the <code>Context</code> class, and instead requiring you to explicitly pass around some <code>onUnmount</code> event emitter that you can subscribe to. It would have made the framework even simpler, and it would have decoupled different parts of the framework (which is a nice bonus - it makes it easier to take pieces of the framework out and use them in isolation). I ultimately broke my priority rules given above and decided against this, mostly because I deemed the verbosity cost to be too high (this change would mean that functions such as <code>set()</code> and <code>useSignals()</code> would both require an additional <code>onUnmount</code> parameter, and I don't think either of those functions can support becoming much more verbose).
      </p>

      <p>
        But you don't have to follow in my footsteps. If you hate the hooks, take them out. Update the framework to suit your needs.
      </p>
    </details>

    <style ${set({ textContent: style })}></style>
  `;
});

const style = `
  ${headerStyleMixin}

  :host {
    display: block;
    max-width: 800px;
    margin: 0 auto;
    margin-bottom: 80px;
    padding-left: 8px;
    padding-right: 8px;
  }

  ${customElements.getName(CodeViewer)} {
    margin-top: 1.5em;
    margin-bottom: 1.5em;
  }
`;
