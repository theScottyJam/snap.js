import { Signal, html, set } from './snapFramework.js';
import { assert } from './util.js';
import { defineStyledElement, promiseToSignal, Prism } from './shared.js';

function handleThemeLoadError(error) {
  console.error(error);
  // Return the empty string, i.e. no CSS mark-up, if we failed to load the theme.
  return '';
}

const signalLightThemeCss = promiseToSignal(
  fetch('thirdParty/prism/light-theme.css')
    .then(resp => resp.text())
    .catch(handleThemeLoadError),
  { loadingValue: '' },
);

const signalDarkThemeCss = promiseToSignal(
  fetch('thirdParty/prism/dark-theme.css')
    .then(resp => resp.text())
    .catch(handleThemeLoadError),
  { loadingValue: '' },
);

/**
 * signalDisableWrapping can be set to true, false, or "without-internal-scrolling".
 * "without-internal-scrolling" will disable wrapping and also prevent the container from generating a scrollbar.
 * wrapWithinWords allows wrapping to occur in the middle of the word - useful for minified text where the actual content isn't meant to be human-readable.
 */
export const CodeViewer = defineStyledElement('CodeViewer', getStyles, (signalText_, opts = {}) => {
  const signalText = signalText_ instanceof Signal ? signalText_ : new Signal(signalText_);
  const { theme = 'light', wrapWithinWords = false, signalDisableWrapping = new Signal(true) } = opts;
  assert(['light', 'dark'].includes(theme));
  let preEl;

  // There can't be any whitespace between the pre tag and the code tag, or it will show up in the UI
  const el = html`
    <pre ${set({
      style: signalDisableWrapping.use(disableWrapping => {
        if (disableWrapping === true) return 'overflow-x: auto; white-space: revert';
        if (disableWrapping === 'without-internal-scrolling') return 'overflow: revert; white-space: revert';
        if (disableWrapping === false) return '';
        throw new Error();
      }),
      className: `theme-${theme}`,
    }, preEl_ => { preEl = preEl_ })}></pre>

    <style ${set({
      textContent: theme === 'light' ? signalLightThemeCss : signalDarkThemeCss,
    })}></style>
  `;

  signalText.use(text => {
    const codeEl = html`<code class="language-javascript" ${set({
      textContent: text,
      style: signalDisableWrapping.use(disableWrapping => {
        return (
          (wrapWithinWords ? 'word-break: break-all;' : '') +
          (disableWrapping ? 'white-space: revert;' : '')
        );
      }),
    })}></code>`;

    preEl.innerHTML = '';
    preEl.append(codeEl);

    Prism.highlightAllUnder(preEl);
  });

  return el;
});

function getStyles() {
  return `
    :host {
      /* Allows others to modify the margin of this element. */
      display: block;
    }

    :host pre {
      margin: 0;
      padding: 0;
      text-wrap: wrap;
      white-space: pre-wrap;
      /* Let the containers this element goes in choose the background, instead of having the theme choose. */
      background: none;
    }

    /* Override the fact that the light theme likes to make the background white behind operators, which looks a little weird. */
    .token.operator, .token.entity, .token.url, .language-css .token.string, .style .token.string {
      background: unset;
    }

    :host pre > code {
      white-space: pre-wrap;
    }

    /* Make the color a little darker so it doesn't blend into the background as much. */
    pre.theme-light .token.punctuation {
      /* The color is normally #999 */
      color: #444;
    }
  `;
}
