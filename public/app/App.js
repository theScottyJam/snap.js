import { html, renderChoice, set, Signal, useCleanup, withLifecycle } from './snapFramework.js';
import {
  classNameBuilder,
  defineStyledElement,
  parentPage,
  useCapturedValue,
  useCssTransition,
  useProtectedSignal,
} from './shared.js';
import { Frame } from './Frame/Frame.js';
import { SingleEntryPage } from './SingleEntryPage/SingleEntryPage.js';
import { assert } from './util.js';

export const App = defineStyledElement('App', getStyles, () => {
  const [signalPage, setSignalPage] = useRoute();
  const pageInfo = { signalPage, setSignalPage };

  const [signalContent, updateSignalContent] = useProtectedSignal(null);
  const signalShowingPopup = Signal.use(
    [signalPage, signalContent],
    (page, content) => content !== null && (page.startsWith('utils/') || page.startsWith('nolodash/')),
  );

  const signalPageLoading = new Signal(true);
  let detachLastLoadStateListener;
  const watchLoadingState = signalLoadState => {
    detachLastLoadStateListener?.();
    const { uninit } = withLifecycle(() => {
      signalLoadState.use(loadState => {
        signalPageLoading.set(loadState.type === 'loading');
      });
    });
    detachLastLoadStateListener = uninit;
  };

  return html`
    ${renderPopupBackdrop({
      signalShow: signalShowingPopup,
      onClick: () => setSignalPage(parentPage(signalPage.get())),
    })}
    ${renderPopupContent({ signalShow: signalShowingPopup, signalContent, pageInfo })}
    ${new Frame({
      children: renderChoice([
        // not found
        {
          signalWhen: signalPage.use(page => page === 'notFound'),
          render: () => {
            signalPageLoading.set(false);
            return renderNotFound();
          },
        },
        // Framework page
        {
          signalWhen: signalPage.use(page => page.split('/')[0] === 'framework'),
          render: () => renderAsync(async ({ addToLifecycle, signalAborted, signalLoadState, goToPageLoadError }) => {
            watchLoadingState(signalLoadState);
            const { renderFrameworkPageAsync } = await import('./FrameworkPage/FrameworkPage.js');
            if (signalAborted.get()) return;

            return await renderFrameworkPageAsync({ pageInfo, addToLifecycle, signalAborted, goToPageLoadError });
          }),
        },
        // utility/no-lodash page
        {
          signalWhen: new Signal(true),
          render: () => renderAsync(async ({ addToLifecycle, signalAborted, signalLoadState }) => {
            watchLoadingState(signalLoadState);
            const { OverviewPage } = await import('./OverviewPage/OverviewPage.js');
            if (signalAborted.get()) return;

            const [utilsContent, nolodashContent, nolodashFaqHtml] = await Promise.all([
              import('../utilsContent.json', { with: { type: 'json' } })
                .then(response => response.default),
              import('../nolodashContent.json', { with: { type: 'json' } })
                .then(response => response.default),
              // When import attributes support `type: 'text'`, we can swap this for the import() syntax, and get caching for free.
              fetch('nolodashFaq.html')
                .then(response => {
                  if (!response.ok) {
                    throw new Error('Failed to load no-lodash faq - received a status code of ' + response.status);
                  }
                  return response.text();
                }),
            ]);
            updateSignalContent({ utils: utilsContent, nolodash: nolodashContent });
            if (signalAborted.get()) return;

            return addToLifecycle(() => new OverviewPage({ signalContent, pageInfo, nolodashFaqHtml }));
          }),
        },
      ]),
      signalHideFooter: signalPageLoading,
      pageInfo,
    })}
  `;
});

function renderNotFound() {
  return html`
    <p class="error-text">Page not found.</p>
  `;
}

/**
 * Wraps an async render function with an error boundary and loading indicator.
 *
 * The asyncRender() function will receive these parameters:
 * * addToLifecycle(callback) - can be called to enter the existing lifecycle. Must be used before rendering components.
 * * signalAborted - set to true if a cleanup is happening. This should be checked after every async operation, and you should
 *   return early if it's ever found to be true.
 * * signalLoadState - informs you what load state we're currently in.
 * * goToPageLoadError - call this to replace the page's content with a "failed to load the page" error.
 */
function renderAsync(asyncRender) {
  const [signalAborted, setSignalAborted] = useProtectedSignal(false);
  const uninitListeners = [];
  const cleanup = () => {
    setSignalAborted(true);
    for (const listener of uninitListeners) {
      listener();
    }
  };

  useCleanup(cleanup);

  const addToLifecycle = callback => {
    assert(
      !signalAborted.get(),
      'Already aborted. Please check the aborted signal before trying to use the lifecycle.',
    );

    const { uninit, value } = withLifecycle(callback);
    uninitListeners.push(uninit);
    return value;
  };

  const goToPageLoadError = () => {
    cleanup();
    setSignalLoadState({ type: 'loadFailed' });
  };

  // { type: 'loading' } | { type: 'ready', el: ... } | { type: 'loadFailed' }
  const [signalLoadState, setSignalLoadState] = useProtectedSignal({ type: 'loading' });
  asyncRender({ addToLifecycle, signalAborted, signalLoadState, goToPageLoadError })
    .then(el => {
      setSignalLoadState({ type: 'ready', el });
    })
    .catch(error => {
      console.error(error);
      setSignalLoadState({ type: 'loadFailed' });
    });

  const signalLongWait = new Signal(false);
  signalLoadState.use(loadState => {
    if (loadState.type !== 'loading') {
      signalLongWait.set(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      if (signalLoadState.get().type === 'loading') {
        signalLongWait.set(true);
      }
    }, 1000);

    useCleanup(() => {
      clearTimeout(timeoutId);
    });
  });

  return renderChoice([
    {
      signalWhen: signalLoadState.use(loadState => loadState.type === 'loading'),
      render: () => html`
        <p ${set({
          className: classNameBuilder({
            loading: true,
            show: signalLongWait,
          }),
        })}>
          loading...
        </p>
      `,
    },
    {
      signalWhen: signalLoadState.use(loadState => loadState.type === 'loadFailed'),
      render: () => html`<p class="error-text">Failed to load the page.</p>`,
    },
    {
      signalWhen: signalLoadState.use(loadState => loadState.type === 'ready'),
      render: () => signalLoadState.get().el,
    },
  ]);
}

function renderPopupBackdrop({ signalShow, onClick }) {
  const [signalPhase, endTransition] = useCssTransition(signalShow);
  return renderChoice([
    {
      signalWhen: Signal.use([signalShow, signalPhase], (show, phase) => show || phase.name !== 'exited'),
      render: () => html`
        <div ${set({
          className: classNameBuilder(
            {
              'popup-backdrop': true,
            },
            [
              signalPhase.use(phase => phase.name),
            ],
          ),
          onclick: () => {
            // If the backdrop is clicked while we're already
            // trying to animate away the backdrop, ignore the click.
            if (signalPhase.get().direction === 'exit') {
              return;
            }

            onClick();
          },
          ontransitionend: () => endTransition(),
        })}></div>
      `,
    },
  ]);
}

function renderPopupContent({ signalShow, signalContent, pageInfo }) {
  const { signalPage, setSignalPage } = pageInfo;

  const [signalPhase, endTransition] = useCssTransition(signalShow);
  const signalCapturedPage = useCapturedValue(signalPage, {
    signalFreezeIf: signalShow.use(show => !show),
  });

  return renderChoice([
    {
      signalWhen: Signal.use([signalShow, signalPhase], (show, phase) => show || phase.name !== 'exited'),
      render: () => html`
        <div ${set({
          className: classNameBuilder(
            {
              popup: true,
            },
            [
              signalPhase.use(phase => phase.name),
            ],
          ),
          ontransitionend: () => endTransition(),
        }, undefined)}>
          <div class="popup-inner">
            ${new SingleEntryPage({
              signalContent,
              pageInfo: { signalPage: signalCapturedPage, setSignalPage },
            })}
          </div>
        </div>
      `,
    },
  ]);
}

function useRoute() {
  const startingRoute = fetchAndNormalizeCurrentHashPath();

  const [signalPage, updateSignalPage] = useProtectedSignal(startingRoute);

  const onPopState = () => {
    updateSignalPage(fetchAndNormalizeCurrentHashPath());
  };

  window.addEventListener('popstate', onPopState);

  useCleanup(() => {
    window.removeEventListener('popstate', onPopState);
  });

  function setPageAndAddHistoryEvent(newPage) {
    if (newPage === signalPage.get().value) return;
    window.history.pushState(undefined, undefined, '#!/' + newPage);
    updateSignalPage(newPage);
  }

  return [signalPage, setPageAndAddHistoryEvent];
}

function fetchAndNormalizeCurrentHashPath() {
  let hashRoute = (window.location.hash ?? '').split('#!/')[1] ?? '';
  if (hashRoute.endsWith('/')) {
    // Remove trailing slash
    hashRoute = hashRoute.slice(0, -1);
  }

  if (hashRoute === '') {
    return 'utils';
  }

  // If it's a route that doesn't start with a valid top-level route
  if (!/^(utils|nolodash|framework)(\/|$)/.exec(hashRoute)) {
    // This won't return notFound for all not-found cases - the
    // utils and nolodash pages are in charge of rendering their own as needed.
    return 'notFound';
  }

  return hashRoute;
}

function getStyles() {
  const left = {
    forNormalDevices: 40,
    forSmallerDevices: 10,
    forReallySmallDevices: 2,
  };

  const padding = {
    forNormalDevices: 50,
    forSmallerDevices: 20,
    forReallySmallDevices: 15,
  };

  const deviceSize = {
    forSmallerDevices: 1000,
    forReallySmallDevices: 400,
  };

  return `
    .loading {
      color: #555;
      margin-left: 20px;
      transition: opacity 0.1s;
      opacity: 0;
      &.show {
        opacity: 1;
      }
    }

    .error-text {
      color: #a00;
      margin-left: 20px;
      font-weight: bold;
      letter-spacing: 0.08em;
    }

    .popup-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.3);
      z-index: 50;
      transition: opacity 250ms ease-out;
      &.init-entering {
        opacity: 0;
      }
      &.entering,
      &.entered {
        opacity: 1;
      }
      &.exiting {
        opacity: 0;
      }
      &.exited {
        display: none;
      }
    }

    .popup {
      padding-left: ${padding.forNormalDevices}px;
      position: fixed;
      top: 0;
      left: ${left.forNormalDevices}%;
      width: ${100 - left.forNormalDevices}%;
      height: 100%;
      background: white;
      z-index: 100;
      overflow: auto;
      box-sizing: border-box;
      box-shadow: 0 0 7px 2px rgba(0, 0, 0, 0.2);
      transition: opacity 175ms ease-out, transform 175ms ease-out;
      @media (max-width: ${deviceSize.forSmallerDevices}px) {
        padding-left: ${padding.forSmallerDevices}px;
        left: ${left.forSmallerDevices}%;
        width: ${100 - left.forSmallerDevices}%;
      }
      @media (max-width: ${deviceSize.forReallySmallDevices}px) {
        padding-left: ${padding.forReallySmallDevices}px;
        left: ${left.forReallySmallDevices}%;
        width: ${100 - left.forReallySmallDevices}%;
      }

      &.init-entering {
        opacity: 0;
        transform: translateX(40px);
      }
      &.entering {
        opacity: 1;
        transform: translateX(0px);
      }
      &.entered {
        opacity: 1;
        transform: unset;
      }
      &.exiting {
        opacity: 0;
        transform: translateX(40px);
      }
      &.exited {
        display: none;
      }
    }

    .popup-inner {
      width: calc(
        ${100 - left.forNormalDevices}vw - ${padding.forNormalDevices * 2}px
      );
      padding-top: 40px;
      padding-bottom: 30px;
      @media (max-width: ${deviceSize.forSmallerDevices}px) {
        width: calc(
          ${100 - left.forSmallerDevices}vw - ${padding.forSmallerDevices * 2}px
        );
      }
      @media (max-width: ${deviceSize.forReallySmallDevices}px) {
        width: calc(
          ${100 - left.forReallySmallDevices}vw -
          ${padding.forReallySmallDevices * 2}px
        );
      }
    }
  `;
}
