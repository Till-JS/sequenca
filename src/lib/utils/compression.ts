import type { Pattern } from '$lib/types/sequencer';

export function compressPattern(pattern: Pattern): string {
	const simplified = {
		n: pattern.name,
		b: pattern.bpm,
		t: pattern.tracks.map(track => ({
			i: track.instrument,
			s: track.steps.map(step => step.active ? 1 : 0).join(''),
			v: Math.round(track.volume * 100),
			m: track.muted ? 1 : 0
		}))
	};

	const json = JSON.stringify(simplified);
	// Convert to base64 URL-safe
	const base64 = btoa(json)
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=/g, '');
	
	return base64;
}

export function decompressPattern(compressed: string): Partial<Pattern> | null {
	try {
		// Convert from URL-safe base64
		const base64 = compressed
			.replace(/-/g, '+')
			.replace(/_/g, '/');
		
		const json = atob(base64);
		const data = JSON.parse(json);

		return {
			name: data.n,
			bpm: data.b,
			tracks: data.t.map((track: any) => ({
				instrument: track.i,
				steps: track.s.split('').map((s: string) => ({
					active: s === '1',
					velocity: 0.8
				})),
				volume: track.v / 100,
				muted: track.m === 1,
				solo: false,
				effects: []
			})),
			length: 16
		};
	} catch (error) {
		console.error('Failed to decompress pattern:', error);
		return null;
	}
}

export function generateShareUrl(pattern: Pattern): string {
	const compressed = compressPattern(pattern);
	const baseUrl = window.location.origin;
	return `${baseUrl}/grid?p=${compressed}`;
}

export function getPatternFromUrl(): Partial<Pattern> | null {
	if (typeof window === 'undefined') return null;
	
	const params = new URLSearchParams(window.location.search);
	const compressed = params.get('p');
	
	if (!compressed) return null;
	
	return decompressPattern(compressed);
}