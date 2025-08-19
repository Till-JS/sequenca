export const AUDIO_CONSTANTS = {
	DEFAULT_BPM: 120,
	MIN_BPM: 60,
	MAX_BPM: 200,
	DEFAULT_VOLUME: 0.75,
	DEFAULT_SWING: 0,
	LOOKAHEAD_TIME: 0.1,
	SCHEDULE_INTERVAL: 25,
	DEFAULT_STEP_COUNT: 16
} as const;

export const DRUM_URLS = {
	kick: '/sounds/kick.wav',
	snare: '/sounds/snare.wav',
	hihat: '/sounds/hihat.wav',
	openhat: '/sounds/openhat.wav',
	clap: '/sounds/clap.wav',
	perc: '/sounds/perc.wav'
} as const;