import React, { useState, useEffect, ReactNode } from 'react';
import { fetchAnnotations, ParsedAnnotations } from './annotation';

import './SyntaxHighlighter.css';

interface SyntaxOutputProps {
  text: string;
}


interface TooltipProps {
  children: ReactNode;
  text: string;
}

const Tooltip: React.FC<TooltipProps> = ({ children, text }) => {
  const createMarkup = (text: string) => {
    // Splitting the text at the first newline character
    const parts = text.split(/\n/);
    const syntaxType = parts[0];
    const comments = parts.length > 1 ? parts.slice(1).join('<br />') : '';

    // Constructing HTML string with bold Syntax Type and optional comments
    const htmlText = `<strong>${syntaxType}</strong>${comments ? `<br />${comments}` : ''}`;

    return { __html: htmlText };
  };

  return (
    <div className="tooltip">
      {children}
      <span className="tooltiptext" dangerouslySetInnerHTML={createMarkup(text)}></span>
    </div>
  );
};

const SyntaxHighlighter: React.FC<SyntaxOutputProps> = ({ text }) => {
  const [parsedAnnotations, setParsedAnnotations] = useState<ParsedAnnotations | null>(null);

  useEffect(() => {
    const getAnnotations = async () => {
      const annotations = await fetchAnnotations(text);
      setParsedAnnotations(annotations);
    };

    if (text) {
      getAnnotations();
    }
  }, [text]);

  if (!parsedAnnotations) {
    return <div>Loading annotations...</div>;
  }

  return (
    <div className="syntax-highlighter">
      {Object.entries(parsedAnnotations).map(([key, value]) => (
        <div className="syntax-item" key={key}>
          <Tooltip key={key} text={`${value['syntax type']}${value.comments ? `\n\n${value.comments}` : ''}`}>
            <span className="syntax-key">{key}</span>
          </Tooltip>
        </div>
      ))}
    </div>
  );
}

export default SyntaxHighlighter;