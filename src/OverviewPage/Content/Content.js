import React from 'react'
import style from './Content.style'
import DocEntry from '../DocEntry'

export default function Content({setPage}) {
  const content = useLoadContent()
  if (!content) return null
  return (<div className={style.content}>
    {content.map(({categoryHeading, entries}) => (
      <Category key={categoryHeading} heading={categoryHeading} entries={entries} setPage={setPage} />
    ))}
  </div>)
}

function Category({heading, entries, setPage}) {
  return (<>
    <h1 className={style.categoryName}>{heading}</h1>
    {entries.map(entry => (
      <DocEntry key={entry.name} entry={entry} setPage={setPage} />
    ))}
  </>)
}

function useLoadContent() {
  const [content, setContent] = React.useState(null)
  React.useEffect(() => void (
    fetch(process.env.PUBLIC_URL + '/content.json')
    .then(x => x.json())
    .then(setContent)
  ), [])
  return content
}