import ReactMarkdown from 'react-markdown';
import style from './DocEntry.style';

export default function DocEntry({ entry, page, setPage }) {
  const { fnSignature, summary } = entry.manifest;
  const onClick = () => {
    // DocEntry's can only be interacted with on a top-level page.
    if (page.includes('/')) {
      return;
    }
    setPage([page, entry.name].join('/'));
  };
  return (
    <div className={style.docEntry}>
      <code className={style.fnSignature} onClick={onClick}>
        {fnSignature}
      </code>
      <ReactMarkdown className={style.summary}>{summary}</ReactMarkdown>
    </div>
  );
}
