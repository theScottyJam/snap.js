import Code from './Code'
import Description from './Description'
import style from './index.style'

export default function SingleEntryPage({page, setPage}) {
  const {src, name, description} = page
  const {summary} = page.manifest
  return (
    <div>
      <button className={style.backButton} onClick={() => setPage(null)}>Back to overview</button>
      <h1 style={{fontSize: '1.7rem', fontFamily: "'Roboto Mono', monospace"}}>{name}()</h1>
      <Code src={src} />
      <Description summary={summary} description={description} />
    </div>
  )
}