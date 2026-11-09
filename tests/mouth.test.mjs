import test from 'node:test';
import assert from 'node:assert/strict';
import { mouthLevelAt, mouthPose } from '../mouth.js';
import { Portrait } from '../portrait.js';

test('mouth envelope interpolates the media timeline and safely closes outside it',()=>{
  const mouth={step:.02,samples:Uint8Array.from([0,255,0,128])};
  assert.equal(mouthLevelAt(mouth,.01),.5);
  assert.equal(mouthLevelAt(mouth,.02),1);
  assert.equal(mouthLevelAt(mouth,.04),0);
  for(const time of [-1,.08,50,NaN]) assert.equal(mouthLevelAt(mouth,time),0);
});
test('jaw thresholds avoid flutter near pose boundaries while silence closes immediately',()=>{
  assert.equal(mouthPose(.11,'closed'),'closed');
  assert.equal(mouthPose(.13,'closed'),'partial');
  assert.equal(mouthPose(.70,'partial'),'partial');
  assert.equal(mouthPose(.73,'partial'),'open');
  assert.equal(mouthPose(.60,'open'),'open');
  assert.equal(mouthPose(.55,'open'),'partial');
  assert.equal(mouthPose(0,'open'),'closed');
});
test('recorded jaw holds sustained sound without a flap timer and respects motion suppression',()=>{
  const frames=[],timers=new Map();let id=0;
  const portrait=new Portrait({setFrame:f=>frames.push(f),setTimer:fn=>{timers.set(++id,fn);return id;},clearTimer:id=>timers.delete(id)});
  portrait.start();portrait.setSpeaking(true);
  assert.equal(frames.at(-1),'closed','No synthetic mouth opening before audio');
  portrait.setMouthLevel(.8);assert.equal(frames.at(-1),'open');
  const count=frames.length;
  for(let i=0;i<50;i++)portrait.setMouthLevel(.8);
  assert.equal(frames.length,count,'Sustained sound does not repeatedly reset the pose');
  assert.equal(timers.size,1,'Only the independent blink timer remains');
  portrait.setMouthLevel(.3);assert.equal(frames.at(-1),'partial');
  portrait.setMouthLevel(0);assert.equal(frames.at(-1),'closed');
  portrait.setMouthLevel(.8);portrait.setStill(true);portrait.setMouthLevel(.8);
  assert.equal(frames.at(-1),'closed');assert.equal(timers.size,0);
  portrait.setStill(false);portrait.setMouthLevel(.8);portrait.setSpeaking(false);portrait.setMouthLevel(.8);
  assert.equal(frames.at(-1),'closed');
  portrait.suspend();portrait.setMouthLevel(.8);assert.equal(frames.at(-1),'closed');
});
