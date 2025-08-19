import { writable, derived, get } from 'svelte/store';
import { AudioEngine } from '$lib/audio/engine';
import { AUDIO_CONSTANTS } from '$lib/audio/constants';
import { storage } from '$lib/services/storage/localStorage';
import type { Pattern, Track, Step, InstrumentType, SequencerState } from '$lib/types/sequencer';

function createInitialPattern(): Pattern {
	const instruments: InstrumentType[] = [
		'kick' as InstrumentType,
		'snare' as InstrumentType,
		'hihat' as InstrumentType,
		'openhat' as InstrumentType
	];

	const tracks: Track[] = instruments.map((instrument, index) => ({
		id: `track-${index}`,
		name: instrument.charAt(0).toUpperCase() + instrument.slice(1),
		instrument,
		steps: Array(16)
			.fill(null)
			.map(() => ({
				active: false,
				velocity: 0.8,
				pitch: undefined,
				duration: undefined
			})),
		volume: 0.75,
		effects: [],
		muted: false,
		solo: false
	}));

	return {
		id: 'pattern-1',
		name: 'Pattern 1',
		bpm: AUDIO_CONSTANTS.DEFAULT_BPM,
		tracks,
		length: 16,
		created: new Date(),
		modified: new Date()
	};
}

function createSequencerStore() {
	const audioEngine = new AudioEngine();
	let initialized = false;

	// Load saved patterns or create initial
	const savedPatterns = storage.loadPatterns();
	const savedCurrentId = storage.getCurrentPatternId();
	
	let patterns = savedPatterns.length > 0 ? savedPatterns : [createInitialPattern()];
	let currentPattern = savedCurrentId 
		? patterns.find(p => p.id === savedCurrentId) || patterns[0]
		: patterns[0];

	const initialState: SequencerState = {
		isPlaying: false,
		currentStep: 0,
		bpm: currentPattern?.bpm || AUDIO_CONSTANTS.DEFAULT_BPM,
		currentPattern,
		patterns,
		masterVolume: AUDIO_CONSTANTS.DEFAULT_VOLUME,
		metronome: false,
		selectedTrack: null,
		selectedSteps: new Set(),
		stepCount: 16,
		swing: 0
	};

	const { subscribe, set, update } = writable<SequencerState>(initialState);

	audioEngine.onStep((step) => {
		update((state) => ({ ...state, currentStep: step }));
	});

	async function init() {
		if (initialized) return;
		await audioEngine.init();
		const state = get({ subscribe });
		if (state.currentPattern) {
			audioEngine.setPattern(state.currentPattern);
		}
		initialized = true;
	}

	function play() {
		update((state) => {
			if (state.currentPattern && !state.isPlaying) {
				audioEngine.setPattern(state.currentPattern);
				audioEngine.play();
				return { ...state, isPlaying: true };
			}
			return state;
		});
	}

	function stop() {
		audioEngine.stop();
		update((state) => ({ ...state, isPlaying: false, currentStep: 0 }));
	}

	function pause() {
		audioEngine.pause();
		update((state) => ({ ...state, isPlaying: false }));
	}

	function setBPM(bpm: number) {
		audioEngine.setBPM(bpm);
		update((state) => {
			if (state.currentPattern) {
				state.currentPattern.bpm = bpm;
			}
			return { ...state, bpm };
		});
	}

	function setMasterVolume(volume: number) {
		audioEngine.setMasterVolume(volume);
		update((state) => ({ ...state, masterVolume: volume }));
	}

	function toggleStep(trackIndex: number, stepIndex: number) {
		update((state) => {
			if (state.currentPattern) {
				const track = state.currentPattern.tracks[trackIndex];
				if (track && track.steps[stepIndex]) {
					track.steps[stepIndex].active = !track.steps[stepIndex].active;
					audioEngine.setPattern(state.currentPattern);
				}
			}
			return state;
		});
	}

	function setTrackVolume(trackIndex: number, volume: number) {
		update((state) => {
			if (state.currentPattern && state.currentPattern.tracks[trackIndex]) {
				state.currentPattern.tracks[trackIndex].volume = volume;
				audioEngine.setTrackVolume(state.currentPattern.tracks[trackIndex].id, volume);
			}
			return state;
		});
	}

	function toggleTrackMute(trackIndex: number) {
		update((state) => {
			if (state.currentPattern && state.currentPattern.tracks[trackIndex]) {
				state.currentPattern.tracks[trackIndex].muted =
					!state.currentPattern.tracks[trackIndex].muted;
				audioEngine.setPattern(state.currentPattern);
			}
			return state;
		});
	}

	function toggleTrackSolo(trackIndex: number) {
		update((state) => {
			if (state.currentPattern && state.currentPattern.tracks[trackIndex]) {
				const track = state.currentPattern.tracks[trackIndex];
				track.solo = !track.solo;

				if (track.solo) {
					state.currentPattern.tracks.forEach((t, i) => {
						if (i !== trackIndex) {
							t.muted = true;
						}
					});
				} else {
					state.currentPattern.tracks.forEach((t) => {
						t.muted = false;
					});
				}

				audioEngine.setPattern(state.currentPattern);
			}
			return state;
		});
	}

	function clearPattern() {
		update((state) => {
			if (state.currentPattern) {
				state.currentPattern.tracks.forEach((track) => {
					track.steps.forEach((step) => {
						step.active = false;
					});
				});
				audioEngine.setPattern(state.currentPattern);
			}
			return state;
		});
	}

	function setSwing(swing: number) {
		audioEngine.setSwing(swing);
		update((state) => ({ ...state, swing }));
	}

	function savePattern(pattern?: Pattern): boolean {
		const state = get({ subscribe });
		const patternToSave = pattern || state.currentPattern;
		if (!patternToSave) return false;
		
		const success = storage.savePattern(patternToSave);
		if (success) {
			update((state) => {
				const existingIndex = state.patterns.findIndex(p => p.id === patternToSave.id);
				if (existingIndex >= 0) {
					state.patterns[existingIndex] = patternToSave;
				} else {
					state.patterns.push(patternToSave);
				}
				return state;
			});
		}
		return success;
	}

	function loadPattern(patternId: string): void {
		update((state) => {
			const pattern = state.patterns.find(p => p.id === patternId);
			if (pattern) {
				audioEngine.stop();
				audioEngine.setPattern(pattern);
				storage.saveCurrentPatternId(patternId);
				return { 
					...state, 
					currentPattern: pattern,
					currentStep: 0,
					isPlaying: false,
					bpm: pattern.bpm
				};
			}
			return state;
		});
	}

	function createNewPattern(name?: string): void {
		const newPattern = createInitialPattern();
		newPattern.id = `pattern-${Date.now()}`;
		newPattern.name = name || `Pattern ${get({ subscribe }).patterns.length + 1}`;
		
		savePattern(newPattern);
		loadPattern(newPattern.id);
	}

	function duplicatePattern(patternId: string): void {
		const state = get({ subscribe });
		const pattern = state.patterns.find(p => p.id === patternId);
		if (!pattern) return;

		const duplicate = {
			...pattern,
			id: `pattern-${Date.now()}`,
			name: `${pattern.name} (Copy)`,
			created: new Date(),
			modified: new Date()
		};

		savePattern(duplicate);
		loadPattern(duplicate.id);
	}

	function deletePattern(patternId: string): void {
		const state = get({ subscribe });
		if (state.patterns.length <= 1) return; // Keep at least one pattern

		storage.deletePattern(patternId);
		update((state) => {
			const filtered = state.patterns.filter(p => p.id !== patternId);
			if (state.currentPattern?.id === patternId) {
				const newCurrent = filtered[0];
				audioEngine.setPattern(newCurrent);
				storage.saveCurrentPatternId(newCurrent.id);
				return { 
					...state, 
					patterns: filtered,
					currentPattern: newCurrent,
					currentStep: 0,
					isPlaying: false
				};
			}
			return { ...state, patterns: filtered };
		});
	}

	function renamePattern(patternId: string, newName: string): void {
		update((state) => {
			const pattern = state.patterns.find(p => p.id === patternId);
			if (pattern) {
				pattern.name = newName;
				pattern.modified = new Date();
				storage.savePattern(pattern);
			}
			return state;
		});
	}

	return {
		subscribe,
		init,
		play,
		stop,
		pause,
		setBPM,
		setMasterVolume,
		toggleStep,
		setTrackVolume,
		toggleTrackMute,
		toggleTrackSolo,
		clearPattern,
		setSwing,
		savePattern,
		loadPattern,
		createNewPattern,
		duplicatePattern,
		deletePattern,
		renamePattern
	};
}

export const sequencer = createSequencerStore();

export const isPlaying = derived(sequencer, ($sequencer) => $sequencer.isPlaying);
export const currentStep = derived(sequencer, ($sequencer) => $sequencer.currentStep);
export const currentPattern = derived(sequencer, ($sequencer) => $sequencer.currentPattern);
export const bpm = derived(sequencer, ($sequencer) => $sequencer.bpm);
export const masterVolume = derived(sequencer, ($sequencer) => $sequencer.masterVolume);