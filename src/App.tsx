import React, { useState } from 'react';
import { Grid, Drawer, Box } from '@mui/material';

import './App.css';
import TextEntry from './TextEntry';
import SyntaxHighlighter from './SyntaxHighlighter';



const App: React.FC = () => {
  const [text, setText] = useState<string>('');

  return (
    <div className="App">
      <main>
        <div className='text-box'>
          <TextEntry setText={setText} />          
          <SyntaxHighlighter text={text} />          
        </div>

      </main>
    </div>
  );
}

export default App;
