import React, { ChangeEvent, useState } from 'react';

interface TextEntryProps {
  setText: (text: string) => void;
}

const TextEntry: React.FC<TextEntryProps> = ({ setText }) => {  
  const [inputValue, setInputValue] = useState<string>('');

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {    
    setInputValue(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && inputValue.length > 0) {
        setText(inputValue);
    }
};

  return (
    <div className="text-entry">
      <textarea
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyPress}
        placeholder="Enter your text here..."
        rows={10}
        style={{ width: '100%' }}
      />
    </div>
  );
}

export default TextEntry;
