"""Build compact 50 Hz mouth envelopes from the approved lossless recordings.

No audio is regenerated. Centered smoothing preserves the recording timeline;
silence is retained explicitly instead of scheduling fixed-duration mouth flaps.
"""
import array
import base64
import gzip
import io
import json
import math
from pathlib import Path
import wave

ROOT = Path(__file__).resolve().parent.parent
path = ROOT / 'assets/audio/manifest.json'
manifest = json.loads(path.read_text(encoding='utf-8'))
for clip in manifest['clips'].values():
    name = Path(clip['src']).stem
    with wave.open(io.BytesIO(gzip.decompress((ROOT / f'voice-source/{name}.wav.gz').read_bytes()))) as audio:
        assert (audio.getnchannels(), audio.getsampwidth(), audio.getframerate()) == (1, 2, 22050)
        samples = array.array('h', audio.readframes(audio.getnframes()))
    step = 441  # 20 ms at 22050 Hz
    energy = []
    for center in range(0, len(samples), step):
        window = samples[max(0, center-step):min(len(samples), center+step)]
        energy.append(math.sqrt(sum(value*value for value in window)/len(window))/32768)
    audible = sorted(value for value in energy if value > .012)
    scale = max(.065, audible[int((len(audible)-1)*.90)] if audible else .065)
    levels = [min(1, max(0, (value-.012)/(scale-.012))) ** .8 for value in energy]
    smooth = [(levels[max(0,i-1)] + 2*value + levels[min(len(levels)-1,i+1)])/4
              for i,value in enumerate(levels)]
    clip['mouth'] = {'step': .02, 'levels': base64.b64encode(bytes(round(value*255) for value in smooth)).decode('ascii')}
    clip.pop('pulses', None)
manifest['version'] = 3
manifest['cueType'] = 'sentence-and-mouth-envelope'
path.write_text(json.dumps(manifest, separators=(',', ':')), encoding='utf-8')
print(f"Prepared mouth envelopes for {len(manifest['clips'])} unchanged recordings.")
