import test from 'node:test';
import assert from 'node:assert/strict';
import { dialogues, contradictions, availableDialogues, relatedDialogues, DialogueJourney, questionLabel } from '../dialogue.js';
import { sentencePause, defaultPacing } from '../speech.js';
import { sentenceRanges } from '../answer.js';
import { loadSession, saveSession } from '../session.js';

for (const challenge of contradictions) {
  test(challenge.id + ' requires both claims and stays available on revisiting them', () => {
    const [first, second] = challenge.requires;
    for (const seen of [[], [first], [second]]) assert.ok(!availableDialogues(new Set(seen)).includes(challenge));
    const seen = new Set([first, second]);
    assert.ok(availableDialogues(seen).includes(challenge));
    for (const context of challenge.contexts) assert.ok(relatedDialogues(context,seen).includes(challenge));
  });
}

test('the supplied three reactions are exact and no prior answers are replaced', () => {
  assert.equal(dialogues.length,51);
  assert.deepEqual(contradictions.map(d=>d.text), [
    'I said creation called back. You mistake the light for the things it illuminated. Or perhaps I have mistaken them.',
    'I wondered when you would notice.',
    'Alone is not the absence of others. It is the absence of anyone who can see you.'
  ]);
});

test('both light and darkness enter cosmic origins without visiting identity', () => {
  for (const entrance of ['light','darkness']) {
    const j = new DialogueJourney();
    for (const id of ['evil',entrance,'before-humans','why-wait','before-light']) assert.ok(j.choose(id),id);
    assert.ok(!j.visited.has('identity')); assert.ok(!j.visited.has('age'));
    assert.equal(questionLabel(dialogues.find(d=>d.id==='why-wait')), 'Why did you wait for us?');
    assert.ok(!availableDialogues(j.visited).some(d=>d.id==='certain-light'));
  }
});

test('alternate entrance does not remove age from the final identity gate', () => {
  const seen = new Set(dialogues.map(d=>d.id)); seen.delete('age');
  assert.ok(!availableDialogues(seen).some(d=>d.id==='certain-light'));
});

test('paired-claim challenge and second entrance survive a real saved journey', () => {
  const j=new DialogueJourney();
  for(const id of ['evil','darkness','before-humans','why-wait','other-lights','alone-with-lights']) assert.ok(j.choose(id),id);
  let raw;const storage={getItem:()=>raw,setItem:(_,value)=>{raw=value;}};
  saveSession(j,{muted:true,still:false},()=>storage);
  const restored=loadSession(()=>storage).journey;
  assert.deepEqual(restored.snapshot(),j.snapshot());
  restored.back(); assert.ok(restored.choices.some(d=>d.id==='alone-with-lights'));
  assert.ok(restored.visited.has('alone-with-lights'));
});

test('pacing distinguishes ordinary and rhetorical transitions and accepts explicit pauses', () => {
  assert.equal(sentencePause('First.','Second.',0),300);
  assert.equal(sentencePause('Why?','Because.',0),650);
  assert.equal(sentencePause('First.','Yet I waited.',0),650);
  assert.equal(sentencePause('First.','Second.',0,defaultPacing,{0:1200}),1200);
  assert.equal(sentencePause('First.','Second.',0,{ordinary:400,rhetorical:800}),400);
  assert.equal(sentencePause('First.','Second.',0,defaultPacing,{0:Infinity}),300);
});

test('sentence offsets retain the entire original response including whitespace', () => {
  const text='I waited.  You returned?\nI remain.';
  assert.deepEqual(sentenceRanges(text),[{text:'I waited.',start:0},{text:'You returned?',start:11},{text:'I remain.',start:25}]);
});
