import test from 'node:test';
import assert from 'node:assert/strict';
import { dialogues, gardenStory, DialogueJourney } from '../dialogue.js';
test('each sentence in the Garden narration comes from one of the six original Garden exchanges',()=>{
  const sources=['garden','came-garden','test','others','paradise','return'].map(id=>dialogues.find(d=>d.id===id).text);
  const lines=gardenStory.text.match(/[^.!?]+[.!?]/g).map(s=>s.trim());
  assert.ok(lines.every(line=>sources.some(s=>s.includes(line))));
  assert.ok(sources.every(s=>lines.some(line=>s.includes(line))));
});
test('old sessions retain other answers and omit the retired solitude exchange and its alias',()=>{
  for(const key of ['memory','alone-with-me']){
    const j=new DialogueJourney();
    assert.ok(j.restore({trail:['opening','identity','memory'],history:['identity',key]}));
    assert.equal(j.current.id,'identity');assert.deepEqual(j.history,['identity']);
    j.selectSubject('serpent'); assert.ok(!j.menuChoices.some(entry=>entry.id==='memory'));
  }
  const j=new DialogueJourney();
  assert.ok(j.restore({trail:['opening','garden','test'],history:['garden','test'],subject:'universe',browsing:true}));
  assert.equal(j.current.id,'test');assert.equal(j.menuChoices.length,16);
});
