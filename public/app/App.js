import { html, renderChoice, set, Signal, useCleanup } from './snapFramework.js'
import {
  classNameBuilder,
  defineStyledElement,
  parentPage,
  useCapturedValue,
  useCssTransition,
  useProtectedSignal
} from './shared.js';
import { Frame } from './Frame/Frame.js';
import { OverviewPage } from './OverviewPage/OverviewPage.js';
import { FrameworkPage } from './FrameworkPage/FrameworkPage.js';
import { SingleEntryPage } from './SingleEntryPage/SingleEntryPage.js';

export const App = defineStyledElement('App', getStyles, () => {
  const [signalPage, setSignalPage] = useRoute();
  const pageInfo = { signalPage, setSignalPage };

  const signalContent = useLoadContent();
  const signalShowingPopup = signalPage.use(page => page.startsWith('utils/') || page.startsWith('nolodash/'));

  return renderChoice([
    { // loading
      signalWhen: signalContent.use(content => content === null),
      render: () => new Frame({ hideFooter: true, children: html``, pageInfo }),
    },
    {
      signalWhen: new Signal(true),
      render: () => html`
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
              render: () => renderNotFound(),
            },
            // Framework page
            {
              signalWhen: signalPage.use(page => page.split('/')[0] === 'framework'),
              render: () => new FrameworkPage({ pageInfo }),
            },
            // utility/no-lodash page
            {
              signalWhen: new Signal(true),
              render: () => new OverviewPage({ signalContent, pageInfo }),
            }
          ]),
          pageInfo,
        })}
      `,
    }
  ]);
});

function renderNotFound() {
  return html`
    <p class="not-found">Page not found.</p>
  `;
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
            ]
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
    }
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
              popup: true
            },
            [
              signalPhase.use(phase => phase.name),
            ]
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
    }
  ])
}

function useLoadContent() {
  const [signalContent, updateSignalContent] = useProtectedSignal(null);

  Promise.all([
    fetch('utilsContent.json').then(x => x.json()),
    fetch('nolodashContent.json').then(x => x.json()),
  ]).then(([utilsContent, nolodashContent]) => {
    updateSignalContent({
      utils: utilsContent,
      nolodash: nolodashContent,
    });
  });

  return signalContent;
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

    .not-found {
      margin-left: 20px;
      color: #a00;
      font-weight: bold;
      letter-spacing: 0.08em;
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
