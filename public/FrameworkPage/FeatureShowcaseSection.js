/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-template-curly-in-string */

import { defineElement, Signal, html, set, useSignals, renderEach } from './snapFramework.js';
import { CodeViewer } from './CodeViewer.js';
import { headerStyleMixin, headerStyleMixinRules } from './sharedStyles.js';
import { jumpToInternalLinkTarget } from './shared.js';

export const FeatureShowcaseSection = defineElement('FeatureShowcaseSection', () => {
  const selectedFeature$ = new Signal(0);

  return html`
    <div class="feature-showcase-region">
      ${renderCodeSamples({ selectedFeature$ })}
      ${renderFeatureList({ selectedFeature$ })}
    </div>

    <style ${set({ textContent: style })}></style>
  `;
});

function renderCodeSamples({ selectedFeature$ }) {
  return html`
    <div class="code-sample-areas-container">
      ${renderEach(
        new Signal(features.map((feature, i) => [i, feature])),
        (feature, i) => renderCodeSample({ feature, index: i, selectedFeature$ }),
      )}
    </div>
  `;
}

function renderCodeSample({ feature, index, selectedFeature$ }) {
  const lineCount = feature.code.split('\n').length;
  // + 1, because if the last character is a new line, it seems to be ignored.
  const newLinePad = '\n'.repeat(LINE_COUNT_OF_LONGEST_EXAMPLE - lineCount + 1);
  return html`
    <div ${set({
      className: useSignals([selectedFeature$], selectedFeature => {
        const base = 'code-example-area';
        return selectedFeature === index ? `${base} show` : base;
      })
    })}>
      <h2 class="mobile-feature-title" ${set({ textContent: feature.header })}></h2>
      <p class="code-tab" ${set({ textContent: feature.tabName })}></p>
      ${new CodeViewer(feature.code + newLinePad, { theme: 'dark' })}
      <div class="feature-description-container">
        <div class="feature-description" ${el => {
          el.append(feature.renderDescription());
        }}>
        </div>
      </div>
    </div>
  `;
}

function renderFeatureList({ selectedFeature$ }) {
  return html`
    <div class="feature-list">
      ${renderEach(
        new Signal(features.map((feature, i) => [i, feature])),
        (feature, i) => html`
          ${renderFeatureItem({
            featureIndex: i,
            selectedFeature$,
            header: feature.header,
          })}
        `,
      )}
    </div>
  `;
}

function renderFeatureItem({ featureIndex, selectedFeature$, header }) {
  const containerClass$ = useSignals([selectedFeature$], selectedFeature => {
    return 'feature' + (selectedFeature === featureIndex ? ' selected' : '');
  });

  return html`
    <button ${set({
      className: containerClass$,
      onmouseover: () => selectedFeature$.set(featureIndex),
      onclick: () => selectedFeature$.set(featureIndex),
    })}>
      <h3 ${set({ textContent: header })}></h3>
    </button>
  `;
}

const features = [
  {
    defaultSelected: true,
    header: 'Hello Simplicity',
    tabName: 'HelloWorld.js',
    renderDescription: () => html`<p>
      The <code>html</code> template tag generates native HTML nodes.
      A "component" is simply a function that returns a native HTML node.
    </p>`,
    code: [
      '// Defines an "App" component.',
      'export function renderHelloWorld() {',
      '  return html`',
      '    <h1>Hello World App</h1>',
      "    ${renderText('Hello World!')}",
      '  `;',
      '}',
      '',
      '// Defines a "Text" component.',
      'function renderText(text) {',
      '  return html`',
      '    <p ${set({ textContent: text })}></p>',
      '  `;',
      '}',
    ].join('\n'),
  },
  {
    header: 'Reactive',
    tabName: 'EchoBox.js',
    renderDescription: () => html`
      <p>
        Reactivity is handled by signals - stateful objects that emit events when updated.
        No need to fuss with
        <a href="https://react.dev/reference/react/useCallback">caching references</a>/<a href="https://react.dev/reference/react/useMemo">memoization</a>/<a href="https://react.dev/learn/react-compiler">a&nbsp;special&nbsp;compiler</a>
        to avoid unnecessary rerenders - your component never rerenders.
      </p>
    `,
    code: [
      'export function renderEchoBox() {',
      '  // The initial value of this signal is an empty string',
      "  const signalInput = new Signal('');",
      '',
      '  // Each textbox keystroke will update the signal,',
      "  // which in turn will update the p tag's contents",
      '  return html`',
      '    <input type="text" ${set({',
      '      onchange: event => signalInput.set(event.target.value),',
      '    })}>',
      '',
      '    <p ${set({ textContent: signalInput })}></p>',
      '  `;',
      '}',
    ].join('\n'),
  }, {
    header: 'Hooks, but Better',
    tabName: 'Counter.js',
    // The "‑" character used below is a non-breaking hyphen character - it prevents the line from wrapping at the hyphen.
    renderDescription: () => html`
      <p>
        Hooks are functions that "hook" into your component's lifecycle. They can be called anywhere in your component - inside of loops, if‑thens, etc.
      </p>
    `,
    code: [
      'export function renderCounter() {',
      '  const signalValue = new Signal(0);',
      '',
      '  const intervalId = setInterval(() => {',
      '    signalValue.set(signalValue.get() + 1);',
      '  }, 1000);',
      '',
      '  // The useCleanup() hook will call the provided listener',
      '  // when this component is being removed from the DOM.',
      '  useCleanup(() => clearInterval(intervalId));',
      '',
      '  return html`',
      '    <p ${set({ textContent: signalValue })}></p>',
      '  `;',
      '}',
    ].join('\n'),
  }, {
    header: 'Encapsulate your CSS',
    tabName: 'Card.js',
    renderDescription: () => html`
      <p>
        Use <a href="javascript://Jump to defineElement's docs" ${set({
          onclick: () => jumpToInternalLinkTarget('code-link:defineElement'),
        })}>defineElement()</a>
        to generate a
        <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_components">custom element (web component)</a>
        that encapsulates your CSS.
      </p>
    `,
    code: [
      "import { PRIMARY_COLOR } from '/theme.js';",
      '',
      "export const Card = defineElement('Card', ({ text }) => {",
      '  return html`',
      '    <p ${set({ textContent: text })}></p>',
      '',
      '    <style ${set({ textContent: css })}></style>',
      '  `;',
      '});',
      '',
      'const css = `',
      '  /* This CSS rule will only apply to the Card element */',
      '  p {',
      '    border: 1px solid ${PRIMARY_COLOR};',
      '  }',
      '`;',
    ].join('\n'),
  }, {
    header: 'Stop the Prop-Drilling',
    tabName: 'ThemedApp.js',
    renderDescription: () => html`
      <p>
        The context API lets you implicitly pass data from parent components to child components.
      </p>
    `,
    code: [
      'const themeContext = new Context();',
      '',
      'export export function renderThemedApp() {',
      "  return themeContext.provide({ primaryTextColor: 'blue' }, () => {",
      '    return html`',
      '      <h1>Themed App Example</h1>',
      '      ${renderHelloWorld()}',
      '    `;',
      '  });',
      '}',
      '',
      'function renderHelloWorld() {',
      '  const { primaryTextColor } = themeContext.get();',
      '  return html`',
      '    <p ${set({ style: `color: ${primaryTextColor}` })}>',
      '      Hello World!',
      '    </p>',
      '  `;',
      '}',
    ].join('\n'),
  }
];

const LINE_COUNT_OF_LONGEST_EXAMPLE = Math.max(...features.map(feature => feature.code.split('\n').length));

const CODE_PANEL_WIDTH = 700;
const CODE_PANEL_WIDTH_SMALL_SCREEN = 600;
const CODE_VIEWER_BORDER_RADIUS = '8px';

const style = `
  ${headerStyleMixin}

  .feature-showcase-region {
    display: flex;
    justify-content: center;
    gap: 45px;
  }

  .feature-list {
    width: 500px;
    margin-top: 70px;
  }

  .feature {
    display: block;
    width: 100%;
    text-align: left;
    background: unset;
    font-size: 1rem;
    position: relative;
    border: unset;
    border-top: 1px solid #ccc;
    /* // <-- Find a better way to handle this - it creates a 1px white strip at the bottom when hovering */
    /* The invisible border-bottom forces the background color to extend to the border. */
    border-bottom: 1px solid white;
    padding-left: 20px;
    padding-right: 20px;
    ${headerStyleMixinRules}
  }

  .feature.selected {
    background-color: #efe;
  }

  .feature:last-child {
    border-bottom: 1px solid #ccc;
  }

  .feature > h3 {
    margin-top: 30px;
    margin-bottom: 30px;
  }

  .mobile-feature-title {
    display: none;
  }

  .code-example-area {
    display: none;
  }

  .code-example-area.show {
    display: block;
  }

  .feature-description-container {
    min-height: 100px;
  }

  .feature-description {
    width: ${CODE_PANEL_WIDTH}px;
    margin-top: 20px;
    padding: 15px;
    background: #efe;
    border-radius: 8px;
    box-sizing: border-box;
    border: 1px solid #7d7;
  }

  .feature-description > p {
    margin: 0;
  }
  
  .code-tab {
    display: inline-block;
    color: #ddd;
    padding: 8px 20px;
    margin-bottom: 0;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    background-color: #272822;
    box-shadow: 0 2px 2px 2px rgba(0,0,0,.09);
    /* Moves the element under the code area, so its shadow goes under instead of over the code. */
    position: relative;
    z-index: -1;
  }

  ${customElements.getName(CodeViewer)} {
    display: block;
    width: ${CODE_PANEL_WIDTH}px;
    background-color: #272822;
    border-radius: 0 ${CODE_VIEWER_BORDER_RADIUS} ${CODE_VIEWER_BORDER_RADIUS} ${CODE_VIEWER_BORDER_RADIUS};
    box-shadow: 0 8px 8px -4px rgba(0,0,0,.6), 0 2px 2px 2px rgba(0,0,0,.1);
    padding: 1em;
    box-sizing: border-box;
  }

  @media screen and (max-width: 1330px) {
    .feature-list {
      width: 230px;
    }

    .feature-showcase-region {
      gap: 20px;
    }

    .feature-description {
      width: ${CODE_PANEL_WIDTH_SMALL_SCREEN}px;
    }

    .code-example-area {
      font-size: 0.85em;
    }

    ${customElements.getName(CodeViewer)} {
      width: ${CODE_PANEL_WIDTH_SMALL_SCREEN}px;
    }

    .feature {
      font-size: 0.9em;
    }
  }

  @media screen and (max-width: 900px) {
    .feature-list {
      display: none;
    }

    :host .code-example-area {
      display: flex;
      flex-flow: column;
      padding-bottom: 25px;
      box-shadow: 0 32px 32px -16px hsla(175, 60%, 70%, 0.5) inset;
      background: linear-gradient(
        110deg,
        hsl(175, 60%, 85%),
        hsl(175, 80%, 95%) 50%
      );
    }

    .mobile-feature-title {
      display: revert;
      margin-top: 1.2em;
      margin-bottom: 0.4em;
    }

    .feature-description-container {
      min-height: unset;
    }

    .feature-description {
      background: white;
      border: revert;
      box-shadow: 0 1px 1px 1px rgba(0,0,0,.03);
      margin-top: 0;
      margin-bottom: 1em;
    }

    .mobile-feature-title,
    .feature-description {
      width: calc(100% - 40px);
      margin-left: 20px;
    }

    .code-tab {
      display: none;
    }

    .code-sample-areas-container {
      display: flex;
      width: 100%;
      flex-flow: column;
    }

    ${customElements.getName(CodeViewer)} {
      border-radius: ${CODE_VIEWER_BORDER_RADIUS};
      order: 2;
      margin-left: calc(calc(100% - ${CODE_PANEL_WIDTH_SMALL_SCREEN}px) / 2);
    }
  }

  @media screen and (max-width: 700px) {
    .mobile-feature-title {
      margin-left: 20px;
    }

    .feature-description {
      width: calc(100% - 20px);
      margin-left: 10px;
    }

    ${customElements.getName(CodeViewer)} {
      width: revert;
      margin-left: 10px;
      margin-right: 10px;
    }
  }
`;
