import OpenAI from 'openai';
import yaml from 'js-yaml';

let system_message = `Your task is to annotate English text with various elements of syntax. This is for advanced study of syntax, of the kind covered in Virginia Tufte's Syntax as Style, so include and focus on advanced concepts, like adverbial modifiers, gerunds, subordinating conjunctions, and the like.

In response to the user's input, output a JSON, where the key for each entry is the text you're annotating, and the keys are "syntax type" and "comments".  There is no need to include comments for most things, and if you do comment, keep it short.

Make the annotations very fine-grained. Do not do any nesting in the JSON - the maximum depth should be 1. 
This output will be read by JSON.parse in TypeScript, so make sure it's valid JSON and escaped properly.

Don't include the entire sentence as a key. Keys should be smaller than that.`

let mock = true;
let mockedAnnotations = `{
  "I wonder": {
      "syntax type": "Main Clause"
  },
  "if": {
      "syntax type": "Subordinating Conjunction"
  },
  "you keep on": {
      "syntax type": "Verb Phrase",
      "comments": "Possible phrasal verb; 'keep on' indicates the continuation of an action"
  },
  "learning": {
      "syntax type": "Gerund",
      "comments": "Functions as the direct object of the verb phrase 'keep on'"
  },
  "or": {
      "syntax type": "Coordinating Conjunction",
      "comments": "Connects two independent clauses"
  },
  "if there is": {
      "syntax type": "Subordinating Clause"
  },
  "only a certain amount": {
      "syntax type": "Noun Phrase",
      "comments": "Subject of the subordinate clause, modified by the quantifying adjective phrase 'only a certain'"
  },
  "each man": {
      "syntax type": "Noun Phrase",
      "comments": "Subject of the modal verb 'can understand'"
  },
  "can understand": {
      "syntax type": "Modal Verb Phrase",
      "comments": "Indicates ability"
  }
}`

export interface SyntaxInfo {
  "syntax type": string;
  comments?: string; // Optional if you have comments
}

export type ParsedAnnotations = Record<string, SyntaxInfo>;



export const fetchAnnotations = async (inputText: string): Promise<ParsedAnnotations | null> => {
  const openai = new OpenAI({
    apiKey: process.env['REACT_APP_OPENAI_API_KEY'],
    dangerouslyAllowBrowser: true
  });

  let annotations: string | null = null;
  if (mock) {
    annotations = mockedAnnotations;
  } else {
    try {
      console.log('Fetching annotations for:', inputText);
      const completion = await openai.chat.completions.create({
        messages: [
          { role: 'system', content: system_message },
          { role: 'user', content: inputText }],
        model: 'gpt-4-1106-preview',
        response_format: { "type": "json_object" },
      });

      // Assuming the response is YAML-formatted annotations
      annotations = completion.choices[0]?.message?.content;
    } catch (error) {
      console.error('Error fetching annotations:', error);
    }
  }

  try {
    if (annotations) {
      let jsonString = annotations.replace(/^json```|```/g, '').trim();
      console.log('JSON string:', jsonString);
      const parsedData: ParsedAnnotations = JSON.parse(jsonString) as ParsedAnnotations;

      console.log('Parsed data:', parsedData);
      return parsedData;
    }
  } catch (e) {
    console.error('Error parsing JSON string:', e);
  }
  return null;
};

