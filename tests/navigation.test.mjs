import test from 'node:test';
import assert from 'node:assert/strict';
import { DialogueJourney } from '../dialogue.js';
test('back from a section keeps the reply, back from the five subjects restores the previous answer',()=>{
  const j=new DialogueJourney();
  assert.ok(j.selectSubject('god')); assert.ok(j.choose('want-god'));
  assert.ok(j.selectSubject('universe')); j.back(); assert.equal(j.current.id,'want-god');
  assert.ok(j.selectSubject('universe')); assert.ok(j.choose('you-darkness'));
  j.back(); assert.equal(j.current.id,'want-god');
  j.selectSubject('universe'); assert.equal(j.choose('you-darkness'),false);
  assert.equal(j.choose('burial'),false);
});
