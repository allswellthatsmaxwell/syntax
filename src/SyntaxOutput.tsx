import React from 'react';

interface SyntaxOutputProps {
  text: string;
}

const SyntaxOutput: React.FC<SyntaxOutputProps> = ({ text }) => {
  return (
    <div className="syntax-output">
      <h2>Processed Text:</h2>
      <div style={{ whiteSpace: 'pre-wrap', border: '1px solid black', padding: '10px', marginTop: '10px' }}>
        {text}
      </div>
    </div>
  );
}

export default SyntaxOutput;
