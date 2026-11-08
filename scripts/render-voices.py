"""Build fixed robotic US lead + word-aligned low British male underlay.

All inference is offline after downloading the open Kokoro model. No visitor
text or browser audio is sent to a speech service. Only finished audio ships.
"""
import ctypes as C
import ctypes.util
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
import sys

import numpy as np
import soundfile as sf
from scipy.signal import resample_poly

SR = 24000
ROOT = Path('.voice-work')
DEST = Path('assets/audio')
ROOT.mkdir(exist_ok=True)
DEST.mkdir(parents=True, exist_ok=True)


def run(*args):
    subprocess.run([str(a) for a in args], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)


class EventID(C.Union):
    _fields_ = [('number', C.c_int), ('name', C.c_char_p), ('string', C.c_char * 8)]


class Event(C.Structure):
    _fields_ = [('type', C.c_int), ('uid', C.c_uint), ('position', C.c_int),
                ('length', C.c_int), ('milliseconds', C.c_int), ('sample', C.c_int),
                ('user', C.c_void_p), ('id', EventID)]


def render_leads(entries):
    """Use synthesis word events, never estimated character-based mouth timing."""
    lib = C.CDLL(ctypes.util.find_library('espeak-ng'))
    lib.espeak_Initialize.argtypes = [C.c_int, C.c_int, C.c_char_p, C.c_int]
    lib.espeak_Synth.argtypes = [C.c_void_p, C.c_size_t, C.c_uint, C.c_int, C.c_uint,
                                C.c_uint, C.POINTER(C.c_uint), C.c_void_p]
    lib.espeak_SetVoiceByName.argtypes = [C.c_char_p]
    sample_rate = lib.espeak_Initialize(2, 0, None, 0)
    assert sample_rate > 0
    assert lib.espeak_SetVoiceByName(b'en-us') == 0
    lib.espeak_SetParameter(1, 165, 0)  # words/minute
    lib.espeak_SetParameter(3, 28, 0)   # pitch
    lib.espeak_SetParameter(4, 12, 0)   # restrained pitch range
    parts, words = [], []

    @C.CFUNCTYPE(C.c_int, C.POINTER(C.c_short), C.c_int, C.POINTER(Event))
    def callback(samples, count, events):
        if samples and count:
            parts.append(np.ctypeslib.as_array(samples, shape=(count,)).copy())
        index = 0
        while events[index].type:
            event = events[index]
            if event.type == 1:
                words.append({'start':max(0,event.position-1), 'length':event.length,
                              'time':event.milliseconds/1000})
            index += 1
        return 0

    lib.espeak_SetSynthCallback(callback)
    for entry in entries:
        for index, sentence in enumerate(entry['sentences']):
            stem = ROOT / f"{entry['id']}-{index}"
            parts.clear(); words.clear()
            raw = sentence['text'].encode('utf8')
            buffer = C.create_string_buffer(raw)
            assert lib.espeak_Synth(buffer,len(raw)+1,0,1,0,1,None,None) == 0
            pcm = np.concatenate(parts).astype(np.float32)/32768
            pcm = resample_poly(pcm, SR, sample_rate).astype(np.float32)
            assert len(pcm) and words
            sf.write(str(stem)+'.lead.wav',pcm,SR,subtype='FLOAT')
            # Punctuation may produce duplicated synthesis events; retain first.
            unique = {word['start']:word for word in reversed(words)}
            word_list = sorted(unique.values(),key=lambda word:word['time'])
            (Path(str(stem)+'.words.json')).write_text(json.dumps(word_list))
    lib.espeak_Terminate()


def british(pipeline, text):
    chunks, tokens, elapsed, cursor = [], [], 0.0, 0
    for result in pipeline(text,voice='bm_george',speed=1.0,split_pattern=None):
        pcm = result.audio.numpy().astype(np.float32)
        chunks.append(pcm)
        for token in result.tokens or []:
            position = text.find(token.text,cursor)
            if position < 0:
                raise ValueError(f'Token does not match original text: {token.text!r} in {text!r}')
            cursor = position+len(token.text)
            if token.start_ts is not None and re.search(r'\w',token.text):
                tokens.append({'start':position,'time':elapsed+token.start_ts})
        elapsed += len(pcm)/SR
    assert chunks and tokens, text
    return np.concatenate(chunks), tokens


def align(lead, lead_words, shadow, shadow_words, stem):
    """Map each common word onset onto the lead using a continuous time warp."""
    targets = {word['start']:word['time'] for word in lead_words}
    anchors = [(0,0)]
    for word in shadow_words:
        if word['start'] not in targets:
            continue
        src = round(word['time']*SR)
        dst = round(targets[word['start']]*SR)
        if src > anchors[-1][0] and dst > anchors[-1][1] and src < len(shadow) and dst < len(lead):
            anchors.append((src,dst))
    anchors.append((len(shadow),len(lead)))
    coverage = sum(word['start'] in targets for word in shadow_words)/len(shadow_words)
    if coverage < .80:
        raise ValueError(f'Insufficient word alignment coverage: {coverage:.2%}')
    source = Path(str(stem)+'.british.wav')
    aligned = Path(str(stem)+'.aligned.wav')
    mapping = Path(str(stem)+'.map.txt')
    sf.write(source,shadow,SR,subtype='FLOAT')
    mapping.write_text('\n'.join(f'{src} {dst}' for src,dst in anchors))
    run('rubberband','--fine','--quiet','--duration',len(lead)/SR,'--pitch',-2,
        '--timemap',mapping,source,aligned)
    result, rate = sf.read(aligned,dtype='float32')
    assert rate == SR
    # The encoder must receive exactly one shared sample timeline.
    result = np.pad(result,(0,max(0,len(lead)-len(result))))[:len(lead)]
    return result, coverage, len(anchors)-2


def rms(audio):
    active = audio[np.abs(audio)>.005]
    return float(np.sqrt(np.mean(active**2))) if len(active) else 0.0


def main():
    entries = json.loads((ROOT/'script.json').read_text())
    if '--preview' in sys.argv:
        entries = [entry for entry in entries if entry['id'] in ('opening','garden','you-darkness')]
    print('Rendering robotic leads and word timing.',flush=True)
    render_leads(entries)
    # Load the neural model only after the independent lead generation finishes.
    import torch
    from kokoro import KPipeline
    torch.set_num_threads(min(4,os.cpu_count() or 2))
    pipeline = KPipeline(lang_code='b',repo_id='hexgrad/Kokoro-82M',device='cpu')
    manifest = {'version':1,'mix':{'lead':'eSpeak NG en-US','underlay':'Kokoro bm_george en-GB',
                                 'underlayPitchSemitones':-2,'underlayGainDb':-10},'clips':{}}
    report = []
    for entry in entries:
        complete, lead_stem, shadow_stem, cues, sentences = [], [], [], [], []
        elapsed = 0.0
        for index, sentence in enumerate(entry['sentences']):
            stem = ROOT/f"{entry['id']}-{index}"
            lead, _ = sf.read(str(stem)+'.lead.wav',dtype='float32')
            words = json.loads(Path(str(stem)+'.words.json').read_text())
            shadow, shadow_words = british(pipeline,sentence['text'])
            shadow, coverage, anchor_count = align(lead,words,shadow,shadow_words,stem)
            lead *= .16/max(rms(lead),.001)
            shadow *= (.16*10**(-10/20))/max(rms(shadow),.001)
            mixed = lead+shadow
            peak = float(np.max(np.abs(mixed)))
            if peak > .94:
                lead *= .94/peak; shadow *= .94/peak; mixed = lead+shadow
            duration = len(mixed)/SR
            sentences.append({'time':round(elapsed,4),'end':round(elapsed+duration,4),
                              'text':sentence['text'],'start':sentence['start']})
            for word in words:
                assert 0<=word['start']<len(sentence['text'])
                cues.append({**word,'time':round(elapsed+word['time'],4),'sentence':index})
            gap = np.zeros(round(sentence['pause']*SR),dtype=np.float32)
            complete.extend([mixed,gap]);lead_stem.extend([lead,gap]);shadow_stem.extend([shadow,gap])
            elapsed += duration+len(gap)/SR
            report.append({'id':entry['id'],'sentence':index,'coverage':coverage,'anchors':anchor_count,
                           'samples':len(lead),'peak':float(np.max(np.abs(mixed)))})
        final = np.concatenate(complete)
        digest = hashlib.sha256(entry['text'].encode()).hexdigest()[:12]
        name = f"{entry['id']}-{digest}.mp3"
        wav = ROOT/f"{entry['id']}-mix.wav"
        sf.write(wav,final,SR)
        run('ffmpeg','-y','-v','error','-i',wav,'-codec:a','libmp3lame','-b:a','96k',DEST/name)
        manifest['clips'][entry['id']] = {'text':entry['text'],'src':'assets/audio/'+name,
            'duration':round(len(final)/SR,4),'sentences':sentences,'words':cues}
        if entry['id']=='opening':
            for label, pieces in [('robotic',lead_stem),('british',shadow_stem)]:
                sf.write(ROOT/f'opening-{label}.wav',np.concatenate(pieces),SR)
                run('ffmpeg','-y','-v','error','-i',ROOT/f'opening-{label}.wav','-b:a','96k',DEST/f'preview-{label}.mp3')
        print(f"Rendered {entry['id']}: {len(final)/SR:.1f}s, {len(cues)} word cues",flush=True)
    (DEST/'manifest.json').write_text(json.dumps(manifest,separators=(',',':')))
    (DEST/'alignment-report.json').write_text(json.dumps(report,indent=2))
    (DEST/'NOTICE.txt').write_text('Robotic lead: eSpeak NG, en-US. British underlay: Kokoro-82M, bm_george.\n'
        'Kokoro model and voice weights: Apache-2.0, https://huggingface.co/hexgrad/Kokoro-82M\n'
        'Inference: https://github.com/hexgrad/kokoro. Timing/pitch processing: Rubber Band.\n'
        'Dialogue text belongs to the I AM project. Both voices are synthetic.\n')
    assert len(manifest['clips'])==len(entries)
    print(f"Completed {len(entries)} synchronized recordings.",flush=True)


if __name__=='__main__':
    main()
