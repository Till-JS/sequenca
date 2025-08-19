<script lang="ts">
	import { Volume2 } from 'lucide-svelte';
	import { sequencer, masterVolume } from '$lib/stores/sequencer';

	let localVolume = $masterVolume * 100;

	$: if ($masterVolume * 100 !== localVolume) {
		localVolume = $masterVolume * 100;
	}

	function handleVolumeChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const newVolume = parseInt(target.value) / 100;
		sequencer.setMasterVolume(newVolume);
	}
</script>

<div class="flex items-center gap-2">
	<Volume2 class="w-5 h-5 text-gray-600 dark:text-gray-400" />
	<input
		type="range"
		min="0"
		max="100"
		bind:value={localVolume}
		oninput={handleVolumeChange}
		class="w-24 accent-primary"
		aria-label="Master Volume"
	/>
	<span class="text-sm text-gray-600 dark:text-gray-400 w-10">
		{Math.round(localVolume)}%
	</span>
</div>

<style>
	.accent-primary {
		accent-color: var(--primary, #6366f1);
	}
</style>