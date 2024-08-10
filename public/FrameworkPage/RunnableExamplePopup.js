import { CodeViewer } from './CodeViewer.js';
import { PUBLIC_URL } from './shared.js';
import { ICON_BUTTON_BACKGROUND_ON_HOVER, ICON_BUTTON_OUTLINE_ON_FOCUS } from './sharedStyles.js';
import { Signal, defineElement, html, renderEach, renderIf, set, useSignals, withLifecycle } from './snapFramework.js';

export function showPopupWithExample(code) {
  const removePopup = () => {
    uninit();
    popupEl.parentNode.removeChild(popupEl);
  };

  const { uninit, value: popupEl } = withLifecycle(() => {
    return new PopupWithExample({ code, removePopup });
  });

  document.body.append(popupEl);
}

export const PopupWithExample = defineElement('PopupWithExample', ({ code, removePopup }) => {
  const codeToView = code
    .replaceAll("%FRAMEWORK_LOCATION%", `./snapFramework.js`)
    .replaceAll("%ASSETS%", `./assets`);

  const codeToRun = code
    .replaceAll("%FRAMEWORK_LOCATION%", `${PUBLIC_URL}/FrameworkPage/snapFramework.js`)
    .replaceAll("%ASSETS%", `${PUBLIC_URL}/assets`);

  const showResult$ = new Signal(true);
  const logOutput$ = new Signal([]);
  return html`
    <div class="backdrop" ${set({
      onclick: () => removePopup(),
    })}></div>

    <div class="foreground">
      <div class="code">
        <button class="rerun-button" ${set({
          onclick: () => {
            // Force it to re-render
            showResult$.set(false);
            logOutput$.set([]);
            showResult$.set(true);
          },
        })}>Rerun</button>
        ${new CodeViewer(codeToView, { theme: 'light' })}
      </div>
      <div class="result">
        ${renderIf(showResult$, () => html`
          <iframe frameborder="0" ${iframeEl => {
            // Wait a moment for the iframe to be attached to the DOM before trying to access its contents.
            setTimeout(() => {
              const logMethodsToOverride = [
                { fnName: 'info', cssClassName: 'info' },
                { fnName: 'log', cssClassName: 'info' },
                { fnName: 'warn', cssClassName: 'error' },
                { fnName: 'error', cssClassName: 'error' },
              ];
              for (const { fnName, cssClassName } of logMethodsToOverride) {
                const iframeLogFn = iframeEl.contentWindow.console[fnName];
                iframeEl.contentWindow.console[fnName] = (...args) => {
                  const isObject = value => value !== null && typeof value === 'object';
                  const argsAsString = args.map(arg => {
                    return isObject(arg) || Array.isArray(arg)
                      ? JSON.stringify(arg, null, '  ')
                      : String(arg);
                  }).join(' ');

                  logOutput$.set([...logOutput$.get(), { cssClass: cssClassName, message: argsAsString }]);
                  iframeLogFn(...args);
                };
              }

              iframeEl.contentWindow.addEventListener('error', error => {
                logOutput$.set([...logOutput$.get(), { cssClass: 'error', message: error.message }]);
              });

              const scriptEl = iframeEl.contentDocument.createElement('script');
              scriptEl.type = 'module';
              scriptEl.textContent = codeToRun;
              iframeEl.contentDocument.head.append(scriptEl);
            });
          }}></iframe>
        `)}
        ${renderIf(useSignals([logOutput$], logOutput => logOutput.length > 0), () => html`
          <div>
            <p class="log-output-heading">Log Output</p>
          </div>
        `)}
        <div class="log-output">
          ${renderEach(
            useSignals([logOutput$], logOutput => logOutput.map((logLine, i) => [i, logLine])),
            logLine => html`<pre ${set({ textContent: logLine.message, className: logLine.cssClass })}></pre>`,
          )}
        </div>
      </div>
    </div>

    <style ${set({ textContent: style })}></style>
  `;
});

const BORDER_STYLE = '1px solid #ccc';

const style = `
  .backdrop {
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.3);
  }

  .foreground {
    position: fixed;
    display: grid;
    grid-template-columns: minmax(0, 3fr) minmax(0, 2fr); 
    background: white;

    top: 80px;
    left: 80px;
    bottom: 80px;
    right: 80px;
    border-radius: 4px;
  }

  .code {
    padding: 10px;
    overflow: auto;
    /* Makes it so the rerun button can be positioned relative to this container */
    position: relative;
  }

  .rerun-button {
    position: absolute;
    top: 8px;
    right: 8px;
    padding: 3px 6px;
    background: white;
    border: 1px solid #aaa;
    cursor: pointer;
    border-radius: 2px;
    &:hover {
      background: ${ICON_BUTTON_BACKGROUND_ON_HOVER};
    }
    &:focus {
      outline: ${ICON_BUTTON_OUTLINE_ON_FOCUS};
    }
  }

  .result {
    display: flex;
    flex-flow: column;
    border-left: ${BORDER_STYLE};
    overflow-y: hidden;
  }

  .result iframe {
    flex: 1;
  }

  .log-output {
    max-height: 50%;
    display: flex;
    flex-flow: column;
    overflow: auto;
  }

  .log-output pre {
    margin: 0;
    padding: 10px 5px;
    border-top: ${BORDER_STYLE};
    white-space: pre-wrap;
  }

  .log-output pre.error {
    color: darkred;
  }

  .log-output-heading {
    display: inline-block;
    padding: 5px 5px;
    margin: 0;
    font-size: 0.8em;
    letter-spacing: 0.08em;
    border-top: ${BORDER_STYLE};
    border-right: ${BORDER_STYLE};
    border-top-right-radius: 4px;
  }
`;
