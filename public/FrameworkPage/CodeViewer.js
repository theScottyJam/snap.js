import { defineElement, Signal, html, set, useSignals } from './snapFramework.js';
import { assert } from './util.js';
import { PUBLIC_URL, Prism } from './shared.js';

export const CodeViewer = defineElement('CodeViewer', (text$_, { theme = 'light' } = {}) => {
  const text$ = text$_ instanceof Signal ? text$_ : new Signal(text$_);
  assert(['light', 'dark'].includes(theme));
  let codeContainerEl;

  // Waiting a tad before running the syntax highlighter so the element has a chance
  // to get attached to the DOM first.
  setTimeout(() => {
    codeContainerEl.classList.add(`theme-${theme}`)
    // highlightAllUnder() needs to run against a container that holds the pre element.
    // It can't run against the pre element itself.
    Prism.highlightAllUnder(codeContainerEl);
  }, 200); // <--

  const el = html`
    <div ${el => { codeContainerEl = el }}>
      <pre><code class="language-javascript" ${set({
        textContent: text$,
      })}></code></pre>
    </div>

    <link rel="stylesheet" ${set({ href: `${PUBLIC_URL}/thirdParty/prism/${theme}-theme.css` })}/>
    <style ${set({ textContent: style })}></style>
  `;

  // This is done after html`...` so the syntax highlighting can happen after the text has been updated.
  useSignals([text$], text => {
    Prism.highlightAllUnder(codeContainerEl);
  });

  return el;
});

const style = `
  :host pre {
    margin: 0;
    padding: 0;
    text-wrap: wrap;
    white-space: pre-wrap;
    /* We let the containers this element goes in choose the background, instead of having the theme choose. */
    background: none;
  }

  :host pre > code {
    white-space: pre-wrap;
  }
`;
