<script lang="ts">
	import { sequencer } from '$lib/stores/sequencer';
	import { Clock } from 'lucide-svelte';
	import { onMount } from 'svelte';

	let delayAmount = $state(0.2);
	let delayTime = $state('8n');
	let delayFeedback = $state(0.3);

	const timeOptions = [
		{ value: '16n', label: '1/16' },
		{ value: '8n', label: '1/8' },
		{ value: '8t', label: '1/8T' },
		{ value: '4n', label: '1/4' },
		{ value: '4t', label: '1/4T' },
		{ value: '2n', label: '1/2' }
	];

	onMount(() => {
		// Initialize delay with default values
		sequencer.setGlobalDelay(delayAmount);
		sequencer.setGlobalDelayTime(delayTime);
		sequencer.setGlobalDelayFeedback(delayFeedback);
	});

	function handleDelayChange(e: Event) {
		const value = parseFloat((e.target as HTMLInputElement).value);
		delayAmount = value;
		sequencer.setGlobalDelay(value);
	}

	function handleTimeChange(e: Event) {
		const value = (e.target as HTMLSelectElement).value;
		delayTime = value;
		sequencer.setGlobalDelayTime(value);
	}

	function handleFeedbackChange(e: Event) {
		const value = parseFloat((e.target as HTMLInputElement).value);
		delayFeedback = value;
		sequencer.setGlobalDelayFeedback(value);
	}
</script>

<div class="delay-control">
	<div class="control-header">
		<Clock class="w-4 h-4" />
		<span class="label">Delay</span>
	</div>
	
	<div class="control-group">
		<div class="control-item">
			<input
				type="range"
				min="0"
				max="1"
				step="0.01"
				value={delayAmount}
				oninput={handleDelayChange}
				class="delay-slider"
				aria-label="Delay amount"
			/>
			<span class="value">{Math.round(delayAmount * 100)}%</span>
		</div>

		<select 
			value={delayTime}
			onchange={handleTimeChange}
			class="time-select"
			aria-label="Delay time"
		>
			{#each timeOptions as option}
				<option value={option.value}>{option.label}</option>
			{/each}
		</select>

		<div class="feedback-control">
			<span class="mini-label">FB</span>
			<input
				type="range"
				min="0"
				max="0.95"
				step="0.05"
				value={delayFeedback}
				oninput={handleFeedbackChange}
				class="feedback-slider"
				aria-label="Delay feedback"
			/>
			<span class="mini-value">{Math.round(delayFeedback * 100)}%</span>
		</div>
	</div>
</div>

<style>
	.delay-control {
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

	.control-group {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.control-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.delay-slider {
		width: 100px;
		height: 4px;
		background: #2a2a2a;
		border-radius: 2px;
		outline: none;
		-webkit-appearance: none;
		appearance: none;
	}

	.delay-slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 16px;
		height: 16px;
		background: #06b6d4;
		border-radius: 50%;
		cursor: pointer;
		transition: transform 0.1s;
	}

	.delay-slider::-webkit-slider-thumb:hover {
		transform: scale(1.2);
	}

	.delay-slider::-moz-range-thumb {
		width: 16px;
		height: 16px;
		background: #06b6d4;
		border-radius: 50%;
		cursor: pointer;
		border: none;
		transition: transform 0.1s;
	}

	.delay-slider::-moz-range-thumb:hover {
		transform: scale(1.2);
	}

	.time-select {
		background: #2a2a2a;
		border: 1px solid #3a3a3a;
		border-radius: 0.375rem;
		color: #e5e5e5;
		padding: 0.25rem 0.5rem;
		font-size: 0.875rem;
		cursor: pointer;
		outline: none;
		transition: all 0.15s;
	}

	.time-select:hover {
		background: #333;
		border-color: #444;
	}

	.time-select:focus {
		border-color: #06b6d4;
	}

	.feedback-control {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.mini-label {
		font-size: 0.75rem;
		color: #888;
		font-weight: 500;
		text-transform: uppercase;
	}

	.feedback-slider {
		width: 60px;
		height: 3px;
		background: #2a2a2a;
		border-radius: 1.5px;
		outline: none;
		-webkit-appearance: none;
		appearance: none;
	}

	.feedback-slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 12px;
		height: 12px;
		background: #06b6d4;
		border-radius: 50%;
		cursor: pointer;
		transition: transform 0.1s;
	}

	.feedback-slider::-webkit-slider-thumb:hover {
		transform: scale(1.2);
	}

	.feedback-slider::-moz-range-thumb {
		width: 12px;
		height: 12px;
		background: #06b6d4;
		border-radius: 50%;
		cursor: pointer;
		border: none;
		transition: transform 0.1s;
	}

	.feedback-slider::-moz-range-thumb:hover {
		transform: scale(1.2);
	}

	.value, .mini-value {
		font-size: 0.875rem;
		color: #888;
		min-width: 3ch;
		text-align: right;
		font-variant-numeric: tabular-nums;
	}

	.mini-value {
		font-size: 0.75rem;
		min-width: 2.5ch;
	}

	@media (max-width: 768px) {
		.delay-control {
			gap: 0.5rem;
			flex-wrap: wrap;
		}

		.control-group {
			gap: 0.5rem;
			flex-wrap: wrap;
		}

		.delay-slider {
			width: 80px;
		}

		.feedback-slider {
			width: 50px;
		}

		.label {
			font-size: 0.75rem;
		}

		.time-select {
			font-size: 0.75rem;
			padding: 0.2rem 0.4rem;
		}
	}
</style>