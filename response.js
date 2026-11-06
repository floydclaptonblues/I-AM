// A cancellable pause and held gaze for one answer. It owns no dialogue or user settings.
export class HeldResponse {
  constructor({ hold, waiting, reveal, speak, done, setTimer = (fn, ms) => setTimeout(fn, ms), clearTimer = id => clearTimeout(id) }) {
    Object.assign(this, { hold, waiting, reveal, speak, done, setTimer, clearTimer });
    this.active = false; this.generation = 0; this.timer = null;
  }
  cancel() {
    this.generation++;
    this.clearTimer(this.timer); this.timer = null;
    if (!this.active) return;
    this.active = false;
    this.waiting(false); this.hold(false); this.done();
  }
  start(text, { muted = false } = {}) {
    this.cancel();
    const generation = this.generation;
    this.active = true; this.hold(true); this.reveal(''); this.waiting(true);
    this.timer = this.setTimer(() => {
      if (generation !== this.generation || !this.active) return;
      this.timer = null; this.waiting(false); this.reveal(text);
      if (muted) {
        this.timer = this.setTimer(() => {
          if (generation === this.generation) this.cancel();
        }, 1500);
      } else this.speak(text, { rate: 0.85, volume: 0.55 });
    }, 3000);
  }
  observe(state) {
    if (state === 'finished' || state === 'unavailable') this.cancel();
  }
}
