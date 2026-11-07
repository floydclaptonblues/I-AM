// Decode the supplied GIF without changing its artwork. Holding the canvas stops on
// the exact displayed frame; CSS animation-play-state cannot pause an <img> GIF.
export class GardenPlayer {
  constructor({ image, canvas, video, Decoder = globalThis.ImageDecoder }) {
    Object.assign(this, { image, canvas, video, Decoder });
    this.frozen = true; this.frame = 0; this.timer = null; this.generation = 0;
  }
  async load(config) {
    this.config = config;
    try {
      if (!this.Decoder || !config.animated || !await this.Decoder.isTypeSupported('image/gif')) throw new Error('Native GIF fallback');
      const response = await fetch(config.animated);
      if (!response.ok) throw new Error('Garden unavailable');
      this.decoder = new this.Decoder({ data: await response.arrayBuffer(), type: 'image/gif' });
      await this.decoder.tracks.ready;
      this.count = this.decoder.tracks.selectedTrack.frameCount;
      await this.draw(0, this.generation);
      if (!this.frozen) this.schedule();
    } catch {
      this.decoder?.close(); this.decoder = null;
      if (this.video) {
        this.video.src = 'assets/eden-figs.mp4';
        this.video.preload = 'auto';
        this.video.muted = true;
        this.video.addEventListener('loadeddata', () => {
          this.videoReady = true; this.video.hidden = false;
          this.image.hidden = true; this.canvas.hidden = true;
          this.freeze(this.frozen);
        }, { once: true });
        this.video.addEventListener('error', () => {
          this.videoReady = false; this.video.hidden = true;
          this.image.hidden = false; this.image.src = config.still;
        }, { once: true });
        this.video.load();
      }
    }
  }
  async draw(index, generation) {
    const { image } = await this.decoder.decode({ frameIndex: index });
    try {
      if (generation !== this.generation) return;
      if (this.canvas.width !== image.displayWidth || this.canvas.height !== image.displayHeight) {
        this.canvas.width = image.displayWidth; this.canvas.height = image.displayHeight;
      }
      this.canvas.getContext('2d').drawImage(image, 0, 0);
      this.duration = Math.max(20, (image.duration || 100000) / 1000);
      this.frame = index; this.canvas.hidden = false; this.image.hidden = true;
    } finally { image.close(); }
  }
  schedule() {
    clearTimeout(this.timer);
    if (this.frozen || !this.decoder) return;
    const generation = this.generation;
    this.timer = setTimeout(async () => {
      try { await this.draw((this.frame + 1) % this.count, generation); }
      catch { this.freeze(true); return; }
      if (generation === this.generation) this.schedule();
    }, this.duration || 100);
  }
  freeze(value) {
    if (this.videoReady) {
      this.frozen = value;
      if (value) this.video.pause();
      else this.video.play().catch(() => {}); // Autoplay policy may leave a still frame.
      return;
    }
    if (value === this.frozen) return;
    this.frozen = value; this.generation++; clearTimeout(this.timer);
    if (this.decoder) { if (!value) this.schedule(); return; }
    // Until a controllable renderer is ready, retain the matching poster frame.
  }
}
