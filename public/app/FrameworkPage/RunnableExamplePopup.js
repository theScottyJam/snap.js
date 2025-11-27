import { Signal, html, renderChoice, renderEach, set, useCleanup, withLifecycle } from '../snapFramework.js';
import { defineStyledElement } from '../shared.js';
import { CodeViewer } from '../CodeViewer.js';
import { signalIsMobileScreenSize, prepareCodeExampleForRunning, prepareCodeExampleForViewing } from './shared.js';
import { ICON_BUTTON_BACKGROUND_ON_HOVER, ICON_BUTTON_OUTLINE_ON_FOCUS } from './sharedStyles.js';

const createEventSignal = () => new Signal(false);

const triggerEventSignal = signal => {
  signal.set(!signal.get());
};

export function showPopupWithExample(code, { version }) {
  const removePopup = () => {
    uninit();
    popupEl.parentNode.removeChild(popupEl);
  };

  const { uninit, value: popupEl } = withLifecycle(() => {
    return new PopupWithExample({ code, removePopup, version });
  });

  document.body.append(popupEl);
}

export const PopupWithExample = defineStyledElement('PopupWithExample', getStyles, ({ code, removePopup, version }) => {
  const signalRerunCodeEvent = createEventSignal();

  const codeToView = prepareCodeExampleForViewing(code);

  const codeToRun = prepareCodeExampleForRunning(code, { version });

  const keyDownListener = event => {
    if (event.key === 'Escape') {
      removePopup();
    }
  };
  
  window.addEventListener('keydown', keyDownListener);
  useCleanup(() => {
    window.removeEventListener('keydown', keyDownListener);
  });

  return html`
    <div class="backdrop" ${set({
      onclick: () => removePopup(),
    })}></div>

    <div class="foreground">
      ${renderCodePanel({ codeToView, signalRerunCodeEvent, removePopup })}
      ${renderResultPanel({ codeToRun, signalRerunCodeEvent, removePopup })}
    </div>
  `;
});

function renderCodePanel({ codeToView, signalRerunCodeEvent, removePopup }) {
  return html`
    <div class="code-panel">
      <div class="panel-header">
        <p>Code</p>
        <div class="rerun-button-container">
          <button class="rerun-button" ${set({
            onclick: () => triggerEventSignal(signalRerunCodeEvent),
          })}>
            Rerun
          </button>
        </div>
        ${renderCloseButton({ removePopup, forDesktop: false })}
      </div>
      <div class="code">
        ${new CodeViewer(codeToView, {
          theme: 'light',
          signalDisableWrapping: signalIsMobileScreenSize.use(isMobileScreenSize => isMobileScreenSize ? 'without-internal-scrolling' : false),
        })}
      </div>
    </div>
  `;
}

function renderResultPanel({ codeToRun, signalRerunCodeEvent, removePopup }) {
  const signalShowResult = new Signal(true);
  const signalLogOutput = new Signal([]);
  signalRerunCodeEvent.use(() => {
    // Force it to re-render
    signalShowResult.set(false);
    signalLogOutput.set([]);
    signalShowResult.set(true);
  });

  return html`
    <div class="result-panel">
      <div class="panel-header">
        <p>Result</p>
        <div>
          ${renderCloseButton({ removePopup, forDesktop: true })}
        </div>
      </div>
      <div class="result">
        ${renderChoice([{
          signalWhen: signalShowResult,
          render: () => html`
            <iframe frameborder="0" ${iframeEl => {
              // Wait a moment for the iframe to be attached to the DOM before trying to access its contents.
              setTimeout(() => {
                runExampleInIframe({
                  iframeEl,
                  codeToRun,
                  // logLevel is either "info" or "error"
                  onLog: (logLevel, message ) => {
                    signalLogOutput.set([...signalLogOutput.get(), { cssClass: logLevel, message }]);
                  },
                })
              });
            }}></iframe>
          `
        }])}
        ${renderChoice([{
          signalWhen: signalLogOutput.use(logOutput => logOutput.length > 0),
          render: () => html`
            <div>
              <p class="log-output-heading">Log Output</p>
            </div>
          `
        }])}
        <div class="log-output">
          ${renderEach(
            signalLogOutput.use(logOutput => logOutput.map((logLine, i) => [i, logLine])),
            logLine => html`<pre ${set({ textContent: logLine.message, className: logLine.cssClass })}></pre>`,
          )}
        </div>
      </div>
    </div>
  `;
}

function renderCloseButton({ removePopup, forDesktop }) {
  return html`
    <button class="close-button" ${set({
      onclick: removePopup,
      className: 'close-button ' + (forDesktop ? 'for-desktop' : 'for-mobile'),
    })}>×</button>
  `;
}

// The below code doesn't work in Firefox because it causes the tab to crash.
// This will hopefully get fixed in a future release, but until then, using
// an alternative runExampleInIframe() below will work for now.

// function runExampleInIframe({ iframeEl, codeToRun, onLog }) {
//   const logMethodsToOverride = [
//     { fnName: 'info', logLevel: 'info' },
//     { fnName: 'log', logLevel: 'info' },
//     { fnName: 'warn', logLevel: 'error' },
//     { fnName: 'error', logLevel: 'error' },
//   ];
//   for (const { fnName, logLevel } of logMethodsToOverride) {
//     const iframeLogFn = iframeEl.contentWindow.console[fnName];
//     iframeEl.contentWindow.console[fnName] = (...args) => {
//       const isObject = value => value !== null && typeof value === 'object';
//       const argsAsString = args.map(arg => {
//         return isObject(arg) || Array.isArray(arg)
//           ? JSON.stringify(arg, null, '  ')
//           : String(arg);
//       }).join(' ');

//       onLog(logLevel, argsAsString);
//       iframeLogFn(...args);
//     };
//   }

//   iframeEl.contentWindow.addEventListener('error', error => {
//     onLog('error', error.message);
//   });

//   const scriptEl = iframeEl.contentDocument.createElement('script');
//   scriptEl.type = 'module';
//   scriptEl.textContent = codeToRun;
//   iframeEl.contentDocument.head.append(scriptEl);

//   iframeEl.srcdoc = `
//     <!doctype html>
//     <html><head><script type="module">
//       ${codeToRun}
//     </script></head></html>
//   `;
// }

function runExampleInIframe({ iframeEl, codeToRun, onLog }) {
  globalThis.__onIframeConsoleOutput = onLog;

  iframeEl.srcdoc = `
    <!doctype html>
    <html><head>
      <script>
        const logMethodsToOverride = [
          { fnName: 'info', logLevel: 'info' },
          { fnName: 'log', logLevel: 'info' },
          { fnName: 'warn', logLevel: 'error' },
          { fnName: 'error', logLevel: 'error' },
        ];
        for (const { fnName, logLevel } of logMethodsToOverride) {
          const logFn = console[fnName];
          console[fnName] = (...args) => {
            const isObject = value => value !== null && typeof value === 'object';
            const argsAsString = args.map(arg => {
              return isObject(arg) || Array.isArray(arg)
                ? JSON.stringify(arg, null, '  ')
                : String(arg);
            }).join(' ');

            globalThis.parent.__onIframeConsoleOutput(logLevel, argsAsString);
            logFn(...args);
          };
        }

        window.addEventListener('error', error => {
          globalThis.parent.__onIframeConsoleOutput('error', error.message);
        });
      </script>
      <script type="module">
        ${codeToRun}
      </script>
    </head></html>
  `;
}

function getStyles() {
  const FRAME_BORDER_STYLE = '1px solid #ccc';
  const BUTTON_BORDER_COLOR = '#aaa';
  const POPUP_BORDER_RADIUS = '4px';

  return `
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
      border-radius: ${POPUP_BORDER_RADIUS};
    }

    .panel-header {
      display: flex;
      margin-left: 10px;
      & > p {
        flex: 1;
      }
    }

    .code-panel {
      display: flex;
      flex-flow: column;
      /*
        This seems to be required in order to cause the child to create a scrollbar instead of overflowing.
        I don't really know why this works. Maybe it's creating a new formatting context, and that's doing something-or-other to the children?
      */
      overflow: hidden;
    }

    .code {
      flex: 1;
      overflow: auto;
      padding: 10px;
    }

    .rerun-button-container {
      display: flex;
      flex-flow: column;
      justify-content: center;
      margin-right: 10px;
    }

    .rerun-button {
      padding: 3px 6px;
      background: white;
      border: 1px solid ${BUTTON_BORDER_COLOR};
      cursor: pointer;
      border-radius: 2px;
      &:hover {
        background: ${ICON_BUTTON_BACKGROUND_ON_HOVER};
      }
      &:focus {
        outline: ${ICON_BUTTON_OUTLINE_ON_FOCUS};
      }
    }

    .result-panel {
      display: flex;
      flex-flow: column;
      overflow: auto;
      border-left: ${FRAME_BORDER_STYLE};
    }

    .result {
      flex: 1;
      display: flex;
      flex-flow: column;
      /*
        This seems to be required in order to cause the child to create a scrollbar instead of overflowing.
        I don't really know why this works. Maybe it's creating a new formatting context, and that's doing something-or-other to the children?
      */
      overflow: hidden;
    }

    .result iframe {
      flex: 1;
    }

    .close-button {
      font-size: 1.5rem;
      width: 36px;
      height: 36px;
      background: white;
      border: none;
      border-left: 1px solid ${BUTTON_BORDER_COLOR};
      border-bottom: 1px solid ${BUTTON_BORDER_COLOR};
      border-bottom-left-radius: 3px;
      border-top-right-radius: ${POPUP_BORDER_RADIUS};
      cursor: pointer;
      &:hover {
        background: ${ICON_BUTTON_BACKGROUND_ON_HOVER};
      }
      &:focus {
        outline: ${ICON_BUTTON_OUTLINE_ON_FOCUS};
      }
      &.for-mobile {
        display: none;
      }
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
      border-top: ${FRAME_BORDER_STYLE};
      white-space: pre-wrap;
    }

    .log-output pre.error {
      color: darkred;
    }

    .log-output-heading {
      display: inline-block;
      padding: 5px 5px;
      margin: 0;
      font-size: 0.8rem;
      letter-spacing: 0.08em;
      border-top: ${FRAME_BORDER_STYLE};
      border-right: ${FRAME_BORDER_STYLE};
      border-top-right-radius: 4px;
    }

    @media screen and (max-width: 1200px) {
      .foreground {
        grid-template-columns: revert;
        grid-template-rows: minmax(0, 3fr) minmax(0, 2fr);
      }

      .result-panel {
        border-left: revert;
        border-top: ${FRAME_BORDER_STYLE};
      }

      .close-button {
        &.for-mobile {
          display: revert;
        }
        &.for-desktop {
          display: none;
        }
      }

      .rerun-button-container {
        display: revert;
        margin-top: 4px;
        margin-right: 12px;
      }

      .rerun-button {
        padding: 6px 8px;
      }
    }

    @media screen and (max-width: 900px) {
      .foreground {
        top: 18px;
        left: 18px;
        bottom: 18px;
        right: 18px;
      }
    }
  `;
}
