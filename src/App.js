import React from 'react';
import { useCapturedValue, useCssTransition } from './util';
import { parentPage } from './shared';
import Frame from './Frame';
import OverviewPage from './OverviewPage';
import SingleEntryPage from './SingleEntryPage';
import { FrameworkPage } from './FrameworkPage';
import style from './App.style.js';

function App() {
  const [page, setPage] = useRoute();

  const content = useLoadContent();
  if (!content) {
    return <Frame hideFooter={true} page={page} setPage={setPage} />;
  }

  const showingPopup = page.includes('/');

  return (
    <>
      <PopupBackdrop
        show={showingPopup}
        onClick={() => setPage(parentPage(page))}
      />
      <PopupContent
        show={showingPopup}
        page={page}
        setPage={setPage}
        content={content}
      />
      <Frame page={page} setPage={setPage}>
        {page === 'framework' ? (
          <FrameworkPage />
        ) : page === 'notFound' ? (
          <NotFound />
        ) : (
          <OverviewPage page={page} setPage={setPage} content={content} />
        )}
      </Frame>
    </>
  );
}

function NotFound() {
  return <p className={style.notFound}>Page not found.</p>;
}

function PopupBackdrop({ show, onClick }) {
  const [phase, endTransition] = useCssTransition(show);
  if (!show && phase.name === 'exited') return null;
  return (
    <div
      className={style.popupBackdrop(phase.name)}
      onClick={onClick}
      onTransitionEnd={() => endTransition()}
    />
  );
}

function PopupContent({ show, page, setPage, content }) {
  const [phase, endTransition] = useCssTransition(show);
  const capturedPage = useCapturedValue(page, { freezeIf: !show });
  if (!show && phase.name === 'exited') return null;
  return (
    <div
      className={style.popup(phase.name)}
      onTransitionEnd={() => endTransition()}
    >
      <div className={style.popupInner}>
        <SingleEntryPage
          page={capturedPage}
          setPage={setPage}
          content={content}
        />
      </div>
    </div>
  );
}

function useLoadContent() {
  const [content, setContent] = React.useState(null);
  React.useEffect(
    () =>
      void Promise.all([
        fetch(process.env.PUBLIC_URL + '/utilsContent.json').then(x =>
          x.json()
        ),
        fetch(process.env.PUBLIC_URL + '/nolodashContent.json').then(x =>
          x.json()
        ),
      ]).then(([utilsContent, nolodashContent]) => {
        setContent({
          utils: utilsContent,
          nolodash: nolodashContent,
        });
      }),
    []
  );
  return content;
}

function useRoute() {
  const startingRoute = fetchAndNormalizeCurrentHashPath();

  const [page, setPage] = React.useState(startingRoute);

  React.useEffect(() => {
    const onPopState = () => {
      setPage(fetchAndNormalizeCurrentHashPath());
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [setPage]);

  function setPageAndAddHistoryEvent(newPage) {
    if (newPage === page) return;
    window.history.pushState(undefined, undefined, '#!/' + newPage);
    setPage(newPage);
  }

  return [page, setPageAndAddHistoryEvent];
}

function fetchAndNormalizeCurrentHashPath() {
  let hashRoute = (window.location.hash ?? '').split('#!/')[1] ?? '';
  if (hashRoute.endsWith('/')) {
    // Remove trailing slash
    hashRoute = hashRoute.slice(0, -1);
  }

  if (hashRoute === '') {
    hashRoute = 'utils';
  } else if (hashRoute.match(/^framework\/release\/1\.0\/?$/)) {
    window.history.replaceState({}, 'Title', '/snap.js/#!/framework');
    hashRoute = 'framework';
  } else if (
    // If it's a route that doesn't start with a valid top-level route
    !/^(utils|nolodash|framework)(\/|$)/.exec(hashRoute) ||
    // Or if it starts with framework/... (we've already passed all valid checks for framework/... routes)
    hashRoute.startsWith('framework/')
  ) {
    // This won't return notFound for all not-found cases - the
    // utils and nolodash pages are in charge of rendering their own as needed.
    hashRoute = 'notFound';
  }

  return hashRoute;
}

export default App;
