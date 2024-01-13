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
    return { __html: text.replace(/\n/g, '<br />') };
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
          <Tooltip key={key} text={`Syntax Type: ${value['syntax type']}${value.comments ? `\n\nComments: ${value.comments}` : ''}`}>
            <span className="syntax-key">{key}</span>
          </Tooltip>
        </div>
      ))}
    </div>
  );
}

export default SyntaxHighlighter;