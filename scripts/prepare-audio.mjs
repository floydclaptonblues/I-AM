// Re-encode committed lossless David recordings; no speech service or voice
// installation is needed at build time or on a visitor's device.
import { readFileSync, writeFileSync, mkdirSync, unlinkSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { spawnSync } from 'node:child_process';
const manifest = JSON.parse(readFileSync('assets/audio/manifest.json','utf8'));
mkdirSync('.voice-work',{recursive:true});
for (const clip of Object.values(manifest.clips)) {
  const name = clip.src.split('/').at(-1).replace(/\.mp3$/, '');
  const input = '.voice-work/'+name+'.wav';
  writeFileSync(input,gunzipSync(readFileSync('voice-source/'+name+'.wav.gz')));
  const result = spawnSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-i',input,
    '-codec:a','libmp3lame','-b:a','64k',clip.src],{stdio:'inherit'});
  if(result.error || result.status!==0) throw result.error || new Error('Voice compression failed: '+name);
  unlinkSync(input);
}
console.log(`Prepared ${Object.keys(manifest.clips).length} David recordings.`);
