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

/**
 * disableWrapping$ can be set to true, false, or "without-internal-scrolling".
 * "without-internal-scrolling" will disable wrapping and also prevent the container from generating a scrollbar.
 * wrapWithinWords allows wrapping to occur in the middle of the word - useful for minified text where the actual content isn't meant to be human-readable.
 */
export const CodeViewer = defineElement('CodeViewer', (text$_, { theme = 'light', wrapWithinWords = false, disableWrapping$ = new Signal(true) } = {}) => {
  const text$ = text$_ instanceof Signal ? text$_ : new Signal(text$_);
  assert(['light', 'dark'].includes(theme));
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
      <!-- There can't be any whitespace between the pre tag and the code tag, or it will show up in the UI -->
      <pre ${set({
        style: useSignals([disableWrapping$], disableWrapping => {
          if (disableWrapping === true) return 'overflow-x: auto; white-space: revert';
          if (disableWrapping === 'without-internal-scrolling') return 'overflow: revert; white-space: revert';
          if (disableWrapping === false) return '';
          throw new Error();
        }),
      })}><code class="language-javascript" ${set({
        textContent: text$,
        style: useSignals([disableWrapping$], disableWrapping => {
          return (
            (wrapWithinWords ? 'word-break: break-all;' : '') +
            (disableWrapping ? 'white-space: revert;' : '')
          )
        }),
      })}></code></pre>
    </div>

    <style ${set({
      textContent: theme === 'light' ? lightThemeCss$ : darkThemeCss$,
    })}></style>
    <style ${set({ textContent: style })}></style>
  `;

  // This is done after html`...` so the syntax highlighting can happen after the parameters have been updated.
  let skip = true;
  useSignals([text$], text => {
    if (skip) return;
    Prism.highlightAllUnder(codeContainerEl);
  });
  skip = false;

  return el;
});

const style = `
  :host {
    /* Allows others to modify the margin of this element. */
    display: block;
  }

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
