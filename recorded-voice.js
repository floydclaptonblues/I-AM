import { Narrator } from './speech.js?v=immersion-1';

// Both voices are premixed into one file. The media clock also drives the words
// and portrait, so neither a second player nor browser TTS can drift underneath.
export class RecordedNarrator {
  constructor(options = {}) {
    this.onState = options.onState || (() => {});
    this.onSentence = options.onSentence || (() => {});
    this.onWord = options.onWord || (() => {});
    this.setTimer = options.setTimer || ((fn,ms) => setTimeout(fn,ms));
    this.clearTimer = options.clearTimer || clearTimeout;
    this.requestFrame = options.requestFrame || (fn => requestAnimationFrame(fn));
    this.cancelFrame = options.cancelFrame || cancelAnimationFrame;
    this.fallback = new Narrator(options);
    this.audio = (options.createAudio || (() => {
      const element = document.createElement('audio');
      element.id = 'voice-track'; element.hidden = true; element.preload = 'metadata';
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
        const response = await this.fetch('assets/audio/manifest.json?v=layered-1',{signal:controller.signal});
        if (!response.ok) throw new Error('Voice catalog unavailable');
        const manifest = await response.json();
        if (manifest.version !== 1 || !manifest.clips) throw new Error('Invalid voice catalog');
        this.readyCatalog = new Map(Object.values(manifest.clips).map(clip => [clip.text,clip]));
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
  }
  stop(state = 'idle') {
    this.generation++;
    this.clearAudio();
    this.fallback.stop(state);
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
      || !Array.isArray(clip.words) || !Array.isArray(clip.sentences) || !(clip.duration>0)) {
      this.audio.dataset.mode = 'browser-fallback';
      this.fallback.play(text,options); return;
    }
    this.audio.dataset.mode = 'layered';
    const rate = Math.min(2,Math.max(.5,options.rate ?? 1));
    this.audio.playbackRate = rate;
    this.audio.preservesPitch = true;
    this.audio.volume = Math.min(1,Math.max(0,options.volume ?? 1));
    let started = false, sentenceIndex = -1, wordIndex = -1, state = '';
    const setState = next => { if (state !== next) { state = next; this.onState(next); } };
    const update = () => {
      if (!valid() || this.audio.paused) return;
      const time = this.audio.currentTime;
      const index = clip.sentences.findLastIndex(sentence => sentence.time <= time);
      const sentence = clip.sentences[index];
      if (!sentence) return;
      if (index !== sentenceIndex) {
        sentenceIndex = index;
        this.onSentence(sentence.text,index,clip.sentences.length);
      }
      setState(time < sentence.end ? 'speaking' : 'between');
      const nextWord = clip.words.findLastIndex(word => word.time <= time);
      if (nextWord >= 0 && nextWord !== wordIndex && clip.words[nextWord].sentence === index && time < sentence.end) {
        wordIndex = nextWord;
        const word = clip.words[nextWord];
        this.onWord(word.start,word.length,sentence.text);
      }
    };
    const tick = () => { if (valid()) { update(); this.frame = this.requestFrame(tick); } };
    const fail = error => {
      if (!valid()) return;
      if (!started && error?.name !== 'NotAllowedError') {
        this.generation++; this.clearAudio(); this.audio.dataset.mode = 'browser-fallback';
        this.fallback.play(text,options);
      } else this.stop('unavailable');
    };
    this.audio.onplaying = () => {
      if (!valid()) return;
      started = true; this.clearTimer(this.timer);
      this.timer = this.setTimer(() => { if (valid()) this.stop('unavailable'); },Math.max(20000,clip.duration/rate*1000+15000));
      setState('speaking'); this.cancelFrame(this.frame); tick();
    };
    this.audio.onwaiting = () => { if (valid()) setState('loading'); };
    this.audio.onpause = () => { if (valid() && !this.audio.ended) setState('paused'); };
    this.audio.ontimeupdate = update;
    this.audio.onended = () => { if (valid()) this.stop('finished'); };
    this.audio.onerror = fail;
    this.audio.src = clip.src;
    this.timer = this.setTimer(() => fail(),12000);
    try { await this.audio.play(); } catch(error) { fail(error); }
  }
}
