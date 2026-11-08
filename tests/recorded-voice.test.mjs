import test from 'node:test';
import assert from 'node:assert/strict';
import { RecordedNarrator } from '../recorded-voice.js';

const text='Who are you? I was here.';
const clip={text,src:'assets/audio/test-abc.mp3',duration:4,
  sentences:[{time:0,end:1.5,text:'Who are you?',start:0},{time:2,end:4,text:'I was here.',start:13}],
  words:[{time:0,start:0,length:3,sentence:0},{time:.5,start:4,length:3,sentence:0},
    {time:1,start:8,length:3,sentence:0},{time:2,start:0,length:1,sentence:1}]};
function setup({fetch,play}={}) {
  const states=[],words=[],sentences=[],utterances=[],timers=new Map(),frames=new Map();let id=0;
  const audio={dataset:{},paused:true,ended:false,currentTime:0,volume:1,playbackRate:1,
    pause(){this.paused=true;},load(){},removeAttribute(){delete this.src;},
    play(){this.paused=false;if(play)return play(this);this.onplaying?.();return Promise.resolve();}};
  const narrator=new RecordedNarrator({createAudio:()=>audio,
    fetch:fetch||(async()=>({ok:true,json:async()=>({version:1,clips:{test:clip}})})),
    synth:{getVoices:()=>[],cancel(){},speak:u=>utterances.push(u)},Utterance:class {constructor(text){this.text=text;}},
    onState:state=>states.push(state),onSentence:(...args)=>sentences.push(args),onWord:(...args)=>words.push(args),
    setTimer:(fn,ms)=>{timers.set(++id,{fn,ms});return id;},clearTimer:id=>timers.delete(id),
    requestFrame:fn=>{frames.set(++id,fn);return id;},cancelFrame:id=>frames.delete(id)});
  return {narrator,audio,states,words,sentences,utterances,timers,frames};
}
test('one mixed recording drives the sentence and word cues from its media clock',async()=>{
  const s=setup();await s.narrator.play(text);
  assert.equal(s.audio.src,clip.src);assert.equal(s.audio.dataset.mode,'layered');assert.equal(s.utterances.length,0);
  assert.deepEqual(s.words.at(-1),[0,3,'Who are you?']);
  s.audio.currentTime=1.1;s.audio.ontimeupdate();assert.deepEqual(s.words.at(-1),[8,3,'Who are you?']);
  s.audio.currentTime=1.7;s.audio.ontimeupdate();assert.equal(s.states.at(-1),'between');
  s.audio.currentTime=2.1;s.audio.ontimeupdate();assert.deepEqual(s.words.at(-1),[0,1,'I was here.']);
  assert.equal(s.sentences.at(-1)[1],1);
});
test('quiet finale settings apply to both mixed voices and reset for ordinary answers',async()=>{
  const s=setup();await s.narrator.play(text,{rate:.85,volume:.55});
  assert.equal(s.audio.volume,.55);assert.equal(s.audio.playbackRate,.85);assert.equal(s.audio.defaultPlaybackRate,.85);assert.equal(s.audio.preservesPitch,true);
  await s.narrator.play(text);assert.equal(s.audio.volume,1);assert.equal(s.audio.playbackRate,1);
});
test('Stop during catalog loading cannot start either voice later',async()=>{
  let resolve;const s=setup({fetch:()=>new Promise(done=>{resolve=done;})});
  const pending=s.narrator.play(text);s.narrator.stop();
  resolve({ok:true,json:async()=>({version:1,clips:{test:clip}})});await pending;
  assert.equal(s.audio.src,undefined);assert.equal(s.audio.paused,true);assert.equal(s.utterances.length,0);
});
test('Stop and switching answers invalidate media callbacks and cancel cue polling',async()=>{
  const s=setup();await s.narrator.play(text);const oldEnd=s.audio.onended,oldUpdate=s.audio.ontimeupdate;
  s.narrator.stop();assert.equal(s.frames.size,0);assert.equal(s.timers.size,0);
  oldEnd();oldUpdate();assert.equal(s.states.at(-1),'idle');
  await s.narrator.play(text);oldEnd();assert.equal(s.audio.paused,false);
  s.audio.onended();assert.equal(s.audio.paused,true);assert.equal(s.states.at(-1),'finished');
});
test('a missing clip falls back once; failure after playback never repeats spoken text',async()=>{
  const s=setup({play:()=>Promise.reject(new Error('Decode failed'))});await s.narrator.play(text);
  assert.equal(s.utterances.length,1);assert.equal(s.audio.dataset.mode,'browser-fallback');
  const active=setup();await active.narrator.play(text);active.audio.onerror(new Error('Connection lost'));
  assert.equal(active.utterances.length,0);assert.equal(active.states.at(-1),'unavailable');
});
test('blocked autoplay releases the controls without bypassing browser permission',async()=>{
  const s=setup({play:()=>Promise.reject(Object.assign(new Error('Blocked'),{name:'NotAllowedError'}))});
  await s.narrator.play(text);assert.equal(s.states.at(-1),'unavailable');assert.equal(s.utterances.length,0);
});
