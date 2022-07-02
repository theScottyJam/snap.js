import React from 'react';
import { useCapturedValue, useCssTransition } from './util';
import Frame from './Frame';
import OverviewPage from './OverviewPage';
import SingleEntryPage from './SingleEntryPage';
import style from './App.style.js';

function App() {
  const [page, setPage] = React.useState(null);
  return (
    <>
      <PopupBackdrop show={page != null} onClick={() => setPage(null)} />
      <PopupContent show={page != null} page={page} setPage={setPage} />
      <Frame>
        <OverviewPage setPage={setPage} />
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

function PopupContent({ show, page, setPage }) {
  const [phase, endTransition] = useCssTransition(show);
  const capturedPage = useCapturedValue(page, { freezeIf: !show });
  if (!show && phase.name === 'exited') return null;
  return (
    <div
      className={style.popup(phase.name)}
      onTransitionEnd={() => endTransition()}
    >
      <div className={style.popupInner}>
        <SingleEntryPage page={capturedPage} setPage={setPage} />
      </div>
    </div>
  );
}

export default App;
