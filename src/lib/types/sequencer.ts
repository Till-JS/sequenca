export interface Pattern {
	id: string;
	name: string;
	bpm: number;
	tracks: Track[];
	length: number;
	created: Date;
	modified: Date;
	userId?: string;
}

export interface Track {
	id: string;
	name: string;
	instrument: InstrumentType;
	steps: Step[];
	volume: number;
	effects: Effect[];
	muted: boolean;
	solo: boolean;
}

export interface Step {
	active: boolean;
	velocity: number;
	pitch?: number;
	duration?: number;
}

export interface Effect {
	type: 'reverb' | 'delay' | 'filter';
	params: Record<string, number>;
	enabled: boolean;
}

export enum InstrumentType {
	KICK = 'kick',
	SNARE = 'snare',
	HIHAT = 'hihat',
	OPENHAT = 'openhat',
	CLAP = 'clap',
	PERC = 'perc',
	SYNTH = 'synth',
	BASS = 'bass'
}

export interface SequencerState {
	isPlaying: boolean;
	currentStep: number;
	bpm: number;
	currentPattern: Pattern | null;
	patterns: Pattern[];
	masterVolume: number;
	metronome: boolean;
	selectedTrack: number | null;
	selectedSteps: Set<string>;
	stepCount: 16 | 32 | 64;
	swing: number;
}