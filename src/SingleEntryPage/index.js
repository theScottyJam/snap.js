import Code from './Code';
import Description from './Description';
import style from './index.style';
import {
  lookupContentEntryFromRoute,
  extractTopLevelPageFromRoute,
} from '../shared';

export default function SingleEntryPage({ page, setPage, content }) {
  const pageData = lookupContentEntryFromRoute(content, page);
  if (pageData === null) {
    return <NotFound setPage={setPage} page={page} />;
  }

  const { src, name, description } = pageData;
  const { summary } = pageData.manifest;
  return (
    <div>
      <BackButton setPage={setPage} page={page} />
      <h1
        style={{ fontSize: '1.7rem', fontFamily: "'Roboto Mono', monospace" }}
      >
        {name}()
      </h1>
      <Code src={src} />
      <Description summary={summary} description={description} />
    </div>
  );
}

function NotFound({ setPage, page }) {
  return (
    <div>
      <BackButton setPage={setPage} page={page} />
      <h1>Page not found</h1>
    </div>
  );
}

function BackButton({ setPage, page }) {
  return (
    <button
      className={style.backButton}
      onClick={() => setPage(extractTopLevelPageFromRoute(page) ?? 'utils')}
    >
      Back to overview
    </button>
  );
}
