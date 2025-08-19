import * as Tone from 'tone';
import { DRUM_URLS } from './constants';
import { InstrumentType } from '$lib/types/sequencer';

export class DrumKit {
	private synths: Map<InstrumentType, any> = new Map();
	private loaded = false;

	async load() {
		if (this.loaded) return;

		console.log('Loading instruments with enum values:', {
			KICK: InstrumentType.KICK,
			SNARE: InstrumentType.SNARE,
			HIHAT: InstrumentType.HIHAT,
			OPENHAT: InstrumentType.OPENHAT
		});

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

		// HiHat mit NoiseSynth und Filter
		const hihatFilter = new Tone.Filter(10000, 'highpass').toDestination();
		const hihat = new Tone.NoiseSynth({
			noise: {
				type: 'white'
			},
			envelope: {
				attack: 0.001,
				decay: 0.03,
				sustain: 0,
				release: 0.01
			},
			volume: -5
		}).connect(hihatFilter);

		// Open HiHat mit längerem Decay
		const openhatFilter = new Tone.Filter(8000, 'highpass').toDestination();
		const openhat = new Tone.NoiseSynth({
			noise: {
				type: 'white'
			},
			envelope: {
				attack: 0.001,
				decay: 0.15,
				sustain: 0.1,
				release: 0.2
			},
			volume: -5
		}).connect(openhatFilter);

		this.synths.set(InstrumentType.KICK, kick);
		this.synths.set(InstrumentType.SNARE, snare);
		this.synths.set(InstrumentType.HIHAT, hihat);
		this.synths.set(InstrumentType.OPENHAT, openhat);

		console.log('Loaded synths with keys:', Array.from(this.synths.keys()));

		this.loaded = true;
	}

	trigger(instrument: InstrumentType, velocity = 1, time?: number) {
		console.log('Triggering instrument:', instrument, 'at time:', time);
		const synth = this.synths.get(instrument);
		
		if (!synth) {
			console.error('Synth not found for instrument:', instrument);
			console.log('Available synths:', Array.from(this.synths.keys()));
			return;
		}

		if (instrument === InstrumentType.KICK) {
			(synth as Tone.MembraneSynth).triggerAttackRelease('C1', '8n', time, velocity);
		} else if (instrument === InstrumentType.SNARE || instrument === InstrumentType.HIHAT || instrument === InstrumentType.OPENHAT) {
			(synth as Tone.NoiseSynth).triggerAttackRelease('16n', time, velocity);
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