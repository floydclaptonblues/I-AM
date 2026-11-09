// Every device plays the same approved David recording. Sentence cues and
// mouth envelope follows the media clock, including buffering and replay.
import { mouthLevelAt } from './mouth.js?v=mouth-1';
export class RecordedNarrator {
  constructor(options = {}) {
    this.onState = options.onState || (() => {});
    this.onSentence = options.onSentence || (() => {});
    this.onMouth = options.onMouth || (() => {});
    this.setTimer = options.setTimer || ((fn,ms) => setTimeout(fn,ms));
    this.clearTimer = options.clearTimer || (id => clearTimeout(id));
    this.requestFrame = options.requestFrame || (fn => requestAnimationFrame(fn));
    this.cancelFrame = options.cancelFrame || (id => cancelAnimationFrame(id));
    this.audio = (options.createAudio || (() => {
      const element = document.createElement('audio');
      element.id = 'voice-track'; element.hidden = true; element.preload = 'none';
      document.body.append(element); return element;
    }))();
    this.generation = 0;
    this.timer = null; this.frame = null;
    this.fetch = options.fetch || globalThis.fetch.bind(globalThis);
    this.catalog = null;
  }
  async loadCatalog() {
    if (!this.catalog) this.catalog = (async () => {
      const controller = new AbortController();
      const timeout = this.setTimer(() => controller.abort(),8000);
      try {
        const response = await this.fetch('assets/audio/manifest.json?v=mouth-1',{signal:controller.signal});
        if (!response.ok) throw new Error('Voice catalog unavailable');
        const manifest = await response.json();
        if (manifest.version !== 3 || !manifest.clips) throw new Error('Invalid voice catalog');
        this.readyCatalog = new Map(Object.values(manifest.clips).map(clip => {
          if (clip.mouth?.step !== .02 || typeof clip.mouth.levels !== 'string') throw new Error('Missing mouth timing');
          const samples = Uint8Array.from(atob(clip.mouth.levels), char => char.charCodeAt(0));
          if (Math.abs(samples.length*clip.mouth.step-clip.duration) > .021) throw new Error('Mouth timing length mismatch');
          return [clip.text,{...clip,mouth:{step:clip.mouth.step,samples}}];
        }));
        return this.readyCatalog;
      } catch { this.catalog = null; return null; }
      finally { this.clearTimer(timeout); }
    })();
    return this.catalog;
  }
  clearAudio() {
    this.cancelFrame(this.frame); this.clearTimer(this.timer);
    this.frame = this.timer = null;
    for (const event of ['playing','ended','error','pause','waiting','timeupdate']) this.audio['on'+event] = null;
    this.audio.pause();
    this.audio.removeAttribute('src'); this.audio.load();
    this.onMouth(0);
  }
  stop(state = 'idle') {
    this.generation++;
    this.clearAudio();
    this.onState(state);
  }
  async play(text, options = {}) {
    this.stop();
    const generation = this.generation;
    const valid = () => generation === this.generation;
    this.onState('loading');
    const catalog = this.readyCatalog || await this.loadCatalog();
    if (!valid()) return;
    const clip = catalog?.get(text);
    if (!clip || !/^assets\/audio\/[a-z0-9-]+\.mp3$/.test(clip.src)
      || !clip.mouth?.samples || !Array.isArray(clip.sentences) || !(clip.duration>0)) {
      this.stop('unavailable'); return;
    }
    this.audio.dataset.voice = 'microsoft-david';
    const rate = Math.min(2,Math.max(.5,options.rate ?? 1));
    this.audio.defaultPlaybackRate = rate;
    this.audio.playbackRate = rate;
    this.audio.preservesPitch = true;
    this.audio.volume = Math.min(1,Math.max(0,options.volume ?? 1));
    let sentenceIndex = -1, state = '', buffering = true;
    const setState = next => { if (state !== next) { state = next; this.onState(next); } };
    const update = () => {
      if (!valid() || this.audio.paused || buffering) return;
      const time = this.audio.currentTime;
      const index = clip.sentences.findLastIndex(sentence => sentence.time <= time);
      const sentence = clip.sentences[index];
      if (!sentence) return;
      if (index !== sentenceIndex) {
        sentenceIndex = index;
        this.onSentence(sentence.text,index,clip.sentences.length);
      }
      setState(time < sentence.end ? 'speaking' : 'between');
      this.onMouth(time < sentence.end ? mouthLevelAt(clip.mouth,time) : 0);
    };
    const tick = () => { if (valid()) { update(); this.frame = this.requestFrame(tick); } };
    const fail = () => { if (valid()) this.stop('unavailable'); };
    const watchdog = ms => {
      this.clearTimer(this.timer); this.timer = this.setTimer(fail,ms);
    };
    this.audio.onplaying = () => {
      if (!valid()) return;
      buffering = false;
      watchdog(Math.max(20000,(clip.duration-this.audio.currentTime)/rate*1000+15000));
      setState('speaking'); this.cancelFrame(this.frame); tick();
    };
    this.audio.onwaiting = () => {
      if (!valid()) return;
      buffering = true; this.onMouth(0); setState('loading'); watchdog(12000);
    };
    this.audio.onpause = () => { if (valid() && !this.audio.ended) { this.onMouth(0); setState('paused'); } };
    this.audio.ontimeupdate = update;
    this.audio.onended = () => { if (valid()) this.stop('finished'); };
    this.audio.onerror = fail;
    this.audio.src = clip.src;
    watchdog(12000);
    try { await this.audio.play(); } catch { fail(); }
  }
}
