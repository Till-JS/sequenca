export interface AudioConfig {
	sampleRate: number;
	latencyHint: 'interactive' | 'playback' | 'balanced';
	lookAhead: number;
}

export interface DrumSample {
	url: string;
	name: string;
	type: 'kick' | 'snare' | 'hihat' | 'openhat' | 'clap' | 'perc';
}

export interface SynthPreset {
	name: string;
	oscillator: {
		type: 'sine' | 'square' | 'sawtooth' | 'triangle';
	};
	envelope: {
		attack: number;
		decay: number;
		sustain: number;
		release: number;
	};
	filter?: {
		type: 'lowpass' | 'highpass' | 'bandpass';
		frequency: number;
		Q: number;
	};
}