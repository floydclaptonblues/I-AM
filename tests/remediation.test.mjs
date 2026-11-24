import test from 'node:test';
import assert from 'node:assert/strict';
import { dialogues, contradictions } from '../dialogue.js';
import { sentencePause, defaultPacing } from '../speech.js';
import { sentenceRanges } from '../answer.js';
import { loadSession, saveSession } from '../session.js';

test('the supplied three reactions are exact and no prior answers are replaced', () => {
  assert.equal(dialogues.length,61);
  assert.deepEqual(contradictions.map(d=>d.text), [
    'I said creation called back. You mistake the light for the things it illuminated. Or perhaps I have mistaken them.',
    'I wondered when you would notice.',
    'Alone is not the absence of others. It is the absence of anyone who can see you.'
  ]);
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
