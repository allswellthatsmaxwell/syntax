import React, { useState, useEffect } from 'react';
import { fetchAnnotations, ParsedYaml, SyntaxInfo } from './annotation';

interface SyntaxOutputProps {
  text: string;
}

const SyntaxHighlighter: React.FC<SyntaxOutputProps> = ({ text }) => {
  const [parsedYaml, setParsedYaml] = useState<ParsedYaml | null>(null);

  useEffect(() => {
    const getAnnotations = async () => {
      const annotations = await fetchAnnotations(text);
      setParsedYaml(annotations);
    };

    if (text) {
      getAnnotations();
    }
  }, [text]);

  if (!parsedYaml) {
    return <div>Loading annotations...</div>;
  }

  return (
    <div className="syntax-highlighter">
      {Object.entries(parsedYaml).map(([key, value]) => (
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