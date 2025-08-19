import { writable, derived } from 'svelte/store';

export type ViewType = 'grid' | 'circular' | 'wave' | '3d';

interface UIState {
	currentView: ViewType;
	theme: 'dark' | 'light';
	showSettings: boolean;
	showHelp: boolean;
}

function createUIStore() {
	const initialState: UIState = {
		currentView: 'grid',
		theme: 'dark',
		showSettings: false,
		showHelp: false
	};

	// Load saved preferences
	if (typeof window !== 'undefined') {
		const saved = localStorage.getItem('sequencer_ui');
		if (saved) {
			try {
				const parsed = JSON.parse(saved);
				Object.assign(initialState, parsed);
			} catch (e) {
				console.error('Failed to load UI preferences');
			}
		}
	}

	const { subscribe, update } = writable<UIState>(initialState);

	function setView(view: ViewType) {
		update((state) => {
			const newState = { ...state, currentView: view };
			if (typeof window !== 'undefined') {
				localStorage.setItem('sequencer_ui', JSON.stringify(newState));
			}
			return newState;
		});
	}

	function toggleTheme() {
		update((state) => {
			const newState = { ...state, theme: state.theme === 'dark' ? 'light' : 'dark' };
			if (typeof window !== 'undefined') {
				localStorage.setItem('sequencer_ui', JSON.stringify(newState));
				document.documentElement.classList.toggle('dark', newState.theme === 'dark');
			}
			return newState;
		});
	}

	function toggleSettings() {
		update((state) => ({ ...state, showSettings: !state.showSettings }));
	}

	function toggleHelp() {
		update((state) => ({ ...state, showHelp: !state.showHelp }));
	}

	return {
		subscribe,
		setView,
		toggleTheme,
		toggleSettings,
		toggleHelp
	};
}

export const ui = createUIStore();
export const currentView = derived(ui, ($ui) => $ui.currentView);
export const theme = derived(ui, ($ui) => $ui.theme);