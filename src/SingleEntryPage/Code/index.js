import SyntaxHighlighter from 'react-syntax-highlighter'
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs'

export default function Code({src}) {
  return (
    <SyntaxHighlighter
      language="javascript"
      style={atomOneDark}
      showLineNumbers
    >
      {src}
    </SyntaxHighlighter>
  )
}