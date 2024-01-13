import React, { useState, useEffect } from 'react';
import { fetchAnnotations, ParsedAnnotations, SyntaxInfo } from './annotation';

interface SyntaxOutputProps {
  text: string;
}

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
          <span className="syntax-key" title={`Syntax Type: ${value['syntax type']}\nComments: ${value.comments || ''}`}>
            {key}
          </span>
        </div>
      ))}
    </div>
  );
}

export default SyntaxHighlighter;