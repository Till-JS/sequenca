import * as Tone from 'tone';
import { DRUM_URLS } from './constants';
import type { InstrumentType } from '$lib/types/sequencer';

export class DrumKit {
	private synths: Map<InstrumentType, Tone.MembraneSynth | Tone.NoiseSynth | Tone.MetalSynth> =
		new Map();
	private loaded = false;

	async load() {
		if (this.loaded) return;

		const kick = new Tone.MembraneSynth({
			pitchDecay: 0.05,
			octaves: 10,
			oscillator: {
				type: 'sine'
			},
			envelope: {
				attack: 0.001,
				decay: 0.4,
				sustain: 0.01,
				release: 1.4,
				attackCurve: 'exponential'
			}
		}).toDestination();

		const snare = new Tone.NoiseSynth({
			noise: {
				type: 'white'
			},
			envelope: {
				attack: 0.001,
				decay: 0.2,
				sustain: 0
			}
		}).toDestination();

		const hihat = new Tone.MetalSynth({
			frequency: 200,
			envelope: {
				attack: 0.001,
				decay: 0.1,
				release: 0.01
			},
			harmonicity: 5.1,
			modulationIndex: 32,
			resonance: 4000,
			octaves: 1.5
		}).toDestination();

		const openhat = new Tone.MetalSynth({
			frequency: 200,
			envelope: {
				attack: 0.001,
				decay: 0.5,
				release: 0.2
			},
			harmonicity: 5.1,
			modulationIndex: 32,
			resonance: 4000,
			octaves: 1.5
		}).toDestination();

		this.synths.set('kick' as InstrumentType, kick);
		this.synths.set('snare' as InstrumentType, snare);
		this.synths.set('hihat' as InstrumentType, hihat);
		this.synths.set('openhat' as InstrumentType, openhat);

		this.loaded = true;
	}

	trigger(instrument: InstrumentType, velocity = 1, time?: number) {
		const synth = this.synths.get(instrument);
		if (!synth) return;

		if (instrument === 'kick') {
			(synth as Tone.MembraneSynth).triggerAttackRelease('C1', '8n', time, velocity);
		} else if (instrument === 'snare') {
			(synth as Tone.NoiseSynth).triggerAttackRelease('8n', time, velocity);
		} else if (instrument === 'hihat' || instrument === 'openhat') {
			(synth as Tone.MetalSynth).triggerAttackRelease('16n', time, velocity * 0.3);
		}
	}

	setVolume(instrument: InstrumentType, volume: number) {
		const synth = this.synths.get(instrument);
		if (synth) {
			synth.volume.value = Tone.gainToDb(volume);
		}
	}

	dispose() {
		this.synths.forEach((synth) => synth.dispose());
		this.synths.clear();
		this.loaded = false;
	}
}