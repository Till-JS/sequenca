import * as Tone from 'tone';

export class EffectsChain {
	private reverb: Tone.Reverb;
	private delay: Tone.FeedbackDelay;
	private filter: Tone.Filter;
	private gainNode: Tone.Gain;
	private input: Tone.Gain;
	private output: Tone.Gain;

	constructor() {
		// Create input/output nodes
		this.input = new Tone.Gain(1);
		this.output = new Tone.Gain(1);
		this.gainNode = new Tone.Gain(1);

		// Create effects
		this.reverb = new Tone.Reverb({
			decay: 2.5,
			preDelay: 0.01,
			wet: 0
		});

		this.delay = new Tone.FeedbackDelay({
			delayTime: '8n',
			feedback: 0.3,
			wet: 0
		});

		this.filter = new Tone.Filter({
			frequency: 20000,
			type: 'lowpass',
			rolloff: -12
		});

		// Connect chain: input -> filter -> delay -> reverb -> gain -> output
		this.input.connect(this.filter);
		this.filter.connect(this.delay);
		this.delay.connect(this.reverb);
		this.reverb.connect(this.gainNode);
		this.gainNode.connect(this.output);
	}

	connect(destination: any) {
		this.output.connect(destination);
		return this;
	}

	getInput() {
		return this.input;
	}

	setReverbMix(amount: number) {
		// amount: 0-1
		this.reverb.wet.value = Math.min(1, Math.max(0, amount));
	}

	setReverbDecay(seconds: number) {
		// seconds: 0.1-10
		this.reverb.decay = Math.min(10, Math.max(0.1, seconds));
	}

	setDelayMix(amount: number) {
		// amount: 0-1
		this.delay.wet.value = Math.min(1, Math.max(0, amount));
	}

	setDelayTime(time: string | number) {
		// time: '4n', '8n', '16n' or seconds
		this.delay.delayTime.value = time as any;
	}

	setDelayFeedback(amount: number) {
		// amount: 0-0.95
		this.delay.feedback.value = Math.min(0.95, Math.max(0, amount));
	}

	setFilterFrequency(freq: number) {
		// freq: 20-20000 Hz
		this.filter.frequency.value = Math.min(20000, Math.max(20, freq));
	}

	setFilterType(type: 'lowpass' | 'highpass' | 'bandpass') {
		this.filter.type = type;
	}

	setVolume(db: number) {
		this.gainNode.gain.value = Tone.dbToGain(db);
	}

	dispose() {
		this.reverb.dispose();
		this.delay.dispose();
		this.filter.dispose();
		this.gainNode.dispose();
		this.input.dispose();
		this.output.dispose();
	}
}

// Global send effects bus
export class SendEffects {
	private reverbSend: Tone.Reverb;
	private delaySend: Tone.FeedbackDelay;
	private reverbReturn: Tone.Gain;
	private delayReturn: Tone.Gain;

	constructor() {
		// Create send reverb
		this.reverbSend = new Tone.Reverb({
			decay: 4,
			preDelay: 0.02,
			wet: 1 // 100% wet for send effect
		});
		this.reverbReturn = new Tone.Gain(0.3).toDestination();
		this.reverbSend.connect(this.reverbReturn);

		// Create send delay
		this.delaySend = new Tone.FeedbackDelay({
			delayTime: '8n',
			feedback: 0.3,
			wet: 1 // 100% wet for send effect
		});
		this.delayReturn = new Tone.Gain(0.2).toDestination();
		this.delaySend.connect(this.delayReturn);
	}

	getReverbSend() {
		return this.reverbSend;
	}

	getDelaySend() {
		return this.delaySend;
	}

	setReverbLevel(level: number) {
		this.reverbReturn.gain.value = level;
	}

	setDelayLevel(level: number) {
		this.delayReturn.gain.value = level;
	}

	setReverbDecay(seconds: number) {
		this.reverbSend.decay = seconds;
	}

	setDelayTime(time: string | number) {
		this.delaySend.delayTime.value = time as any;
	}

	setDelayFeedback(amount: number) {
		this.delaySend.feedback.value = Math.min(0.95, Math.max(0, amount));
	}

	dispose() {
		this.reverbSend.dispose();
		this.delaySend.dispose();
		this.reverbReturn.dispose();
		this.delayReturn.dispose();
	}
}