import React from 'react'
import Frame from './Frame'
import OverviewPage from './OverviewPage'
import SingleEntryPage from './SingleEntryPage'
import style from './App.style.js'

function App() {
  const [page, setPage] = React.useState(null)
  return (<>
    {page != null && (<>
      <div className={style.outsidePopup} onClick={() => setPage(null)} />
      <div className={style.popup}>
        <div className={style.popupInner}>
          <SingleEntryPage page={page} setPage={setPage}/>
        </div>
      </div>
    </>)}
    <Frame>
      <OverviewPage setPage={setPage} />
    </Frame>
  </>);
}

export default App;
