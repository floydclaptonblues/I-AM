"""Package the approved SAPI recordings with sentence and measured energy cues.

Word boundaries are not invented: the UI highlights complete spoken sentences.
Mouth pulses come from the waveform, with no audio processing needed on a phone.
"""
import array
import gzip
import hashlib
import io
import json
from pathlib import Path
import wave

ROOT = Path(__file__).resolve().parent.parent
WORK = ROOT / '.voice-work'
DEST = ROOT / 'assets/audio'
SOURCE = ROOT / 'voice-source'
DEST.mkdir(parents=True, exist_ok=True)
SOURCE.mkdir(exist_ok=True)
entries = json.loads((WORK / 'script.json').read_text(encoding='utf-8'))
manifest = {'version': 2, 'voice': 'Microsoft David Desktop', 'sapiPitch': -6,
            'cueType': 'sentence-and-waveform', 'clips': {}}
for entry in entries:
    pcm = bytearray()
    sentences = []
    pulses = []
    for index, sentence in enumerate(entry['sentences']):
        with wave.open(str(WORK / f"{entry['id']}-{index}.wav")) as audio:
            assert (audio.getnchannels(), audio.getsampwidth(), audio.getframerate()) == (1, 2, 22050)
            part = audio.readframes(audio.getnframes())
        start = len(pcm) / 44100
        end = start + len(part) / 44100
        sentences.append({'time': round(start, 5), 'end': round(end, 5), 'text': sentence['text']})
        samples = array.array('h', part)
        # Each pulse corresponds to audible energy in a 140 ms section.
        step = round(22050 * .14)
        for offset in range(0, len(samples), step):
            chunk = samples[offset:offset+step]
            rms = (sum(sample * sample for sample in chunk) / len(chunk)) ** .5 / 32768
            if rms > .025:
                pulses.append({'time': round(start + offset / 22050, 5), 'wide': rms > .09})
        pcm.extend(part)
        pcm.extend(bytes(round(sentence['pause'] * 22050) * 2))
    wav = io.BytesIO()
    with wave.open(wav, 'wb') as audio:
        audio.setparams((1, 2, 22050, 0, 'NONE', 'not compressed'))
        audio.writeframes(pcm)
    digest = hashlib.sha256(wav.getvalue()).hexdigest()[:12]
    stem = f"{entry['id']}-{digest}"
    (SOURCE / f'{stem}.wav.gz').write_bytes(gzip.compress(wav.getvalue(), mtime=0))
    manifest['clips'][entry['id']] = {
        'text': entry['text'], 'src': f'assets/audio/{stem}.mp3',
        'duration': round(len(pcm) / 44100, 5), 'sentences': sentences, 'pulses': pulses}
(DEST / 'manifest.json').write_text(json.dumps(manifest, separators=(',', ':')), encoding='utf-8')
print(f"Packaged {len(entries)} recordings; {sum(p.stat().st_size for p in SOURCE.glob('*.gz')) / 1048576:.1f} MiB lossless sources")
