<script lang="ts">
	import { sequencer } from '$lib/stores/sequencer';

	let swing = 0;

	$: if ($sequencer) {
		swing = $sequencer.swing * 100;
	}

	function handleSwingChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const newSwing = parseInt(target.value) / 100;
		sequencer.setSwing(newSwing);
	}
</script>

<div class="swing-control">
	<label for="swing-slider" class="label">
		Swing: {Math.round(swing)}%
	</label>
	<input
		id="swing-slider"
		type="range"
		min="0"
		max="75"
		bind:value={swing}
		oninput={handleSwingChange}
		class="slider"
	/>
</div>

<style>
	.swing-control {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.label {
		font-size: 0.75rem;
		font-weight: 500;
		color: #888;
	}

	.slider {
		width: 100px;
		accent-color: var(--primary, #6366f1);
	}
</style>