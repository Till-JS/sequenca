<script lang="ts">
	import { Play, Pause, Square } from 'lucide-svelte';
	import { sequencer, isPlaying } from '$lib/stores/sequencer';

	function handlePlayPause() {
		if ($isPlaying) {
			sequencer.pause();
		} else {
			sequencer.play();
		}
	}

	function handleStop() {
		sequencer.stop();
	}
</script>

<div class="flex gap-2">
	<button
		onclick={handlePlayPause}
		class="flex items-center justify-center w-12 h-12 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
		aria-label={$isPlaying ? 'Pause' : 'Play'}
	>
		{#if $isPlaying}
			<Pause class="w-6 h-6" />
		{:else}
			<Play class="w-6 h-6" />
		{/if}
	</button>

	<button
		onclick={handleStop}
		class="flex items-center justify-center w-12 h-12 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition-colors"
		aria-label="Stop"
	>
		<Square class="w-6 h-6" />
	</button>
</div>

<style>
	.bg-primary {
		background-color: var(--primary, #6366f1);
	}

	.bg-primary\/90 {
		background-color: color-mix(in srgb, var(--primary, #6366f1) 90%, transparent);
	}
</style>