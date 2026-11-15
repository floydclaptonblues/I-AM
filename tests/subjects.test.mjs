import test from 'node:test';
import assert from 'node:assert/strict';
import { DialogueJourney, subjects } from '../dialogue.js';

test('every question is available on first entry and returns to all five sections', () => {
  const all = subjects.flatMap(s=>s.questions);
  assert.equal(new Set(all).size, all.length);
  assert.deepEqual(subjects.map(s=>s.questions.length),[16,1,10,16,11]);
  for (const section of subjects) {
    for (const id of section.questions) {
      const j = new DialogueJourney();
      assert.ok(j.selectSubject(section.id));
      assert.deepEqual(j.menuChoices.map(row=>row.id),section.questions);
      assert.ok(j.choose(id));
      assert.deepEqual(j.menuChoices.map(row=>row.id),subjects.map(s=>s.id));
      const restored = new DialogueJourney();
      assert.ok(restored.restore(j.snapshot()));
      assert.deepEqual(restored.transcript,j.transcript);
      restored.selectSubject(section.id);
      assert.equal(restored.menuChoices.some(row=>row.id===id),section.id==='garden');
    }
  }
});

test('the last unanswered question leaves its section visible and disabled',()=>{
  const j=new DialogueJourney();
  const section=subjects.find(s=>s.id==='god');
  for(const id of [...section.questions].reverse()){assert.ok(j.selectSubject(section.id));assert.ok(j.choose(id));}
  assert.equal(j.menuChoices.find(s=>s.id==='god').disabled,true);
  assert.equal(j.selectSubject('god'),false);
  assert.equal(j.history.length,10);
});
