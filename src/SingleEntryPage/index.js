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

  const topLevelPage = extractTopLevelPageFromRoute(page);
  if (topLevelPage === 'nolodash') {
    return (
      <NolodashSingleEntryPage
        pageData={pageData}
        page={page}
        setPage={setPage}
      />
    );
  } else {
    return (
      <DefaultSingleEntryPage
        pageData={pageData}
        page={page}
        setPage={setPage}
      />
    );
  }
}

function DefaultSingleEntryPage({ pageData, setPage, page }) {
  const { name, src, description } = pageData;
  const { summary } = pageData.manifest;
  return (
    <div>
      <BackButton setPage={setPage} page={page} />
      <h1 className={style.entryHeader}>{name}()</h1>
      {src && <Code src={src} />}
      <Description summary={summary} description={description} />
    </div>
  );
}

function NolodashSingleEntryPage({ pageData, setPage, page }) {
  const { src, description } = pageData;
  const { summary, lodashLink } = pageData.manifest;
  return (
    <div>
      <BackButton setPage={setPage} page={page} />
      <h1 className={style.entryHeader}>Lodash's version</h1>
      <a className={style.fnSignatureLink} href={lodashLink}>
        <code>{pageData.manifest.fnSignature}</code>
      </a>
      {src && <Code src={src} />}
      <Description
        summary={summary}
        description={'# The Vanilla JavaScript Equivalent\n\n' + description}
      />
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
