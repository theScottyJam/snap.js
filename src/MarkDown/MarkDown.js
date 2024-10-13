import ReactMarkdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import style from './MarkDown.style';
import {
  doesCodeBlockHaveChoices,
  CodeBlockWithChoices,
} from './CodeBlockWithChoices.js';

function Code({ children: [text], inline, language }) {
  if (inline) {
    return <code className={style.inlineCode}>{text}</code>;
  }

  const renderCodeBlock = code => (
    <SyntaxHighlighter language={language ?? 'javascript'} style={atomOneLight}>
      {code}
    </SyntaxHighlighter>
  );

  if (doesCodeBlockHaveChoices(text)) {
    return (
      <CodeBlockWithChoices text={text} renderCodeBlock={renderCodeBlock} />
    );
  } else {
    return renderCodeBlock(text);
  }
}

const components = { code: Code };

export default function MarkDown({ children }) {
  return (
    <div className={style.markdown}>
      <ReactMarkdown components={components}>{children}</ReactMarkdown>
    </div>
  );
}
