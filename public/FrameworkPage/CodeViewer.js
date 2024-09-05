import { defineElement, Signal, html, set, useSignals } from './snapFramework.js';
import { assert, promiseToSignal } from './util.js';
import { PUBLIC_URL, Prism } from './shared.js';

function handleThemeLoadError(error) {
  console.error(error);
  // Return the empty string, i.e. no CSS mark-up, if we failed to load the theme.
  return '';
}

const lightThemeCss$ = promiseToSignal(
  fetch(`${PUBLIC_URL}/thirdParty/prism/light-theme.css`)
    .then(resp => resp.text())
    .catch(handleThemeLoadError),
  { loadingValue: '' },
);

const darkThemeCss$ = promiseToSignal(
  fetch(`${PUBLIC_URL}/thirdParty/prism/dark-theme.css`)
    .then(resp => resp.text())
    .catch(handleThemeLoadError),
  { loadingValue: '' },
);

export const CodeViewer = defineElement('CodeViewer', (text$_, { theme: theme$_ = 'light', wrapWithinWords = false } = {}) => {
  const text$ = text$_ instanceof Signal ? text$_ : new Signal(text$_);
  const theme$ = theme$_ instanceof Signal ? theme$_ : new Signal(theme$_);
  assert(['light', 'dark'].includes(theme$.get()));
  let codeContainerEl;

  // Waiting a tad before running the syntax highlighter so the element has a chance
  // to get attached to the DOM first.
  setTimeout(() => {
    // highlightAllUnder() needs to run against a container that holds the pre element.
    // It can't run against the pre element itself.
    Prism.highlightAllUnder(codeContainerEl);
  }, 200); // <-- (why is 200ms needed? Is it so the theme/font has a chance to load in? Something else?)

  const el = html`
    <div ${el => { codeContainerEl = el }}>
      <pre><code class="language-javascript" ${set({
        textContent: text$,
        style: wrapWithinWords ? 'word-break: break-all' : '',
      })}></code></pre>
    </div>

    <style ${set({
      textContent: useSignals(
        [theme$, lightThemeCss$, darkThemeCss$],
        (theme, lightThemeCss, darkThemeCss) => theme === 'light' ? lightThemeCss : darkThemeCss
      )
    })}></style>
    <style ${set({ textContent: style })}></style>
  `;

  // This is done after html`...` so the syntax highlighting can happen after the parameters have been updated.
  let skip = true;
  useSignals([text$, theme$], (text, theme) => {
    if (skip) return;
    Prism.highlightAllUnder(codeContainerEl);
  });
  skip = false;

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

  /* Override the fact that the light theme likes to make the background white behind operators, which looks a little weird. */
  .token.operator, .token.entity, .token.url, .language-css .token.string, .style .token.string {
    background: unset;
  }

  :host pre > code {
    white-space: pre-wrap;
  }
`;
