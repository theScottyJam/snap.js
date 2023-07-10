import ReactMarkdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import style from './MarkDown.style';

const components = {
  code: ({ children, inline, language }) =>
    inline ? (
      <code className={style.inlineCode}>{children}</code>
    ) : (
      <SyntaxHighlighter
        language={language ?? 'javascript'}
        style={atomOneLight}
      >
        {children}
      </SyntaxHighlighter>
    ),
};

export default function MarkDown({ children }) {
  return (
    <div className={style.markdown}>
      <ReactMarkdown components={components}>{children}</ReactMarkdown>
    </div>
  );
}
