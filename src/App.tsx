import React, { useState } from 'react';
import TextEntry from './TextEntry';
import SyntaxOutput from './SyntaxOutput';
import Annotator from './Annotator';



const App: React.FC = () => {
  const [text, setText] = useState<string>('');

  const handleTextChange = (newText: string) => {
    setText(newText);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Text Syntax Highlighter</h1>
      </header>
      <main>
        <TextEntry onTextChange={handleTextChange} />
        <SyntaxOutput text={text} />
        <Annotator text={text} />
      </main>
    </div>
  );
}

export default App;
