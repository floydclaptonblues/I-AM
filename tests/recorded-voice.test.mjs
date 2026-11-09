import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import { RecordedNarrator } from '../recorded-voice.js';
import { opening, dialogues } from '../dialogue.js';
import { sentenceRanges } from '../answer.js';

const text='Who are you? I was here.';
const clip={text,src:'assets/audio/test-abc.mp3',duration:4,
  sentences:[{time:0,end:1.5,text:'Who are you?'},{time:2,end:4,text:'I was here.'}],
  pulses:[{time:0,wide:false},{time:.5,wide:true},{time:2,wide:false}]};
function setup({fetch,play}={}) {
  const states=[],pulses=[],sentences=[],timers=new Map(),frames=new Map();let id=0;
  const audio={dataset:{},paused:true,ended:false,currentTime:0,volume:1,playbackRate:1,
    pause(){this.paused=true;},load(){},removeAttribute(){delete this.src;},
    play(){this.paused=false;if(play)return play(this);this.onplaying?.();return Promise.resolve();}};
  const narrator=new RecordedNarrator({createAudio:()=>audio,
    fetch:fetch||(async()=>({ok:true,json:async()=>({version:2,clips:{test:clip}})})),
    onState:state=>states.push(state),onSentence:(...args)=>sentences.push(args),onPulse:pulse=>pulses.push(pulse),
    setTimer:(fn,ms)=>{timers.set(++id,{fn,ms});return id;},clearTimer:id=>timers.delete(id),
    requestFrame:fn=>{frames.set(++id,fn);return id;},cancelFrame:id=>frames.delete(id)});
  return {narrator,audio,states,pulses,sentences,timers,frames};
}
test('same David recording drives sentence and waveform cues from the media clock',async()=>{
  const s=setup();await s.narrator.play(text);
  assert.equal(s.audio.src,clip.src);assert.equal(s.audio.dataset.voice,'microsoft-david');
  assert.deepEqual(s.pulses,[false]);
  s.audio.currentTime=.53;s.audio.ontimeupdate();assert.deepEqual(s.pulses,[false,true]);
  s.audio.currentTime=1.7;s.audio.ontimeupdate();assert.equal(s.states.at(-1),'between');
  s.audio.currentTime=2.1;s.audio.ontimeupdate();assert.equal(s.sentences.at(-1)[1],1);
});
test('quiet finale preserves pitch while slowing, then replay restores ordinary settings',async()=>{
  const s=setup();await s.narrator.play(text,{rate:.85,volume:.55});
  assert.equal(s.audio.volume,.55);assert.equal(s.audio.playbackRate,.85);assert.equal(s.audio.defaultPlaybackRate,.85);assert.equal(s.audio.preservesPitch,true);
  await s.narrator.play(text);assert.equal(s.audio.volume,1);assert.equal(s.audio.playbackRate,1);
});
test('Stop while catalog loads cannot start delayed audio',async()=>{
  let resolve;const s=setup({fetch:()=>new Promise(done=>{resolve=done;})});
  const pending=s.narrator.play(text);s.narrator.stop();
  resolve({ok:true,json:async()=>({version:2,clips:{test:clip}})});await pending;
  assert.equal(s.audio.src,undefined);assert.equal(s.audio.paused,true);
});
test('Stop and answer switching invalidate callbacks and pending play rejection',async()=>{
  let reject;const s=setup({play:()=>new Promise((_,no)=>{reject=no;})});
  const pending=s.narrator.play(text);await new Promise(resolve=>setImmediate(resolve));
  const oldEnd=s.audio.onended,oldUpdate=s.audio.ontimeupdate;
  s.narrator.stop();reject(new Error('Old load'));await pending;
  oldEnd();oldUpdate();assert.equal(s.states.at(-1),'idle');assert.equal(s.frames.size,0);assert.equal(s.timers.size,0);
  const active=setup();await active.narrator.play(text);const stale=active.audio.onended;
  await active.narrator.play(text);stale();assert.equal(active.audio.paused,false);
  active.audio.onended();assert.equal(active.states.at(-1),'finished');
});
test('buffering stops mouth cues, retains loading state, and resumes on the media clock',async()=>{
  const s=setup();await s.narrator.play(text);s.audio.onwaiting();
  s.audio.currentTime=.5;s.audio.ontimeupdate();assert.equal(s.states.at(-1),'loading');assert.equal(s.pulses.length,1);
  s.audio.onplaying();assert.equal(s.states.at(-1),'speaking');assert.deepEqual(s.pulses,[false,true]);
});
test('network, missing recording, autoplay and decoder failures release controls without substituting a device voice',async()=>{
  for(const s of [setup({fetch:async()=>({ok:false})}),setup({play:()=>Promise.reject(new Error('Decode'))}),
    setup({play:()=>Promise.reject(Object.assign(new Error('Blocked'),{name:'NotAllowedError'}))})]) {
    await s.narrator.play(text);assert.equal(s.states.at(-1),'unavailable');assert.equal(s.audio.paused,true);
  }
  const s=setup();await s.narrator.play('New unrecorded line.');assert.equal(s.states.at(-1),'unavailable');
  const active=setup();await active.narrator.play(text);active.audio.onerror();assert.equal(active.states.at(-1),'unavailable');
});
test('every current answer has a matching hashed lossless recording and bounded sentence/audio cues',()=>{
  const manifest=JSON.parse(readFileSync(new URL('../assets/audio/manifest.json',import.meta.url),'utf8'));
  assert.equal(manifest.version,2);assert.equal(manifest.voice,'Microsoft David Desktop');assert.equal(manifest.sapiPitch,-6);
  const entries=[{id:'opening',text:opening},...dialogues];
  assert.equal(Object.keys(manifest.clips).length,entries.length);
  for(const entry of entries) {
    const clip=manifest.clips[entry.id];assert.equal(clip.text,entry.text,entry.id);
    assert.deepEqual(clip.sentences.map(s=>s.text),sentenceRanges(entry.text).map(s=>s.text));
    const name=clip.src.split('/').at(-1).replace('.mp3','');
    const wav=gunzipSync(readFileSync(new URL('../voice-source/'+name+'.wav.gz',import.meta.url)));
    assert.equal(wav.toString('ascii',0,4),'RIFF');assert.equal(wav.readUInt32LE(24),22050);
    assert.ok(name.endsWith(createHash('sha256').update(wav).digest('hex').slice(0,12)));
    assert.ok(Math.abs((wav.length-44)/44100-clip.duration)<.001);
    assert.ok(clip.sentences.every((s,i)=>s.time>=0&&s.end>s.time&&s.end<=clip.duration+.001&&(!i||s.time>=clip.sentences[i-1].end)));
    assert.ok(clip.pulses.length>0);
    assert.ok(clip.pulses.every((p,i)=>p.time>=0&&p.time<clip.duration&&(!i||p.time>clip.pulses[i-1].time)));
  }
});
