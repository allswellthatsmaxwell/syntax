import React, { useState, useEffect } from 'react';
import OpenAI from 'openai';

interface AnnotatorProps {
  text: string;
}

let system_message = `Your task is to annotate English text with various elements of syntax. This is for advanced study of syntax, of the kind covered in Virginia Tufte's Syntax as Style, so include and focus on advanced concepts, like adverbial modifiers, gerunds, subordinating conjunctions, and the like.

In response to the user's input, output a YAML file, where the key for each entry is the text you're annotating, and the keys are "syntax type" and "comments".  There is no need to include comments for most things, and if you do comment, keep it short.

Make the annotations very fine-grained. Do not do any nesting in the YAML.`;

const Annotator: React.FC<AnnotatorProps> = ({ text }) => {
  const [annotations, setAnnotations] = useState<string|null>('');

  useEffect(() => {
    if (text) {
      fetchAnnotations(text);
    }
  }, [text]);

  const fetchAnnotations = async (inputText: string) => {
    const openai = new OpenAI({
      apiKey: process.env['REACT_APP_OPENAI_API_KEY'],
      dangerouslyAllowBrowser: true
    });

    try {
      const completion = await openai.chat.completions.create({
        messages: [{ role: 'system', content: system_message },
                   { role: 'user', content: inputText }],
        model: 'gpt-4-1106-preview',
      });

      // Assuming the response includes YAML-formatted annotations
      setAnnotations(completion.choices[0]?.message?.content);
    } catch (error) {
      console.error('Error fetching annotations:', error);
      setAnnotations('Error fetching annotations.');
    }
  };

  return (
    <div className="annotator">
      <h2>Annotations:</h2>
      <div style={{ whiteSpace: 'pre-wrap', border: '1px solid black', padding: '10px', marginTop: '10px' }}>
        {annotations || 'No annotations to display.'}
      </div>
    </div>
  );
};

export default Annotator;
