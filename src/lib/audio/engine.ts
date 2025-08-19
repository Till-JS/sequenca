import * as Tone from 'tone';
import { DrumKit } from './instruments';
import { AUDIO_CONSTANTS } from './constants';
import type { Pattern, Track, Step } from '$lib/types/sequencer';

export class AudioEngine {
	private drumKit: DrumKit;
	private transport = Tone.getTransport();
	private currentStep = 0;
	private isPlaying = false;
	private pattern: Pattern | null = null;
	private sequenceId: number | null = null;
	private onStepCallback?: (step: number) => void;

	constructor() {
		this.drumKit = new DrumKit();
		this.setupTransport();
	}

	private setupTransport() {
		this.transport.bpm.value = AUDIO_CONSTANTS.DEFAULT_BPM;
		this.transport.swing = AUDIO_CONSTANTS.DEFAULT_SWING;
	}

	async init() {
		await Tone.start();
		await this.drumKit.load();
	}

	setPattern(pattern: Pattern) {
		this.pattern = pattern;
		this.setBPM(pattern.bpm);
	}

	setBPM(bpm: number) {
		this.transport.bpm.value = Math.max(
			AUDIO_CONSTANTS.MIN_BPM,
			Math.min(AUDIO_CONSTANTS.MAX_BPM, bpm)
		);
	}

	setSwing(swing: number) {
		this.transport.swing = swing;
	}

	onStep(callback: (step: number) => void) {
		this.onStepCallback = callback;
	}

	play() {
		if (this.isPlaying || !this.pattern) return;

		this.isPlaying = true;
		this.currentStep = 0;

		if (this.sequenceId !== null) {
			this.transport.clear(this.sequenceId);
		}

		this.sequenceId = this.transport.scheduleRepeat((time) => {
			this.processStep(time);
		}, '16n');

		this.transport.start();
	}

	private processStep(time: number) {
		if (!this.pattern) return;

		this.pattern.tracks.forEach((track) => {
			if (track.muted) return;

			const step = track.steps[this.currentStep];
			if (step && step.active) {
				this.drumKit.trigger(track.instrument, step.velocity, time);
			}
		});

		if (this.onStepCallback) {
			Tone.getDraw().schedule(() => {
				this.onStepCallback?.(this.currentStep);
			}, time);
		}

		this.currentStep = (this.currentStep + 1) % this.pattern.length;
	}

	stop() {
		if (!this.isPlaying) return;

		this.isPlaying = false;
		this.transport.stop();
		this.transport.cancel();

		if (this.sequenceId !== null) {
			this.transport.clear(this.sequenceId);
			this.sequenceId = null;
		}

		this.currentStep = 0;
		this.onStepCallback?.(0);
	}

	pause() {
		if (!this.isPlaying) return;
		this.isPlaying = false;
		this.transport.pause();
	}

	resume() {
		if (this.isPlaying) return;
		this.isPlaying = true;
		this.transport.start();
	}

	setMasterVolume(volume: number) {
		Tone.getDestination().volume.value = Tone.gainToDb(volume);
	}

	setTrackVolume(trackId: string, volume: number) {
		const track = this.pattern?.tracks.find((t) => t.id === trackId);
		if (track) {
			this.drumKit.setVolume(track.instrument, volume);
		}
	}

	toggleStep(trackIndex: number, stepIndex: number) {
		if (!this.pattern) return;

		const track = this.pattern.tracks[trackIndex];
		if (track && track.steps[stepIndex]) {
			track.steps[stepIndex].active = !track.steps[stepIndex].active;
		}
	}

	dispose() {
		this.stop();
		this.drumKit.dispose();
	}
}