import { mkdir, writeFile } from 'node:fs/promises';
import { opening, dialogues } from '../dialogue.js';
import { sentenceRanges } from '../answer.js';
import { sentencePause } from '../speech.js';

const entries = [{ id:'opening', text:opening }, ...dialogues].map(({id,text}) => {
  const sentences = sentenceRanges(text);
  return { id, text, sentences:sentences.map((sentence,index) => ({
    ...sentence, pause:index+1<sentences.length ? sentencePause(sentence.text,sentences[index+1].text,index)/1000 : 0
  })) };
});
await mkdir('.voice-work',{recursive:true});
await writeFile('.voice-work/script.json',JSON.stringify(entries,null,2));
console.log(`Exported ${entries.length} complete recordings without changing dialogue.`);
