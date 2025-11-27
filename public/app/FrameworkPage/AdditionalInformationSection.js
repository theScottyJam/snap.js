import { html } from '../snapFramework.js';
import { defineStyledElement } from '../shared.js';
import { CodeViewer } from '../CodeViewer.js';

export const AdditionalInformationSection = defineStyledElement('AdditionalInformationSection', getStyles, () => {
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
      If you defining a custom element and want to apply styles to the element you're defining, you can use the <code>:host</code> CSS selector. You might, for example, set the <code>display</code> property to something other than the default value of <code>inline</code> to allow your custom element to receive paddings/margin styling, among other reasons.
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
    </ul>

    <h2>Global State Management</h2>

    <p>
      Many applications benefit from having their state kept outside of their component tree.
      In modern frameworks, this is often accomplished through additional tools (such as Redux, Vuex, etc).
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
      You can derive new global-state signals from existing global-state signals with the help of the <code>Signal.use()</code> hook.
    </p>

    ${new CodeViewer([
      "import { Signal } from './snapFramework.js';",
      '',
      'function derive(sourceSignals, deriveNewSignal) {',
      '  // Signal.use() must run within a life-cycle because it needs to know when to',
      "  // unregister its listeners. Since we're dealing with global state, we won't",
      '  // ever need to unregister the listeners, so we can just call `Signal.use()`',
      '  // within `withLifecycle()`, and then never instruct it to clean up',
      '  // by ignoring the uninit function we get back.',
      '  const { value, uninit } = withLifecycle(() => {',
      '    return Signal.use(sourceSignals, deriveNewSignal);',
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

    <h2>Design Notes</h2>
    
    <details>
      <summary>View</summary>
      
      <p>
        <strong>Q: This framework is uglier than React/Angular/Vue/etc! Why?</strong>
      </p>

      <p>
        "Prettiness" isn't the highest priority. So yes, you may find that some tasks in &lt;insert your favorite framework&gt; are less verbose than the Snap Framework, and that's fine. The priorities of this framework are, in order:
      </p>

      <ol>
        <li>The framework should provide a similar feature set that modern frameworks provide.</li>
        <li>The framework's code should be small <em>and</em> simple.</li>
        <li>The framework should feel nice to use.</li>
        <li>The framework should be reasonably performant.</li>
      </ol>

      <p>
        Several features and performance improvements that were considered for this framework that ultimately got cut, not because they weren't useful or improved the end-user's experience, but because they added too much complexity or too much code to the overall framework. Some performance improvements were cut as well because they would have had a negligible effect for the majority of users while adding a fair amount of complexity to the code itself.
      </p>

      <p>
        <strong>Q: Where are the unit tests?</strong>
      </p>

      <p>
        I may publish some at a future point in time depending on the demand. For now, if you want them, you'll either need to write them yourself or create a GitHub issue to let me know that this is wanted.
      </p>

      <p>
        <strong>Q: Why doesn't this framework make better use of custom web components?</strong>
      </p>

      <p>
        The original plan was to build this framework around Custom Web Component - every component you make would be a custom web component. I soon found out that web components add a fair amount of complexity with little benefit - here are just some of the issues you will run into if you use them "properly":
      </p>

      <ul>
        <li><strong>Complex lifecycles:</strong> In most frameworks, the lifecycle primarily involves an initialization step and a clean-up step. After your component has been cleaned up, it's never going to be used again. Custom web components are different because they try to mimic how you use native components. Never, at any point in time do you tell a native component "Hey, I'm done using you, you're good to completely clean up". You might detach the native component from the DOM, and it'll temporarily clean itself up at that point, but it has to be prepared for the scenario where you turn around and re-attaching it back into the DOM elsewhere, at which point it has to un-clean itself up and go back to being fully functional again. Doing something as simple as moving an element from one place to another in the DOM will cause it to go through this cleanup-then-uncleanup cycle. Asking users to build on top of web components "properly" means asking them to manage this extra "uncleanup" lifecycle step - which is frankly, unnecessary complexity.</li>
        <li><strong>Attributes vs properties:</strong> A well-built web component is capable of receiving inputs in two different formats - through HTML attributes (e.g. <code>&lt;your-web-component size="3"&gt;&lt;your-web-component&gt;</code>) and properties (e.g. <code>yourWebComponent.size = 3;</code>). These formats are fairly different from each other - attributes will always have string values while properties can contain any JavaScript data, Boolean attributes are intended to be handled by the presence or absence of the attribute (meaning an attribute that's set to the empty string should be considered true), while with properties, you just set it to a normal boolean value, and so on. All of this complexity of being able to support two forms of inputs is, once again, placed on you, the person creating the web components - frameworks can help make some of it easier, but it can't entirely remove the complexity.</li>
        <li><strong>Name collisions:</strong> Custom web components are built off of the concept of inheritance, which means you're going to automatically inherit various attributes and properties that are common to all elements, and if new native attributes are added to the language, you will also inherit those. This makes name collision a very real issue. I ran into it when I was trying to create an input named "title", forgetting that the <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/title">title attribute</a> is already a thing, which caused all sorts of weird bugs. I solved this by prefixing all of my inputs and property names with an "x", which, again, was a burden of ugliness being placed upon me, the user of the framework.</li>
      </ul>

      <p>
        That's a lot of downsides to custom web components, but they do offer one really nice up-side - CSS encapsulation, and I didn't want to go without that. The compromise I eventually came to, was to use custom web components simply as a way to encapsulate CSS, not as the basis for defining all components. The web components produced by the framework would be very unidiomatic, because 1. they wouldn't properly support the "cleanup"/"uncleanup" lifecycle, instead, you had to explicitly tell them when to clean up using the framework's own lifecycle management system, and 2. they wouldn't support attributes or properties - all inputs had to be passed in via the constructor. I wouldn't even give the end-user the luxury of having complete control over the name of their custom element - I tack on a random number to avoid custom element name conflicts.
      </p>

      <p>
        <strong>Q: How do the hooks provided by this framework compare with React's hooks?</strong>
      </p>

      <p>
        A lot of React's hooks are simply unnecessary in the Snap Framework primarily because components in the Snap Framework don't rerender. It is quite surprising how much simpler things become when the concept of rerendering is removed. I'll go over the most common React hooks and explain how the equivalent functionality is handled in the Snap Framework - for no particular reason aside from the fact that it's an interesting comparison.
      </p>

      <p>
        <strong>useState/useReducer:</strong> In React, <code>useState()</code> will keep track of a piece of state between rerenders. Each time you update a piece of state, it will trigger an entire rerender. <code>useReducer()</code> is very similar to <code>useState()</code>, just with an alternative API that makes it easier to make changes to a deeply nested piece of state. In the Snap Framework, signals are used instead. A signal holds a piece of mutable state, and whoever cares about that piece of state can subscribe to the signal. This is what eliminates the need to have rerenders, a virtual DOM, and DOM diffing.
      </p>

      <p>
        <strong>useRef:</strong> <code>useRef()</code> allows you to keep state between rerenders without causing a rerender whenever the state is updated. In the Snap Framework, this is just a local variable inside of your component - anyone can read or update that local variable, and it will persist for the lifetime of the component.
      </p>

      <p>
        <strong>useCallback/useMemo:</strong> These are optimization techniques that are used to prevent too much stuff from rerendering whenever a state change happens. React is coming out with a new <a href="https://react.dev/learn/react-compiler">React Compiler</a> that will, in part, automatically memoize values for you to take the worry off of you. In the Snap Framework, there aren't any rerenders so there's nothing that needs to be optimized in this regard.
      </p>

      <p>
        <strong>useContext:</strong> An equivalent isn't provided for this. You could always explicitly pass around a "ctx" object to all components containing whatever data you need to share.
      </p>

      <p>
        <strong>useImperativeHandle:</strong> A React component returns an element tree representation, but with <code>useImperativeHandle()</code>, it allows a component to additionally register a custom API of any shape to go along with the element tree. Consumers of the component can get access to that custom API and use the methods/properties provided on it. In the Snap Framework, the same objective is accomplished by creating a custom element (with <code>defineElement()</code>), and then attaching whatever methods/properties you want to its <code>.api</code> property. Consumers can create an instance of your custom element and then interact with it through that <code>.api</code> property.
      </p>

      <p>
        <strong>useEffect:</strong> This hook has multiple use cases rolled into one function. 1. It allows you to react when a component is being mounted. In the Snap Framework, your component function itself is essentially an on-mount handler - everything you put in there will execute as the component is being set up. 2. It allows you to react when a component is being unmounted. In the Snap Framework, this is provided through the <code>useCleanup()</code> hook. 3. It allows you to react to state changes. In the Snap Framework, this is done via <code>Signal.use()</code>.
      </p>

      <p>
        <strong>Q: I don't like hooks, why did you have to include them?</strong>
      </p>

      <p>
        I know there's mixed feelings on hooks. I almost didn't include them - I was really close to stripping out <code>useCleanup()</code> and instead requiring you to explicitly pass around some <code>onUnmount</code> event emitter that you can subscribe to. It would have made the framework even simpler, and it would have decoupled different parts of the framework (which is a nice bonus - it makes it easier to take pieces of the framework out and use them in isolation). I ultimately broke my priority rules given above and decided against this, mostly because I deemed the verbosity cost to be too high (this change would mean that functions such as <code>set()</code> and <code>Signal.use()</code> would both require an additional <code>onUnmount</code> parameter, and I don't think either of those functions can support becoming much more verbose).
      </p>

      <p>
        But you don't have to follow in my footsteps. If you hate the hooks, take them out. Update the framework to suit your needs.
      </p>
    </details>
  `;
});

function getStyles() {
  return `
    :host {
      display: block;
      max-width: 800px;
      margin: 0 auto;
      margin-bottom: 80px;
      padding-left: 8px;
      padding-right: 8px;
    }

    ${customElements.getName(CodeViewer)} {
      margin-top: 24px;
      margin-bottom: 24px;
    }
  `;
}
