import ReactMarkdown from 'react-markdown'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import style from './Description.style'

export default function Description({description, summary}) {
  const components = {
    code: ({children, inline, language}) => inline
      ? (
          <code className={style.inlineCode}>{children}</code>
        )
      : (
        <SyntaxHighlighter language={language ?? 'javascript'} style={atomOneLight}>
          {children}
        </SyntaxHighlighter>
      ),
  }

  return (
    <div className={style.description}>
      <ReactMarkdown components={components}>{summary+'\n\n'+description}</ReactMarkdown>
    </div>
  )
}