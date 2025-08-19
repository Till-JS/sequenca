<script lang="ts">
	import { sequencer } from '$lib/stores/sequencer';
	import { Sparkles } from 'lucide-svelte';
	import { onMount } from 'svelte';

	let reverbAmount = $state(0.3);

	onMount(() => {
		// Initialize reverb with default value
		sequencer.setGlobalReverb(reverbAmount);
	});

	function handleReverbChange(e: Event) {
		const value = parseFloat((e.target as HTMLInputElement).value);
		reverbAmount = value;
		sequencer.setGlobalReverb(value);
	}
</script>

<div class="reverb-control">
	<div class="control-header">
		<Sparkles class="w-4 h-4" />
		<span class="label">Reverb</span>
	</div>
	<input
		type="range"
		min="0"
		max="1"
		step="0.01"
		value={reverbAmount}
		oninput={handleReverbChange}
		class="reverb-slider"
		aria-label="Reverb amount"
	/>
	<span class="value">{Math.round(reverbAmount * 100)}%</span>
</div>

<style>
	.reverb-control {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.control-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: #888;
	}

	.label {
		font-size: 0.875rem;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.025em;
	}

	.reverb-slider {
		width: 120px;
		height: 4px;
		background: #2a2a2a;
		border-radius: 2px;
		outline: none;
		-webkit-appearance: none;
		appearance: none;
	}

	.reverb-slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 16px;
		height: 16px;
		background: #8b5cf6;
		border-radius: 50%;
		cursor: pointer;
		transition: transform 0.1s;
	}

	.reverb-slider::-webkit-slider-thumb:hover {
		transform: scale(1.2);
	}

	.reverb-slider::-moz-range-thumb {
		width: 16px;
		height: 16px;
		background: #8b5cf6;
		border-radius: 50%;
		cursor: pointer;
		border: none;
		transition: transform 0.1s;
	}

	.reverb-slider::-moz-range-thumb:hover {
		transform: scale(1.2);
	}

	.value {
		font-size: 0.875rem;
		color: #888;
		min-width: 3ch;
		text-align: right;
		font-variant-numeric: tabular-nums;
	}

	@media (max-width: 768px) {
		.reverb-control {
			gap: 0.5rem;
		}

		.reverb-slider {
			width: 80px;
		}

		.label {
			font-size: 0.75rem;
		}

		.value {
			font-size: 0.75rem;
		}
	}
</style>