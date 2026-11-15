import test from 'node:test';
import assert from 'node:assert/strict';
import { DialogueJourney, subjects, subjectQuestions, dialogues } from '../dialogue.js';

test('every question belongs to one subject and fresh subjects expose only grounded questions', () => {
  const ids = subjects.flatMap(subject => subject.questions);
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual([...ids].sort(), dialogues.map(entry => entry.id).sort());
  assert.deepEqual(subjects.flatMap(subject => subjectQuestions(subject.id,new Set()).map(entry => entry.id)).sort(),
    ['identity','age','garden','garden-story','evil','upright','before-humans','before-light','father-brighter'].sort());
});

test('subject navigation preserves the answer and never unlocks or records a discovery', () => {
  const journey = new DialogueJourney();
  assert.deepEqual(journey.menuChoices.map(entry => entry.label), subjects.map(subject => subject.label));
  journey.selectSubject('garden');
  assert.equal(journey.current.id,'opening'); assert.equal(journey.history.length,0);
  assert.deepEqual(journey.menuChoices.map(entry => entry.id),['garden-story']);
  assert.equal(journey.choose('test'),false);
  journey.choose('garden-story');
  const before = journey.snapshot();
  journey.showSubjects(); journey.selectSubject('universe');
  assert.equal(journey.current.id,'garden-story');
  assert.deepEqual(journey.history,before.history); assert.deepEqual(journey.trail,before.trail);
  assert.ok(journey.choose('before-humans')); assert.equal(journey.subject,null);
  assert.equal(journey.menuChoices[0].id,'other-lights');
  journey.back(); assert.equal(journey.current.id,'garden-story');
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
      if (next.id==='certain-light' && !journey.visited.has('shadows')) for (const id of ['identity','age','happy','darkness-ended']) assert.ok(journey.visited.has(id));
      if (next.id==='you-darkness') assert.ok(journey.visited.has('certain-light'));
      assert.ok(journey.choose(next.id)); changed=true;
    }
    if (!changed) break;
  }
  const legacyGarden = subjects.find(subject => subject.id === 'garden').questions.filter(id => id !== 'garden-story');
  assert.deepEqual([...journey.visited].sort(), dialogues.map(entry => entry.id).filter(id => !legacyGarden.includes(id)).sort());
  assert.ok(new DialogueJourney().restore(journey.snapshot()));
});

test('after every answer the follow-up menu contains only questions from its own category', () => {
  const journey = new DialogueJourney();
  for (const entry of dialogues) journey.visited.add(entry.id);
  for (const subject of subjects) {
    for (const id of subject.questions) {
      if (subject.id === 'garden' && id !== 'garden-story') continue;
      if (['universe','god'].includes(subject.id)) journey.visited.delete(id);
      journey.selectSubject(subject.id);
      assert.ok(journey.choose(id));
      assert.equal(journey.menuSubject.id,subject.id);
      if (['universe','god'].includes(subject.id)) {
        assert.deepEqual(journey.menuChoices, []);
        continue;
      }
      const expected = journey.choices.filter(entry => subject.questions.includes(entry.id));
      assert.deepEqual(journey.menuChoices.map(entry => entry.id),expected.map(entry => entry.id));
    }
  }
});

test('the Garden memory leads to either the grave or the serpent’s shadow', () => {
  for (const [subject, lead] of [['humanity','death'], ['universe','shadows']]) {
    const journey = new DialogueJourney();
    journey.selectSubject('garden');
    assert.ok(journey.choose('garden-story'));
    assert.deepEqual(journey.menuChoices, []);
    assert.deepEqual(journey.transitions.map(item => item.id), ['universe','humanity']);
    journey.selectSubject(subject);
    assert.equal(journey.menuChoices[0].id, lead);
    assert.ok(journey.choose(lead));
    if (lead === 'shadows') {
      for (const next of ['certain-light','you-darkness']) {
        assert.equal(journey.menuChoices[0].id, next);
        assert.ok(journey.choose(next));
      }
      assert.equal(journey.current.text, 'Who told you to ask me that?');
    }
    const resumed = new DialogueJourney();
    assert.ok(resumed.restore(journey.snapshot()));
    assert.deepEqual(resumed.transcript, journey.transcript);
  }
});

test('every Universe question is reachable once, even when branches are taken in reverse order', () => {
  const universe = subjects.find(subject => subject.id === 'universe');
  for (const pickLast of [false, true]) {
    let journey = new DialogueJourney();
    journey.selectSubject('universe');
    assert.deepEqual(journey.menuChoices.map(entry => entry.id), ['before-humans','before-light']);
    while (journey.menuChoices.length) {
      const choices = journey.menuChoices;
      assert.ok(choices.every(entry => !journey.visited.has(entry.id) && universe.questions.includes(entry.id)));
      const next = pickLast ? choices.at(-1) : choices[0];
      assert.ok(journey.choose(next.id));
      assert.equal(journey.choose(next.id), false);
      const restored = new DialogueJourney();
      assert.ok(restored.restore(journey.snapshot()));
      assert.deepEqual(restored.menuChoices, journey.menuChoices);
      journey = restored;
    }
    assert.deepEqual([...journey.visited].sort(), [...universe.questions].sort());
    assert.equal(journey.history.length, universe.questions.length);
    journey.showSubjects(); journey.selectSubject('universe');
    assert.deepEqual(journey.menuChoices, []);
  }
});

test('God threads exhaust both orders, preserve a missed fork, and unlock the father challenge only after both claims', () => {
  const god = subjects.find(subject => subject.id === 'god');
  for (const lastFirst of [true,false]) {
    let journey = new DialogueJourney();
    journey.selectSubject('god');
    assert.deepEqual(journey.menuChoices.map(entry => entry.id), ['evil','father-brighter']);
    while (journey.menuChoices.length) {
      assert.deepEqual(journey.transitions, []);
      assert.ok(journey.menuChoices.every(entry => !journey.visited.has(entry.id) && god.questions.includes(entry.id)));
      const next = lastFirst ? journey.menuChoices.at(-1) : journey.menuChoices[0];
      assert.ok(journey.choose(next.id));
      assert.equal(journey.choose(next.id),false);
      const saved = new DialogueJourney();
      assert.ok(saved.restore(journey.snapshot()));
      assert.deepEqual(saved.transcript,journey.transcript);
      assert.deepEqual(saved.menuChoices,journey.menuChoices);
      journey = saved;
    }
    assert.deepEqual([...journey.visited].sort(),god.questions.filter(id => id !== 'questioned-father').sort());
    assert.ok(journey.atSectionMain);
    journey.selectSubject('universe'); assert.ok(journey.choose('before-light'));
    journey.selectSubject('god'); assert.deepEqual(journey.menuChoices,[]);
    journey.selectSubject('universe'); assert.ok(journey.choose('before-humans'));
    journey.selectSubject('humanity'); assert.ok(journey.choose('called-back'));
    journey.selectSubject('god');
    assert.deepEqual(journey.menuChoices.map(entry => entry.id),['questioned-father']);
    assert.ok(journey.choose('questioned-father'));
    assert.deepEqual(journey.menuChoices,[]);
  }
});
