import React, { ChangeEvent, useState } from 'react';

interface TextEntryProps {
  onTextChange: (text: string) => void;
}

const TextEntry: React.FC<TextEntryProps> = ({ onTextChange }) => {
  const [inputText, setInputText] = useState<string>('');

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const newText = event.target.value;
    setInputText(newText);
    onTextChange(newText);
  };

  return (
    <div className="text-entry">
      <textarea
        value={inputText}
        onChange={handleChange}
        placeholder="Enter your text here..."
        rows={10}
        style={{ width: '100%' }}
      />
    </div>
  );
}

export default TextEntry;
