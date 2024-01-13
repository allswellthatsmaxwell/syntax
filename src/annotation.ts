import OpenAI from 'openai';
import yaml from 'js-yaml';

let system_message = `Your task is to annotate English text with various elements of syntax. This is for advanced study of syntax, of the kind covered in Virginia Tufte's Syntax as Style, so include and focus on advanced concepts, like adverbial modifiers, gerunds, subordinating conjunctions, and the like.

In response to the user's input, output a YAML file, where the key for each entry is the text you're annotating, and the keys are "syntax type" and "comments".  There is no need to include comments for most things, and if you do comment, keep it short.

Make the annotations very fine-grained. Do not do any nesting in the YAML - the maximum depth should be 1.

Don't include the entire sentence as a key. Keys should be smaller than that.`

let mock = false;
let mockedAnnotations = `\`\`\`yaml
"Enter an instruction":
  syntax type: Imperative clause
"or":
  syntax type: Coordinating conjunction
"select":
  syntax type: Imperative clause
"a preset,":
  syntax type: Direct object (noun phrase)
"and":
  syntax type: Coordinating conjunction
"watch":
  syntax type: Imperative clause
"the API":
  syntax type: Direct object (noun phrase)
"respond":
  syntax type: Infinitive verb phrase
"with":
  syntax type: Preposition
"a message":
  syntax type: Object of the preposition (noun phrase)
"that":
  syntax type: Relative pronoun introducing a relative clause
"attempts":
  syntax type: Head verb of the relative clause
"to match":
  syntax type: Infinitive verb phrase functioning as an adverbial modifier
"or":
  syntax type: Coordinating conjunction within the relative clause
"answer":
  syntax type: Infinitive verb phrase functioning as an adverbial modifier
"the query.":
  syntax type: Direct object of the infinitive verb phrase (noun phrase)
\`\`\``

export interface SyntaxInfo {
  "syntax type": string;
  comments?: string; // Optional if you have comments
}

export type ParsedYaml = Record<string, SyntaxInfo>;



export const fetchAnnotations = async (inputText: string): Promise<ParsedYaml | null> => {
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
        messages: [{ role: 'system', content: system_message },
        { role: 'user', content: inputText }],
        model: 'gpt-4-1106-preview',
      });

      // Assuming the response is YAML-formatted annotations
      annotations = completion.choices[0]?.message?.content;
    } catch (error) {
      console.error('Error fetching annotations:', error);        
    }
  }

  try {
    if (annotations) {
      let yamlString = annotations.replace(/yaml```|```/g, '').trim();
      console.log('YAML string:', yamlString);
      const parsedData: ParsedYaml = yaml.load(yamlString) as ParsedYaml;
      console.log('Parsed data:', parsedData);
      return parsedData;
    }
  } catch (e) {
    console.error('Error parsing YAML string:', e);    
  }
  return null;
};

