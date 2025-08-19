import * as Tone from 'tone';
import { DRUM_URLS } from './constants';
import { InstrumentType } from '$lib/types/sequencer';
import { SendEffects } from './effects';

export class DrumKit {
	private synths: Map<InstrumentType, any> = new Map();
	private sends: Map<InstrumentType, Tone.Gain> = new Map();
	private sendEffects: SendEffects;
	private loaded = false;

	async load() {
		if (this.loaded) return;

		// Initialize send effects
		this.sendEffects = new SendEffects();

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
		const kickSend = new Tone.Gain(0).connect(this.sendEffects.getReverbSend());
		kick.connect(kickSend);

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
		const snareSend = new Tone.Gain(0.1).connect(this.sendEffects.getReverbSend());
		snare.connect(snareSend);

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
		const hihatSend = new Tone.Gain(0.05).connect(this.sendEffects.getReverbSend());
		hihat.connect(hihatSend);

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
		const openhatSend = new Tone.Gain(0.08).connect(this.sendEffects.getReverbSend());
		openhat.connect(openhatSend);

		// 808 Bass Drum - Lange, tiefe Bass-Kick
		const bass808 = new Tone.MembraneSynth({
			pitchDecay: 0.08,
			octaves: 10,
			oscillator: {
				type: 'sine'
			},
			envelope: {
				attack: 0.006,
				decay: 0.5,
				sustain: 0.3,
				release: 1.5
			},
			volume: -3
		}).toDestination();
		const bassSend = new Tone.Gain(0).connect(this.sendEffects.getReverbSend());
		bass808.connect(bassSend);

		// Clap - Mehrere kurze Noise-Bursts
		const clap = new Tone.NoiseSynth({
			noise: {
				type: 'white'
			},
			envelope: {
				attack: 0.005,
				decay: 0.03,
				sustain: 0
			},
			volume: -8
		}).toDestination();
		const clapSend = new Tone.Gain(0.15).connect(this.sendEffects.getReverbSend());
		clap.connect(clapSend);

		// Percussion - Metallischer Klang
		const perc = new Tone.MetalSynth({
			frequency: 400,
			envelope: {
				attack: 0.001,
				decay: 0.06,
				release: 0.01
			},
			harmonicity: 3.1,
			modulationIndex: 16,
			resonance: 2000,
			octaves: 1,
			volume: -12
		}).toDestination();
		const percSend = new Tone.Gain(0.2).connect(this.sendEffects.getReverbSend());
		perc.connect(percSend);

		this.synths.set(InstrumentType.KICK, kick);
		this.synths.set(InstrumentType.SNARE, snare);
		this.synths.set(InstrumentType.HIHAT, hihat);
		this.synths.set(InstrumentType.OPENHAT, openhat);
		this.synths.set(InstrumentType.BASS, bass808);
		this.synths.set(InstrumentType.CLAP, clap);
		this.synths.set(InstrumentType.PERC, perc);

		// Store send gains
		this.sends.set(InstrumentType.KICK, kickSend);
		this.sends.set(InstrumentType.SNARE, snareSend);
		this.sends.set(InstrumentType.HIHAT, hihatSend);
		this.sends.set(InstrumentType.OPENHAT, openhatSend);
		this.sends.set(InstrumentType.BASS, bassSend);
		this.sends.set(InstrumentType.CLAP, clapSend);
		this.sends.set(InstrumentType.PERC, percSend);

		this.loaded = true;
	}

	trigger(instrument: InstrumentType, velocity = 1, time?: number) {
		const synth = this.synths.get(instrument);
		if (!synth) return;

		if (instrument === InstrumentType.KICK) {
			(synth as Tone.MembraneSynth).triggerAttackRelease('C1', '8n', time, velocity);
		} else if (instrument === InstrumentType.BASS) {
			(synth as Tone.MembraneSynth).triggerAttackRelease('C0', '4n', time, velocity);
		} else if (instrument === InstrumentType.SNARE || instrument === InstrumentType.HIHAT || instrument === InstrumentType.OPENHAT || instrument === InstrumentType.CLAP) {
			(synth as Tone.NoiseSynth).triggerAttackRelease('16n', time, velocity);
		} else if (instrument === InstrumentType.PERC) {
			(synth as Tone.MetalSynth).triggerAttackRelease('32n', time, velocity);
		}
	}

	setVolume(instrument: InstrumentType, volume: number) {
		const synth = this.synths.get(instrument);
		if (synth) {
			synth.volume.value = Tone.gainToDb(volume);
		}
	}

	setReverbSend(instrument: InstrumentType, amount: number) {
		const send = this.sends.get(instrument);
		if (send) {
			send.gain.value = amount;
		}
	}

	setGlobalReverbMix(amount: number) {
		if (this.sendEffects) {
			this.sendEffects.setReverbLevel(amount);
		}
	}

	setGlobalReverbDecay(seconds: number) {
		if (this.sendEffects) {
			this.sendEffects.setReverbDecay(seconds);
		}
	}

	dispose() {
		this.synths.forEach((synth) => synth.dispose());
		this.synths.clear();
		this.sends.forEach((send) => send.dispose());
		this.sends.clear();
		if (this.sendEffects) {
			this.sendEffects.dispose();
		}
		this.loaded = false;
	}
}