<script lang="ts">
	import { sequencer, currentPattern, currentStep, isPlaying } from '$lib/stores/sequencer';
	import { onMount } from 'svelte';
	import { Volume2, VolumeX } from 'lucide-svelte';

	const trackColors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

	onMount(() => {
		sequencer.init();
	});

	function handleStepClick(trackIndex: number, stepIndex: number) {
		sequencer.toggleStep(trackIndex, stepIndex);
	}

	function handleMute(trackIndex: number) {
		sequencer.toggleTrackMute(trackIndex);
	}

	function handleSolo(trackIndex: number) {
		sequencer.toggleTrackSolo(trackIndex);
	}
</script>

{#if $currentPattern}
	<div class="grid-wrapper">
		<div class="grid-sequencer">
			<div class="tracks-container">
			{#each $currentPattern.tracks as track, trackIndex}
				<div class="track" style="--track-color: {trackColors[trackIndex]}">
					<div class="track-header">
						<span class="track-name">{track.name}</span>
						<div class="track-controls">
							<button
								onclick={() => handleMute(trackIndex)}
								class="mute-btn"
								class:active={track.muted}
								aria-label={track.muted ? 'Unmute' : 'Mute'}
							>
								{#if track.muted}
									<VolumeX class="w-4 h-4" />
								{:else}
									<Volume2 class="w-4 h-4" />
								{/if}
							</button>
							<button
								onclick={() => handleSolo(trackIndex)}
								class="solo-btn"
								class:active={track.solo}
								aria-label={track.solo ? 'Unsolo' : 'Solo'}
							>
								S
							</button>
						</div>
					</div>
					<div class="steps">
						{#each track.steps as step, stepIndex}
							<button
								onclick={() => handleStepClick(trackIndex, stepIndex)}
								ontouchstart={(e) => { e.preventDefault(); handleStepClick(trackIndex, stepIndex); }}
								class="step"
								class:active={step.active}
								class:current={$currentStep === stepIndex && $isPlaying}
								aria-label="Step {stepIndex + 1}"
							>
								<div class="step-indicator"></div>
							</button>
						{/each}
					</div>
				</div>
			{/each}
		</div>

		<div class="step-numbers">
			{#each Array(16) as _, i}
				<div class="step-number" class:current={$currentStep === i && $isPlaying}>
					{i + 1}
				</div>
			{/each}
		</div>
		</div>
	</div>
{/if}

<style>
	.grid-wrapper {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.grid-sequencer {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		padding: 2rem;
		background: #1a1a1a;
		border-radius: 0.75rem;
		width: auto;
		max-width: 100%;
	}

	.tracks-container {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.track {
		display: flex;
		gap: 1.5rem;
		align-items: center;
	}

	.track-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		min-width: 120px;
		width: 120px;
	}

	.track-name {
		font-size: 1rem;
		font-weight: 500;
		color: #e5e5e5;
		flex: 1;
	}

	.track-controls {
		display: flex;
		gap: 0.25rem;
	}

	.mute-btn,
	.solo-btn {
		width: 2rem;
		height: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #2a2a2a;
		border: 1px solid #3a3a3a;
		border-radius: 0.375rem;
		color: #888;
		font-size: 0.875rem;
		font-weight: bold;
		cursor: pointer;
		transition: all 0.15s;
	}

	.mute-btn:hover,
	.solo-btn:hover {
		background: #333;
		border-color: #444;
	}

	.mute-btn.active {
		background: #dc2626;
		border-color: #ef4444;
		color: white;
	}

	.solo-btn.active {
		background: #f59e0b;
		border-color: #fbbf24;
		color: white;
	}

	.steps {
		display: grid;
		grid-template-columns: repeat(16, 1fr);
		gap: 0.375rem;
		flex: 1;
		max-width: calc(16 * 4.5rem);
	}

	.step {
		width: clamp(2.5rem, 4vw, 4rem);
		height: clamp(2.5rem, 4vw, 4rem);
		padding: 0.25rem;
		background: #2a2a2a;
		border: 1px solid #3a3a3a;
		border-radius: 0.5rem;
		cursor: pointer;
		transition: all 0.15s;
		position: relative;
	}

	.step:hover {
		background: #333;
		border-color: #444;
	}

	.step.active .step-indicator {
		background: var(--track-color);
		opacity: 0.9;
	}

	.step.current {
		border-color: #fff;
		box-shadow: 0 0 0 1px #fff;
	}

	.step-indicator {
		width: 100%;
		height: 100%;
		border-radius: 0.25rem;
		background: transparent;
		transition: all 0.15s;
	}

	.step-numbers {
		display: grid;
		grid-template-columns: repeat(16, 1fr);
		gap: 0.375rem;
		margin-left: calc(120px + 1.5rem);
		max-width: calc(16 * 4.5rem);
	}

	.step-number {
		width: clamp(2.5rem, 4vw, 4rem);
		height: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.875rem;
		color: #666;
		transition: color 0.15s;
	}

	.step-number.current {
		color: #fff;
		font-weight: bold;
	}

	/* Mobile Responsive */
	@media (max-width: 768px) {
		.grid-sequencer {
			padding: 0.5rem;
		}

		.track-header {
			min-width: 80px;
		}

		.track-name {
			font-size: 0.75rem;
		}

		.step {
			width: 2rem;
			height: 2rem;
		}

		.step-number {
			width: 2rem;
			font-size: 0.625rem;
		}

		.step-numbers {
			margin-left: 88px;
		}

		.mute-btn,
		.solo-btn {
			width: 1.5rem;
			height: 1.5rem;
			font-size: 0.625rem;
		}
	}

	/* Prevent text selection on mobile */
	.step {
		-webkit-tap-highlight-color: transparent;
		-webkit-touch-callout: none;
		-webkit-user-select: none;
		user-select: none;
	}
</style>