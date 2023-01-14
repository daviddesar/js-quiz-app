import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism';

type CustomMarkdownProps = {
  text: string;
  className?: string;
  disabled?: boolean;
};

const CustomMarkdown = ({ text, className }: CustomMarkdownProps) =>
  text.replace(/\n$/, '').length < 1 ? null : (
    <ReactMarkdown
      className={className}
      components={{
        code({ inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');

          return !inline && match ? (
            <SyntaxHighlighter
              style={dracula}
              PreTag="div"
              wrapLongLines
              language="javascript"
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className={className ? className : ''} {...props}>
              {children}
            </code>
          );
        },
      }}
    >
      {text}
    </ReactMarkdown>
  );

export default CustomMarkdown;
