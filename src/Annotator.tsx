import React, { useState, useEffect } from 'react';
import OpenAI from 'openai';

interface AnnotatorProps {
  text: string;
}

const Annotator: React.FC<AnnotatorProps> = ({ text }) => {
  const [annotations, setAnnotations] = useState<string|null>('');

  useEffect(() => {
    if (text) {
      fetchAnnotations(text);
    }
  }, [text]);

  const fetchAnnotations = async (inputText: string) => {
    const openai = new OpenAI({
      apiKey: process.env['OPENAI_API_KEY'],
    });

    try {
      const completion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: inputText }],
        model: 'gpt-3.5-turbo',
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
