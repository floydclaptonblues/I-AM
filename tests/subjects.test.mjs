import test from 'node:test';
import assert from 'node:assert/strict';
import { DialogueJourney, subjects } from '../dialogue.js';

test('every question is available on first entry and returns to all five sections', () => {
  const all = subjects.flatMap(s=>s.questions);
  assert.equal(new Set(all).size, all.length);
  assert.deepEqual(subjects.map(s=>s.questions.length),[16,1,10,17,11]);
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
      assert.deepEqual(restored.menuChoices.map(row=>row.id),section.questions);
      assert.ok(restored.choose(id));
    }
  }
});

test('all five fully explored sections reopen from an existing saved visit',()=>{
  const j=new DialogueJourney();
  for (const section of subjects) {
    for (const id of [...section.questions].reverse()) {
      assert.ok(j.selectSubject(section.id));
      assert.ok(j.choose(id));
    }
  }
  for (const section of subjects) {
    const restored=new DialogueJourney();
    assert.ok(restored.restore({...j.snapshot(),subject:section.id}));
    assert.equal(restored.subject,section.id);
    assert.deepEqual(restored.menuChoices.map(row=>row.id),section.questions);
    assert.ok(restored.choose(section.questions[0]));
    assert.ok(restored.selectSubject(section.id));
    assert.deepEqual(restored.menuChoices.map(row=>row.id),section.questions);
  }
});
