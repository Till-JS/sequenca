import type { Pattern } from '$lib/types/sequencer';
import { z } from 'zod';

const STORAGE_KEYS = {
	PATTERNS: 'sequencer_patterns',
	CURRENT_PATTERN: 'sequencer_current_pattern',
	SETTINGS: 'sequencer_settings'
} as const;

const PatternSchema = z.object({
	id: z.string(),
	name: z.string(),
	bpm: z.number(),
	tracks: z.array(
		z.object({
			id: z.string(),
			name: z.string(),
			instrument: z.string(),
			steps: z.array(
				z.object({
					active: z.boolean(),
					velocity: z.number(),
					pitch: z.number().optional(),
					duration: z.number().optional()
				})
			),
			volume: z.number(),
			effects: z.array(z.any()),
			muted: z.boolean(),
			solo: z.boolean()
		})
	),
	length: z.number(),
	created: z.string().transform((str) => new Date(str)),
	modified: z.string().transform((str) => new Date(str)),
	userId: z.string().optional()
});

export class LocalStorageService {
	private isAvailable(): boolean {
		try {
			const test = '__test__';
			localStorage.setItem(test, test);
			localStorage.removeItem(test);
			return true;
		} catch {
			return false;
		}
	}

	savePattern(pattern: Pattern): boolean {
		if (!this.isAvailable()) return false;

		try {
			const patterns = this.loadPatterns();
			const existingIndex = patterns.findIndex((p) => p.id === pattern.id);

			const patternToSave = {
				...pattern,
				modified: new Date(),
				created: pattern.created || new Date(),
				tracks: pattern.tracks.map((track) => ({
					...track,
					instrument: track.instrument.toString()
				}))
			};

			if (existingIndex >= 0) {
				patterns[existingIndex] = patternToSave;
			} else {
				patterns.push(patternToSave);
			}

			const serialized = JSON.stringify(patterns, (key, value) => {
				if (value instanceof Date) {
					return value.toISOString();
				}
				return value;
			});

			localStorage.setItem(STORAGE_KEYS.PATTERNS, serialized);
			return true;
		} catch (error) {
			console.error('Failed to save pattern:', error);
			return false;
		}
	}

	loadPatterns(): Pattern[] {
		if (!this.isAvailable()) return [];

		try {
			const stored = localStorage.getItem(STORAGE_KEYS.PATTERNS);
			if (!stored) return [];

			const parsed = JSON.parse(stored);
			const patterns = z.array(PatternSchema).parse(parsed);

			return patterns.map((p) => ({
				...p,
				tracks: p.tracks.map((track) => {
					// Konvertiere String zu InstrumentType enum
					const instrumentMap: Record<string, any> = {
						'kick': 'kick',
						'snare': 'snare',
						'hihat': 'hihat',
						'openhat': 'openhat',
						'bass': 'bass',
						'clap': 'clap',
						'perc': 'perc',
						'synth': 'synth'
					};
					return {
						...track,
						instrument: instrumentMap[track.instrument] || track.instrument
					};
				})
			}));
		} catch (error) {
			console.error('Failed to load patterns:', error);
			return [];
		}
	}

	deletePattern(patternId: string): boolean {
		if (!this.isAvailable()) return false;

		try {
			const patterns = this.loadPatterns();
			const filtered = patterns.filter((p) => p.id !== patternId);
			localStorage.setItem(STORAGE_KEYS.PATTERNS, JSON.stringify(filtered));
			return true;
		} catch (error) {
			console.error('Failed to delete pattern:', error);
			return false;
		}
	}

	saveCurrentPatternId(patternId: string): void {
		if (!this.isAvailable()) return;
		localStorage.setItem(STORAGE_KEYS.CURRENT_PATTERN, patternId);
	}

	getCurrentPatternId(): string | null {
		if (!this.isAvailable()) return null;
		return localStorage.getItem(STORAGE_KEYS.CURRENT_PATTERN);
	}

	saveSettings(settings: Record<string, any>): void {
		if (!this.isAvailable()) return;
		localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
	}

	loadSettings(): Record<string, any> | null {
		if (!this.isAvailable()) return null;

		try {
			const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
			return stored ? JSON.parse(stored) : null;
		} catch {
			return null;
		}
	}

	clear(): void {
		if (!this.isAvailable()) return;
		Object.values(STORAGE_KEYS).forEach((key) => {
			localStorage.removeItem(key);
		});
	}
}

export const storage = new LocalStorageService();