import ReactMarkdown from 'react-markdown'
import style from './DocEntry.style'

export default function DocEntry({entry, setPage}) {
  const {fnSignature, summary} = entry.manifest
  return (
    <div className={style.docEntry}>
      <code className={style.fnSignature} onClick={() => setPage(entry)}>{fnSignature}</code>
      <ReactMarkdown className={style.summary}>{summary}</ReactMarkdown>
    </div>
  )
}