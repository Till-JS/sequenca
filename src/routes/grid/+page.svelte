<script lang="ts">
	import GridSequencer from '$lib/components/GridSequencer.svelte';
	import PlayButton from '$lib/components/controls/PlayButton.svelte';
	import BPMSlider from '$lib/components/controls/BPMSlider.svelte';
	import VolumeControl from '$lib/components/controls/VolumeControl.svelte';
	import PatternSelector from '$lib/components/controls/PatternSelector.svelte';
	import SwingControl from '$lib/components/controls/SwingControl.svelte';
	import ClearButton from '$lib/components/controls/ClearButton.svelte';
	import ShareButton from '$lib/components/shared/ShareButton.svelte';
	import { sequencer, isPlaying } from '$lib/stores/sequencer';
	import { getPatternFromUrl } from '$lib/utils/compression';
	import { onMount } from 'svelte';

	onMount(() => {
		// Check for shared pattern in URL
		const sharedPattern = getPatternFromUrl();
		if (sharedPattern) {
			// Create a new pattern from the shared data
			const newPattern = {
				...sharedPattern,
				id: `pattern-${Date.now()}`,
				name: `${sharedPattern.name} (Imported)`,
				created: new Date(),
				modified: new Date()
			};
			sequencer.savePattern(newPattern as any);
			sequencer.loadPattern(newPattern.id);
			
			// Clear the URL parameter
			const url = new URL(window.location.href);
			url.searchParams.delete('p');
			window.history.replaceState({}, '', url.toString());
		}

		// Auto-save pattern periodically
		const autoSaveInterval = setInterval(() => {
			sequencer.savePattern();
		}, 30000); // Save every 30 seconds

		const handleKeyPress = (e: KeyboardEvent) => {
			if (e.code === 'Space') {
				e.preventDefault();
				if ($isPlaying) {
					sequencer.pause();
				} else {
					sequencer.play();
				}
			}
		};

		window.addEventListener('keydown', handleKeyPress);
		
		return () => {
			clearInterval(autoSaveInterval);
			window.removeEventListener('keydown', handleKeyPress);
			// Save on unmount
			sequencer.savePattern();
		};
	});
</script>

<div class="sequencer-page">
	<header class="header">
		<div class="header-left">
			<h1 class="title">Multi-Sequencer</h1>
			<PatternSelector />
		</div>
		<div class="controls">
			<PlayButton />
			<div class="divider" />
			<BPMSlider />
			<SwingControl />
			<div class="divider" />
			<VolumeControl />
			<div class="divider" />
			<ClearButton />
			<ShareButton />
		</div>
	</header>

	<main class="main">
		<GridSequencer />
	</main>
</div>

<style>
	:global(:root) {
		--primary: #6366f1;
		--secondary: #8b5cf6;
		--success: #10b981;
		--danger: #ef4444;
	}

	.sequencer-page {
		min-height: 100vh;
		background: #0a0a0a;
		color: #e5e5e5;
		display: flex;
		flex-direction: column;
	}

	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1.5rem 2rem;
		background: #1a1a1a;
		border-bottom: 1px solid #2a2a2a;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.header-left {
		display: flex;
		align-items: center;
		gap: 1.5rem;
	}

	.title {
		font-size: 1.5rem;
		font-weight: bold;
		background: linear-gradient(135deg, var(--primary), var(--secondary));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.controls {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		flex-wrap: wrap;
	}

	.divider {
		width: 1px;
		height: 2rem;
		background: #3a3a3a;
	}

	.main {
		flex: 1;
		padding: 2rem;
		display: flex;
		justify-content: center;
		align-items: flex-start;
	}
</style>