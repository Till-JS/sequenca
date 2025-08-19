<script lang="ts">
	import { sequencer, bpm } from '$lib/stores/sequencer';
	import { AUDIO_CONSTANTS } from '$lib/audio/constants';

	let localBpm = $bpm;

	$: if (localBpm !== $bpm) {
		localBpm = $bpm;
	}

	function handleBpmChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const newBpm = parseInt(target.value);
		sequencer.setBPM(newBpm);
	}
</script>

<div class="flex flex-col gap-2">
	<label for="bpm-slider" class="text-sm font-medium text-gray-700 dark:text-gray-300">
		BPM: {localBpm}
	</label>
	<input
		id="bpm-slider"
		type="range"
		min={AUDIO_CONSTANTS.MIN_BPM}
		max={AUDIO_CONSTANTS.MAX_BPM}
		bind:value={localBpm}
		on:input={handleBpmChange}
		class="w-32 accent-primary"
	/>
</div>

<style>
	.accent-primary {
		accent-color: var(--primary, #6366f1);
	}
</style>