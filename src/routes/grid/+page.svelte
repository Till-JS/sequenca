<script lang="ts">
	import GridSequencer from '$lib/components/GridSequencer.svelte';
	import PlayButton from '$lib/components/controls/PlayButton.svelte';
	import BPMSlider from '$lib/components/controls/BPMSlider.svelte';
	import VolumeControl from '$lib/components/controls/VolumeControl.svelte';
	import { sequencer } from '$lib/stores/sequencer';
	import { onMount } from 'svelte';

	onMount(() => {
		const handleKeyPress = (e: KeyboardEvent) => {
			if (e.code === 'Space') {
				e.preventDefault();
				const state = sequencer;
				state.play();
			}
		};

		window.addEventListener('keydown', handleKeyPress);
		return () => window.removeEventListener('keydown', handleKeyPress);
	});
</script>

<div class="sequencer-page">
	<header class="header">
		<h1 class="title">Multi-Sequencer</h1>
		<div class="controls">
			<PlayButton />
			<BPMSlider />
			<VolumeControl />
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
		gap: 2rem;
	}

	.main {
		flex: 1;
		padding: 2rem;
		display: flex;
		justify-content: center;
		align-items: flex-start;
	}
</style>