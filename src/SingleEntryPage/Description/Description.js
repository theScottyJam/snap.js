import ReactMarkdown from 'react-markdown'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import style from './Description.style'

export default function Description({description, summary}) {
  const renderers = {
    code: ({value, language}) => (
      <SyntaxHighlighter language={language || 'javascript'} style={atomOneLight}>
        {value}
      </SyntaxHighlighter>
    ),
    inlineCode: ({value}) => (
      <code className={style.inlineCode}>{value}</code>
    )
  }

  return (
    <div className={style.description}>
      <ReactMarkdown renderers={renderers}>{summary+'\n\n'+description}</ReactMarkdown>
    </div>
  )
}