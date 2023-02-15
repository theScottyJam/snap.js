import React from 'react';
import { useCapturedValue, useCssTransition } from './util';
import { parentPage } from './shared';
import Frame from './Frame';
import OverviewPage from './OverviewPage';
import SingleEntryPage from './SingleEntryPage';
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
        <OverviewPage page={page} setPage={setPage} content={content} />
      </Frame>
    </>
  );
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
  const currentHashRoute = (window.location.hash ?? '').split('#!/')[1] ?? '';
  let startingRoute = currentHashRoute;
  if (startingRoute.endsWith('/')) {
    // Remove trailing slash
    startingRoute = startingRoute.slice(0, -1);
  }
  if (!/^(utils|nolodash)(\/|$)/.exec(startingRoute)) {
    // Just forward any unknown top-level routes to the default landing page.
    // This also forwards the `/` route to utils/ as well.
    startingRoute = 'utils';
  }

  const [page, setPage] = React.useState(startingRoute);

  React.useEffect(() => {
    window.history.replaceState(undefined, undefined, '#!/' + page);
  }, [page]);

  return [page, setPage];
}

export default App;
