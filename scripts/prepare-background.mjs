// Build a pauseable fallback from the author's original GIF; never overwrite it.
import { spawnSync } from 'node:child_process';
const result = spawnSync('ffmpeg', ['-hide_banner','-loglevel','error','-y',
  '-i','assets/eden-figs.gif','-an','-vf','scale=trunc(iw/2)*2:trunc(ih/2)*2',
  '-c:v','libx264','-crf','18','-pix_fmt','yuv420p','-movflags','+faststart',
  'assets/eden-figs.mp4'], { stdio:'inherit' });
if (result.error || result.status !== 0) throw result.error || new Error('Garden conversion failed');
