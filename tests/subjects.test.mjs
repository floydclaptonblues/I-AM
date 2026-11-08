import test from 'node:test';
import assert from 'node:assert/strict';
import { DialogueJourney, subjects, subjectQuestions, dialogues } from '../dialogue.js';

test('every question belongs to one subject and fresh subjects expose only grounded questions', () => {
  const ids = subjects.flatMap(subject => subject.questions);
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual([...ids].sort(), dialogues.map(entry => entry.id).sort());
  assert.deepEqual(subjects.flatMap(subject => subjectQuestions(subject.id,new Set()).map(entry => entry.id)).sort(),
    ['identity','age','garden','evil','upright','before-humans'].sort());
});

test('subject navigation preserves the answer and never unlocks or records a discovery', () => {
  const journey = new DialogueJourney();
  assert.deepEqual(journey.menuChoices.map(entry => entry.label), subjects.map(subject => subject.label));
  journey.selectSubject('garden');
  assert.equal(journey.current.id,'opening'); assert.equal(journey.history.length,0);
  assert.deepEqual(journey.menuChoices.map(entry => entry.id),['garden']);
  assert.equal(journey.choose('test'),false);
  journey.choose('garden'); journey.choose('test');
  const before = journey.snapshot();
  journey.showSubjects(); journey.selectSubject('universe');
  assert.equal(journey.current.id,'test');
  assert.deepEqual(journey.history,before.history); assert.deepEqual(journey.trail,before.trail);
  assert.ok(journey.choose('before-humans')); assert.equal(journey.subject,null);
  assert.equal(journey.menuChoices[0].id,'why-wait');
  journey.back(); assert.equal(journey.current.id,'test');
});

test('selected subjects survive saves without changing old conversation saves', () => {
  for (const atOpening of [true,false]) {
    const journey = new DialogueJourney();
    if (!atOpening) journey.choose('identity');
    journey.selectSubject('god');
    const restored = new DialogueJourney(); assert.ok(restored.restore(journey.snapshot()));
    assert.equal(restored.subject,'god'); assert.equal(restored.menuChoices[0].id,'evil');
    restored.showSubjects(); assert.ok(restored.showingSubjects);
  }
  const old = new DialogueJourney(); assert.ok(old.restore({trail:['opening','garden'],history:['garden'],browsing:true}));
  assert.ok(old.showingSubjects); assert.equal(old.subject,null);
  const invalid = new DialogueJourney(); assert.ok(invalid.restore({trail:['opening'],history:[],subject:'missing'}));
  assert.equal(invalid.subject,null);
});

test('unlocked questions can be revisited through their genre and restore after a cross-subject jump', () => {
  const journey = new DialogueJourney(); journey.choose('garden'); journey.choose('test');
  journey.showSubjects(); journey.selectSubject('humanity');
  assert.ok(journey.choose('death'));
  const restored = new DialogueJourney(); assert.ok(restored.restore(journey.snapshot()));
  assert.equal(restored.current.id,'death'); restored.back(); assert.equal(restored.current.id,'test');
});

test('all exchanges are reachable through subjects while late revelations remain gated', () => {
  const journey = new DialogueJourney();
  for (let pass=0; pass<dialogues.length; pass++) {
    let changed=false;
    for (const subject of subjects) {
      journey.selectSubject(subject.id);
      const next = journey.menuChoices.find(entry => !journey.visited.has(entry.id));
      if (!next) continue;
      if (next.id==='certain-light') for (const id of ['identity','age','happy','darkness-ended']) assert.ok(journey.visited.has(id));
      if (next.id==='you-darkness') assert.ok(journey.visited.has('certain-light'));
      assert.ok(journey.choose(next.id)); changed=true;
    }
    if (!changed) break;
  }
  assert.equal(journey.visited.size,dialogues.length);
  assert.ok(new DialogueJourney().restore(journey.snapshot()));
});
